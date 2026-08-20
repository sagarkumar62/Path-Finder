import os
import json
from pathlib import Path
from typing import Dict, List, Any, Optional

DATA_DIR = Path(__file__).resolve().parents[1] / "data"
REGISTRY_PATH = DATA_DIR / "career_registry.json"


class CareerSourceRouter:
    """
    Source Router Architecture:
    Routes technical developer queries to roadmap.sh canonical representations
    and occupational queries to O*NET / ESCO dataset representations.
    """
    def __init__(self):
        self.registry: Dict[str, Dict[str, Any]] = {}
        self.load_registry()

    def load_registry(self):
        if REGISTRY_PATH.exists():
            try:
                self.registry = json.loads(REGISTRY_PATH.read_text(encoding="utf-8"))
            except Exception as err:
                print(f"[SourceRouter] Error reading career_registry.json: {err}")

    def get_canonical_career(self, career_id: str) -> Optional[Dict[str, Any]]:
        c_id = career_id.lower().strip()
        reg_entry = self.registry.get(c_id)

        if reg_entry:
            file_rel_path = reg_entry.get("file_path")
            if file_rel_path:
                full_path = DATA_DIR / file_rel_path
                if full_path.exists():
                    try:
                        career_data = json.loads(full_path.read_text(encoding="utf-8"))
                        return career_data
                    except Exception as err:
                        print(f"[SourceRouter] Error reading {full_path}: {err}")

        # Fallback check inside technical or occupational subdirectories
        for group in ["technical", "occupational"]:
            candidate_file = DATA_DIR / "careers" / group / f"{c_id}.json"
            if candidate_file.exists():
                try:
                    return json.loads(candidate_file.read_text(encoding="utf-8"))
                except Exception:
                    pass

        return None


source_router = CareerSourceRouter()
