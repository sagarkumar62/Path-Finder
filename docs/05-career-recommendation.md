# 05 - Career Recommendation Specification

## 1. Feature Overview

The Career Recommendation engine analyzes learner profile data (skills, interests, education, goals, weekly time) and computes target career matches with confidence levels, reasons, and missing skill gaps.

## 2. API Endpoints

### `POST /api/v1/recommendations`
- **Auth**: Protected
- **Request Body**:
  ```json
  {
    "targetCareer": "AI Engineer"
  }
  ```
- **Response** (200 OK):
  ```json
  {
    "success": true,
    "message": "Career recommendations generated successfully",
    "data": {
      "_id": "66c1f200...",
      "targetCareer": "AI Engineer",
      "recommendations": [
        {
          "career": "AI Engineer",
          "matchScore": 0.88,
          "confidence": 0.92,
          "reasons": [
            "Existing experience in JavaScript & React provides a solid baseline.",
            "High alignment with stated goals for AI Engineer."
          ],
          "skillGaps": ["Python", "Machine Learning", "PyTorch", "Statistics & Math"]
        }
      ]
    }
  }
  ```

### `GET /api/v1/recommendations`
- Returns historical recommendations saved for the user.

### `GET /api/v1/recommendations/:id`
- Retrieves specific recommendation object.
