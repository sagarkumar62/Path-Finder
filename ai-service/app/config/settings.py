import os
from typing import Optional
from dotenv import load_dotenv

# Load .env if present
load_dotenv()


class Settings:
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-1.0")
    NODE_BACKEND_URL: str = os.getenv("NODE_BACKEND_URL", "http://localhost:5000")
    AI_SERVICE_PORT: int = int(os.getenv("AI_SERVICE_PORT", "8000"))
    AI_MOCK_MODE: bool = os.getenv("AI_MOCK_MODE", "true").lower() in ("1", "true", "yes")
    EMBEDDING_MODEL: str = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")
    AI_SERVICE_TIMEOUT: int = int(os.getenv("AI_SERVICE_TIMEOUT", "30000"))

    # Scalable Data & Vector Index Paths
    ESCO_DATA_PATH: Optional[str] = os.getenv("ESCO_DATA_PATH")
    ONET_DATA_PATH: Optional[str] = os.getenv("ONET_DATA_PATH")
    CAREER_DATA_PATH: Optional[str] = os.getenv("CAREER_DATA_PATH")
    VECTOR_INDEX_PATH: Optional[str] = os.getenv("VECTOR_INDEX_PATH")
    VECTOR_METADATA_PATH: Optional[str] = os.getenv("VECTOR_METADATA_PATH")


settings = Settings()

