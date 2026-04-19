"""
Author: K-ON! Team
文件描述: 公告 CRUD 操作
"""

from sqlalchemy.orm import Session

from app import models, schemas


def get_announcements(
    db: Session, skip: int = 0, limit: int = 20, published_only: bool = True
) -> tuple[list[models.Announcement], int]:
    query = db.query(models.Announcement)
    if published_only:
        query = query.filter(models.Announcement.is_published == True)  # noqa: E712
    query = query.order_by(models.Announcement.created_at.desc())
    total = query.count()
    return query.offset(skip).limit(limit).all(), total


def get_announcement(db: Session, announcement_id: str) -> models.Announcement | None:
    return (
        db.query(models.Announcement)
        .filter(models.Announcement.id == announcement_id)
        .first()
    )


def create_announcement(
    db: Session, ann_in: schemas.AnnouncementCreate, author_id: str
) -> models.Announcement:
    db_ann = models.Announcement(
        title=ann_in.title,
        content=ann_in.content,
        is_published=ann_in.is_published,
        author_id=author_id,
    )
    db.add(db_ann)
    db.commit()
    db.refresh(db_ann)
    return db_ann


def update_announcement(
    db: Session, ann: models.Announcement, ann_update: schemas.AnnouncementUpdate
) -> models.Announcement:
    update_data = ann_update.model_dump(exclude_none=True)
    for field, value in update_data.items():
        setattr(ann, field, value)
    db.commit()
    db.refresh(ann)
    return ann


def delete_announcement(db: Session, ann: models.Announcement) -> None:
    db.delete(ann)
    db.commit()
