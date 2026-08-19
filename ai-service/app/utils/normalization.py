import json
import re
from pathlib import Path
from typing import Dict, Optional


_BASE = Path(__file__).resolve().parents[1] / "data"


def _load_skill_taxonomy() -> Dict[str, str]:
    """Return a map of alias -> canonical skill name."""
    path = _BASE / "skills.json"
    if not path.exists():
        return {}
    data = json.loads(path.read_text(encoding="utf-8"))
    mapping = {}
    for item in data:
        canon = item.get("name")
        for a in item.get("aliases", []):
            mapping[a.strip().lower()] = canon
        # also map the canonical name
        mapping[canon.strip().lower()] = canon
    return mapping


_SKILL_MAP = _load_skill_taxonomy()


def normalize_skill_name(name: str) -> str:
    if not name:
        return name
    key = re.sub(r"[^0-9a-zA-Z\s\-\.]+", "", name).strip().lower()
    return _SKILL_MAP.get(key, name.strip())


def normalize_profile_skills(profile: Dict) -> Dict:
    """Normalize the `skills` field in a profile dict in-place and return it."""
    skills = profile.get("skills") or []
    normalized = []
    for s in skills:
        name = s.get("name") if isinstance(s, dict) else str(s)
        level = s.get("level") if isinstance(s, dict) else None
        canon = normalize_skill_name(name)
        normalized.append({"name": canon, "level": level})
    profile["skills"] = normalized
    return profile
