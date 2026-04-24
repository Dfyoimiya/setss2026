from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class RebuttalCreate(BaseModel):
    content: str = Field(..., min_length=1)


class RebuttalResponse(BaseModel):
    id: str
    review_id: str
    content: str
    is_visible_to_reviewer: bool
    created_at: datetime | None

    model_config = ConfigDict(from_attributes=True)
