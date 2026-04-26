from datetime import UTC, datetime

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.auth import get_current_active_user
from app.core.database import get_db
from app.core.exceptions import (
    FileNotFoundError,
    NotFoundError,
    PeriodClosedError,
    RebuttalClosedError,
    ReviewNotFoundError,
    SubmissionNotFoundError,
    UnauthorizedError,
)
from app.core.response import ApiResponse, created, ok
from app.core.storage import get_storage_service
from app.crud import rebuttal as crud_rebuttal
from app.crud import review as crud_review
from app.crud import submission as crud_submission
from app.crud import submission_file as crud_file
from app.crud import submission_period as crud_period
from app.models.submission import Submission
from app.models.user import User
from app.schemas.rebuttal import RebuttalCreate
from app.schemas.submission import (
    SubmissionCreate,
    SubmissionResponse,
    SubmissionUpdate,
)

router = APIRouter(prefix="/api/v1/submissions", tags=["Submissions"])


def _check_period_open_for_submission(period) -> None:
    now = datetime.now(UTC)
    # Handle both offset-aware and offset-naive datetimes (SQLite stores naive)
    start = period.start_date
    end = period.end_date
    if start.tzinfo is None:
        now = now.replace(tzinfo=None)
    if now < start or now > end:
        raise PeriodClosedError("Submission period is not open")


def _check_period_open_for_rebuttal(period) -> None:
    now = datetime.now(UTC)
    deadline = period.rebuttal_deadline
    if deadline.tzinfo is None:
        now = now.replace(tzinfo=None)
    if now > deadline:
        raise RebuttalClosedError("Rebuttal period has closed")


def _check_owner(submission: Submission, current_user: User) -> None:
    if submission.user_id != current_user.id:
        raise UnauthorizedError("You can only access your own submissions")


def _build_submission_response(db: Session, submission: Submission) -> SubmissionResponse:
    files = crud_file.get_by_submission(db, str(submission.id))
    file_responses = [
        {
            "id": f.id,
            "file_name": f.file_name,
            "file_size": f.file_size,
            "version": f.version,
            "is_current": f.is_current,
            "uploaded_at": f.uploaded_at,
        }
        for f in files
    ]
    data = {
        "id": submission.id,
        "user_id": submission.user_id,
        "period_id": submission.period_id,
        "title": submission.title,
        "abstract": submission.abstract,
        "keywords": submission.keywords,
        "authors": submission.authors,
        "corresponding_author": submission.corresponding_author,
        "status": submission.status,
        "created_at": submission.created_at,
        "updated_at": submission.updated_at,
        "files": file_responses,
    }
    return SubmissionResponse.model_validate(data)


@router.post("", response_model=ApiResponse, status_code=201)
def create_submission(
    obj_in: SubmissionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    period = crud_period.get(db, obj_in.period_id)
    if not period:
        raise NotFoundError("Submission period not found")
    _check_period_open_for_submission(period)

    submission = crud_submission.create(db, obj_in, current_user.id)
    return created(data={"id": submission.id, "status": submission.status})


@router.get("", response_model=ApiResponse)
def list_my_submissions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    skip: int = 0,
    limit: int = 100,
):
    submissions = crud_submission.get_by_user(db, current_user.id, skip=skip, limit=limit)
    data = [
        {
            "id": s.id,
            "title": s.title,
            "status": s.status,
            "created_at": s.created_at,
            "updated_at": s.updated_at,
        }
        for s in submissions
    ]
    return ok(data=data)


