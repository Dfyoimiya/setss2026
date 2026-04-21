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

    # 保留本地上传目录作为临时缓冲
    upload_dir: str = "/app/uploads"
    max_upload_size_mb: int = 20

    # MinIO / S3 对象存储
    minio_endpoint: str = "minio:9000"
    minio_access_key: str = "minioadmin"
    minio_secret_key: str = "minioadmin"
    minio_bucket: str = "setss-papers"
    minio_secure: bool = False
    minio_public_endpoint: str = "http://localhost:9000"  # 前端可访问的地址

    # 邮件 SMTP
    smtp_host: str = "smtp.example.com"
    smtp_port: int = 465
    smtp_user: str = "noreply@example.com"
    smtp_password: str = ""
    smtp_from_name: str = "SETSS 2026"
    smtp_ssl: bool = True
    email_enabled: bool = False  # 设为 True 才真正发送邮件

    # 前端基础 URL（用于邮件中的链接）
    frontend_base_url: str = "http://localhost:5173"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
