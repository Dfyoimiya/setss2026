import uuid

from sqlalchemy import JSON, Column, DateTime, ForeignKey, String, Text, func

from app.core.database import Base


class Submission(Base):
    __tablename__ = "submissions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    period_id = Column(
        String, ForeignKey("submission_periods.id"), nullable=False, index=True
    )
    title = Column(String(500), nullable=False)
    abstract = Column(Text, nullable=False)
    keywords = Column(String(1024), nullable=False)
    authors = Column(JSON, nullable=False)
    corresponding_author = Column(JSON, nullable=False)
    status = Column(String(50), default="draft", nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
