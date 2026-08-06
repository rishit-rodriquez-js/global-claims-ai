import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "GlobalClaims AI Enterprise"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "production")

    # Database Settings
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./claims.db")

    # Security & JWT
    SECRET_KEY: str = os.getenv("JWT_SECRET") or os.getenv("SECRET_KEY", "global_claims_secret_2026_key_super_secure")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 120

    # Azure Storage Settings
    AZURE_STORAGE_CONNECTION_STRING: str = os.getenv("AZURE_STORAGE_CONNECTION_STRING", "")
    AZURE_STORAGE_CONTAINER: str = os.getenv("AZURE_STORAGE_CONTAINER", "claims-documents")
    AZURE_STORAGE_ACCOUNT: str = os.getenv("AZURE_STORAGE_ACCOUNT", "globalclaimsstorage")

    # Azure AI Services
    AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT: str = os.getenv("AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT", "")
    AZURE_DOCUMENT_INTELLIGENCE_KEY: str = os.getenv("AZURE_DOCUMENT_INTELLIGENCE_KEY", "")

    AZURE_OPENAI_ENDPOINT: str = os.getenv("AZURE_OPENAI_ENDPOINT", "")
    AZURE_OPENAI_KEY: str = os.getenv("AZURE_OPENAI_KEY") or os.getenv("AZURE_OPENAI_API_KEY", "")
    AZURE_OPENAI_DEPLOYMENT: str = os.getenv("AZURE_OPENAI_DEPLOYMENT", "gpt-4o")
    AZURE_OPENAI_API_VERSION: str = os.getenv("AZURE_OPENAI_API_VERSION", "2024-06-01")

    AZURE_SEARCH_ENDPOINT: str = os.getenv("AZURE_SEARCH_ENDPOINT") or os.getenv("AZURE_AI_SEARCH_ENDPOINT", "")
    AZURE_SEARCH_KEY: str = os.getenv("AZURE_SEARCH_KEY") or os.getenv("AZURE_AI_SEARCH_KEY", "")
    AZURE_SEARCH_INDEX: str = os.getenv("AZURE_SEARCH_INDEX") or os.getenv("AZURE_AI_SEARCH_INDEX", "insurance-policies-index")

    # File Constraints
    MAX_FILE_SIZE_BYTES: int = 10 * 1024 * 1024  # 10 MB
    ALLOWED_EXTENSIONS: set = {".pdf", ".png", ".jpg", ".jpeg"}

    # CORS Configuration
    CORS_ORIGINS: list = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        os.getenv("FRONTEND_URL", "*")
    ]

settings = Settings()
