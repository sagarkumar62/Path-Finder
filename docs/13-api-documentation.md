# 13 - Complete API Reference Index

Base URL: `/api/v1`

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | No | System health diagnostics (DB & AI Service) |
| `POST` | `/auth/register` | No | User registration with JWT session creation |
| `POST` | `/auth/login` | No | User login with HTTP-only cookies |
| `POST` | `/auth/logout` | No / Yes | Clears HTTP-only session cookies |
| `POST` | `/auth/refresh` | Refresh Token | Generates new Access & Refresh tokens |
| `GET` | `/auth/me` | Yes | Retrieves current user profile details |
| `GET` | `/profile` | Yes | Get authenticated user's learner profile |
| `POST` | `/profile` | Yes | Create initial onboarding learner profile |
| `PUT` | `/profile` | Yes | Full update replacement of learner profile |
| `PATCH` | `/profile` | Yes | Partial update of learner profile |
| `POST` | `/recommendations` | Yes | Request AI-powered career recommendations |
| `GET` | `/recommendations` | Yes | Get historical recommendations |
| `GET` | `/recommendations/:id` | Yes | Get recommendation by ID |
| `POST` | `/recommendations/skill-gap` | Yes | Calculate skill gap analysis for career |
| `POST` | `/recommendations/adapt` | Yes | Trigger adaptive recommendation update |
| `POST` | `/roadmaps/generate` | Yes | Generate multi-phase learning roadmap |
| `GET` | `/roadmaps` | Yes | List all user roadmaps |
| `GET` | `/roadmaps/:id` | Yes | Get roadmap by ID |
| `PATCH` | `/roadmaps/:id` | Yes | Update roadmap status |
| `GET` | `/progress` | Yes | List milestone progress records |
| `POST` | `/progress` | Yes | Create milestone progress tracker |
| `PATCH` | `/progress/:id` | Yes | Update milestone status/completion |
| `GET` | `/progress/summary` | Yes | Aggregate progress statistics |
| `POST` | `/feedback` | Yes | Submit feedback on recommendations/roadmap |
| `GET` | `/feedback` | Yes | Get user feedback history |
| `POST` | `/conversation/message` | Yes | Send message to AI career assistant |
| `GET` | `/conversation` | Yes | Retrieve active chat conversation |
| `GET` | `/dashboard` | Yes | Unified dashboard data aggregation payload |
