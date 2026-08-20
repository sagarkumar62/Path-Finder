import os
import pandas as pd
from typing import List, Dict, Any
from app.preprocessing.dataset_cleaner import clean_career_record


def load_esco_data(esco_dir: str) -> List[Dict[str, Any]]:
    """
    Parses ESCO raw CSV files (occupations.csv, skills.csv, occupation_skill_relations.csv) if present.
    Returns cleaned career benchmark dictionaries.
    """
    if not esco_dir or not os.path.exists(esco_dir):
        return []

    occ_file = os.path.join(esco_dir, "occupations.csv")
    rel_file = os.path.join(esco_dir, "occupation_skill_relations.csv")

    if not os.path.exists(occ_file) or not os.path.exists(rel_file):
        return []

    try:
        occ_df = pd.read_csv(occ_file)
        rel_df = pd.read_csv(rel_file)

        merged = pd.merge(rel_df, occ_df, on="occupationUri", how="inner")
        careers_map: Dict[str, Dict[str, Any]] = {}

        for _, row in merged.iterrows():
            uri = str(row.get("occupationUri", "")).strip()
            title = str(row.get("preferredLabel", "")).strip()
            skill_name = str(row.get("skillPreferredLabel", row.get("skillUri", ""))).strip()
            rel_type = str(row.get("relationType", "essential")).strip().lower()

            if not title or not skill_name:
                continue

            importance = 0.9 if rel_type == "essential" else 0.6
            req_level = 4 if rel_type == "essential" else 3

            if uri not in careers_map:
                careers_map[uri] = {
                    "id": title.lower().replace(" ", "-"),
                    "title": title,
                    "description": str(row.get("description", "")),
                    "category": "ESCO Occupation",
                    "required_skills": [],
                    "source": ["esco"],
                    "source_ids": [uri]
                }

            careers_map[uri]["required_skills"].append({
                "name": skill_name,
                "importance": importance,
                "required_level": req_level
            })

        return [clean_career_record(c) for c in careers_map.values()]
    except Exception as err:
        print(f"[ESCOLoader] Warning loading ESCO CSVs: {err}")
        return []
