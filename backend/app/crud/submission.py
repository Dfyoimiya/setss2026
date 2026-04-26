from sqlalchemy.orm import Session

from app.models.submission import Submission
from app.schemas.submission import SubmissionCreate, SubmissionUpdate

VALID_TRANSITIONS = {
    "draft": ["submitted", "withdrawn"],
    "submitted": ["under_review", "withdrawn"],
    "under_review": [
        "review_completed",
        "accepted",
        "rejected",
        "minor_revision",
        "major_revision",
        "withdrawn",
    ],
    "review_completed": ["accepted", "rejected", "minor_revision", "major_revision"],
    "minor_revision": ["revision_submitted", "withdrawn"],
    "major_revision": ["revision_submitted", "withdrawn"],
    "revision_submitted": ["under_review", "accepted", "rejected"],
    "accepted": ["withdrawn"],
    "rejected": [],
    "withdrawn": [],
}


def get(db: Session, submission_id: str) -> Submission | None:
    return db.query(Submission).filter(Submission.id == submission_id).first()


def get_by_user(db: Session, user_id: str, skip: int = 0, limit: int = 100) -> list[Submission]:
    return (
        db.query(Submission)
        .filter(Submission.user_id == user_id)
        .order_by(Submission.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_multi(db: Session, skip: int = 0, limit: int = 100) -> list[Submission]:
    return (
        db.query(Submission).order_by(Submission.created_at.desc()).offset(skip).limit(limit).all()
    )


def create(db: Session, obj_in: SubmissionCreate, user_id: str) -> Submission:
    data = obj_in.model_dump()
    data["user_id"] = user_id
    data["status"] = "draft"
    db_obj = Submission(**data)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def update(db: Session, db_obj: Submission, obj_in: SubmissionUpdate) -> Submission:
    for field, value in obj_in.model_dump(exclude_none=True).items():
        setattr(db_obj, field, value)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def transition_status(db: Session, db_obj: Submission, new_status: str) -> Submission:
    current = db_obj.status
    if new_status not in VALID_TRANSITIONS.get(current, []):
        from app.core.exceptions import InvalidStateTransitionError

        raise InvalidStateTransitionError(f"Cannot transition from '{current}' to '{new_status}'")
    db_obj.status = new_status
    db.commit()
    db.refresh(db_obj)
    return db_obj


def withdraw(db: Session, db_obj: Submission) -> Submission:
    return transition_status(db, db_obj, "withdrawn")


def submit(db: Session, db_obj: Submission) -> Submission:
    return transition_status(db, db_obj, "submitted")


def submit_revision(db: Session, db_obj: Submission) -> Submission:
    return transition_status(db, db_obj, "revision_submitted")


def delete(db: Session, db_obj: Submission) -> None:
    db.delete(db_obj)
    db.commit()
