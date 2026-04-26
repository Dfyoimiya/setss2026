from sqlalchemy.orm import Session

from app.models.submission_period import SubmissionPeriod
from app.schemas.submission_period import SubmissionPeriodCreate, SubmissionPeriodUpdate


def get(db: Session, period_id: str) -> SubmissionPeriod | None:
    return db.query(SubmissionPeriod).filter(SubmissionPeriod.id == period_id).first()


def get_active(db: Session) -> SubmissionPeriod | None:
    return (
        db.query(SubmissionPeriod)
        .filter(SubmissionPeriod.is_active == True)  # noqa: E712
        .order_by(SubmissionPeriod.start_date.desc())
        .first()
    )


def get_multi(db: Session, skip: int = 0, limit: int = 100) -> list[SubmissionPeriod]:
    return (
        db.query(SubmissionPeriod)
        .order_by(SubmissionPeriod.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def create(db: Session, obj_in: SubmissionPeriodCreate) -> SubmissionPeriod:
    db_obj = SubmissionPeriod(**obj_in.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def update(
    db: Session, db_obj: SubmissionPeriod, obj_in: SubmissionPeriodUpdate
) -> SubmissionPeriod:
    for field, value in obj_in.model_dump(exclude_none=True).items():
        setattr(db_obj, field, value)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def delete(db: Session, db_obj: SubmissionPeriod) -> None:
    db.delete(db_obj)
    db.commit()
