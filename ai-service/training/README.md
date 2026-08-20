# Synthetic Training Data Directory

This directory contains scripts and JSONL datasets for training, benchmarking, and evaluating career matching, skill-gap prediction, and roadmap sequencing models.

---

## Files

- `generate_training_data.py`: Programmatically synthesizes training examples from the unified career knowledge base.
- `datasets/career_matching.jsonl`: Training examples for User Profile $\rightarrow$ Career Target classification.
- `datasets/skill_gap.jsonl`: Training examples for Profile $\rightarrow$ Missing Skills prediction.
- `datasets/roadmap_sequences.jsonl`: Training examples for Missing Skills $\rightarrow$ Topological Learning Sequence prediction.

> [!NOTE]
> All records generated in this directory are explicitly tagged with `"data_type": "synthetic_training_data"` to distinguish them from real user interaction logs.
