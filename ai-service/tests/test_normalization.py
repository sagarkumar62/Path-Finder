from app.utils.normalization import normalize_skill_name, normalize_profile_skills


def test_normalize_skill_name_aliases():
    assert normalize_skill_name("ReactJS").lower() == "react"
    assert normalize_skill_name("python3") == "python"
    assert normalize_skill_name("Node") == "node.js"


def test_normalize_profile_skills():
    profile = {"skills": [{"name": "React.js", "level": 3}, {"name": "Python 3", "level": 2}]}
    out = normalize_profile_skills(profile)
    assert out["skills"][0]["name"].lower() == "react"
    assert out["skills"][1]["name"].lower() == "python"
