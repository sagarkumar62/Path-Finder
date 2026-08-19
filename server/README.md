# CAREER PATHFINDER - Backend API

> AI-Powered Personalized Career and Learning Path Recommendation SaaS (Hackathon Prototype)

---

## 📌 Project Overview

**CAREER PATHFINDER** backend is a modular, scalable Node.js + Express + TypeScript RESTful API server. It manages user authentication, learner profiles, career catalog data, milestone progress tracking, qualitative feedback loops, conversational AI interactions, and unified dashboard data aggregation.

It communicates with an independent Python FastAPI AI microservice for machine learning calculations, vector embeddings, skill gap analysis, and LLM orchestration.

---

## 🏗 High-Level Architecture

```
                    USER
                      │
                      ▼
              Next.js Frontend
                      │
                      │ REST API
                      ▼
             Node.js + Express Backend
                      │
          ┌───────────┴───────────┐
          │                       │
          ▼                       ▼
       MongoDB              Python AI Service
                                  │
                                  ▼
                         ML / Recommendation / LLM
```

---

## 🛠 Tech Stack

- **Runtime**: Node.js, TypeScript
- **Framework**: Express.js
- **Database**: MongoDB, Mongoose ORM
- **Authentication**: JWT (Access & Refresh tokens), HTTP-only Cookies, bcryptjs
- **Validation**: Zod schema validation
- **HTTP Client**: Axios (for Python FastAPI microservice bridge)
- **Security & Utilities**: Helmet, CORS, Morgan, Cookie-Parser

---

## 📂 Project Structure

```
server/
├── src/
│   ├── config/
│   │   ├── db.ts               # MongoDB Mongoose connection
│   │   ├── env.ts              # Environment variable loader
│   │   └── ai.ts               # AI service configuration
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── profile.controller.ts
│   │   ├── conversation.controller.ts
│   │   ├── recommendation.controller.ts
│   │   ├── roadmap.controller.ts
│   │   ├── progress.controller.ts
│   │   ├── feedback.controller.ts
│   │   ├── assistant.controller.ts
│   │   └── dashboard.controller.ts
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts        # JWT token extraction & verification
│   │   ├── error.middleware.ts       # Centralized error handler
│   │   ├── notFound.middleware.ts    # 404 handler
│   │   └── validation.middleware.ts  # Zod schema request validator
│   │
│   ├── models/
│   │   ├── User.ts
│   │   ├── LearnerProfile.ts
│   │   ├── Career.ts
│   │   ├── Skill.ts
│   │   ├── LearningResource.ts
│   │   ├── Recommendation.ts
│   │   ├── Roadmap.ts
│   │   ├── Progress.ts
│   │   ├── Feedback.ts
│   │   └── Conversation.ts
│   │
│   ├── routes/
│   │   ├── health.routes.ts
│   │   ├── auth.routes.ts
│   │   ├── profile.routes.ts
│   │   ├── conversation.routes.ts
│   │   ├── recommendation.routes.ts
│   │   ├── roadmap.routes.ts
│   │   ├── progress.routes.ts
│   │   ├── feedback.routes.ts
│   │   ├── assistant.routes.ts
│   │   └── dashboard.routes.ts
│   │
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── profile.service.ts
│   │   ├── recommendation.service.ts
│   │   ├── roadmap.service.ts
│   │   ├── progress.service.ts
│   │   ├── feedback.service.ts
│   │   ├── conversation.service.ts
│   │   └── ai.service.ts              # FastAPI REST client + Mock AI engine
│   │
│   ├── validators/
│   │   ├── auth.validator.ts
│   │   ├── profile.validator.ts
│   │   ├── recommendation.validator.ts
│   │   └── feedback.validator.ts
│   │
│   ├── utils/
│   │   ├── ApiError.ts
│   │   ├── ApiResponse.ts
│   │   ├── jwt.ts
│   │   ├── logger.ts
│   │   └── seed.ts                  # Database seed script
│   │
│   ├── app.ts                        # Express application configuration
│   └── server.ts                     # HTTP server entry point
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## ⚡ Quick Start & Running Locally

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Setup

Create `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Default `.env` contents:

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb+srv://testuser:7s2a5g0a2r6@music.v4orayv.mongodb.net/career_pathfinder

