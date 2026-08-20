from typing import Dict, List, Any
from app.services.career_resolver import resolve_target_career, normalize_career_input
from app.utils.normalization import normalize_profile_skills, _parse_level


def generate_roadmap_structure(profile: Dict[str, Any], target_career_input: str) -> Dict[str, Any]:
    """
    Career-Specific Graph Roadmap Engine.
    Resolves career deterministically, personalizes topic graph nodes, calculates skill gaps,
    builds node DAG state labels (MASTERED, RECOMMENDED, LOCKED, OPTIONAL), and returns graph & UI phases.
    """
    clean_req = normalize_career_input(target_career_input)
    profile = normalize_profile_skills(profile)
    user_skills = profile.get("skills", [])
    user_skill_map = {s["name"].lower(): _parse_level(s.get("level")) for s in user_skills if "name" in s}
    weekly_hours = int(profile.get("weekly_hours") or profile.get("weeklyHours") or 10)

    # 1. Deterministic Resolution
    res = resolve_target_career(target_career_input)

    print(f"[CAREER REQUEST] {target_career_input}")
    print(f"[NORMALIZED] {clean_req}")
    print(f"[RESOLVED CAREER] {res.get('resolved_career')}")
    print(f"[CAREER ID] {res.get('career_id')}")
    print(f"[SOURCE] {res.get('source_provider')}")
    print(f"[CAREER DOMAIN] {res.get('domain')}")

    if not res.get("success") or not res.get("graph_data"):
        return {
            "success": False,
            "error": "CAREER_NOT_SUPPORTED",
            "message": res.get("message") or f"This career '{target_career_input}' is not currently supported.",
            "requested_career": target_career_input,
            "resolved_career": None,
            "resolution_method": "not_found",
            "confidence": 0.0
        }

    graph_data = res["graph_data"]
    raw_nodes = graph_data.get("nodes", [])
    raw_edges = graph_data.get("edges", [])

    # 2. Personalize Topic Graph Nodes
    personalized_nodes = []
    mastered_ids = set()

    for node in raw_nodes:
        n_id = node["id"]
        n_title = node["title"]
        req_lvl = node.get("requiredLevel", node.get("recommended_level", 4))
        user_lvl = user_skill_map.get(n_title.lower(), user_skill_map.get(n_id.lower(), 0))
        gap = max(0, req_lvl - user_lvl)

        if user_lvl >= req_lvl:
            status = "MASTERED"
            mastered_ids.add(n_id)
            priority = "LOW"
        elif user_lvl > 0:
            status = "RECOMMENDED"
            priority = "MEDIUM"
        else:
            status = "RECOMMENDED"
            priority = "HIGH"

        prereqs = node.get("prerequisites", [])
        prereqs_met = all(p in mastered_ids for p in prereqs)
        if not prereqs_met and status != "MASTERED":
            status = "LOCKED"

        p_node = dict(node)
        p_node.update({
            "nodeId": n_id,
            "userLevel": user_lvl,
            "requiredLevel": req_lvl,
            "skillGap": gap,
            "priority": priority,
            "status": status,
            "stateLabel": status,
            "estimatedHours": 20 if status != "MASTERED" else 0
        })
        personalized_nodes.append(p_node)

    print(f"[REQUIRED SKILLS] {[n['title'] for n in personalized_nodes]}")

    missing_titles = [n["title"] for n in personalized_nodes if n["status"] != "MASTERED"]
    needs_work_titles = [n["title"] for n in personalized_nodes if n["status"] == "RECOMMENDED"]

    print(f"[MISSING SKILLS] {missing_titles}")

    # 3. Derived Presentation Layer (Phases 1-4)
    phase_1_nodes = [n for n in personalized_nodes if n.get("type") == "foundation"]
    phase_2_nodes = [n for n in personalized_nodes if n.get("type") == "core"]
    phase_3_nodes = [n for n in personalized_nodes if n.get("type") in ("intermediate", "advanced")]
    phase_4_nodes = [n for n in personalized_nodes if n.get("type") == "capstone"]

    if not phase_1_nodes:
        phase_1_nodes = personalized_nodes[:2]
    if not phase_2_nodes:
        phase_2_nodes = personalized_nodes[2:4]
    if not phase_3_nodes:
        phase_3_nodes = personalized_nodes[4:6]
    if not phase_4_nodes:
        phase_4_nodes = personalized_nodes[6:]

    def build_phase_dict(phase_id: str, title: str, desc: str, nodes: List[Dict[str, Any]], prereqs: List[str]) -> Dict[str, Any]:
        node_titles = [n["title"] for n in nodes]
        milestones = []
        for idx, n in enumerate(nodes):
            milestones.append({
                "milestoneId": f"m_{phase_id}_{idx+1}",
                "title": n["title"],
                "description": n.get("description", f"Master {n['title']} competencies."),
                "estimatedHours": n.get("estimatedHours") or 20,
                "completed": n["status"] == "MASTERED",
                "targetSkill": n["title"]
            })

        # Match or generate phase learning resources (video, docs, project)
        raw_phases = graph_data.get("phases", [])
        matched_raw_phase = next((p for p in raw_phases if p.get("phaseId") == phase_id or p.get("title") == title), None)
        phase_resources = matched_raw_phase.get("resources", []) if matched_raw_phase else []

        if not phase_resources:
            primary_topic = node_titles[0] if node_titles else title
            query_topic = primary_topic.replace(" ", "+")
            phase_resources = [
                {
                    "title": f"Complete {primary_topic} Video Guide & Masterclass",
                    "type": "Video",
                    "provider": "YouTube / freeCodeCamp",
                    "url": f"https://www.youtube.com/results?search_query={query_topic}+tutorial+full+course",
                    "videoUrl": f"https://www.youtube.com/results?search_query={query_topic}+tutorial+full+course",
                    "duration": "45 mins",
                    "rating": 4.8,
                    "access": "Free"
                },
                {
                    "title": f"{primary_topic} Official Documentation & Reference",
                    "type": "Documentation",
                    "provider": "MDN / Official Docs",
                    "url": f"https://www.google.com/search?q={query_topic}+official+documentation",
                    "duration": "30 mins",
                    "rating": 4.9,
                    "access": "Free"
                },
                {
                    "title": f"Hands-on {primary_topic} Project & Exercises",
                    "type": "Project",
                    "provider": "GitHub / LeetCode",
                    "url": f"https://github.com/topics/{primary_topic.lower().replace(' ', '-')}",
                    "duration": "2 hours",
                    "rating": 4.7,
                    "access": "Free"
                }
            ]

        # Ensure videoUrl is explicitly populated for video/course items
        for r in phase_resources:
            if r.get("type") in ("Video", "Course") and not r.get("videoUrl"):
                r["videoUrl"] = r.get("url")

        return {
            "phaseId": phase_id,
            "title": title,
            "description": desc,
            "skills": node_titles,
            "prerequisites": prereqs,
            "progressPercent": 0,
            "milestones": milestones,
            "resources": phase_resources
        }

    phases = [
        build_phase_dict("phase-1", f"Phase 1: Foundations & Prerequisites for {res['resolved_career']}", "Build foundational domain topics.", phase_1_nodes, []),
        build_phase_dict("phase-2", f"Phase 2: Core Technical & Professional Mastery", "Develop core domain capabilities.", phase_2_nodes, ["phase-1"]),
        build_phase_dict("phase-3", f"Phase 3: Advanced Specialization", "Master specialized domain protocols.", phase_3_nodes, ["phase-2"]),
        build_phase_dict("phase-4", f"Phase 4: Capstone & Career Readiness", "Complete practical projects and prepare for career entry.", phase_4_nodes, ["phase-3"])
    ]

    print(f"[DETERMINISTIC PHASES] {[p['title'] for p in phases]}")

    # 4. Domain Validation Check (CAREER_ROADMAP_MISMATCH)
    is_non_tech = res.get("domain") in ("aviation", "healthcare", "finance", "design", "engineering")
    all_node_titles_str = " ".join([n["title"].lower() for n in personalized_nodes])
    tech_keywords = ["python", "react", "node.js", "pytorch", "linear algebra"]

    if is_non_tech and any(k in all_node_titles_str for k in tech_keywords):
        raise ValueError(f"CAREER_ROADMAP_MISMATCH: Non-tech career '{res['resolved_career']}' erroneously contains tech skills.")

    total_hours = sum(n["estimatedHours"] for n in personalized_nodes if n["status"] != "MASTERED")
    if total_hours == 0:
        total_hours = 120

    duration_months = max(1, round(total_hours / (weekly_hours * 4)))

    return {
        "success": True,
        "requested_career": target_career_input,
        "resolved_career": res["resolved_career"],
        "career_id": res["career_id"],
        "domain": res["domain"],
        "source_provider": res["source_provider"],
        "resolution_method": res["resolution_method"],
        "confidence": res["confidence"],
        "careerId": res["career_id"],
        "careerTitle": res["resolved_career"],
        "matchScore": 90,
        "duration": duration_months,
        "durationUnit": "Months",
        "weeklyHours": weekly_hours,
        "estimatedHours": total_hours,
        "nodes": personalized_nodes,
        "edges": raw_edges,
        "missingSkills": missing_titles,
        "needsWorkSkills": needs_work_titles,
        "phases": phases
    }
