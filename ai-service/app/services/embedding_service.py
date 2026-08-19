from typing import Optional, List
from app.config.settings import settings


class EmbeddingService:
    def __init__(self):
        self.model = None

    def load(self):
        try:
            from sentence_transformers import SentenceTransformer

            self.model = SentenceTransformer(settings.EMBEDDING_MODEL)
        except Exception:
            # model not available or failed to load
            self.model = None

    def available(self) -> bool:
        return self.model is not None

    def encode(self, texts: List[str]):
        if not self.model:
            raise RuntimeError("Embedding model not loaded")
        return self.model.encode(texts)


_svc = EmbeddingService()


def get_embedding_service() -> EmbeddingService:
    return _svc
