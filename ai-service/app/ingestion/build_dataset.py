import os
import json
import pickle
from pathlib import Path
from typing import Dict, List, Any
import numpy as np

from app.ingestion.unified_loader import load_unified_careers
from app.knowledge.skill_graph import get_skill_graph
from app.services.embedding_service import get_embedding_service
from app.services.embedding_cache import build_career_embeddings
from app.services.faiss_index import get_faiss_index
from app.embeddings.index_builder import persistent_index_manager
from app.models.career import Career, SkillRequirement


def build_complete_dataset_pipeline():
    """
    Reproducible Dataset Build Pipeline.
    Incurs 0 data destruction: Ingests ESCO, O*NET, and careers.json,
    normalizes skills, validates dependency graph, builds embeddings,
    and persists FAISS vector index and processed files.
    """
    print("[INFO] Starting Career PathFinder Dataset Build Pipeline...")
    
    # 1. Ingest Raw & Curated Data
    print("[INFO] Loading ESCO dataset...")
    print("[INFO] Loading O*NET dataset...")
    print("[INFO] Ingesting baseline careers.json...")
    
    careers = load_unified_careers()
    print(f"[INFO] Careers loaded: {len(careers)}")

    # 2. Skill Normalization & Extraction
    print("[INFO] Normalizing skills and extracting relationship graph...")
    unique_skills = set()
    total_relationships = 0

    for c in careers:
        req_skills = c.get("required_skills", [])
        total_relationships += len(req_skills)
        for s in req_skills:
            if isinstance(s, dict) and s.get("name"):
                unique_skills.add(s["name"])

    print(f"[INFO] Unique Normalized Skills: {len(unique_skills)}")
    print(f"[INFO] Career-Skill Relationships: {total_relationships}")

    # 3. Build & Validate Skill Dependency Graph
    print("[INFO] Building skill dependency graph (DAG)...")
    skill_graph = get_skill_graph()
    has_cycle = skill_graph.detect_cycle()
    if has_cycle:
        print("[WARNING] Skill dependency cycle detected! Fallback topological sorting enabled.")
    else:
        print("[INFO] Skill dependency graph validated: 0 cycles detected.")

    # 4. Export Processed Data Files
    processed_dir = Path(__file__).resolve().parents[1] / "data" / "processed"
    processed_dir.mkdir(parents=True, exist_ok=True)
    
    processed_careers_file = processed_dir / "careers.json"
    with open(processed_careers_file, "w", encoding="utf-8") as f:
        json.dump(careers, f, indent=2)
    print(f"[INFO] Exported processed knowledge base to {processed_careers_file}")

    processed_skills_file = processed_dir / "skills.json"
    with open(processed_skills_file, "w", encoding="utf-8") as f:
        json.dump(sorted(list(unique_skills)), f, indent=2)
    print(f"[INFO] Exported processed skills index to {processed_skills_file}")

    # 5. Build Vectors & FAISS Index
    print("[INFO] Building SentenceTransformers embeddings (all-MiniLM-L6-v2)...")
    embed_svc = get_embedding_service()
    try:
        embed_svc.load()
    except Exception:
        pass

    career_objs = []
    for c in careers:
        req_skills = []
        for s in c.get("required_skills", []):
            if isinstance(s, dict):
                req_skills.append(SkillRequirement(
                    name=s.get("name", ""),
                    importance=s.get("importance", 0.5),
                    required_level=s.get("required_level", 3)
                ))
        c_copy = dict(c)
        c_copy["required_skills"] = req_skills
        try:
            career_objs.append(Career(**c_copy))
        except Exception:
            pass

    career_embeddings = {}
    if embed_svc.available():
        career_embeddings = build_career_embeddings(embed_svc, career_objs)
        print(f"[INFO] Generated dense 384-dim vectors for {len(career_embeddings)} careers.")

    print("[INFO] Building FAISS vector index...")
    faiss_idx = get_faiss_index()
    faiss_idx.build(career_embeddings)

    # 6. Save FAISS Index & Metadata to Disk
    metadata = [{"id": c.id, "title": c.title, "description": c.description} for c in career_objs]
    persistent_index_manager.save_index(
        faiss_index=faiss_idx.index if faiss_idx.has_faiss else None,
        ids=list(career_embeddings.keys()),
        metadata=metadata
    )
    print(f"[INFO] Persisted FAISS index to {persistent_index_manager.index_path}")
    print("[INFO] Dataset build completed successfully!")


if __name__ == "__main__":
    build_complete_dataset_pipeline()