JWT_ACCESS_SECRET=career_pathfinder_jwt_access_secret_key_2026_dev
JWT_REFRESH_SECRET=career_pathfinder_jwt_refresh_secret_key_2026_dev

ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:3000

AI_SERVICE_URL=http://localhost:8000
AI_SERVICE_TIMEOUT=30000
AI_MOCK_MODE=true
```

### 3. Seed Database

Populate realistic career, skill, and resource data:

```bash
npm run seed
```

### 4. Start Development Server

```bash
npm run dev
```

The server will start at: `http://localhost:5000/api/v1/health`

---

## 🤖 Mock AI Mode (`AI_MOCK_MODE=true`)

When `AI_MOCK_MODE=true` is set in `.env`, the backend generates deterministic, realistic recommendations, skill gaps, roadmaps, and assistant replies without needing the Python FastAPI service running locally.

When Python FastAPI is running, set `AI_MOCK_MODE=false`. If FastAPI fails or times out, `AIService` automatically falls back gracefully without crashing Express.

---

## 📡 API Endpoint Summary

### Base URL: `/api/v1`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Server, Database & AI Health Check |
| `POST` | `/auth/register` | Register new user account |
| `POST` | `/auth/login` | Login user & set HTTP-only cookies |
| `POST` | `/auth/logout` | Clear authentication cookies |
| `POST` | `/auth/refresh` | Refresh JWT tokens |
| `GET` | `/auth/me` | Get current user info |
| `GET` | `/profile` | Get user learner profile |
| `POST` | `/profile` | Create initial profile |
| `PUT` | `/profile` | Full update profile |
| `PATCH` | `/profile` | Partial update profile |
| `POST` | `/recommendations` | Generate career recommendations |
| `GET` | `/recommendations` | List user recommendations |
| `POST` | `/recommendations/skill-gap` | Skill gap analysis |
| `POST` | `/recommendations/adapt` | Adaptive recommendation update |
| `POST` | `/roadmaps/generate` | Generate learning roadmap |
| `GET` | `/roadmaps` | List user roadmaps |
| `GET` | `/roadmaps/:id` | Get specific roadmap |
| `PATCH` | `/roadmaps/:id` | Update roadmap status |
| `GET` | `/progress` | List milestone progress |
| `POST` | `/progress` | Track milestone progress |
| `PATCH` | `/progress/:id` | Update milestone status/completion |
| `GET` | `/progress/summary` | Progress summary metrics |
| `POST` | `/feedback` | Submit feedback |
| `GET` | `/feedback` | Get user feedback history |
| `POST` | `/conversation/message` | Send chat message to AI assistant |
| `GET` | `/conversation` | Get conversation history |
| `GET` | `/dashboard` | Aggregated dashboard data payload |

---

## 📚 Documentation Directory (`docs/`)

Comprehensive feature documentation files are available in `docs/`:

- `docs/00-project-overview.md`
- `docs/01-architecture.md`
- `docs/02-database-design.md`
- `docs/03-authentication.md`
- `docs/04-learner-profile.md`
- `docs/05-career-recommendation.md`
- `docs/06-ai-integration.md`
- `docs/07-skill-gap-analysis.md`
- `docs/08-roadmap-generation.md`
- `docs/09-progress-tracking.md`
- `docs/10-feedback-adaptation.md`
- `docs/11-conversational-assistant.md`
- `docs/12-dashboard.md`
- `docs/13-api-documentation.md`
- `docs/14-security.md`
- `docs/15-testing.md`
- `docs/16-deployment.md`
- `docs/17-challenges-learnings.md`