@router.get("/{submission_id}", response_model=ApiResponse)
def get_submission(
    submission_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    submission = crud_submission.get(db, submission_id)
    if not submission:
        raise SubmissionNotFoundError()
    _check_owner(submission, current_user)

    response = _build_submission_response(db, submission)

    # Include visible reviews for the author
    visible_reviews = crud_review.get_visible_by_submission(db, submission.id)
    review_data = []
    for idx, rv in enumerate(visible_reviews, start=1):
        reb = crud_rebuttal.get_by_review(db, rv.id)
        reb_data = None
        if reb:
            reb_data = {
                "id": reb.id,
                "review_id": reb.review_id,
                "content": reb.content,
                "is_visible_to_reviewer": reb.is_visible_to_reviewer,
                "created_at": reb.created_at,
            }
        review_data.append(
            {
                "id": rv.id,
                "overall_score": rv.overall_score,
                "detailed_comments": rv.detailed_comments,
                "recommendation": rv.recommendation,
                "created_at": rv.created_at,
                "reviewer_number": idx,
                "rebuttal": reb_data,
            }
        )

    result = response.model_dump()
    result["reviews"] = review_data
    return ok(data=result)


@router.put("/{submission_id}", response_model=ApiResponse)
def update_submission(
    submission_id: str,
    obj_in: SubmissionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    submission = crud_submission.get(db, submission_id)
    if not submission:
        raise SubmissionNotFoundError()
    _check_owner(submission, current_user)

    # Only drafts or revision states can be edited
    if submission.status not in ("draft", "minor_revision", "major_revision"):
        raise PeriodClosedError("Submissions can only be edited when in draft or revision state")

    # Check period is still open for edits (if not draft)
    if submission.status != "draft":
        period = crud_period.get(db, submission.period_id)
        if period:
            _check_period_open_for_submission(period)

    updated = crud_submission.update(db, submission, obj_in)
    response = _build_submission_response(db, updated)
    return ok(data=response)


@router.delete("/{submission_id}", response_model=ApiResponse)
def withdraw_submission(
    submission_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    submission = crud_submission.get(db, submission_id)
    if not submission:
        raise SubmissionNotFoundError()
    _check_owner(submission, current_user)

    if submission.status == "withdrawn":
        return ok(data={"message": "Already withdrawn"})

    crud_submission.withdraw(db, submission)
    return ok(data={"status": "withdrawn"})


@router.post("/{submission_id}/files", response_model=ApiResponse, status_code=201)
def upload_file(
    submission_id: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    submission = crud_submission.get(db, submission_id)
    if not submission:
        raise SubmissionNotFoundError()
    _check_owner(submission, current_user)

    if submission.status not in ("draft", "minor_revision", "major_revision"):
        raise PeriodClosedError("Cannot upload files for this submission status")

    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    storage = get_storage_service()
    version = crud_file.get_next_version(db, submission_id)
    object_name = f"submissions/{submission_id}/v{version}/{file.filename}"

    file_data = file.file.read()
    storage.upload_file(
        object_name=object_name,
        data=file.file,
        length=len(file_data),
        content_type="application/pdf",
    )

    db_file = crud_file.create(
        db,
        submission_id=submission_id,
        file_name=file.filename or "paper.pdf",
        minio_key=object_name,
        file_size=len(file_data),
        version=version,
    )
    return created(
        data={
            "id": db_file.id,
            "file_name": db_file.file_name,
            "version": db_file.version,
        }
    )


@router.get("/{submission_id}/files/{file_id}/download")
def download_file(
    submission_id: str,
    file_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    submission = crud_submission.get(db, submission_id)
    if not submission:
        raise SubmissionNotFoundError()
    _check_owner(submission, current_user)

    db_file = crud_file.get(db, file_id)
    if not db_file or db_file.submission_id != submission_id:
        raise FileNotFoundError()

    storage = get_storage_service()
    data = storage.download_file(db_file.minio_key)
    from fastapi.responses import StreamingResponse

    return StreamingResponse(
        data,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{db_file.file_name}"'},
    )


@router.post("/{submission_id}/submit", response_model=ApiResponse)
def submit_submission(
    submission_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    submission = crud_submission.get(db, submission_id)
    if not submission:
        raise SubmissionNotFoundError()
    _check_owner(submission, current_user)

    period = crud_period.get(db, submission.period_id)
    if period:
        _check_period_open_for_submission(period)

    # Must have at least one file
    files = crud_file.get_by_submission(db, submission_id)
    if not files:
        raise HTTPException(status_code=400, detail="Please upload a PDF before submitting")

    updated = crud_submission.submit(db, submission)
    return ok(data={"id": updated.id, "status": updated.status})


@router.post("/{submission_id}/revision", response_model=ApiResponse)
def submit_revision(
    submission_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    submission = crud_submission.get(db, submission_id)
    if not submission:
        raise SubmissionNotFoundError()
    _check_owner(submission, current_user)

    if submission.status not in ("minor_revision", "major_revision"):
        raise HTTPException(
            status_code=400, detail="Only submissions requesting revision can submit a revision"
        )

    period = crud_period.get(db, submission.period_id)
    if period:
        _check_period_open_for_submission(period)

    updated = crud_submission.submit_revision(db, submission)
    return ok(data={"id": updated.id, "status": updated.status})


@router.post("/reviews/{review_id}/rebuttal", response_model=ApiResponse, status_code=201)
def create_rebuttal(
    review_id: str,
    obj_in: RebuttalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    review = crud_review.get(db, review_id)
    if not review:
        raise ReviewNotFoundError()

    # Verify the review belongs to the current user's submission
    from app.models.review_assignment import ReviewAssignment

    assignment = (
        db.query(ReviewAssignment).filter(ReviewAssignment.id == review.assignment_id).first()
    )
    if not assignment:
        raise NotFoundError("Assignment not found")

    submission = crud_submission.get(db, assignment.submission_id)
    if not submission or submission.user_id != current_user.id:
        raise UnauthorizedError("You can only rebuttal reviews for your own submissions")

    # Check rebuttal deadline
    period = crud_period.get(db, submission.period_id)
    if period:
        _check_period_open_for_rebuttal(period)

    # Check if rebuttal already exists
    existing = crud_rebuttal.get_by_review(db, review_id)
    if existing:
        updated = crud_rebuttal.update(db, existing, obj_in.content)
    else:
        updated = crud_rebuttal.create(db, review_id, obj_in.content)

    return created(
        data={
            "id": updated.id,
            "review_id": updated.review_id,
            "content": updated.content,
            "created_at": updated.created_at,
        }
    )
