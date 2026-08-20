import os
import json
from pathlib import Path
from typing import List, Dict, Any
from app.config.settings import settings
from app.preprocessing.dataset_cleaner import clean_career_record
from app.ingestion.onet_loader import load_onet_data
from app.ingestion.onet_loader import load_onet_data
from app.ingestion.esco_loader import load_esco_data
from app.ingestion.csv_loader import load_csv_careers


def load_unified_careers() -> List[Dict[str, Any]]:
    """
    Loads unified dataset combining career.csv, careers.json, O*NET, and ESCO.
    """
    unified_map: Dict[str, Dict[str, Any]] = {}

    # 0. Load career.csv dataset
    try:
        csv_careers = load_csv_careers()
        for c in csv_careers:
            cleaned = clean_career_record(c)
            unified_map[cleaned["id"]] = cleaned
    except Exception as e:
        print(f"[UnifiedLoader] Error reading career.csv: {e}")

    # 1. Load curated careers/ subdirectories & baseline careers.json
    data_dir = Path(__file__).resolve().parents[1] / "data"
    
    for group in ["technical", "occupational"]:
        group_dir = data_dir / "careers" / group
        if group_dir.exists():
            for c_file in group_dir.glob("*.json"):
                try:
                    c_item = json.loads(c_file.read_text(encoding="utf-8"))
                    cleaned = clean_career_record(c_item)
                    unified_map[cleaned["id"]] = cleaned
                except Exception as err:
                    print(f"[UnifiedLoader] Error reading {c_file}: {err}")

    legacy_path = data_dir / "careers.json"
    if legacy_path.exists():
        try:
            raw = json.loads(legacy_path.read_text(encoding="utf-8"))
            for item in raw:
                cleaned = clean_career_record(item)
                if cleaned["id"] not in unified_map:
                    unified_map[cleaned["id"]] = cleaned
        except Exception as e:
            print(f"[UnifiedLoader] Error reading legacy careers.json: {e}")

    # 2. Ingest O*NET if configured or raw directory exists
    onet_dir = settings.ONET_DATA_PATH or str(Path(__file__).resolve().parents[1] / "data" / "raw" / "onet")
    if os.path.exists(onet_dir):
        onet_careers = load_onet_data(onet_dir)
        for c in onet_careers:
            if c["id"] not in unified_map:
                unified_map[c["id"]] = c

    # 3. Ingest ESCO if configured or raw directory exists
    esco_dir = settings.ESCO_DATA_PATH or str(Path(__file__).resolve().parents[1] / "data" / "raw" / "esco")
    if os.path.exists(esco_dir):
        esco_careers = load_esco_data(esco_dir)
        for c in esco_careers:
            if c["id"] not in unified_map:
                unified_map[c["id"]] = c

    return list(unified_map.values())
