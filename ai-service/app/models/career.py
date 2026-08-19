from pydantic import BaseModel
from typing import List, Optional


class SkillRequirement(BaseModel):
    name: str
    importance: float
    required_level: int


class Career(BaseModel):
    id: str
    title: str
    description: Optional[str]
    required_skills: List[SkillRequirement]
    recommended_skills: Optional[List[str]] = []
    interests: Optional[List[str]] = []
    education: Optional[List[str]] = []
    experience_levels: Optional[List[str]] = []
    typical_duration_months: Optional[int] = None
