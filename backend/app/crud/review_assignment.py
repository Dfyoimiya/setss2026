import random
from datetime import UTC, datetime

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.review_assignment import ReviewAssignment
from app.models.user import User


def get(db: Session, assignment_id: str) -> ReviewAssignment | None:
    return db.query(ReviewAssignment).filter(ReviewAssignment.id == assignment_id).first()


def get_by_reviewer(
    db: Session, reviewer_id: str, skip: int = 0, limit: int = 100
) -> list[ReviewAssignment]:
    return (
        db.query(ReviewAssignment)
        .filter(ReviewAssignment.reviewer_id == reviewer_id)
        .order_by(ReviewAssignment.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_by_submission(
    db: Session, submission_id: str, skip: int = 0, limit: int = 100
) -> list[ReviewAssignment]:
    return (
        db.query(ReviewAssignment)
        .filter(ReviewAssignment.submission_id == submission_id)
        .order_by(ReviewAssignment.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_multi(db: Session, skip: int = 0, limit: int = 100) -> list[ReviewAssignment]:
    return (
        db.query(ReviewAssignment)
        .order_by(ReviewAssignment.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_by_submission_and_reviewer(
    db: Session, submission_id: str, reviewer_id: str
) -> ReviewAssignment | None:
    return (
        db.query(ReviewAssignment)
        .filter(
            ReviewAssignment.submission_id == submission_id,
            ReviewAssignment.reviewer_id == reviewer_id,
        )
        .first()
    )


def create(
    db: Session,
    submission_id: str,
    reviewer_id: str,
    deadline: datetime,
    assigned_by: str | None = None,
) -> ReviewAssignment:
    db_obj = ReviewAssignment(
        submission_id=submission_id,
        reviewer_id=reviewer_id,
        deadline=deadline,
        assigned_by=assigned_by,
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def accept(db: Session, db_obj: ReviewAssignment) -> ReviewAssignment:
    db_obj.status = "accepted"
    db.commit()
    db.refresh(db_obj)
    return db_obj


def decline(db: Session, db_obj: ReviewAssignment) -> ReviewAssignment:
    db_obj.status = "declined"
    db.commit()
    db.refresh(db_obj)
    return db_obj


def start_review(db: Session, db_obj: ReviewAssignment) -> ReviewAssignment:
    db_obj.status = "in_review"
    db.commit()
    db.refresh(db_obj)
    return db_obj


def complete(db: Session, db_obj: ReviewAssignment) -> ReviewAssignment:
    db_obj.status = "completed"
    db_obj.completed_at = datetime.now(UTC)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def get_candidate_reviewers(db: Session, submission_id: str, exclude_user_id: str) -> list[User]:
    """Return eligible reviewers who are not already assigned to this submission."""
    already_assigned = [
        r[0]
        for r in db.query(ReviewAssignment.reviewer_id)
        .filter(ReviewAssignment.submission_id == submission_id)
        .all()
    ]
    query = db.query(User).filter(
        User.role.like("%reviewer%"),
        User.id != exclude_user_id,
    )
    if already_assigned:
        query = query.filter(User.id.notin_(already_assigned))
    return query.all()


def get_reviewer_workload(db: Session, reviewer_id: str) -> int:
    return (
        db.query(func.count(ReviewAssignment.id))
        .filter(
            ReviewAssignment.reviewer_id == reviewer_id,
            ReviewAssignment.status.in_(["pending", "accepted", "in_review"]),
        )
        .scalar()
        or 0
    )


def auto_assign(
    db: Session,
    submission_id: str,
    exclude_user_id: str,
    deadline: datetime,
    num_reviewers: int = 3,
    assigned_by: str | None = None,
) -> list[ReviewAssignment]:
    candidates = get_candidate_reviewers(db, submission_id, exclude_user_id)
    if not candidates:
        return []

    # Sort by workload (ascending), then pick randomly among the least loaded
    candidates_with_load = [(c, get_reviewer_workload(db, c.id)) for c in candidates]
    candidates_with_load.sort(key=lambda x: x[1])

    selected = []
    for _ in range(num_reviewers):
        if not candidates_with_load:
            break
        min_load = candidates_with_load[0][1]
        pool = [c for c, load in candidates_with_load if load == min_load]
        chosen = random.choice(pool)
        selected.append(chosen)
        candidates_with_load = [(c, load) for c, load in candidates_with_load if c.id != chosen.id]

    assignments = []
    for reviewer in selected:
        assignments.append(create(db, submission_id, reviewer.id, deadline, assigned_by))
    return assignments


def delete(db: Session, db_obj: ReviewAssignment) -> None:
    db.delete(db_obj)
    db.commit()
