# AI Roadmap Dataset Pipeline & Architecture Documentation

This document serves as the comprehensive operational guide for the **Career PathFinder** AI Roadmap Dataset Pipeline, explaining raw data ingestion, preprocessing, vector embeddings, prerequisite graph construction, 4-phase roadmap generation, and LLM enrichment.

---

## 1. Where to Put Dataset Files

All dataset files belong inside the Python microservice (`ai-service/app/data/`):
- **ESCO raw CSV files**: `ai-service/app/data/raw/esco/` (`occupations.csv`, `skills.csv`, `occupationSkillRelations.csv`).
- **O*NET raw data files**: `ai-service/app/data/raw/onet/` (`occupations.csv`, `skills.csv`, `abilities.csv`, `tasks.csv`).
- **Baseline Curated Dataset**: `ai-service/app/data/careers.json`.

> [!IMPORTANT]
> Raw downloaded files inside `app/data/raw/` MUST NEVER be modified directly. All transformations occur programmatically during pipeline execution.

---

## 2. How to Run Ingestion & Rebuild Dataset Index

Run the reproducible build CLI command from the `ai-service/` root directory:

```bash
python -u -m app.ingestion.build_dataset
```

### Execution Log Output:
```text
[INFO] Starting Career PathFinder Dataset Build Pipeline...
[INFO] Loading ESCO dataset...
[INFO] Loading O*NET dataset...
[INFO] Ingesting baseline careers.json...
[INFO] Careers loaded: 12
[INFO] Normalizing skills and extracting relationship graph...
[INFO] Unique Normalized Skills: 22
[INFO] Career-Skill Relationships: 33
[INFO] Building skill dependency graph (DAG)...
[INFO] Skill dependency graph validated: 0 cycles detected.
[INFO] Exported processed knowledge base to app/data/processed/careers.json
[INFO] Exported processed skills index to app/data/processed/skills.json
[INFO] Building SentenceTransformers embeddings (all-MiniLM-L6-v2)...
[INFO] Generated dense 384-dim vectors for 12 careers.
[INFO] Building FAISS vector index...
[INFO] Persisted FAISS index to app/data/embeddings/careers.index
[INFO] Dataset build completed successfully!
```

---

## 3. Data Transformation Flow: Raw to Processed

```text
Raw Datasets (ESCO / O*NET / careers.json)
                   │
                   ▼
  Cleaning & Normalization (skill_normalizer.py & dataset_cleaner.py)
   - Clamps importance weights (0.0 to 1.0) and required levels (1 to 5)
   - Normalizes "Python programming", "Python (programming)" -> "Python"
   - Normalizes "React.js", "ReactJS", "React JS" -> "React"
                   │
                   ▼
  Processed Unified Knowledge Base
   - Saved to ai-service/app/data/processed/careers.json
   - Saved to ai-service/app/data/processed/skills.json
```

---

## 4. Embedding Generation & FAISS Vector Indexing

- **Model**: `sentence-transformers/all-MiniLM-L6-v2`
- **Vector Dimension**: 384-dimensional dense floating-point vectors.
- **Index Engine**: FAISS (`IndexFlatIP` Inner Product with normalized vectors for exact Cosine Similarity).
- **Disk Persistence**: Vectors and metadata map are saved to `ai-service/app/data/embeddings/careers.index` and `metadata.pkl`. The index loads automatically on service startup without re-encoding unless data changes.

---

## 5. Multi-Factor Career Matching Algorithm

Careers are ranked using an explainable multi-factor scoring formula:

$$\text{Final Score} = w_{\text{skill}} S_{\text{skill}} + w_{\text{interest}} S_{\text{interest}} + w_{\text{goal}} S_{\text{goal}} + w_{\text{exp}} S_{\text{experience}} + w_{\text{sem}} S_{\text{semantic}}$$

Where:
- $S_{\text{skill}}$ = Weighted Skill Match Ratio.
- $S_{\text{semantic}}$ = FAISS Cosine Similarity score.
- $S_{\text{interest}}, S_{\text{goal}}, S_{\text{experience}}$ = Attribute alignment scores.

---

## 6. Skill-Gap Calculation & Categorization

Given a user's skills ($L_{\text{user}}$) and career benchmark requirements ($L_{\text{required}}$):

$$\text{Skill Match Ratio} = \frac{\sum_{i=1}^{n} w_i \times \min\left(\frac{L_{\text{user}, i}}{L_{\text{required}, i}}, 1.0\right)}{\sum_{i=1}^{n} w_i}$$

Skills are categorized into:
- **Missing**: $L_{\text{user}} = 0$
- **Needs Work**: $0 < L_{\text{user}} < L_{\text{required}}$
- **Strong**: $L_{\text{user}} \ge L_{\text{required}}$

---

## 7. Skill Dependency Graph (DAG) & Prerequisites

- Implemented in `ai-service/app/knowledge/skill_graph.py`.
- Cycle Detection: Uses Kahn's algorithm (`detect_cycle()`) to detect cyclic dependencies before generating roadmaps.
- Topological Sorting (`topological_sort_skills()`): Guarantees missing prerequisite root skills (e.g. `JavaScript` before `React`, `Python` before `Machine Learning`) are scheduled in Phase 1.
- Inferred Attributes: Inferred dependencies are marked as `"inferred": true`.

---

## 8. Deterministic 4-Phase Roadmap Generation & Weekly Hours Scaling

Constructs a 4-phase sequence:
- **Phase 1: Foundations & Prerequisites**: Root prerequisite missing skills.
- **Phase 2: Core Technical Mastery**: Primary framework & API capabilities.
- **Phase 3: Advanced Specialization**: Domain optimization & advanced concepts.
- **Phase 4: Capstone & Career Readiness**: Portfolio projects, system design, deployment, interview prep.

#### Duration Calculation:
$$\text{Duration (Months)} = \max\left(1, \operatorname{round}\left(\frac{\text{Total Estimated Hours}}{\text{Weekly Commitment Hours} \times 4}\right)\right)$$

---

## 9. Gemini LLM Content Enrichment (`gemini-3.6-flash`)

Google Gemini (`gemini-3.6-flash`) receives structured facts generated by the Python engine to enrich each phase with:
- 🎥 **Video Resources**: Course tutorial and video walkthrough links.
- 📄 **Official Documentation Resources**: Language/framework reference documentation links.
- 🚀 **Practical Project Resources**: Hands-on lab and project specifications.
- 📊 **Flowchart Graph**: Mermaid diagram nodes and edges visualizing the learning pathway.

Gemini enriches and explains structured facts without overriding deterministic prerequisite ordering.

---

## 10. How to Add Another Dataset Source

1. Create a new loader script in `ai-service/app/ingestion/your_loader.py`.
2. Parse raw data records into `clean_career_record()` dictionaries.
3. Import and call your loader inside `ai-service/app/ingestion/unified_loader.py`.
4. Re-run `python -u -m app.ingestion.build_dataset`.

---

## 11. Dataset Attribution & Licensing

- **O*NET Data**: Derived from the O*NET Database by the U.S. Department of Labor, Licensing under CC BY 4.0.
- **ESCO Data**: European Skills, Competencies, Qualifications and Occupations by the European Commission, licensed under CC BY 4.0.
