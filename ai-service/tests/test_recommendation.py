from app.services.recommendation_engine import recommend


def test_recommendation_output_structure():
    profile = {
        "user_id": "u1",
        "skills": [{"name": "JavaScript", "level": 4}, {"name": "React", "level": 3}],
        "interests": ["Web Development"],
        "career_goals": ["Become a Full Stack Developer"],
        "experience_level": "Junior",
        "target_career": "full-stack-developer",
    }
    res = recommend(profile, top_k=3)
    assert res["success"] is True
    assert isinstance(res["recommendations"], list)
    assert len(res["recommendations"]) <= 3
    for item in res["recommendations"]:
        assert 0.0 <= item["match_score"] <= 1.0
        assert "score_breakdown" in item
        assert "skill_gaps" in item
