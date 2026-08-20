import os
import pickle
from typing import Dict, List, Any, Tuple, Optional
import numpy as np
from app.config.settings import settings

try:
    import faiss
    _HAS_FAISS = True
except Exception:
    faiss = None
    _HAS_FAISS = False


class PersistentIndexManager:
    def __init__(self):
        self.index_path = settings.VECTOR_INDEX_PATH or os.path.join(
            os.path.dirname(__file__), "..", "data", "embeddings", "careers.index"
        )
        self.metadata_path = settings.VECTOR_METADATA_PATH or os.path.join(
            os.path.dirname(__file__), "..", "data", "embeddings", "metadata.pkl"
        )

    def save_index(self, faiss_index: Any, ids: List[str], metadata: List[Dict[str, Any]]):
        """Persists FAISS index and metadata to disk."""
        try:
            os.makedirs(os.path.dirname(self.index_path), exist_ok=True)
            if _HAS_FAISS and faiss_index is not None:
                faiss.write_index(faiss_index, self.index_path)
            
            with open(self.metadata_path, "wb") as f:
                pickle.dump({"ids": ids, "metadata": metadata}, f)
        except Exception as e:
            print(f"[PersistentIndex] Warning saving vector index: {e}")

    def load_index(self) -> Tuple[Optional[Any], List[str], List[Dict[str, Any]]]:
        """Loads FAISS index and metadata from disk if present."""
        if not os.path.exists(self.metadata_path):
            return None, [], []

        try:
            with open(self.metadata_path, "rb") as f:
                meta_data = pickle.load(f)
            ids = meta_data.get("ids", [])
            metadata = meta_data.get("metadata", [])

            index = None
            if _HAS_FAISS and os.path.exists(self.index_path):
                index = faiss.read_index(self.index_path)

            return index, ids, metadata
        except Exception as e:
            print(f"[PersistentIndex] Warning loading vector index: {e}")
            return None, [], []


persistent_index_manager = PersistentIndexManager()
