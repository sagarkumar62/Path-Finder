import random
from typing import List, Dict, Any
from app.ingestion.unified_loader import load_unified_careers
from app.knowledge.skill_graph import get_skill_graph


def generate_synthetic_training_dataset(sample_size: int = 100) -> List[Dict[str, Any]]:
    """
    Programmatically generates synthetic training examples from career/skill relationships.
    Explicitly labeled as synthetic training data to distinguish from real user interaction logs.
    """
    careers = load_unified_careers()
    if not careers:
        return []

    skill_graph = get_skill_graph()
    dataset = []

    for i in range(sample_size):
        career = random.choice(careers)
        req_skills = [s["name"] for s in career.get("required_skills", [])]
        
        if not req_skills:
            continue

        # Randomly select a subset of skills known by the hypothetical synthetic user
        num_known = random.randint(0, max(1, len(req_skills) - 1))
        known_skills = random.sample(req_skills, num_known) if num_known > 0 else []
        
        missing_skills = [s for s in req_skills if s not in known_skills]
        recommended_sequence = skill_graph.topological_sort_skills(missing_skills)

        dataset.append({
            "id": f"synth_{i+1}",
            "data_type": "synthetic_training_data",
            "user_skills": known_skills,
            "target_career": career["title"],
            "career_id": career["id"],
            "missing_skills": missing_skills,
            "recommended_sequence": recommended_sequence
        })

    return dataset
