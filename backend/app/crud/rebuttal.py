from sqlalchemy.orm import Session

from app.models.rebuttal import Rebuttal


def get(db: Session, rebuttal_id: str) -> Rebuttal | None:
    return db.query(Rebuttal).filter(Rebuttal.id == rebuttal_id).first()


def get_by_review(db: Session, review_id: str) -> Rebuttal | None:
    return db.query(Rebuttal).filter(Rebuttal.review_id == review_id).first()


def create(db: Session, review_id: str, content: str) -> Rebuttal:
    db_obj = Rebuttal(review_id=review_id, content=content)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def update(db: Session, db_obj: Rebuttal, content: str) -> Rebuttal:
    db_obj.content = content
    db.commit()
    db.refresh(db_obj)
    return db_obj


def set_visibility(db: Session, db_obj: Rebuttal, visible: bool) -> Rebuttal:
    db_obj.is_visible_to_reviewer = visible
    db.commit()
    db.refresh(db_obj)
    return db_obj


def delete(db: Session, db_obj: Rebuttal) -> None:
    db.delete(db_obj)
    db.commit()
