import uuid

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, String, Text, func

from app.core.database import Base


class Rebuttal(Base):
    __tablename__ = "rebuttals"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    review_id = Column(
        String, ForeignKey("reviews.id"), nullable=False, unique=True, index=True
    )
    content = Column(Text, nullable=False)
    is_visible_to_reviewer = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
