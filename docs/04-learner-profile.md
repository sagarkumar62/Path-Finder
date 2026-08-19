# 04 - Learner Profile Specification

## 1. Purpose

The Learner Profile serves as the single source of truth for user background, experience level, existing skills, career goals, weekly availability, and learning preferences. It feeds directly into the AI Recommendation and Roadmap generation engines.

## 2. API Endpoints

### 1. `GET /api/v1/profile`
- **Auth**: Protected
- **Response** (200 OK): Returns current user's profile. Creates a default empty profile if none exists.

### 2. `POST /api/v1/profile`
- **Auth**: Protected
- **Request Body**:
  ```json
  {
    "education": "B.Tech Computer Science",
    "educationLevel": "Bachelor",
    "experienceLevel": "Beginner",
    "currentRole": "Student",
    "targetCareer": "AI Engineer",
    "skills": ["JavaScript", "React", "Node.js"],
    "interests": ["Artificial Intelligence", "Web Development"],
    "careerGoals": ["Become Senior AI Engineer"],
    "learningPreferences": ["Projects", "Videos"],
    "weeklyLearningHours": 15
  }
  ```
- **Response** (201 Created)

### 3. `PUT /api/v1/profile`
- **Auth**: Protected
- Full replacement update of learner profile.

### 4. `PATCH /api/v1/profile`
- **Auth**: Protected
- Partial patch update for specific profile fields.
