import uuid

from sqlalchemy import JSON, Column, DateTime, ForeignKey, String, Text, func

from app.core.database import Base


class Submission(Base):
    """Model representing a submission for a journal.

    Attributes:
        id: Unique identifier for the submission.
        user_id: ID of the user who made the submission.
        period_id: ID of the submission period this submission belongs to.
        title: Title of the submission.
        abstract: Abstract of the submission.
        keywords: Comma-separated keywords for the submission.
        authors: List of authors with their details (name, affiliation, email).
        corresponding_author: Details of the corresponding author (name, affiliation, email).
        status: Current status of the submission (e.g., draft, submitted, under_review, accepted, rejected).
        created_at: Timestamp when the submission was created.
        updated_at: Timestamp when the submission was last updated.
    """

    __tablename__ = "submissions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    period_id = Column(String, ForeignKey("submission_periods.id"), nullable=False, index=True)
    title = Column(String(500), nullable=False)
    abstract = Column(Text, nullable=False)
    keywords = Column(String(1024), nullable=False)
    authors = Column(JSON, nullable=False)
    corresponding_author = Column(JSON, nullable=False)
    status = Column(String(50), default="draft", nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
