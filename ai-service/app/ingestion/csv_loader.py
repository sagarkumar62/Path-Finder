import csv
import json
import re
from pathlib import Path
from typing import List, Dict, Any

DATA_DIR = Path(__file__).resolve().parents[1] / "data"
CAREERS_CSV_PATH = DATA_DIR / "raw" / "career" / "careers.csv"
CAREER_CSV_PATH = DATA_DIR / "raw" / "career" / "career.csv"

CSV_PATH = CAREERS_CSV_PATH if CAREERS_CSV_PATH.exists() else CAREER_CSV_PATH

def slugify(text: str) -> str:
    if not text:
        return ""
    clean = text.strip().lower()
    clean = re.sub(r'[^a-z0-9\s\-]+', '', clean)
    return re.sub(r'[\s\_]+', '-', clean)

def load_csv_careers() -> List[Dict[str, Any]]:
    """
    Ingests career.csv / careers.csv dataset containing 76,000+ resource rows across 5,000+ careers,
    aggregating skills, domain metadata, learning resources, phases, and roadmap parameters.
    """
    if not CSV_PATH.exists():
        print(f"[CSVLoader] File not found at {CSV_PATH}")
        return []

    career_groups: Dict[str, Dict[str, Any]] = {}
    aliases_to_add: Dict[str, str] = {}

    with open(CSV_PATH, mode="r", encoding="utf-8", errors="ignore") as f:
        reader = csv.DictReader(f)
        first_row = True
        is_career_csv_schema = False

        for row in reader:
            if first_row:
                first_row = False
                if "resource_id" in row or "resource_name" in row:
                    is_career_csv_schema = True

            title = (row.get("career_title") or "").strip()
            if not title:
                continue

            c_id = slugify(title)
            aliases_to_add[title.lower()] = c_id
            aliases_to_add[re.sub(r'[^a-z0-9\s]+', '', title.lower())] = c_id

            domain = (row.get("domain") or "Software Development").strip()
            exp_level = (row.get("experience_level") or "Mid").strip()

            if is_career_csv_schema:
                # -------------------------------------------------------------
                # Parsing career.csv (76,986 rows with 1 row per resource)
                # -------------------------------------------------------------
                p_num = (row.get("phase_number") or "1").strip()
                p_name = (row.get("phase_name") or "Foundation").strip()
                res_name = (row.get("resource_name") or "").strip()
                res_cat = (row.get("resource_category") or "Course").strip()
                provider = (row.get("provider") or "Online").strip()
                skills_raw = (row.get("skills_covered") or "").strip()
                skills_list = [s.strip() for s in skills_raw.split(",") if s.strip()]
                access = (row.get("access") or "Free").strip()
                raw_url = (row.get("resource_url") or "").strip()
                est_hours = (row.get("estimated_hours") or "10").strip()
                difficulty = (row.get("difficulty") or "Intermediate").strip()

                if not raw_url or raw_url in ("#", "https://youtube.com", "https://devdocs.io", "https://github.com"):
                    continue

                raw_type = res_cat.lower()
                if "video" in raw_type or "course" in raw_type:
                    norm_type = "video"
                elif "doc" in raw_type or "article" in raw_type or "book" in raw_type:
                    norm_type = "documentation"
                elif "project" in raw_type or "practice" in raw_type or "challenge" in raw_type:
                    norm_type = "project"
                else:
                    norm_type = "course"

                res_id = (row.get("resource_id") or f"res_{c_id}_{hash(raw_url) & 0xffffff}").strip()

                res_item = {
                    "id": res_id,
                    "resourceId": res_id,
                    "careerId": c_id,
                    "skill": skills_list[0] if skills_list else "General",
                    "skills_covered": skills_list,
                    "resourceType": norm_type,
                    "type": norm_type,
                    "title": res_name if res_name else f"{title} Learning Resource",
                    "provider": provider,
                    "url": raw_url,
                    "videoUrl": raw_url if norm_type in ("video", "course") else None,
                    "rating": 4.8,
                    "duration": f"{est_hours} hours",
                    "level": difficulty,
                    "access": access,
                    "phase_number": p_num,
                    "phase_name": p_name,
                    "source": "careers.csv",
                    "verified": True
                }

                if c_id not in career_groups:
                    career_groups[c_id] = {
                        "id": c_id,
                        "title": title,
                        "description": f"Comprehensive career pathway for {title} covering {domain} skills, hands-on projects, and industry standards.",
                        "domain": domain.lower().replace("&", "and").replace(" ", "-"),
                        "domain_display": domain,
                        "experience_levels": [exp_level],
                        "skills_frequency": {},
                        "learning_resources": {},
                        "phase_resources": {"1": [], "2": [], "3": [], "4": []},
                        "phase_names": {"1": "Foundation", "2": "Skill Development", "3": "Projects & Experience", "4": "Career & Placement"},
                        "soft_skills": set(),
                        "certifications": set(),
                        "education": ["Bachelor's Degree"],
                        "salary_min": 600000,
                        "salary_max": 1500000,
                        "duration_months": 6,
                        "sample_count": 0
                    }

                cg = career_groups[c_id]
                cg["sample_count"] += 1
                cg["learning_resources"][res_item["title"]] = res_item

                if p_num in cg["phase_resources"]:
                    cg["phase_resources"][p_num].append(res_item)
                if p_name:
                    cg["phase_names"][p_num] = p_name

                for s in skills_list:
                    cg["skills_frequency"][s] = cg["skills_frequency"].get(s, 0) + 1

            else:
                # -------------------------------------------------------------
                # Legacy careers.csv parsing (pipe-delimited fields)
                # -------------------------------------------------------------
                tech_skills_raw = row.get("technical_skills") or ""
                tech_skills = [s.strip() for s in tech_skills_raw.split(",") if s.strip()]

                soft_skills_raw = row.get("soft_skills") or ""
                soft_skills = [s.strip() for s in soft_skills_raw.split(",") if s.strip()]

                education = (row.get("education") or "B.Tech CSE").strip()
                cert = (row.get("certification") or "").strip()

                try:
                    salary_min = int(row.get("salary_min_inr") or 600000)
                    salary_max = int(row.get("salary_max_inr") or 1500000)
                except ValueError:
                    salary_min, salary_max = 600000, 1500000

                try:
                    duration_months = int(row.get("roadmap_duration_months") or 6)
                except ValueError:
                    duration_months = 6

                r_names = [x.strip() for x in (row.get("learning_resource_names") or "").split("|") if x.strip()]
                r_types = [x.strip() for x in (row.get("learning_resource_types") or "").split("|") if x.strip()]
                r_providers = [x.strip() for x in (row.get("learning_resource_providers") or "").split("|") if x.strip()]
                r_urls = [x.strip() for x in (row.get("learning_resource_urls") or "").split("|") if x.strip()]
                r_skills = [x.strip() for x in (row.get("learning_resource_skills") or "").split("|") if x.strip()]
                r_levels = [x.strip() for x in (row.get("learning_resource_levels") or "").split("|") if x.strip()]
                r_hours = [x.strip() for x in (row.get("learning_resource_hours") or "").split("|") if x.strip()]
                r_access = [x.strip() for x in (row.get("learning_resource_access") or "").split("|") if x.strip()]
                r_ratings = [x.strip() for x in (row.get("learning_resource_ratings") or "").split("|") if x.strip()]

                parsed_resources = []
                for i in range(len(r_names)):
                    raw_url = r_urls[i] if i < len(r_urls) else ""
                    if not raw_url or raw_url.strip() in ("#", "https://youtube.com", "https://devdocs.io", "https://github.com"):
                        continue

                    raw_type = (r_types[i] if i < len(r_types) else "Course").strip().lower()
                    if "video" in raw_type or "course" in raw_type:
                        norm_type = "video"
                    elif "doc" in raw_type or "article" in raw_type:
                        norm_type = "documentation"
                    elif "project" in raw_type or "practice" in raw_type:
                        norm_type = "project"
                    else:
                        norm_type = "course"

                    res_id = f"res_{c_id}_{i+1}"
                    parsed_resources.append({
                        "id": res_id,
                        "resourceId": res_id,
                        "careerId": c_id,
                        "skill": r_skills[i] if i < len(r_skills) else "General",
                        "resourceType": norm_type,
                        "type": norm_type,
                        "title": r_names[i],
                        "provider": r_providers[i] if i < len(r_providers) else "Verified Educator",
                        "url": raw_url,
                        "videoUrl": raw_url if norm_type in ("video", "course") else None,
                        "rating": float(r_ratings[i]) if i < len(r_ratings) and r_ratings[i].replace('.', '', 1).isdigit() else 4.8,
                        "duration": f"{r_hours[i]} hours" if i < len(r_hours) else "10 hours",
                        "level": r_levels[i] if i < len(r_levels) else "Beginner",
                        "access": r_access[i] if i < len(r_access) else "Free",
                        "source": "careers.csv",
                        "verified": True
                    })

                if c_id not in career_groups:
                    career_groups[c_id] = {
                        "id": c_id,
                        "title": title,
                        "description": f"Comprehensive career pathway for {title} covering {domain} skills, hands-on projects, and industry standards.",
                        "domain": domain.lower().replace("&", "and").replace(" ", "-"),
                        "domain_display": domain,
                        "experience_levels": [exp_level],
                        "skills_frequency": {},
                        "learning_resources": {},
                        "soft_skills": set(soft_skills),
                        "certifications": set([cert]) if cert else set(),
                        "education": [education],
                        "salary_min": salary_min,
                        "salary_max": salary_max,
                        "duration_months": duration_months,
                        "sample_count": 0
                    }

                cg = career_groups[c_id]
                cg["sample_count"] += 1
                if exp_level not in cg["experience_levels"]:
                    cg["experience_levels"].append(exp_level)
                if education not in cg["education"]:
                    cg["education"].append(education)
                if cert:
                    cg["certifications"].add(cert)
                for s in soft_skills:
                    cg["soft_skills"].add(s)

                for res in parsed_resources:
                    cg["learning_resources"][res["title"]] = res

                for idx, skill in enumerate(tech_skills):
                    cg["skills_frequency"][skill] = cg["skills_frequency"].get(skill, 0) + 1

    # Convert aggregated groups into unified career format & write graph JSONs
    unified_careers: List[Dict[str, Any]] = []

    for c_id, cg in career_groups.items():
        sorted_skills = sorted(cg["skills_frequency"].keys(), key=lambda s: cg["skills_frequency"][s], reverse=True)
        req_skills_formatted = []

        for idx, skill_name in enumerate(sorted_skills[:10]):
            imp = max(0.5, round(0.95 - (idx * 0.05), 2))
            req_skills_formatted.append({
                "name": skill_name,
                "importance": imp,
                "required_level": 4 if idx < 3 else 3
            })

        recommended_skills = sorted_skills[10:15] if len(sorted_skills) > 10 else []

        avg_sal = f"₹{cg['salary_min']:,} - ₹{cg['salary_max']:,} / year"

        res_list = list(cg.get("learning_resources", {}).values())

        career_entry = {
            "id": c_id,
            "title": cg["title"],
            "description": cg["description"],
            "domain": cg["domain"],
            "required_skills": req_skills_formatted,
            "recommended_skills": recommended_skills,
            "interests": [cg["domain_display"]],
            "education": cg["education"][:3],
            "experience_levels": cg["experience_levels"],
            "typical_duration_months": cg["duration_months"],
            "salary_range": avg_sal,
            "averageSalary": avg_sal,
            "certifications": list(cg["certifications"])[:5],
            "soft_skills": list(cg["soft_skills"])[:5],
            "learning_resources": res_list
        }
        unified_careers.append(career_entry)

        # Generate Graph Dataset JSON for roadmap generation
        build_graph_json_for_career(career_entry, sorted_skills, res_list)

    # Persist updated aliases map
    update_aliases_file(aliases_to_add)

    print(f"[CSVLoader] Processed {len(unified_careers)} unique career profiles from {CSV_PATH.name}")
    return unified_careers


