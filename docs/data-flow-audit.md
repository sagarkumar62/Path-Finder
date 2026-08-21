# Career PathFinder — Master Data Flow Audit & Verification Matrix

This document represents the audited, verified master data flow map for **Career PathFinder / Path Finder**.

---

## 1. System Architecture Map

```
USER (Next.js 16.3.1 Client)
        ↓
TanStack React Query Cache / AuthContext
        ↓
API Client (client/src/lib/api.ts with JWT Interceptor)
        ↓
Express API Gateway (Port 5000)
        ↓
Authenticated Controllers (req.user._id scoping)
        ↓
Services Layer (recommendation, profile, roadmap, progress, conversation)
        ↓
MongoDB Atlas (User, LearnerProfile, Recommendation, Roadmap, Progress, Conversation)
        ↓
Google Gemini AI Engine (v1beta gemini-2.5-flash / gemini-3.6-flash for natural language text synthesis)
        ↓
Structured Express Response Wrapper (ApiResponse { statusCode, data, message, success })
        ↓
API Client Unwrapping (unwrapData)
        ↓
React Query State Updates & UI Render
```

---

## 2. Comprehensive Data Flow Audit Matrix

| Feature / Section | Frontend Component | API Client Method | Endpoint & Route | Backend Controller | Service Layer | DB Model Scoping | AI Boundary | React Query Key | Invalidation Trigger | Verification Status |
|---|---|---|---|---|---|---|---|---|---|---|
| **Dashboard** | `DashboardPage` (`client/src/app/dashboard/page.tsx`) | `api.getDashboardData()` | `GET /api/v1/dashboard` | `getDashboardData` | `progressService`, `recommendationService` | `User`, `LearnerProfile`, `Roadmap`, `Progress` (`userId: req.user._id`) | Deterministic 6-Factor AI Fit Formula calculated server-side | `['dashboard']` | `Profile Save`, `Milestone Toggle`, `Roadmap Generation` | PASS ✓ |
| **Auth / User Info** | `AuthProvider` (`client/src/context/AuthContext.tsx`) | `api.getCurrentUser()` | `GET /api/v1/auth/me` | `getCurrentUser` | `authService` | `User` (`_id: req.user._id`) | None (Direct DB extraction) | `['currentUser']` | `Profile Save`, `Logout` (`queryClient.clear()`) | PASS ✓ |
| **Learner Profile** | `ProfilePage` (`client/src/app/profile/page.tsx`) | `api.getProfile()`, `api.saveProfile()` | `GET /api/v1/profile`, `POST /api/v1/profile` | `getProfile`, `saveProfile` | `profileService` | `LearnerProfile` (`userId: req.user._id`) | Triggers real-time AI Fit score recalculation for updated skills | `['profile']` | `['profile']`, `['dashboard']`, `['recommendations']`, `['roadmap']` | PASS ✓ |
| **Recommendations** | `RecommendationsPage` (`client/src/app/recommendations/page.tsx`) | `api.getRecommendations()` | `GET /api/v1/recommendations` | `getRecommendations` | `recommendationService` | `Recommendation`, `CAREERS_DATASET` | 6-Factor Hybrid Formula calculates score; Gemini synthesizes `whyMatches` | `['recommendations']` | `Profile Save`, `Target Career Change` | PASS ✓ |
| **Skill Gap Analysis** | `CareerDetailPage` (`client/src/app/careers/[id]/page.tsx`) | `api.getSkillGap()` | `POST /api/v1/recommendations/skill-gap` | `getSkillGap` | `recommendationService` | `LearnerProfile`, `CAREERS_DATASET` | Deterministic required vs current skill delta classification | `['skill-gap', careerId]` | `Profile Save` | PASS ✓ |
| **Learning Roadmap** | `RoadmapPage` (`client/src/app/roadmap/page.tsx`) | `api.getRoadmap()`, `api.toggleMilestone()` | `GET /api/v1/roadmaps`, `PATCH /api/v1/roadmaps/:id` | `getRoadmaps`, `updateRoadmap` | `roadmapService` | `Roadmap` (`_id: id, userId: req.user._id`) | AI builds 4-phase pathway; adaptive events log pacing | `['roadmap']` | `['roadmap']`, `['dashboard']`, `['progress']` | PASS ✓ |
| **Progress Analytics** | `ProgressPage` (`client/src/app/progress/page.tsx`) | `api.getProgress()` | `GET /api/v1/progress/summary` | `getProgressSummary` | `progressService` | `Progress` (`userId: req.user._id`) | Deterministic hours, streak days & completed milestone aggregation | `['progress']` | `Milestone Toggle`, `Roadmap Regeneration` | PASS ✓ |
| **Context-Aware AI Assistant** | `AssistantPage` (`client/src/app/assistant/page.tsx`) | `api.sendAssistantMessage()` | `POST /api/v1/conversation/message` | `sendMessage` | `conversationService`, `aiService` | `Conversation`, `LearnerProfile`, `Roadmap` | Backend injects user goal, current skills, phase & next milestone into Gemini AI | N/A (Mutation-driven local list state) | `['conversation']` | PASS ✓ |

