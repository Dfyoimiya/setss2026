from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth import require_organizer
from app.core.database import get_db
from app.core.exceptions import (
    FileNotFoundError,
    SubmissionNotFoundError,
)
from app.core.response import ApiResponse, ok
from app.core.storage import get_storage_service
from app.crud import rebuttal as crud_rebuttal
from app.crud import review as crud_review
from app.crud import submission as crud_submission
from app.crud import submission_file as crud_file
from app.models.user import User
from app.schemas.review import AdminDecision

router = APIRouter(prefix="/api/v1/admin/submissions", tags=["Admin - Submissions"])


def _build_full_submission(db: Session, submission) -> dict:
    files = crud_file.get_by_submission(db, str(submission.id))
    file_data = [
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

    reviews = crud_review.get_by_submission(db, str(submission.id))
    review_data = []
    for rv in reviews:
        reb = crud_rebuttal.get_by_review(db, rv.id)
        review_data.append(
            {
                "id": rv.id,
                "overall_score": rv.overall_score,
                "detailed_comments": rv.detailed_comments,
                "recommendation": rv.recommendation,
                "is_visible_to_author": rv.is_visible_to_author,
                "created_at": rv.created_at,
                "rebuttal": {
                    "id": reb.id,
                    "content": reb.content,
                    "is_visible_to_reviewer": reb.is_visible_to_reviewer,
                    "created_at": reb.created_at,
                }
                if reb
                else None,
            }
        )

    return {
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
        "files": file_data,
        "reviews": review_data,
    }


@router.get("", response_model=ApiResponse)
def list_all_submissions(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_organizer),
    skip: int = 0,
    limit: int = 100,
):
    submissions = crud_submission.get_multi(db, skip=skip, limit=limit)
    data = [
        {
            "id": s.id,
            "user_id": s.user_id,
            "period_id": s.period_id,
            "title": s.title,
            "status": s.status,
            "created_at": s.created_at,
            "updated_at": s.updated_at,
        }
        for s in submissions
    ]
    return ok(data=data)


@router.get("/{submission_id}", response_model=ApiResponse)
def get_submission_detail(
    submission_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_organizer),
):
    submission = crud_submission.get(db, submission_id)
    if not submission:
        raise SubmissionNotFoundError()
    return ok(data=_build_full_submission(db, submission))


@router.get("/{submission_id}/files/{file_id}/download")
def admin_download_file(
    submission_id: str,
    file_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_organizer),
):
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


@router.post("/{submission_id}/decision", response_model=ApiResponse)
def make_decision(
    submission_id: str,
    decision_in: AdminDecision,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_organizer),
):
    submission = crud_submission.get(db, submission_id)
    if not submission:
        raise SubmissionNotFoundError()

    # Transition to the decision state
    valid_decisions = ["accepted", "rejected", "minor_revision", "major_revision"]
    if decision_in.decision not in valid_decisions:
        raise HTTPException(status_code=400, detail=f"Invalid decision. Must be one of: {valid_decisions}")

    updated = crud_submission.transition_status(db, submission, decision_in.decision)
    return ok(data={"id": updated.id, "status": updated.status})
