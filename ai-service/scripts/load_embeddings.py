import traceback
import sys
from pathlib import Path
# Ensure package root is importable when running this script directly
ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from app.config.settings import settings
from app.services.embedding_service import get_embedding_service
from app.services.recommendation_engine import load_careers
from app.services.embedding_cache import build_career_embeddings


def main():
    try:
        print("Settings: AI_MOCK_MODE=", settings.AI_MOCK_MODE)
        embed = get_embedding_service()
        if not embed.available():
            print("Embedding model not loaded; attempting to load...")
            embed.load()
        if not embed.available():
            print("Embedding model unavailable after load; running in mock mode.")
        careers = load_careers()
        mapping = build_career_embeddings(embed, careers)
        print(f"Built career embeddings: {len(mapping)} items")
        if len(mapping) > 0:
            sample_keys = list(mapping.keys())[:5]
            print("Sample career ids:", sample_keys)
    except Exception:
        traceback.print_exc()


if __name__ == '__main__':
    main()
