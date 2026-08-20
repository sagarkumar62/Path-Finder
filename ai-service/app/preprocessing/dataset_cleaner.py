from typing import Dict, List, Any, Tuple
from app.preprocessing.skill_normalizer import normalize_skill_name


def validate_importance(importance: Any) -> float:
    """Clamps importance weights strictly between 0.0 and 1.0."""
    try:
        val = float(importance)
        if val > 1.0 and val <= 100.0:
            val = val / 100.0
        elif val > 5.0 and val <= 10.0:
            val = val / 10.0
        return max(0.0, min(1.0, round(val, 2)))
    except Exception:
        return 0.5


def validate_level(level: Any) -> int:
    """Clamps required proficiency levels strictly between 1 and 5."""
    try:
        val = int(round(float(level)))
        if val > 5:
            # Handle 1-7 O*NET level scale conversion
            val = round(val * (5.0 / 7.0))
        return max(1, min(5, val))
    except Exception:
        return 3


def clean_career_record(raw_career: Dict[str, Any]) -> Dict[str, Any]:
    """
    Cleans and standardizes a single career record.
    Preserves existing weighted skill structure and source attributions.
    """
    career_id = str(raw_career.get("id") or raw_career.get("code") or "").strip().lower()
    title = str(raw_career.get("title") or "Unknown Career").strip()
    
    if not career_id:
        career_id = title.lower().replace(" ", "-")

    description = str(raw_career.get("description") or "").strip()
    category = str(raw_career.get("category") or "Technology").strip()

    cleaned_skills = []
    seen_skills = set()

    raw_reqs = raw_career.get("required_skills") or raw_career.get("skills") or []
    for req in raw_reqs:
        if isinstance(req, dict):
            raw_sname = req.get("name") or req.get("title") or ""
            importance = validate_importance(req.get("importance", 0.5))
            req_level = validate_level(req.get("required_level", req.get("level", 3)))
        else:
            raw_sname = str(req)
            importance = 0.5
            req_level = 3

        if not raw_sname:
            continue

        norm_name, raw_source_name = normalize_skill_name(raw_sname)
        if norm_name.lower() in seen_skills:
            continue
        seen_skills.add(norm_name.lower())

        cleaned_skills.append({
            "name": norm_name,
            "raw_name": raw_source_name,
            "importance": importance,
            "required_level": req_level,
            "source": raw_career.get("source", ["custom"])
        })

    recommended_skills = []
    for rec in raw_career.get("recommended_skills", []):
        norm_rec, _ = normalize_skill_name(str(rec))
        if norm_rec and norm_rec.lower() not in seen_skills:
            recommended_skills.append(norm_rec)
            seen_skills.add(norm_rec.lower())

    return {
        "id": career_id,
        "title": title,
        "description": description,
        "category": category,
        "required_skills": cleaned_skills,
        "recommended_skills": recommended_skills,
        "interests": [str(i).strip() for i in raw_career.get("interests", []) if i],
        "education": [str(e).strip() for e in raw_career.get("education", []) if e],
        "experience_levels": [str(x).strip() for x in raw_career.get("experience_levels", ["Junior", "Mid"]) if x],
        "typical_duration_months": int(raw_career.get("typical_duration_months") or 6),
        "source": raw_career.get("source", ["custom"]),
        "source_ids": raw_career.get("source_ids", [career_id])
    }
