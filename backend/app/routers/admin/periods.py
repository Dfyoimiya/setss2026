from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth import require_organizer
from app.core.database import get_db
from app.core.exceptions import PeriodNotFoundException
from app.core.response import ApiResponse, created, ok
from app.crud import submission_period as crud_period
from app.models.user import User
from app.schemas.submission_period import (
    SubmissionPeriodCreate,
    SubmissionPeriodUpdate,
)

router = APIRouter(prefix="/api/v1/admin/periods", tags=["Admin - Periods"])


@router.get("", response_model=ApiResponse)
def list_periods(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_organizer),
    skip: int = 0,
    limit: int = 100,
):
    periods = crud_period.get_multi(db, skip=skip, limit=limit)
    data = [
        {
            "id": p.id,
            "name": p.name,
            "start_date": p.start_date,
            "end_date": p.end_date,
            "is_active": p.is_active,
        }
        for p in periods
    ]
    return ok(data=data)


@router.post("", response_model=ApiResponse)
def create_period(
    obj_in: SubmissionPeriodCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_organizer),
):
    period = crud_period.create(db, obj_in)
    return created(
        data={
            "id": period.id,
            "name": period.name,
            "is_active": period.is_active,
        }
    )


@router.get("/{period_id}", response_model=ApiResponse)
def get_period(
    period_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_organizer),
):
    period = crud_period.get(db, period_id)
    if not period:
        raise PeriodNotFoundException()
    return ok(data={
        "id": period.id,
        "name": period.name,
        "description": period.description,
        "start_date": period.start_date,
        "end_date": period.end_date,
        "review_deadline": period.review_deadline,
        "rebuttal_deadline": period.rebuttal_deadline,
        "final_decision_deadline": period.final_decision_deadline,
        "reviewers_per_paper": period.reviewers_per_paper,
        "is_active": period.is_active,
        "created_at": period.created_at,
        "updated_at": period.updated_at,
    })


@router.put("/{period_id}", response_model=ApiResponse)
def update_period(
    period_id: str,
    obj_in: SubmissionPeriodUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_organizer),
):
    period = crud_period.get(db, period_id)
    if not period:
        raise PeriodNotFoundException()
    updated = crud_period.update(db, period, obj_in)
    return ok(data={"id": updated.id, "name": updated.name})


@router.delete("/{period_id}", response_model=ApiResponse)
def delete_period(
    period_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_organizer),
):
    period = crud_period.get(db, period_id)
    if not period:
        raise PeriodNotFoundException()
    crud_period.delete(db, period)
    return ok(data={"message": "Period deleted"})
