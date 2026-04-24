from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth import require_organizer
from app.core.database import get_db
from app.core.exceptions import (
    NotFoundException,
    ReviewerAlreadyAssignedException,
    ReviewNotFoundException,
    SubmissionNotFoundException,
)
from app.core.response import ApiResponse, created, ok
from app.crud import review as crud_review
from app.crud import review_assignment as crud_assignment
from app.crud import submission as crud_submission
from app.crud import submission_period as crud_period
from app.models.user import User
from app.schemas.review import ReviewVisibilityUpdate

router = APIRouter(prefix="/api/v1/admin/reviews", tags=["Admin - Reviews"])


@router.get("/reviewers", response_model=ApiResponse)
def list_candidate_reviewers(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_organizer),
):
    reviewers = (
        db.query(User)
        .filter(User.role.like("%reviewer%"), User.is_active == True)  # noqa: E712
        .all()
    )
    data = [
        {"id": r.id, "email": r.email, "full_name": r.full_name, "institution": r.institution}
        for r in reviewers
    ]
    return ok(data=data)


@router.get("/assignments", response_model=ApiResponse)
def list_all_assignments(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_organizer),
    skip: int = 0,
    limit: int = 100,
):
    assignments = crud_assignment.get_multi(db, skip=skip, limit=limit)
    data = [
        {
            "id": a.id,
            "submission_id": a.submission_id,
            "reviewer_id": a.reviewer_id,
            "status": a.status,
            "assigned_by": a.assigned_by,
            "assigned_at": a.assigned_at,
            "deadline": a.deadline,
            "completed_at": a.completed_at,
            "created_at": a.created_at,
        }
        for a in assignments
    ]
    return ok(data=data)


@router.post("/assignments", response_model=ApiResponse)
def manual_assign(
    submission_id: str,
    reviewer_id: str,
    deadline: datetime,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_organizer),
):
    submission = crud_submission.get(db, submission_id)
    if not submission:
        raise SubmissionNotFoundException()

    existing = crud_assignment.get_by_submission_and_reviewer(db, submission_id, reviewer_id)
    if existing:
        raise ReviewerAlreadyAssignedException()

    assignment = crud_assignment.create(
        db,
        submission_id=submission_id,
        reviewer_id=reviewer_id,
        deadline=deadline,
        assigned_by=current_user.id,
    )
    return created(
        data={
            "id": assignment.id,
            "submission_id": assignment.submission_id,
            "reviewer_id": assignment.reviewer_id,
            "status": assignment.status,
        }
    )


@router.post("/assignments/auto", response_model=ApiResponse, status_code=201)
def auto_assign(
    submission_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_organizer),
):
    submission = crud_submission.get(db, submission_id)
    if not submission:
        raise SubmissionNotFoundException()

    period = crud_period.get(db, submission.period_id)
    if not period:
        raise NotFoundException("Submission period not found")

    assignments = crud_assignment.auto_assign(
        db,
        submission_id=submission_id,
        exclude_user_id=submission.user_id,
        deadline=period.review_deadline,
        num_reviewers=period.reviewers_per_paper,
        assigned_by=current_user.id,
    )

    # Auto-transition submission to under_review if currently submitted
    if submission.status == "submitted" and assignments:
        crud_submission.transition_status(db, submission, "under_review")

    return created(
        data=[
            {
                "id": a.id,
                "submission_id": a.submission_id,
                "reviewer_id": a.reviewer_id,
                "status": a.status,
            }
            for a in assignments
        ]
    )


@router.post("/reviews/{review_id}/visibility", response_model=ApiResponse)
def set_review_visibility(
    review_id: str,
    obj_in: ReviewVisibilityUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_organizer),
):
    review = crud_review.get(db, review_id)
    if not review:
        raise ReviewNotFoundException()

    updated = crud_review.set_visibility(db, review, obj_in.is_visible_to_author)
    return ok(data={"id": updated.id, "is_visible_to_author": updated.is_visible_to_author})
