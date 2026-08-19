Career PathFinder - AI Service (Prototype)

This FastAPI service implements the AI layer for Career PathFinder.

Run locally (development):

```bash
python -m venv .venv
# on Linux / macOS
source .venv/bin/activate
# on Windows (PowerShell)
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Health endpoint: `GET /health`

Notes:
- See `.env.example` for environment variables.
- This is Phase 1 scaffold. Next: career dataset and recommendation engine.
