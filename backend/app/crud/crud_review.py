"""
Author: K-ON! Team
文件描述: 审稿 CRUD 操作
"""

from sqlalchemy.orm import Session

from app import models, schemas


def get_reviews_by_reviewer(
    db: Session, reviewer_id: str, skip: int = 0, limit: int = 20
) -> tuple[list[models.Review], int]:
    query = db.query(models.Review).filter(models.Review.reviewer_id == reviewer_id)
    total = query.count()
    return query.offset(skip).limit(limit).all(), total


def get_reviews_by_paper(db: Session, paper_id: str) -> list[models.Review]:
    return db.query(models.Review).filter(models.Review.paper_id == paper_id).all()


def get_all_reviews(
    db: Session, skip: int = 0, limit: int = 20
) -> tuple[list[models.Review], int]:
    query = db.query(models.Review)
    total = query.count()
    return query.offset(skip).limit(limit).all(), total


def get_review(db: Session, review_id: str) -> models.Review | None:
    return db.query(models.Review).filter(models.Review.id == review_id).first()


def get_review_by_paper_reviewer(
    db: Session, paper_id: str, reviewer_id: str
) -> models.Review | None:
    return (
        db.query(models.Review)
        .filter(
            models.Review.paper_id == paper_id, models.Review.reviewer_id == reviewer_id
        )
        .first()
    )


def assign_reviewer(db: Session, paper_id: str, reviewer_id: str) -> models.Review:
    db_review = models.Review(
        paper_id=paper_id, reviewer_id=reviewer_id, status="pending"
    )
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review


def remove_reviewer(db: Session, review: models.Review) -> None:
    db.delete(review)
    db.commit()


def submit_review(
    db: Session, review: models.Review, review_data: schemas.ReviewSubmit
) -> models.Review:
    review.score = review_data.score
    review.comments = review_data.comments
    review.recommendation = review_data.recommendation
    review.status = "submitted"
    db.commit()
    db.refresh(review)
    return review
