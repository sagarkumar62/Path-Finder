from typing import Dict, List
import numpy as np

from app.models.career import Career


def build_career_embeddings(embedding_service, careers: List[Career]) -> Dict[str, np.ndarray]:
    """Create and return a mapping of career_id -> embedding vector.

    embedding_service must implement `encode(list[str]) -> List[list[float]]`.
    """
    texts = []
    ids = []
    for c in careers:
        ids.append(c.id)
        text = " ".join([c.title or "", c.description or "", " ".join([s.name for s in c.required_skills])])
        texts.append(text)

    if not embedding_service or not embedding_service.available():
        return {}

    try:
        embs = embedding_service.encode(texts)
        mapping = {cid: np.array(embs[i], dtype=float) for i, cid in enumerate(ids)}
        return mapping
    except Exception:
        return {}