---

## 3. Audited Data Flow Contracts & Rules

### Rule 1: Centralized API Client (`client/src/lib/api.ts`)
- All frontend data requests flow strictly through `client/src/lib/api.ts`.
- Zero raw `fetch()` or `axios()` calls exist in page/component files.
- Axios request interceptor attaches `Authorization: Bearer <sessionStorage.token>`.
- `unwrapData()` unwraps `ApiResponse` wrapper `{ statusCode, data, message, success }` into clean TypeScript resources for React components.

### Rule 2: User Security & Scoping (`req.user._id`)
- Every backend route uses `authMiddleware` to decode JWT token.
- Controllers enforce `const userId = req.user._id`.
- Zero reliance on client-supplied `req.body.userId` or `req.query.userId` for authorization.
- Database queries use `{ userId: req.user._id }` or `{ _id: id, userId: req.user._id }`.

### Rule 3: AI vs Deterministic Code Boundary
- **Deterministic Math Scoring**: Match Scores, 6-factor score breakdowns, skill gaps, progress percentage, learning hours, streak days, and milestone priorities are computed deterministically in backend TypeScript services.
- **Gemini AI Role**: Synthesizes natural language text explanations (`whyMatches`), 4-phase learning pathways, and context-aware mentor guidance. Gemini AI does NOT override calculated math scores.

### Rule 4: React Query Cache Invalidation Matrix
- **Profile Save (`updateUserAndProfile`)**: Invalidates `['profile']`, `['dashboard']`, `['recommendations']`, `['roadmap']`.
- **Milestone Toggle (`toggleMilestone`)**: Invalidates `['roadmap']`, `['dashboard']`, `['progress']`.
- **Logout (`logout`)**: Clears authenticated query cache (`queryClient.clear()`).

---

## 4. Production Build Verification Results

- **Backend Compilation (`server`)**: Executed `npm run build` $\rightarrow$ `tsc` compiled cleanly (**Exit Code 0**).
- **AI Evaluation Suite (`server`)**: Executed `npx tsx src/utils/ai-evaluation.ts` $\rightarrow$ **100.0% Top-1 Precision Accuracy & 100.0% Top-3 Recall Precision (Exit Code 0)**.
- **Frontend Compilation (`client`)**: Executed `npm run build` $\rightarrow$ Next.js Turbopack compiled and prerendered static pages cleanly (**Exit Code 0**).

---

## 5. Verification Checklist & Definition of Done

- [x] Every frontend API call goes through `client/src/lib/api.ts`.
- [x] Every server-state fetch uses TanStack React Query (`useQuery`).
- [x] Every protected backend endpoint uses `req.user._id`.
- [x] No client-provided `userId` is trusted for authorization.
- [x] Every MongoDB user query is scoped to `{ userId }`.
- [x] Gemini API calls are strictly backend-only (`server/src/services/ai.service.ts`).
- [x] Response shapes are consistent via `ApiResponse` wrapper & `unwrapData`.
- [x] No duplicate score or skill gap calculations exist in React components.
- [x] React Query cache invalidation is correctly mapped to mutations.
- [x] Loading, empty, and error UI states are implemented across pages.
- [x] AI context is built server-side in `conversationService`.
- [x] Frontend and Backend production builds pass cleanly (`exit code 0`).
