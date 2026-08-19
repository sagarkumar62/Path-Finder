from pydantic import BaseModel
from typing import List, Optional


class UserSkill(BaseModel):
    name: str
    level: int


class UserProfile(BaseModel):
    user_id: Optional[str]
    education: Optional[str] = None
    education_level: Optional[str] = None
    experience_level: Optional[str] = None
    current_role: Optional[str] = None
    target_career: Optional[str] = None
    skills: List[UserSkill] = []
    interests: List[str] = []
    career_goals: List[str] = []
    learning_preferences: List[str] = []
    weekly_learning_hours: Optional[int] = None
    completed_courses: List[str] = []
    certifications: List[str] = []
    projects: List[str] = []
    learning_history: List[str] = []
