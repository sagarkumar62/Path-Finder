import os
import json
import random
from pathlib import Path
from app.ingestion.unified_loader import load_unified_careers
from app.knowledge.skill_graph import get_skill_graph


def generate_all_synthetic_training_files():
    """
    Generates synthetic training datasets in JSONL format inside ai-service/training/datasets/
    Explicitly labeled as synthetic data to distinguish from real user interaction logs.
    """
    base_dir = Path(__file__).resolve().parent / "datasets"
    base_dir.mkdir(parents=True, exist_ok=True)

    careers = load_unified_careers()
    skill_graph = get_skill_graph()

    matching_file = base_dir / "career_matching.jsonl"
    gap_file = base_dir / "skill_gap.jsonl"
    sequence_file = base_dir / "roadmap_sequences.jsonl"

    print(f"[INFO] Generating synthetic training datasets in {base_dir}...")

    with open(matching_file, "w", encoding="utf-8") as f_match, \
         open(gap_file, "w", encoding="utf-8") as f_gap, \
         open(sequence_file, "w", encoding="utf-8") as f_seq:

        for idx in range(100):
            career = random.choice(careers)
            req_skills = [s["name"] for s in career.get("required_skills", [])]
            if not req_skills:
                continue

            num_known = random.randint(0, max(1, len(req_skills) - 1))
            known = random.sample(req_skills, num_known) if num_known > 0 else []
            known_objs = [{"name": k, "level": random.randint(3, 5)} for k in known]
            
            missing = [s for s in req_skills if s not in known]
            ordered_seq = skill_graph.topological_sort_skills(missing)

            match_item = {
                "id": f"match_{idx+1}",
                "data_type": "synthetic_training_data",
                "user_skills": known_objs,
                "target_career": career["title"],
                "ground_truth_career_id": career["id"]
            }
            f_match.write(json.dumps(match_item) + "\n")

            gap_item = {
                "id": f"gap_{idx+1}",
                "data_type": "synthetic_training_data",
                "user_skills": known_objs,
                "target_career": career["title"],
                "missing_skills": missing
            }
            f_gap.write(json.dumps(gap_item) + "\n")

            seq_item = {
                "id": f"seq_{idx+1}",
                "data_type": "synthetic_training_data",
                "target_career": career["title"],
                "missing_skills": missing,
                "recommended_sequence": ordered_seq
            }
            f_seq.write(json.dumps(seq_item) + "\n")

    print("[INFO] Synthetic training dataset files generated successfully!")


if __name__ == "__main__":
    generate_all_synthetic_training_files()
