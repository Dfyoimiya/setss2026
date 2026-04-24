from sqlalchemy.orm import Session

from app.models.review import Review


def get(db: Session, review_id: str) -> Review | None:
    return db.query(Review).filter(Review.id == review_id).first()


def get_by_assignment(db: Session, assignment_id: str) -> Review | None:
    return db.query(Review).filter(Review.assignment_id == assignment_id).first()


def get_by_submission(
    db: Session, submission_id: str, skip: int = 0, limit: int = 100
) -> list[Review]:
    from app.models.review_assignment import ReviewAssignment

    return (
        db.query(Review)
        .join(ReviewAssignment, Review.assignment_id == ReviewAssignment.id)
        .filter(ReviewAssignment.submission_id == submission_id)
        .order_by(Review.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_visible_by_submission(
    db: Session, submission_id: str, skip: int = 0, limit: int = 100
) -> list[Review]:
    from app.models.review_assignment import ReviewAssignment

    return (
        db.query(Review)
        .join(ReviewAssignment, Review.assignment_id == ReviewAssignment.id)
        .filter(
            ReviewAssignment.submission_id == submission_id,
            Review.is_visible_to_author == True,  # noqa: E712
        )
        .order_by(Review.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def create(
    db: Session,
    assignment_id: str,
    overall_score: int,
    detailed_comments: str,
    recommendation: str,
) -> Review:
    db_obj = Review(
        assignment_id=assignment_id,
        overall_score=overall_score,
        detailed_comments=detailed_comments,
        recommendation=recommendation,
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def update(
    db: Session,
    db_obj: Review,
    overall_score: int | None = None,
    detailed_comments: str | None = None,
    recommendation: str | None = None,
) -> Review:
    if overall_score is not None:
        db_obj.overall_score = overall_score
    if detailed_comments is not None:
        db_obj.detailed_comments = detailed_comments
    if recommendation is not None:
        db_obj.recommendation = recommendation
    db.commit()
    db.refresh(db_obj)
    return db_obj


def set_visibility(db: Session, db_obj: Review, visible: bool) -> Review:
    db_obj.is_visible_to_author = visible
    db.commit()
    db.refresh(db_obj)
    return db_obj


def delete(db: Session, db_obj: Review) -> None:
    db.delete(db_obj)
    db.commit()
