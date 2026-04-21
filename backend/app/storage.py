"""
Author: K-ON! Team
文件描述: MinIO 对象存储服务封装，提供上传和 presigned URL 生成
"""

import io
from datetime import timedelta

from minio import Minio
from minio.error import S3Error

from app.config import settings

_client: Minio | None = None


def get_minio_client() -> Minio:
    global _client
    if _client is None:
        _client = Minio(
            settings.minio_endpoint,
            access_key=settings.minio_access_key,
            secret_key=settings.minio_secret_key,
            secure=settings.minio_secure,
        )
        _ensure_bucket(_client)
    return _client


def _ensure_bucket(client: Minio) -> None:
    try:
        if not client.bucket_exists(settings.minio_bucket):
            client.make_bucket(settings.minio_bucket)
    except S3Error:
        pass


def upload_bytes(object_name: str, data: bytes, content_type: str = "application/pdf") -> str:
    """上传字节数据，返回 object_name"""
    client = get_minio_client()
    client.put_object(
        settings.minio_bucket,
        object_name,
        io.BytesIO(data),
        length=len(data),
        content_type=content_type,
    )
    return object_name


def get_presigned_url(object_name: str, expires_minutes: int = 15) -> str:
    """生成有时效的预签名下载 URL"""
    client = get_minio_client()
    url = client.presigned_get_object(
        settings.minio_bucket,
        object_name,
        expires=timedelta(minutes=expires_minutes),
    )
    # 如果内部端点与外部端点不同，替换 host 部分
    if settings.minio_public_endpoint and settings.minio_endpoint not in settings.minio_public_endpoint:
        internal = f"http://{settings.minio_endpoint}"
        url = url.replace(internal, settings.minio_public_endpoint.rstrip("/"))
    return url


def delete_object(object_name: str) -> None:
    try:
        client = get_minio_client()
        client.remove_object(settings.minio_bucket, object_name)
    except S3Error:
        pass
