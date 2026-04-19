"""
Author: K-ON! Team
文件描述: 应用配置，通过环境变量或 .env 文件读取
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = "postgresql://setss_user:setss_password@postgres:5432/setss_db"
    secret_key: str = "changeme-in-production-use-openssl-rand-hex-32"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 120

    upload_dir: str = "/app/uploads"
    max_upload_size_mb: int = 20

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
