from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import Dict, Any

from app.schemas.profile import UserProfile
from app.services.recommendation_engine import recommend

router = APIRouter()


class RecommendRequest(BaseModel):
    user_id: str
    profile: Dict[str, Any]


@router.post("/recommend")
async def recommend_route(req: RecommendRequest, request: Request):
    if not req.profile:
        raise HTTPException(status_code=400, detail={"success": False, "error": {"code": "invalid_profile", "message": "Profile is required"}})
    embed_svc = getattr(request.app.state, "embedding_service", None)
    career_embeddings = getattr(request.app.state, "career_embeddings", None)
    model = embed_svc if (embed_svc and embed_svc.available()) else None
    res = recommend(req.profile, embedding_service=model, career_embeddings=career_embeddings)
    return res
