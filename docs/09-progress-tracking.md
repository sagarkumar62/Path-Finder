# 09 - Progress Tracking Specification

## 1. Feature Overview

Enables learners to track progress across roadmap phases and individual milestones, recording status (`not_started`, `in_progress`, `completed`), percentage completion, time spent (hours), and personal notes.

## 2. API Endpoints

### 1. `GET /api/v1/progress`
- Query param `roadmapId` (optional).
- Returns list of progress records.

### 2. `POST /api/v1/progress`
- Creates a progress tracker item for a roadmap milestone.

### 3. `PATCH /api/v1/progress/:id`
- **Request Body**:
  ```json
  {
    "status": "completed",
    "completionPercentage": 100,
    "timeSpent": 5,
    "notes": "Completed initial Python syntax exercises."
  }
  ```

### 4. `GET /api/v1/progress/summary`
- Aggregates overall completion percentage, total milestones completed, remaining milestones, and total time spent across active roadmap.
