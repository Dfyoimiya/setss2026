from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.submission_period import AuthorInfo, CorrespondingAuthor


class SubmissionBase(BaseModel):
    title: str = Field(..., max_length=500)
    abstract: str
    keywords: str = Field(..., max_length=1024)
    authors: list[AuthorInfo]
    corresponding_author: CorrespondingAuthor


class SubmissionCreate(SubmissionBase):
    period_id: str


class SubmissionUpdate(BaseModel):
    title: str | None = Field(default=None, max_length=500)
    abstract: str | None = None
    keywords: str | None = Field(default=None, max_length=1024)
    authors: list[AuthorInfo] | None = None
    corresponding_author: CorrespondingAuthor | None = None


class SubmissionFileResponse(BaseModel):
    id: str
    file_name: str
    file_size: int
    version: int
    is_current: bool
    uploaded_at: datetime | None

    model_config = ConfigDict(from_attributes=True)


class SubmissionResponse(SubmissionBase):
    id: str
    user_id: str
    period_id: str
    status: str
    created_at: datetime | None
    updated_at: datetime | None
    files: list[SubmissionFileResponse] = []

    model_config = ConfigDict(from_attributes=True)


class SubmissionListResponse(BaseModel):
    id: str
    title: str
    status: str
    created_at: datetime | None
    updated_at: datetime | None

    model_config = ConfigDict(from_attributes=True)


class SubmissionReviewerView(BaseModel):
    """Anonymous submission view for reviewers (double-blind)."""

    id: str
    title: str
    abstract: str
    keywords: str
    authors: list[AuthorInfo]
    corresponding_author: CorrespondingAuthor
    status: str
    created_at: datetime | None
    files: list[SubmissionFileResponse] = []

    @classmethod
    def from_submission(cls, submission: SubmissionResponse) -> "SubmissionReviewerView":
        """Mask author identities for double-blind review."""
        masked_authors = [
            AuthorInfo(name=a.name, institution=a.institution, email="")
            for a in submission.authors
        ]
        masked_corresponding = CorrespondingAuthor(
            name=submission.corresponding_author.name,
            institution=submission.corresponding_author.institution,
            email="",
        )
        return cls(
            id=submission.id,
            title=submission.title,
            abstract=submission.abstract,
            keywords=submission.keywords,
            authors=masked_authors,
            corresponding_author=masked_corresponding,
            status=submission.status,
            created_at=submission.created_at,
            files=submission.files,
        )

    model_config = ConfigDict(from_attributes=True)
