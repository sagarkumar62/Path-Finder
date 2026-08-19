from fastapi import APIRouter
from app.config.settings import settings

router = APIRouter()


@router.get("/health")
async def health():
    """Service health check. Do NOT return any secrets."""
    gemini_status = "unavailable"
    if settings.AI_MOCK_MODE:
        gemini_status = "mock"
    elif settings.GEMINI_API_KEY:
        gemini_status = "available"

    return {
        "status": "healthy",
        "service": "career-pathfinder-ai",
        "gemini": gemini_status,
        "model": settings.GEMINI_MODEL,
        "embedding_model": settings.EMBEDDING_MODEL,
    }
