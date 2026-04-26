import uuid

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, func

from app.core.database import Base


class SubmissionFile(Base):
    __tablename__ = "submission_files"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    submission_id = Column(String, ForeignKey("submissions.id"), nullable=False, index=True)
    file_name = Column(String(255), nullable=False)
    minio_key = Column(String(1024), nullable=False)
    file_size = Column(Integer, nullable=False)
    version = Column(Integer, nullable=False, default=1)
    is_current = Column(Boolean, default=True, nullable=False)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
