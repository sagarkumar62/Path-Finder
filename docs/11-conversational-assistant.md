# 11 - Conversational AI Assistant Specification

## 1. Feature Overview

Provides a context-aware AI assistant interface allowing users to converse regarding career planning, milestone difficulties, and next learning steps. Conversations are persisted in MongoDB.

## 2. API Endpoints

### 1. `POST /api/v1/conversation/message`
- **Request Body**:
  ```json
  {
    "message": "What should I learn after mastering JavaScript?",
    "context": {
      "currentCareer": "AI Engineer"
    }
  }
  ```
- **Response** (200 OK):
  ```json
  {
    "success": true,
    "message": "Message processed successfully",
    "data": {
      "reply": {
        "sender": "assistant",
        "message": "Since your target career is AI Engineer and you already know JavaScript, the best next step is Python...",
        "suggestedActions": ["Start Python Basics Course", "Explore NumPy and Pandas"],
        "relatedSkills": ["Python", "Machine Learning"]
      }
    }
  }
  ```

### 2. `GET /api/v1/conversation`
- Returns user's active conversation history.
