import uuid

from sqlalchemy import Column, DateTime, ForeignKey, String, func

from app.core.database import Base


class ReviewAssignment(Base):
    __tablename__ = "review_assignments"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    submission_id = Column(
        String, ForeignKey("submissions.id"), nullable=False, index=True
    )
    reviewer_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    status = Column(String(50), default="pending", nullable=False, index=True)
    assigned_by = Column(String, ForeignKey("users.id"), nullable=True)
    assigned_at = Column(DateTime(timezone=True), server_default=func.now())
    deadline = Column(DateTime(timezone=True), nullable=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
