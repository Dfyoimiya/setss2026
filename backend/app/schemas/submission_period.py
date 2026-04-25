from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class AuthorInfo(BaseModel):
    name: str
    institution: str
    email: str


class CorrespondingAuthor(BaseModel):
    name: str
    institution: str
    email: str


class SubmissionPeriodBase(BaseModel):
    name: str = Field(..., max_length=255)
    description: str | None = None
    start_date: datetime
    end_date: datetime
    review_deadline: datetime
    rebuttal_deadline: datetime
    final_decision_deadline: datetime
    reviewers_per_paper: int = Field(default=3, ge=1, le=10)


class SubmissionPeriodCreate(SubmissionPeriodBase):
    pass


class SubmissionPeriodUpdate(BaseModel):
    name: str | None = Field(default=None, max_length=255)
    description: str | None = None
    start_date: datetime | None = None
    end_date: datetime | None = None
    review_deadline: datetime | None = None
    rebuttal_deadline: datetime | None = None
    final_decision_deadline: datetime | None = None
    reviewers_per_paper: int | None = Field(default=None, ge=1, le=10)
    is_active: bool | None = None


class SubmissionPeriodResponse(SubmissionPeriodBase):
    id: str
    is_active: bool
    created_at: datetime | None
    updated_at: datetime | None

    model_config = ConfigDict(from_attributes=True)


class SubmissionPeriodListResponse(BaseModel):
    id: str
    name: str
    start_date: datetime
    end_date: datetime
    is_active: bool

    model_config = ConfigDict(from_attributes=True)
