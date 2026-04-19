"""
Author: K-ON! Team
文件描述: 审稿路由（审稿人操作）
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import schemas
from app.auth import get_current_active_user, require_reviewer
from app.crud import crud_review
from app.database import get_db
from app.models import User

router = APIRouter(prefix="/reviews", tags=["审稿"])


@router.get(
    "/assigned",
    response_model=schemas.PaginatedResponse[schemas.ReviewWithPaperResponse],
    summary="获取分配给我的审稿任务",
)
def get_assigned_reviews(
    page: int = 1,
    size: int = 20,
    current_user: User = Depends(require_reviewer),
    db: Session = Depends(get_db),
):
    skip = (page - 1) * size
    items, total = crud_review.get_reviews_by_reviewer(
        db, current_user.id, skip=skip, limit=size
    )
    return {"items": items, "total": total, "page": page, "size": size}


@router.get(
    "/{review_id}", response_model=schemas.ReviewResponse, summary="获取审稿详情"
)
def get_review(
    review_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    review = crud_review.get_review(db, review_id)
    if not review:
        raise HTTPException(status_code=404, detail="审稿记录不存在")
    if review.reviewer_id != current_user.id and "admin" not in current_user.role.split(
        ","
    ):
        raise HTTPException(status_code=403, detail="无权查看此审稿记录")
    return review


@router.post(
    "/{review_id}/submit", response_model=schemas.ReviewResponse, summary="提交审稿意见"
)
def submit_review(
    review_id: str,
    review_data: schemas.ReviewSubmit,
    current_user: User = Depends(require_reviewer),
    db: Session = Depends(get_db),
):
    review = crud_review.get_review(db, review_id)
    if not review:
        raise HTTPException(status_code=404, detail="审稿记录不存在")
    if review.reviewer_id != current_user.id:
        raise HTTPException(status_code=403, detail="无权提交此审稿")
    if not (1 <= review_data.score <= 5):
        raise HTTPException(status_code=400, detail="评分须在 1-5 之间")
    if review_data.recommendation not in ("accept", "reject", "revise"):
        raise HTTPException(status_code=400, detail="推荐决定须为 accept/reject/revise")
    return crud_review.submit_review(db, review, review_data)


@router.put(
    "/{review_id}", response_model=schemas.ReviewResponse, summary="更新审稿意见"
)
def update_review(
    review_id: str,
    review_data: schemas.ReviewSubmit,
    current_user: User = Depends(require_reviewer),
    db: Session = Depends(get_db),
):
    review = crud_review.get_review(db, review_id)
    if not review:
        raise HTTPException(status_code=404, detail="审稿记录不存在")
    if review.reviewer_id != current_user.id:
        raise HTTPException(status_code=403, detail="无权修改此审稿")
    if not (1 <= review_data.score <= 5):
        raise HTTPException(status_code=400, detail="评分须在 1-5 之间")
    return crud_review.submit_review(db, review, review_data)
