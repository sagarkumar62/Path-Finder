# 10 - Feedback & Adaptive Learning Specification

## 1. Feature Overview

Allows learners to submit qualitative and quantitative feedback regarding recommendations or roadmaps. The backend communicates feedback context to the Python AI service (`POST /adapt`), enabling dynamic updates to learning paths.

## 2. API Endpoints

### 1. `POST /api/v1/feedback`
- **Request Body**:
  ```json
  {
    "recommendationId": "66c1f200...",
    "rating": 5,
    "useful": true,
    "reason": "Highly accurate skill gap analysis",
    "comments": "The recommended PyTorch track matched my current project."
  }
  ```

### 2. `GET /api/v1/feedback`
- Returns all feedback records submitted by the user.

### 3. `POST /api/v1/recommendations/adapt`
- Triggers adaptive re-evaluation of recommendations and roadmap based on milestone progress and feedback.
