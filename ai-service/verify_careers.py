from app.services.roadmap_engine import generate_roadmap_structure


def run_career_verification():
    test_careers = [
        "Pilot",
        "AI Engineer",
        "DevOps Engineer",
        "Full Stack Developer",
        "Data Scientist"
    ]

    dummy_profile = {
        "skills": [],
        "weekly_hours": 15
    }

    print("\n==========================================================")
    print("      CAREER PATHFINDER — FINAL VERIFICATION REPORT")
    print("==========================================================")

    for req_career in test_careers:
        res = generate_roadmap_structure(dummy_profile, req_career)
        print(f"\n--- Requested Career: '{req_career}' ---")
        if not res.get("success"):
            print(f"FAILED: {res.get('error')}")
            continue

        print(f"Requested Career:   {res.get('requested_career')}")
        print(f"Resolved Career:    {res.get('resolved_career')}")
        print(f"Resolution Method:  {res.get('resolution_method')}")
        print(f"Confidence:         {res.get('confidence')}")
        print(f"Top Skills:         {', '.join(res.get('missingSkills', [])[:4])}")
        print(f"Skill Gaps:         {len(res.get('missingSkills', []))} missing, {len(res.get('needsWorkSkills', []))} needs work")
        
        phases = res.get("phases", [])
        for p in phases:
            skills_str = ", ".join(p.get("skills", []))
            print(f"  [{p.get('phaseId').upper()}]: {p.get('title')} -> ({skills_str})")

    print("\n==========================================================\n")


if __name__ == "__main__":
    run_career_verification()
