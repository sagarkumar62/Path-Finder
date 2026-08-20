import pytest
from app.preprocessing.skill_normalizer import normalize_skill_name
from app.preprocessing.dataset_cleaner import clean_career_record, validate_importance, validate_level
from app.knowledge.skill_graph import get_skill_graph
from app.services.roadmap_engine import generate_roadmap_structure
from app.ingestion.unified_loader import load_unified_careers


def test_skill_normalization():
    assert normalize_skill_name("Python programming")[0] == "Python"
    assert normalize_skill_name("Python Programming Language")[0] == "Python"
    assert normalize_skill_name("Python (programming)")[0] == "Python"
    assert normalize_skill_name("js")[0] == "JavaScript"
    assert normalize_skill_name("React.js")[0] == "React"
    assert normalize_skill_name("node.js")[0] == "Node.js"


def test_dataset_cleaner():
    raw_career = {
        "id": "full-stack-developer",
        "title": "Full Stack Developer",
        "required_skills": [
            {"name": "JavaScript (programming)", "importance": 90, "required_level": 4},
            {"name": "Node.js", "importance": 0.8, "required_level": 4}
        ]
    }
    cleaned = clean_career_record(raw_career)
    assert cleaned["id"] == "full-stack-developer"
    assert cleaned["required_skills"][0]["name"] == "JavaScript"
    assert cleaned["required_skills"][0]["importance"] == 0.9
    assert cleaned["required_skills"][0]["required_level"] == 4


def test_skill_graph_cycle_detection():
    graph = get_skill_graph()
    assert graph.detect_cycle() is False


def test_skill_graph_topological_sort():
    graph = get_skill_graph()
    sorted_skills = graph.topological_sort_skills(["PyTorch", "Python", "Machine Learning"])
    assert sorted_skills.index("Python") < sorted_skills.index("Machine Learning")
    assert sorted_skills.index("Machine Learning") < sorted_skills.index("PyTorch")


@pytest.mark.parametrize("target_career", [
    "AI Engineer",
    "Full Stack Developer",
    "DevOps Engineer",
    "Data Scientist",
    "Cybersecurity Analyst",
    "Mobile Developer"
])
def test_roadmap_generation_pipeline(target_career):
    profile = {
        "skills": [{"name": "JavaScript", "level": 3}],
        "weekly_hours": 15
    }
    roadmap = generate_roadmap_structure(profile, target_career)
    assert roadmap["success"] is True
    assert len(roadmap["phases"]) == 4
    assert roadmap["estimatedHours"] > 0
    assert roadmap["weeklyHours"] == 15
    assert roadmap["duration"] > 0


def test_unified_careers_loader():
    careers = load_unified_careers()
    assert len(careers) > 0
    assert any(c["title"] == "AI Engineer" for c in careers)
