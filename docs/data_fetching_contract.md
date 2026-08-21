# Career PathFinder — Complete Data Fetching Instructions & Implementation Contract

## Goal

Use this document as the implementation contract for every data-fetching and data-display flow in **Path Finder**.

### Verified Architecture

```
React Page / Component
        ↓
TanStack React Query / AuthContext
        ↓
API Client (lib/api.ts)
        ↓
Express Backend
        ↓
MongoDB Atlas
        ↓
Gemini AI (when synthesis is required)
        ↓
Express response wrapper
        ↓
API client
        ↓
React Query state
        ↓
UI
```

---

## 1. Global Rules

### Frontend
- Use **TanStack React Query** for server state.
- **Standard query**:
  ```ts
  const { data, isLoading, isError } = useQuery({
    queryKey: ['resource'],
    queryFn: () => api.getResource(),
  });
  ```
- **Standard mutation**:
  ```ts
  const mutation = useMutation({
    mutationFn: (payload) => api.updateResource(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resource'] });
    },
  });
  ```
- All requests MUST go through `client/src/lib/api.ts`. Do not call MongoDB or Gemini directly from React.

### Backend
- Every user-specific request MUST use the authenticated user ID:
  ```ts
  const userId = req.user._id;
  ```
- Never trust a client-provided user ID (`req.body.userId`) for authorization.

### AI vs Deterministic Code Boundaries
- **Gemini AI generates**: explanations, recommendation text (`whyMatches`), roadmap guidance, assistant responses.
- **Deterministic Code calculates**: match scores, skill gaps, progress, streaks, completion percentages, priority rankings.

---

## 2. Dashboard

- **Page**: `client/src/app/dashboard/page.tsx`
- **Endpoint**: `GET /api/v1/dashboard`
- **Backend Controller**: `server/src/controllers/dashboard.controller.ts`

### Query
```ts
const { data: dashboard, isLoading } = useQuery({
  queryKey: ['dashboard'],
  queryFn: () => api.getDashboardData(),
});
```

### Data & Calculations
- **Fetch User-Scoped**: User, LearnerProfile, active Roadmap, Progress, Career recommendation information.
- **Greeting**: `user.name`
- **Active Career Goal**: Sourced from `LearnerProfile.targetCareerGoal` / `LearnerProfile.targetCareer` / active `Roadmap`.
- **6-Factor AI Fit Formula**:
  $$\text{MatchScore} = 0.40 \cdot \text{SkillMatch} + 0.20 \cdot \text{InterestMatch} + 0.15 \cdot \text{GoalMatch} + 0.10 \cdot \text{ExpMatch} + 0.05 \cdot \text{EduMatch} + 0.10 \cdot \text{SemanticMatch}$$
- **Progress**: `overallCompletionPercent`, `learningHours`, `streakDays`.
- **Skill-Gap Summary**: Aggregate counts of `strong`, `needsWork`, `missing`.

---

## 3. Profile

- **Page**: `client/src/app/profile/page.tsx`
- **Endpoints**:
  - `GET /api/v1/auth/me`
  - `GET /api/v1/profile`
  - `PUT /api/v1/auth/change-password`

### AuthContext Fetching
```ts
const currentUser = await api.getCurrentUser();
const currentProfile = await api.getProfile();
```

### Display & Cache Rule
- **Email Source**: `currentUser.email` (never cached fallback).
- **Skills**: Normalized using taxonomy; displays proficiency (*Beginner*, *Intermediate*, *Advanced*).
- **Profile Save Flow**:
  $$\text{ProfileService} \longrightarrow \text{MongoDB Save} \longrightarrow \text{Recalculate Recommendations}$$
  - **Invalidates**: `['profile']`, `['dashboard']`, `['recommendations']`.

---

## 4. Career Recommendations

- **Page**: `client/src/app/recommendations/page.tsx`
- **Endpoint**: `GET /api/v1/recommendations`
- **Service**: `server/src/services/recommendation.service.ts`

### Query
```ts
const { data: recommendations } = useQuery({
  queryKey: ['recommendations'],
  queryFn: () => api.getRecommendations(),
});
```

### Calculation & AI Boundary
- Evaluates all 12 dataset careers returning `matchScore` and `scoreBreakdown`.
- **Gemini**: Receives calculated breakdown and generates natural-language explanation (`whyMatches`). Gemini MUST NOT alter the mathematical score.
- **Display**: Sorted by `matchScore DESC` showing career title, match percentage, reasons, skill gaps, and comparison details.

---

## 5. Skill Gap Analysis

