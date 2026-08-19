from typing import Dict, List, Tuple
import numpy as np

try:
    import faiss
    _HAS_FAISS = True
except Exception:
    faiss = None
    _HAS_FAISS = False


class FaissIndex:
    def __init__(self):
        self.index = None
        self.ids = []
        self.dim = 0
        self.has_faiss = _HAS_FAISS

    def build(self, embeddings: Dict[str, np.ndarray]):
        """Build FAISS index (or fallback) from mapping career_id -> vector."""
        if not embeddings:
            self.index = None
            self.ids = []
            return

        keys = list(embeddings.keys())
        mat = np.stack([embeddings[k].astype('float32') for k in keys])
        self.ids = keys
        self.dim = mat.shape[1]

        if self.has_faiss:
            self.index = faiss.IndexFlatIP(self.dim)
            faiss.normalize_L2(mat)
            self.index.add(mat)
        else:
            # store matrix for brute-force cosine search
            # normalize rows
            norms = np.linalg.norm(mat, axis=1, keepdims=True)
            norms[norms == 0] = 1.0
            self.index = mat / norms

    def search(self, query_vec: np.ndarray, top_k: int = 5) -> List[Tuple[str, float]]:
        """Return list of (career_id, score) sorted by descending similarity."""
        if self.index is None:
            return []
        q = np.array(query_vec, dtype='float32').reshape(1, -1)
        if self.has_faiss:
            faiss.normalize_L2(q)
            D, I = self.index.search(q, top_k)
            results = []
            for score, idx in zip(D[0], I[0]):
                if idx < 0:
                    continue
                results.append((self.ids[int(idx)], float(score)))
            return results
        else:
            # brute force cosine: normalize q and compute dot
            qn = q / (np.linalg.norm(q) + 1e-12)
            sims = (self.index @ qn.T).squeeze()
            idxs = np.argsort(-sims)[:top_k]
            return [(self.ids[int(i)], float(sims[i])) for i in idxs]


_idx = FaissIndex()


def get_faiss_index():
    return _idx
