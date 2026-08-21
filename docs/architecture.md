# Path Finder Architecture

Path Finder is a modern full-stack AI platform built to deliver personalized career recommendations, skill-gap analysis, 4-phase learning pathways, and context-aware AI mentorship.

## Architecture Stack

- **Frontend**: Next.js 16.3.1 (Turbopack) + React 19 + Tailwind CSS + Lucide Icons + TanStack React Query.
- **Backend API**: Node.js + Express 5.0 + TypeScript + Zod Validation.
- **Database**: MongoDB Atlas via Mongoose ODM.
- **AI Infrastructure**: Live Google Gemini REST API (`gemini-1.5-flash` / `gemini-2.0-flash`) + Deterministic 6-Factor Hybrid Scoring Engine + Skill Taxonomy Normalizer.

## Key Subsystems

1. **Authentication & Session Manager**: Dual JWT token strategy (Access token in memory/headers + Refresh token in HTTP-only cookies).
2. **Hybrid Recommendation Engine**: Computes match scores across 6 factors (Skill 40%, Interest 20%, Goal 15%, Experience 10%, Education 5%, Semantic 10%) and generates natural language explanations via Gemini.
3. **Skill Gap Engine**: Analyzes missing vs acquired skills deterministically.
4. **Adaptive Roadmap Engine**: Generates 4-phase pathways and adapts timeline pacing based on milestone completion rates.
5. **AI Assistant**: Context-aware career mentor receiving active user goals, current skills, roadmap phase, and next milestone.
