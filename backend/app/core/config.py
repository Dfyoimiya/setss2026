from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    DATABASE_URL: str = "postgresql://setss_user:setss_dev_password@postgres/setss_db"
    SECRET_KEY: str = "dev-secret-key"
    DEBUG: bool = False

    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 120

    MINIO_ENDPOINT: str = "minio:9000"
    MINIO_ACCESS_KEY: str = "minioadmin"
    MINIO_SECRET_KEY: str = "minioadmin"
    MINIO_BUCKET: str = "setss-papers"
    MINIO_SECURE: bool = False

    # Email (disabled by default in dev)
    EMAIL_ENABLED: bool = False
    SMTP_HOST: str = "smtp.example.com"
    SMTP_PORT: int = 465
    SMTP_USER: str = "noreply@example.com"
    SMTP_PASSWORD: str = ""
    SMTP_FROM_NAME: str = "SETSS 2026"
    SMTP_SSL: bool = True
    FRONTEND_BASE_URL: str = "http://localhost:5173"


settings = Settings()
