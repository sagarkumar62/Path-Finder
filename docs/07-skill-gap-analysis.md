# 07 - Skill Gap Analysis Specification

## 1. Feature Overview

Skill Gap Analysis compares the authenticated user's current skills against the target career requirements. It categorizes skills into:
- Current skills match
- Missing required skills
- Skills to improve
- Prioritized learning order

## 2. API Endpoint

`POST /api/v1/recommendations/skill-gap`
- **Auth**: Protected
- **Request**:
  ```json
  {
    "targetCareer": "AI Engineer"
  }
  ```
- **Response** (200 OK):
  ```json
  {
    "success": true,
    "message": "Skill gap analysis generated successfully",
    "data": {
      "career": "AI Engineer",
      "currentSkills": ["JavaScript", "React"],
      "missingSkills": ["Python", "Machine Learning", "PyTorch", "Statistics & Math"],
      "skillsToImprove": ["SQL / PostgreSQL"],
      "priority": ["Python", "Machine Learning", "Statistics & Math", "PyTorch"]
    }
  }
  ```