def score_resource_relevance(res: Dict[str, Any], career_id: str, phase_skills: List[str]) -> float:
    score = 0.0
    if res.get("careerId") == career_id:
        score += 0.40

    res_skill = (res.get("skill") or "").lower()
    if any(s.lower() in res_skill or res_skill in s.lower() for s in phase_skills):
        score += 0.30

    rating = float(res.get("rating") or 4.0)
    score += (rating / 5.0) * 0.15

    if res.get("source") == "careers.csv" and res.get("verified"):
        score += 0.15

    return score


def build_graph_json_for_career(career_entry: Dict[str, Any], sorted_skills: List[str], learning_resources: List[Dict[str, Any]] = None):
    """
    Builds structured graph JSON containing DAG nodes and phases for roadmap generation.
    Enforces career.csv as the single source of truth for learning resources.
    """
    c_id = career_entry["id"]
    domain = career_entry["domain"]
    resources = learning_resources or []
    title = career_entry["title"]

    skills = sorted_skills if sorted_skills else ["Fundamentals", "Core Concepts", "Advanced Application", "Capstone"]

    nodes = []
    edges = []
    phases = []

    total_skills = len(skills)
    p1_skills = skills[:max(1, total_skills // 4)]
    p2_skills = skills[len(p1_skills):len(p1_skills) + max(1, total_skills // 4)]
    p3_skills = skills[len(p1_skills) + len(p2_skills):len(p1_skills) + len(p2_skills) + max(1, total_skills // 4)]
    p4_skills = skills[len(p1_skills) + len(p2_skills) + len(p3_skills):]

    if not p4_skills:
        p4_skills = [f"{title} Capstone Project & Deployment"]

    phase_names_map = career_entry.get("phase_names", {})
    phase_resources_map = career_entry.get("phase_resources", {})

    phase_defs = [
        ("1", f"Phase 1: {phase_names_map.get('1', 'Foundations')} for {title}", "Master fundamental prerequisite concepts and core tooling.", p1_skills, "foundation"),
        ("2", f"Phase 2: {phase_names_map.get('2', 'Skill Development')} for {title}", "Build core domain logic, architecture, and intermediate patterns.", p2_skills, "core"),
        ("3", f"Phase 3: {phase_names_map.get('3', 'Projects & Experience')} for {title}", "Advanced techniques, performance optimization, and real-world projects.", p3_skills, "advanced"),
        ("4", f"Phase 4: {phase_names_map.get('4', 'Career & Placement')} for {title}", "Deploy real-world capstone project and prepare for career placement.", p4_skills, "capstone")
    ]

    prev_node_id = None
    node_counter = 1

    for p_num, p_title, p_desc, p_skill_list, p_type in phase_defs:
        phase_milestones = []
        p_id = f"p{p_num}"

        for idx, skill in enumerate(p_skill_list):
            n_id = f"node_{node_counter}"
            node_counter += 1

            nodes.append({
                "id": n_id,
                "nodeId": n_id,
                "title": skill,
                "description": f"Learn and apply {skill} in {title} workflows.",
                "type": p_type,
                "recommended_level": 4 if p_type in ("core", "advanced") else 3,
                "requiredLevel": 4,
                "prerequisites": [prev_node_id] if prev_node_id else []
            })

            if prev_node_id:
                edges.append({
                    "id": f"e_{prev_node_id}_{n_id}",
                    "source": prev_node_id,
                    "target": n_id,
                    "type": "prerequisite"
                })

            prev_node_id = n_id

            phase_milestones.append({
                "milestoneId": f"m_{p_id}_{idx+1}",
                "title": skill,
                "description": f"Master {skill} competencies and practical implementation.",
                "estimatedHours": 15,
                "skills": [skill]
            })

        # Select explicit phase resources from career.csv if mapped, else score and rank resources
        explicit_p_resources = phase_resources_map.get(p_num, [])
        if explicit_p_resources:
            phase_resources = explicit_p_resources
        else:
            scored_resources = []
            for r in resources:
                r_score = score_resource_relevance(r, c_id, p_skill_list)
                scored_resources.append((r_score, r))
            scored_resources.sort(key=lambda x: x[0], reverse=True)
            phase_resources = [r for _, r in scored_resources]

        phases.append({
            "phaseId": p_id,
            "title": p_title,
            "description": p_desc,
            "estimatedWeeks": 4,
            "skills": p_skill_list,
            "milestones": phase_milestones,
            "resources": phase_resources[:6]
        })

    graph_dict = {
        "id": c_id,
        "career_id": c_id,
        "title": title,
        "domain": domain,
        "estimatedMonths": career_entry.get("typical_duration_months", 6),
        "estimatedHours": 200,
        "nodes": nodes,
        "edges": edges,
        "phases": phases,
        "learningResources": resources[:8]
    }

    # Save graph JSON into category directory under data/careers
    target_dir = DATA_DIR / "careers" / domain
    target_dir.mkdir(parents=True, exist_ok=True)

    target_file = target_dir / f"{c_id}.json"
    with open(target_file, "w", encoding="utf-8") as f:
        json.dump(graph_dict, f, indent=2)


def update_aliases_file(new_aliases: Dict[str, str]):
    aliases_file = DATA_DIR / "aliases.json"
    existing = {}
    if aliases_file.exists():
        try:
            existing = json.loads(aliases_file.read_text(encoding="utf-8"))
        except Exception:
            existing = {}

    existing.update(new_aliases)
    with open(aliases_file, "w", encoding="utf-8") as f:
        json.dump(existing, f, indent=2)
