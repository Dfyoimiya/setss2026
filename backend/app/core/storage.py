"""MinIO object storage client wrapper for PDF uploads/downloads."""

import contextlib
import io
from typing import BinaryIO

from minio import Minio
from minio.error import S3Error

from app.core.config import settings


class StorageService:
    """Wrapper around MinIO client for submission file operations."""

    def __init__(self) -> None:
        self.client = Minio(
            settings.MINIO_ENDPOINT,
            access_key=settings.MINIO_ACCESS_KEY,
            secret_key=settings.MINIO_SECRET_KEY,
            secure=settings.MINIO_SECURE,
        )
        self.bucket = settings.MINIO_BUCKET

    def upload_file(
        self,
        object_name: str,
        data: BinaryIO,
        length: int,
        content_type: str = "application/pdf",
    ) -> str:
        """Upload a file to MinIO and return the object name."""
        try:
            self.client.put_object(
                self.bucket,
                object_name,
                data,
                length,
                content_type=content_type,
            )
        except S3Error as exc:
            raise RuntimeError(f"Failed to upload file to MinIO: {exc}") from exc
        return object_name

    def download_file(self, object_name: str) -> BinaryIO:
        """Download a file from MinIO and return a BytesIO buffer."""
        try:
            response = self.client.get_object(self.bucket, object_name)
            return io.BytesIO(response.read())
        except S3Error as exc:
            raise RuntimeError(f"Failed to download file from MinIO: {exc}") from exc

    def delete_file(self, object_name: str) -> None:
        """Delete a file from MinIO."""
        with contextlib.suppress(S3Error):
            self.client.remove_object(self.bucket, object_name)


# Global singleton instance
_storage_service: StorageService | None = None


def get_storage_service() -> StorageService:
    """Return the singleton StorageService instance."""
    global _storage_service
    if _storage_service is None:
        _storage_service = StorageService()
    return _storage_service
