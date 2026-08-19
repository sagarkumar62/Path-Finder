from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
from typing import Optional

router = APIRouter()


class SearchRequest(BaseModel):
    text: Optional[str] = None
    top_k: int = 5


@router.post("/embeddings/search")
async def search_embeddings(req: SearchRequest, request: Request):
    faiss_idx = getattr(request.app.state, "faiss_index", None)
    embed_svc = getattr(request.app.state, "embedding_service", None)
    if not faiss_idx:
        raise HTTPException(status_code=500, detail={"success": False, "error": {"code": "no_index", "message": "Embeddings index not initialized"}})

    if not req.text:
        raise HTTPException(status_code=400, detail={"success": False, "error": {"code": "missing_text", "message": "`text` is required"}})

    model = embed_svc if (embed_svc and embed_svc.available()) else None
    if model is None:
        raise HTTPException(status_code=503, detail={"success": False, "error": {"code": "embeddings_unavailable", "message": "Embedding model not available"}})

    q_emb = model.encode([req.text])[0]
    results = faiss_idx.search(q_emb, top_k=req.top_k)
    return {"success": True, "results": [{"career_id": r[0], "score": r[1]} for r in results]}
