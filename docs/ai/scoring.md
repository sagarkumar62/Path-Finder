# Hybrid Scoring & Recommendation Model

Path Finder uses an explainable, 6-factor hybrid scoring model to evaluate profile-career alignment.

## Scoring Formula

$$\text{MatchScore} = 0.40 \cdot \text{SkillMatch} + 0.20 \cdot \text{InterestMatch} + 0.15 \cdot \text{GoalMatch} + 0.10 \cdot \text{ExpMatch} + 0.05 \cdot \text{EduMatch} + 0.10 \cdot \text{SemanticMatch}$$

## Factor Weight Breakdown

| Factor | Weight | Calculation Method |
|---|---|---|
| **Skill Match** | 40% | `(matchedRequiredSkills / totalRequiredSkills) * 100` normalized via Skill Taxonomy |
| **Interest Match** | 20% | Keyword overlap between user stated interests and career domain tags |
| **Goal Alignment** | 15% | 100% for direct career match, 75% for category match, 40% baseline |
| **Experience Match** | 10% | Alignment between user experience level (Entry/Mid/Senior) and role difficulty |
| **Education Match** | 5% | Overlap between user education background and role prerequisites |
| **Semantic Similarity** | 10% | Keyword vector overlap across user profile summary and role description |

## Score Breakdown Output Example

```json
{
  "career": "AI Engineer",
  "matchScore": 87,
  "confidence": 0.87,
  "scoreBreakdown": {
    "skillMatch": 82,
    "interestMatch": 94,
    "goalMatch": 100,
    "experienceMatch": 80,
    "educationMatch": 80,
    "semanticSimilarity": 89
  }
}
```

Google Gemini AI receives this exact calculated breakdown to generate natural language explanations without modifying the benchmark mathematical score.
