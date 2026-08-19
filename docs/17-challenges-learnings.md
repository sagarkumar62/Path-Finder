# 17 - Technical Challenges & Key Learnings

## 1. Challenges Encountered & Solutions

1. **AI Microservice Availability**:
   - *Problem*: In a hackathon setting, the Python AI microservice may be under development or offline.
   - *Solution*: Designed an AI abstraction layer with `AI_MOCK_MODE=true` fallback that generates high-quality deterministic responses, allowing frontend and backend development to proceed uninterrupted.

2. **Single-Request Dashboard Efficiency**:
   - *Problem*: Frontend dashboards usually require 6 to 10 REST API calls, increasing latency and state complexity.
   - *Solution*: Engineered `GET /api/v1/dashboard` to execute parallel MongoDB queries and return an aggregated state payload in a single HTTP request.

3. **Strict Microservice Boundaries**:
   - *Problem*: Risk of tightly coupling Node.js and Python.
   - *Solution*: Enforced HTTP REST API contract over port 8000/5000 with clear input/output JSON schemas. Node never executes Python directly.
