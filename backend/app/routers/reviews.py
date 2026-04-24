from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth import require_reviewer
from app.core.database import get_db
from app.core.exceptions import (
    AssignmentNotFoundException,
    FileNotFoundException,
    NotFoundException,
    ReviewDeadlineExceededException,
    ReviewNotFoundException,
    UnauthorizedException,
)
from app.core.response import ApiResponse, created, ok
from app.core.storage import get_storage_service
from app.crud import review as crud_review
from app.crud import review_assignment as crud_assignment
from app.crud import submission as crud_submission
from app.crud import submission_file as crud_file
from app.models.review_assignment import ReviewAssignment
from app.models.user import User
from app.schemas.review import (
    ReviewCreate,
    ReviewUpdate,
)

router = APIRouter(prefix="/api/v1/review", tags=["Reviews"])


def _check_assignment_owner(assignment: ReviewAssignment, current_user: User) -> None:
    if assignment.reviewer_id != current_user.id:
        raise UnauthorizedException("This assignment does not belong to you")


def _check_review_deadline(assignment: ReviewAssignment) -> None:
    now = datetime.now(UTC)
    deadline = assignment.deadline
    if deadline.tzinfo is None:
        now = now.replace(tzinfo=None)
    if now > deadline:
        raise ReviewDeadlineExceededException()


@router.get("/assignments", response_model=ApiResponse)
def list_my_assignments(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_reviewer),
    skip: int = 0,
    limit: int = 100,
):
    assignments = crud_assignment.get_by_reviewer(db, current_user.id, skip=skip, limit=limit)
    data = [
        {
            "id": a.id,
            "submission_id": a.submission_id,
            "status": a.status,
            "deadline": a.deadline,
            "completed_at": a.completed_at,
            "created_at": a.created_at,
        }
        for a in assignments
    ]
    return ok(data=data)


@router.get("/assignments/{assignment_id}", response_model=ApiResponse)
def get_assignment(
    assignment_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_reviewer),
):
    assignment = crud_assignment.get(db, assignment_id)
    if not assignment:
        raise AssignmentNotFoundException()
    _check_assignment_owner(assignment, current_user)

    submission = crud_submission.get(db, assignment.submission_id)
    if not submission:
        raise NotFoundException("Submission not found")

    files = crud_file.get_by_submission(db, str(submission.id))
    current_file = next((f for f in files if f.is_current), None)
    file_responses = []
    if current_file:
        file_responses.append(
            {
                "id": current_file.id,
                "file_name": current_file.file_name,
                "file_size": current_file.file_size,
                "version": current_file.version,
                "is_current": current_file.is_current,
                "uploaded_at": current_file.uploaded_at,
            }
        )

    # Build anonymous submission view
    sub_response = {
        "id": submission.id,
        "title": submission.title,
        "abstract": submission.abstract,
        "keywords": submission.keywords,
        "authors": [
            {"name": a["name"], "institution": a["institution"], "email": ""}
            for a in submission.authors
        ],
        "corresponding_author": {
            "name": submission.corresponding_author["name"],
            "institution": submission.corresponding_author["institution"],
            "email": "",
        },
        "status": submission.status,
        "created_at": submission.created_at,
        "files": file_responses,
    }

    review = crud_review.get_by_assignment(db, assignment.id)
    review_data = None
    if review:
        review_data = {
            "id": review.id,
            "assignment_id": review.assignment_id,
            "overall_score": review.overall_score,
            "detailed_comments": review.detailed_comments,
            "recommendation": review.recommendation,
            "is_visible_to_author": review.is_visible_to_author,
            "created_at": review.created_at,
            "updated_at": review.updated_at,
        }

    result = {
        "id": assignment.id,
        "submission_id": assignment.submission_id,
        "reviewer_id": assignment.reviewer_id,
        "status": assignment.status,
        "assigned_by": assignment.assigned_by,
        "assigned_at": assignment.assigned_at,
        "deadline": assignment.deadline,
        "completed_at": assignment.completed_at,
        "created_at": assignment.created_at,
        "updated_at": assignment.updated_at,
        "submission": sub_response,
        "review": review_data,
    }
    return ok(data=result)


