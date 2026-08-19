from pydantic import BaseModel
from typing import Dict, List, Optional


class ScoreBreakdown(BaseModel):
    skill_match: float
    interest_match: float
    goal_match: float
    experience_match: float
    education_match: float
    semantic_similarity: float


class RecommendationItem(BaseModel):
    career_id: str
    career: str
    match_score: float
    score_breakdown: ScoreBreakdown
    strengths: List[str]
    skill_gaps: List[str]
    reason: Optional[str] = None
    confidence: float


class RecommendationResponse(BaseModel):
    success: bool
    recommendations: List[RecommendationItem]
