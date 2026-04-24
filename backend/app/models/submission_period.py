import uuid

from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text, func

from app.core.database import Base


class SubmissionPeriod(Base):
    __tablename__ = "submission_periods"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    start_date = Column(DateTime(timezone=True), nullable=False)
    end_date = Column(DateTime(timezone=True), nullable=False)
    review_deadline = Column(DateTime(timezone=True), nullable=False)
    rebuttal_deadline = Column(DateTime(timezone=True), nullable=False)
    final_decision_deadline = Column(DateTime(timezone=True), nullable=False)
    reviewers_per_paper = Column(Integer, default=3, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
