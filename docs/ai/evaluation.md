# AI Evaluation & Benchmarking

Path Finder includes an automated evaluation test runner (`server/src/utils/ai-evaluation.ts`) to continuously validate recommendation precision, skill-gap analysis, and ranking quality across representative learner profiles.

## Benchmark Results

```text
====================================================
           CAREER PATHFINDER AI EVALUATION          
====================================================

[Profile]: Frontend to AI Engineer Transitioner
  Target Goal   : AI Engineer
  Top 1 Match   : AI Engineer (PASS ✓)
  Top 3 Ranked  : AI Engineer, Frontend Developer, Mobile Developer
----------------------------------------------------
[Profile]: Data Analyst to Data Scientist
  Target Goal   : Data Scientist
  Top 1 Match   : Data Scientist (PASS ✓)
  Top 3 Ranked  : Data Scientist, Data Analyst, Backend Developer
----------------------------------------------------
[Profile]: Full Stack Developer
  Target Goal   : Full Stack Developer
  Top 1 Match   : Full Stack Developer (PASS ✓)
  Top 3 Ranked  : Full Stack Developer, Mobile Developer, Frontend Developer
----------------------------------------------------
[Profile]: DevOps Aspirant
  Target Goal   : DevOps Engineer
  Top 1 Match   : DevOps Engineer (PASS ✓)
  Top 3 Ranked  : DevOps Engineer, Cloud Engineer, Machine Learning Engineer
----------------------------------------------------
[Profile]: Cybersecurity Analyst Aspirant
  Target Goal   : Cybersecurity Analyst
  Top 1 Match   : Cybersecurity Analyst (PASS ✓)
  Top 3 Ranked  : Cybersecurity Analyst, DevOps Engineer, Cloud Engineer
----------------------------------------------------

====================================================
  EVALUATION SUMMARY
  Top-1 Precision Accuracy: 100.0% (5/5)
  Top-3 Recall Precision  : 100.0% (5/5)
====================================================
```

## Running Evaluation Suite

```powershell
cd server
npx tsx src/utils/ai-evaluation.ts
```
