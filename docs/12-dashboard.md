# 12 - Dashboard Aggregation Specification

## 1. Feature Overview

The Dashboard endpoint aggregates user profile info, active career goals, top recommendations, skill gap metrics, active roadmap state, milestone progress summaries, recommended next actions, and recent activity into a single optimized payload.

## 2. API Endpoint

`GET /api/v1/dashboard`
- **Auth**: Protected
- **Response** (200 OK):
  ```json
  {
    "success": true,
    "message": "Dashboard data aggregated successfully",
    "data": {
      "user": { "_id": "...", "name": "Jane Doe", "email": "jane@example.com" },
      "careerGoal": { "targetCareer": "AI Engineer", "weeklyLearningHours": 15 },
      "topRecommendations": [...],
      "skillGap": { "missingSkills": ["Python", "Machine Learning"] },
      "roadmap": { "title": "AI Engineer Master Pathway", "status": "active" },
      "progress": { "overallPercentage": 25, "completedMilestones": 2, "remainingMilestones": 6 },
      "nextActions": [
        { "action": "CONTINUE_MILESTONE", "label": "Complete your next pending learning milestone" }
      ],
      "recentActivity": [...]
    }
  }
  ```
