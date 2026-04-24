import uuid

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text, func

from app.core.database import Base


class Review(Base):
    __tablename__ = "reviews"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    assignment_id = Column(
        String,
        ForeignKey("review_assignments.id"),
        nullable=False,
        unique=True,
        index=True,
    )
    overall_score = Column(Integer, nullable=False)
    detailed_comments = Column(Text, nullable=False)
    recommendation = Column(String(50), nullable=False)
    is_visible_to_author = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
