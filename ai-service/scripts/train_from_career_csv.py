import sys
import traceback
from pathlib import Path

# Ensure package root is importable when running this script directly
ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from app.ingestion.csv_loader import load_csv_careers
from app.ingestion.build_dataset import build_complete_dataset_pipeline


def train_model_from_career_csv():
    print("==================================================================")
    print("   CAREER PATHFINDER — CSV MODEL TRAINING & DATASET BUILDER   ")
    print("==================================================================")
    print(f"[1/3] Ingesting & processing raw career dataset from career.csv...")

    csv_careers = load_csv_careers()
    print(f"[SUCCESS] Successfully processed {len(csv_careers)} unique career profiles from career.csv!")

    print(f"\n[2/3] Building unified knowledge base & graph dependencies...")
    build_complete_dataset_pipeline()

    print("\n[3/3] Verifying trained career model & roadmap generation...")
    from app.services.roadmap_engine import generate_roadmap_structure

    test_careers = ["AI Engineer", "Frontend Developer", "ML Engineer", "DevOps Engineer", "Cloud Architect"]
    for c_title in test_careers:
        res = generate_roadmap_structure({"skills": []}, c_title)
        status = "SUCCESS" if res.get("success") else "FAILED"
        print(f"  -> [{status}] Career: '{c_title}' | ID: {res.get('career_id')} | Method: {res.get('resolution_method')}")

    print("\n==================================================================")
    print("   MODEL TRAINING & ROADMAP DATASET BUILD COMPLETE!")
    print("==================================================================")


if __name__ == "__main__":
    try:
        train_model_from_career_csv()
    except Exception as err:
        print(f"[ERROR] Model training failed: {err}")
        traceback.print_exc()