- **Page**: `client/src/app/careers/[id]/page.tsx`
- **Endpoint**: `POST /api/v1/recommendations/skill-gap`
- **Service**: `recommendationService.getSkillGapAnalysis(userId, careerId)`

### Classification Rules
- Compare `LearnerProfile.skills` against `CAREERS_DATASET.requiredSkills` (both normalized):
  - `currentLevel = 4` $\rightarrow$ **Strong**
  - `currentLevel = 2` $\rightarrow$ **Needs Improvement**
  - `currentLevel = 0` $\rightarrow$ **Missing**
- Priority ordering considers prerequisites.

---

## 6. Learning Roadmap

- **Page**: `client/src/app/roadmap/page.tsx`
- **Endpoint**: `GET /api/v1/roadmaps`
- **Service**: `server/src/services/roadmap.service.ts`

### Display & Mutation
- Displays 4 phases exposing title, duration, skills, milestones, projects, resources, and completion states.
- **Milestone Update**: `PATCH /api/v1/roadmaps/:id` with `{ phaseId, milestoneId }`.
  - **On Success Invalidate**: `['roadmap']`, `['dashboard']`, `['progress']`.
- **Adaptive Events**: Reads `roadmap.adaptiveEvents` and displays adaptive learning adjustment notification banners.

---

## 7. Progress Analytics

- **Page**: `client/src/app/progress/page.tsx`
- **Endpoint**: `GET /api/v1/progress/summary`
- **Service**: `server/src/services/progress.service.ts`

### Data Metrics
- Scoped to `req.user._id`.
- Returns `totalLearningHours`, `currentStreakDays`, `completedMilestonesCount`, `recentActivity`.

---

## 8. Context-Aware AI Assistant

- **Page**: `client/src/app/assistant/page.tsx`
- **Endpoint**: `POST /api/v1/conversation/message`
- **Service**: `conversationService.sendMessage()` $\rightarrow$ `aiService.generateAssistantResponse()`

### Context Injection
- Before calling Gemini, fetches active target career, current skills, active roadmap, current phase, next milestone, and estimated hours.
- Answers reference actual pending milestones instead of generic career advice.

---

## 9. React Query Cache Invalidation Rules

| Action / Mutation | Invalidation Target Keys |
|---|---|
| **Profile Update** | `['profile']`, `['dashboard']`, `['recommendations']`, `['roadmap']` |
| **Milestone Toggle** | `['roadmap']`, `['dashboard']`, `['progress']` |
| **Recommendation Generation** | `['recommendations']`, `['dashboard']` |
| **Roadmap Regeneration** | `['roadmap']`, `['dashboard']`, `['progress']` |
| **Logout** | Clear authenticated query/cache state completely (`queryClient.clear()`) |

---

## 10. API Client Centralization Rules

All frontend requests MUST reside in `client/src/lib/api.ts`:

- `GET /api/v1/dashboard`
- `GET /api/v1/auth/me`
- `GET /api/v1/profile`
- `GET /api/v1/recommendations`
- `POST /api/v1/recommendations/skill-gap`
- `GET /api/v1/roadmaps`
- `PATCH /api/v1/roadmaps/:id`
- `GET /api/v1/progress/summary`
- `POST /api/v1/conversation/message`

---

## 11. Loading / Empty / Error UI Boundaries

Every data-fetching component MUST handle state explicitly:

```tsx
if (isLoading) return <LoadingSkeleton />;
if (isError) return <ErrorState message={error.message} />;
if (!data) return <EmptyState />;
return <PageContent data={data} />;
```

For AI operations, display meaningful progress messages (*"Analyzing your profile..."*, *"Matching career paths..."*, *"Identifying skill gaps..."*, *"Building your roadmap..."*).

---

## 12. Security & User-Scoping Contract

- Every user-scoped database query MUST be guarded:
  ```ts
  Roadmap.findOne({
    _id: roadmapId,
    userId: req.user._id
  });
  ```
- Gemini API keys MUST remain strictly server-side (`env.GEMINI_API_KEY`).

---

## 13. Python AI Microservice Boundary (If Introduced)

```
Next.js Frontend
       ↓
Express API Gateway
       ↓
Python FastAPI Service (Port 8000)
       ↓
Gemini API / ML Engine
```
- Node/Express remains the public gateway and authentication provider.

---

## 14. Definition of Done

Data fetching for any feature is complete ONLY when it is:
1. Correctly user-scoped (`req.user._id`)
2. Centralized in `lib/api.ts`
3. Cached and mutated via TanStack React Query
4. Invalidated after mutations
5. Calculated deterministically in backend services
6. Rendered with loading, empty, and error UI guards
7. Protected from cross-user access
8. Verified end-to-end with clean builds (`tsc` & `next build`)
