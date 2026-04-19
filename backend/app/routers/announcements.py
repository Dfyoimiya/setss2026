"""
Author: K-ON! Team
文件描述: 公告路由
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import schemas
from app.auth import require_admin
from app.crud import crud_announcement
from app.database import get_db
from app.models import User

router = APIRouter(prefix="/announcements", tags=["公告"])


@router.get(
    "/",
    response_model=schemas.PaginatedResponse[schemas.AnnouncementResponse],
    summary="获取公告列表",
)
def list_announcements(page: int = 1, size: int = 20, db: Session = Depends(get_db)):
    skip = (page - 1) * size
    items, total = crud_announcement.get_announcements(
        db, skip=skip, limit=size, published_only=True
    )
    return {"items": items, "total": total, "page": page, "size": size}


@router.get(
    "/{announcement_id}",
    response_model=schemas.AnnouncementResponse,
    summary="获取单条公告",
)
def get_announcement(announcement_id: str, db: Session = Depends(get_db)):
    ann = crud_announcement.get_announcement(db, announcement_id)
    if not ann or not ann.is_published:
        raise HTTPException(status_code=404, detail="公告不存在")
    return ann


@router.post(
    "/",
    response_model=schemas.AnnouncementResponse,
    status_code=status.HTTP_201_CREATED,
    summary="发布公告（管理员）",
)
def create_announcement(
    ann_in: schemas.AnnouncementCreate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return crud_announcement.create_announcement(db, ann_in, author_id=current_user.id)


@router.put(
    "/{announcement_id}",
    response_model=schemas.AnnouncementResponse,
    summary="更新公告（管理员）",
)
def update_announcement(
    announcement_id: str,
    ann_update: schemas.AnnouncementUpdate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    ann = crud_announcement.get_announcement(db, announcement_id)
    if not ann:
        raise HTTPException(status_code=404, detail="公告不存在")
    return crud_announcement.update_announcement(db, ann, ann_update)


@router.delete(
    "/{announcement_id}",
    response_model=schemas.MessageResponse,
    summary="删除公告（管理员）",
)
def delete_announcement(
    announcement_id: str,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    ann = crud_announcement.get_announcement(db, announcement_id)
    if not ann:
        raise HTTPException(status_code=404, detail="公告不存在")
    crud_announcement.delete_announcement(db, ann)
    return {"message": "公告已删除"}
