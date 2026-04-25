from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.rebuttal import RebuttalResponse
from app.schemas.submission import SubmissionReviewerView


class ReviewCreate(BaseModel):
    overall_score: int = Field(..., ge=1, le=10)
    detailed_comments: str = Field(..., min_length=1)
    recommendation: str = Field(..., pattern=r"^(accept|reject|major_revision|minor_revision)$")


class ReviewUpdate(BaseModel):
    overall_score: int | None = Field(default=None, ge=1, le=10)
    detailed_comments: str | None = Field(default=None, min_length=1)
    recommendation: str | None = Field(
        default=None, pattern=r"^(accept|reject|major_revision|minor_revision)$"
    )


class ReviewResponse(BaseModel):
    id: str
    assignment_id: str
    overall_score: int
    detailed_comments: str
    recommendation: str
    is_visible_to_author: bool
    created_at: datetime | None
    updated_at: datetime | None

    model_config = ConfigDict(from_attributes=True)


class ReviewForAuthorResponse(BaseModel):
    """Review view for authors (reviewer identity hidden)."""

    id: str
    overall_score: int
    detailed_comments: str
    recommendation: str
    created_at: datetime | None
    reviewer_number: int = 1
    rebuttal: RebuttalResponse | None = None


class ReviewAssignmentResponse(BaseModel):
    id: str
    submission_id: str
    reviewer_id: str
    status: str
    assigned_by: str | None
    assigned_at: datetime | None
    deadline: datetime
    completed_at: datetime | None
    created_at: datetime | None
    updated_at: datetime | None
    submission: SubmissionReviewerView | None = None
    review: ReviewResponse | None = None

    model_config = ConfigDict(from_attributes=True)


class ReviewAssignmentListResponse(BaseModel):
    id: str
    submission_id: str
    status: str
    deadline: datetime
    completed_at: datetime | None
    created_at: datetime | None

    model_config = ConfigDict(from_attributes=True)


class AssignmentDecision(BaseModel):
    accept: bool = True


class AdminDecision(BaseModel):
    decision: str = Field(..., pattern=r"^(accepted|rejected|minor_revision|major_revision)$")


class ReviewVisibilityUpdate(BaseModel):
    is_visible_to_author: bool
