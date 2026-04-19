"""
Author: K-ON! Team
文件描述: 管理员路由 — 用户管理、论文管理、评审管理、注册管理、系统配置
"""

import csv
import io

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app import models, schemas
from app.auth import require_admin
from app.crud import crud_paper, crud_registration, crud_review, crud_user
from app.database import get_db

router = APIRouter(prefix="/admin", tags=["管理员"])


# ─────────────────────────────────────────────
# 用户管理
# ─────────────────────────────────────────────


@router.get(
    "/users/",
    response_model=schemas.PaginatedResponse[schemas.UserDetailResponse],
    summary="获取所有用户",
)
def list_users(
    page: int = 1,
    size: int = 20,
    _: models.User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    skip = (page - 1) * size
    users, total = crud_user.get_users(db, skip=skip, limit=size)
    return {"items": users, "total": total, "page": page, "size": size}


@router.patch(
    "/users/{user_id}/role",
    response_model=schemas.UserDetailResponse,
    summary="修改用户角色",
)
def update_role(
    user_id: str,
    role_data: schemas.RoleUpdate,
    _: models.User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    user = crud_user.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="用户不存在")
    return crud_user.update_user_role(db, user, role_data.role)


@router.patch(
    "/users/{user_id}/status",
    response_model=schemas.UserDetailResponse,
    summary="启用/禁用账户",
)
def update_status(
    user_id: str,
    status_data: schemas.StatusUpdate,
    _: models.User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    user = crud_user.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="用户不存在")
    return crud_user.update_user_status(db, user, status_data.is_active)


# ─────────────────────────────────────────────
# 论文管理
# ─────────────────────────────────────────────


@router.get(
    "/papers/",
    response_model=schemas.PaginatedResponse[schemas.PaperResponse],
    summary="获取所有论文",
)
def list_all_papers(
    page: int = 1,
    size: int = 20,
    status: str | None = None,
    topic: str | None = None,
    _: models.User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    skip = (page - 1) * size
    papers, total = crud_paper.get_all_papers(
        db, skip=skip, limit=size, status=status, topic=topic
    )
    return {"items": papers, "total": total, "page": page, "size": size}


@router.patch(
    "/papers/{paper_id}/status",
    response_model=schemas.PaperResponse,
    summary="修改论文状态",
)
def update_paper_status(
    paper_id: str,
    status_data: schemas.PaperStatusUpdate,
    _: models.User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    paper = crud_paper.get_paper(db, paper_id)
    if not paper:
        raise HTTPException(status_code=404, detail="论文不存在")
    valid = {"submitted", "under_review", "accepted", "rejected", "revision_required"}
    if status_data.status not in valid:
        raise HTTPException(status_code=400, detail=f"状态须为 {'/'.join(valid)}")
    return crud_paper.update_paper_status(db, paper, status_data.status)


@router.get("/papers/export", summary="导出论文列表 CSV")
def export_papers(
    _: models.User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    papers, _ = crud_paper.get_all_papers(db, limit=10000)
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(
        ["ID", "投稿编号", "标题", "状态", "主题", "提交者邮箱", "提交时间"]
    )
    for p in papers:
        writer.writerow(
            [
                p.id,
                p.submission_number,
                p.title,
                p.status,
                p.topic,
                p.submitter.email if p.submitter else "",
                str(p.created_at),
            ]
        )
    output.seek(0)
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode("utf-8-sig")),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=papers.csv"},
    )


@router.post(
    "/papers/{paper_id}/assign-reviewer",
    response_model=schemas.ReviewResponse,
    summary="分配审稿人",
)
def assign_reviewer(
    paper_id: str,
    req: schemas.AssignReviewerRequest,
    _: models.User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    paper = crud_paper.get_paper(db, paper_id)
    if not paper:
        raise HTTPException(status_code=404, detail="论文不存在")
    reviewer = crud_user.get_user_by_id(db, req.reviewer_id)
    if not reviewer:
        raise HTTPException(status_code=404, detail="审稿人不存在")
    existing = crud_review.get_review_by_paper_reviewer(db, paper_id, req.reviewer_id)
    if existing:
        raise HTTPException(status_code=400, detail="该审稿人已被分配此论文")
    review = crud_review.assign_reviewer(db, paper_id, req.reviewer_id)
    if paper.status == "submitted":
        crud_paper.update_paper_status(db, paper, "under_review")
    return review


@router.delete(
    "/papers/{paper_id}/assign-reviewer/{reviewer_id}",
    response_model=schemas.MessageResponse,
    summary="取消分配审稿人",
)
def remove_reviewer(
    paper_id: str,
    reviewer_id: str,
    _: models.User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    review = crud_review.get_review_by_paper_reviewer(db, paper_id, reviewer_id)
    if not review:
        raise HTTPException(status_code=404, detail="分配记录不存在")
    crud_review.remove_reviewer(db, review)
    return {"message": "已取消分配"}


# ─────────────────────────────────────────────
# 审稿管理
# ─────────────────────────────────────────────


@router.get(
    "/reviews/",
    response_model=schemas.PaginatedResponse[schemas.ReviewResponse],
    summary="获取所有审稿记录",
)
def list_all_reviews(
    page: int = 1,
    size: int = 20,
    _: models.User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    skip = (page - 1) * size
    items, total = crud_review.get_all_reviews(db, skip=skip, limit=size)
    return {"items": items, "total": total, "page": page, "size": size}


# ─────────────────────────────────────────────
# 参会注册管理
# ─────────────────────────────────────────────


@router.get(
    "/registrations/",
    response_model=schemas.PaginatedResponse[schemas.RegistrationResponse],
    summary="获取所有报名记录",
)
def list_all_registrations(
    page: int = 1,
    size: int = 20,
    _: models.User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    skip = (page - 1) * size
    items, total = crud_registration.get_all_registrations(db, skip=skip, limit=size)
    return {"items": items, "total": total, "page": page, "size": size}


@router.patch(
    "/registrations/{registration_id}/status",
    response_model=schemas.RegistrationResponse,
    summary="更新报名状态",
)
def update_registration_status(
    registration_id: str,
    status_data: dict,
    _: models.User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    reg = crud_registration.get_registration(db, registration_id)
    if not reg:
        raise HTTPException(status_code=404, detail="报名记录不存在")
    new_status = status_data.get("status")
    if new_status not in ("pending", "confirmed", "cancelled"):
        raise HTTPException(
            status_code=400, detail="状态须为 pending/confirmed/cancelled"
        )
    return crud_registration.update_registration_status(db, reg, new_status)


# ─────────────────────────────────────────────
# 系统配置管理
# ─────────────────────────────────────────────


@router.get(
    "/config/",
    response_model=list[schemas.ConfigResponse],
    summary="获取所有配置项（管理员）",
)
def admin_get_config(
    _: models.User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return db.query(models.SystemConfig).all()


@router.put(
    "/config/{key}",
    response_model=schemas.ConfigResponse,
    summary="更新配置项",
)
def admin_update_config(
    key: str,
    config_update: schemas.ConfigUpdate,
    _: models.User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    cfg = db.query(models.SystemConfig).filter(models.SystemConfig.key == key).first()
    if not cfg:
        cfg = models.SystemConfig(
            key=key, value=config_update.value, description=config_update.description
        )
        db.add(cfg)
    else:
        cfg.value = config_update.value
        if config_update.description is not None:
            cfg.description = config_update.description
    db.commit()
    db.refresh(cfg)
    return cfg
