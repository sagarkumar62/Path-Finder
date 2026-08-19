from fastapi import APIRouter, Request, HTTPException
from app.services.embedding_cache import build_career_embeddings
from app.services.recommendation_engine import load_careers

router = APIRouter()


@router.post("/embeddings/refresh")
async def refresh_embeddings(request: Request):
    """Reload embedding model (if not loaded) and rebuild career embeddings cache."""
    embed_svc = getattr(request.app.state, "embedding_service", None)
    if embed_svc is None:
        raise HTTPException(status_code=500, detail={"success": False, "error": {"code": "no_embedding_service", "message": "Embedding service not initialized"}})

    # load model if not already loaded
    if not embed_svc.available():
        try:
            embed_svc.load()
        except Exception:
            raise HTTPException(status_code=500, detail={"success": False, "error": {"code": "embed_load_failed", "message": "Failed to load embedding model"}})

    careers = load_careers()
    mapping = build_career_embeddings(embed_svc, careers)
    request.app.state.career_embeddings = mapping

    return {"success": True, "count": len(mapping)}