@router.post("/assignments/{assignment_id}/accept", response_model=ApiResponse)
def accept_assignment(
    assignment_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_reviewer),
):
    assignment = crud_assignment.get(db, assignment_id)
    if not assignment:
        raise AssignmentNotFoundException()
    _check_assignment_owner(assignment, current_user)

    if assignment.status != "pending":
        raise HTTPException(status_code=400, detail="Assignment is not in pending state")

    updated = crud_assignment.accept(db, assignment)
    return ok(data={"id": updated.id, "status": updated.status})


@router.post("/assignments/{assignment_id}/decline", response_model=ApiResponse)
def decline_assignment(
    assignment_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_reviewer),
):
    assignment = crud_assignment.get(db, assignment_id)
    if not assignment:
        raise AssignmentNotFoundException()
    _check_assignment_owner(assignment, current_user)

    if assignment.status != "pending":
        raise HTTPException(status_code=400, detail="Assignment is not in pending state")

    updated = crud_assignment.decline(db, assignment)
    return ok(data={"id": updated.id, "status": updated.status})


@router.post("/assignments/{assignment_id}/review", response_model=ApiResponse, status_code=201)
def submit_review(
    assignment_id: str,
    obj_in: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_reviewer),
):
    assignment = crud_assignment.get(db, assignment_id)
    if not assignment:
        raise AssignmentNotFoundException()
    _check_assignment_owner(assignment, current_user)

    if assignment.status not in ("accepted", "in_review"):
        raise HTTPException(
            status_code=400, detail="You must accept the assignment before submitting a review"
        )

    _check_review_deadline(assignment)

    # Check if review already exists
    existing = crud_review.get_by_assignment(db, assignment.id)
    if existing:
        raise HTTPException(status_code=409, detail="Review already submitted. Use PUT to update.")

    # Transition assignment to in_review if accepted
    if assignment.status == "accepted":
        crud_assignment.start_review(db, assignment)

    review = crud_review.create(
        db,
        assignment_id=assignment.id,
        overall_score=obj_in.overall_score,
        detailed_comments=obj_in.detailed_comments,
        recommendation=obj_in.recommendation,
    )

    # Complete assignment
    crud_assignment.complete(db, assignment)

    return created(
        data={
            "id": review.id,
            "assignment_id": review.assignment_id,
            "overall_score": review.overall_score,
            "recommendation": review.recommendation,
        }
    )


@router.put("/assignments/{assignment_id}/review", response_model=ApiResponse)
def update_review(
    assignment_id: str,
    obj_in: ReviewUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_reviewer),
):
    assignment = crud_assignment.get(db, assignment_id)
    if not assignment:
        raise AssignmentNotFoundException()
    _check_assignment_owner(assignment, current_user)

    review = crud_review.get_by_assignment(db, assignment.id)
    if not review:
        raise ReviewNotFoundException()

    _check_review_deadline(assignment)

    updated = crud_review.update(
        db,
        review,
        overall_score=obj_in.overall_score,
        detailed_comments=obj_in.detailed_comments,
        recommendation=obj_in.recommendation,
    )
    return ok(
        data={
            "id": updated.id,
            "overall_score": updated.overall_score,
            "recommendation": updated.recommendation,
        }
    )


@router.get("/assignments/{assignment_id}/file/download")
def download_anonymous_file(
    assignment_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_reviewer),
):
    assignment = crud_assignment.get(db, assignment_id)
    if not assignment:
        raise AssignmentNotFoundException()
    _check_assignment_owner(assignment, current_user)

    if assignment.status == "declined":
        raise UnauthorizedException("You have declined this assignment")

    submission = crud_submission.get(db, assignment.submission_id)
    if not submission:
        raise NotFoundException("Submission not found")

    files = crud_file.get_by_submission(db, str(submission.id))
    current_file = next((f for f in files if f.is_current), None)
    if not current_file:
        raise FileNotFoundException("No file available for this submission")

    storage = get_storage_service()
    data = storage.download_file(current_file.minio_key)
    from fastapi.responses import StreamingResponse

    return StreamingResponse(
        data,
        media_type="application/pdf",
        headers={"Content-Disposition": 'attachment; filename="anonymous_paper.pdf"'},
    )
