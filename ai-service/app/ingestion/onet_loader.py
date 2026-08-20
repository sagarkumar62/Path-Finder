import os
import pandas as pd
from typing import List, Dict, Any
from app.preprocessing.dataset_cleaner import clean_career_record


def load_onet_data(onet_dir: str) -> List[Dict[str, Any]]:
    """
    Parses O*NET raw CSV files (occupations.csv, skills.csv, abilities.csv) if present.
    Returns cleaned career benchmark dictionaries.
    """
    if not onet_dir or not os.path.exists(onet_dir):
        return []

    occupations_file = os.path.join(onet_dir, "occupations.csv")
    skills_file = os.path.join(onet_dir, "skills.csv")

    if not os.path.exists(occupations_file) or not os.path.exists(skills_file):
        return []

    try:
        occ_df = pd.read_csv(occupations_file)
        skills_df = pd.read_csv(skills_file)

        # O*NET columns: O*NET-SOC Code, Title, Element Name, Scale ID, Data Value
        importance_df = skills_df[skills_df['Scale ID'] == 'IM']
        level_df = skills_df[skills_df['Scale ID'] == 'LV']

        merged = pd.merge(
            importance_df, 
            level_df, 
            on=['O*NET-SOC Code', 'Element Name'],
            suffixes=('_imp', '_lvl')
        )

        careers_map: Dict[str, Dict[str, Any]] = {}

        for _, row in merged.iterrows():
            soc_code = str(row['O*NET-SOC Code']).strip()
            title = str(row.get('Title_imp', row.get('Title', ''))).strip()
            skill_name = str(row['Element Name']).strip()
            imp_val = float(row['Data Value_imp'])
            lvl_val = float(row['Data Value_lvl'])

            if not title:
                continue

            if soc_code not in careers_map:
                careers_map[soc_code] = {
                    "id": soc_code.replace(".", "-").lower(),
                    "title": title,
                    "description": f"O*NET benchmark role for {title}.",
                    "category": "O*NET Occupation",
                    "required_skills": [],
                    "source": ["onet"],
                    "source_ids": [soc_code]
                }

            careers_map[soc_code]["required_skills"].append({
                "name": skill_name,
                "importance": imp_val,
                "required_level": lvl_val
            })

        return [clean_career_record(c) for c in careers_map.values()]
    except Exception as err:
        print(f"[ONetLoader] Warning loading O*NET CSVs: {err}")
        return []
