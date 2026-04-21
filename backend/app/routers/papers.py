"""
Author: K-ON! Team
文件描述: 论文投稿路由，PDF 存储至 MinIO，下载通过 presigned URL
"""

import json

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app import schemas, storage
from app.auth import get_current_active_user, has_role
from app.config import settings
from app.crud import crud_paper
from app.database import get_db
from app.models import User

router = APIRouter(prefix="/papers", tags=["论文投稿"])


@router.get(
    "/",
    response_model=schemas.PaginatedResponse[schemas.PaperResponse],
    summary="获取我的投稿列表",
)
def list_my_papers(
    page: int = 1,
    size: int = 20,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    skip = (page - 1) * size
    items, total = crud_paper.get_papers_by_user(db, current_user.id, skip=skip, limit=size)
    return {"items": items, "total": total, "page": page, "size": size}


@router.post(
    "/",
    response_model=schemas.PaperResponse,
    status_code=status.HTTP_201_CREATED,
    summary="提交论文（含 PDF 上传）",
)
async def submit_paper(
    title: str = Form(...),
    abstract: str = Form(...),
    keywords: str = Form(...),
    topic: str = Form(...),
    co_authors: str = Form("[]"),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    if file.content_type not in ("application/pdf", "application/octet-stream"):
        raise HTTPException(status_code=400, detail="仅接受 PDF 文件")

    try:
        co_authors_data = [schemas.PaperAuthorCreate(**a) for a in json.loads(co_authors)]
    except Exception:
        raise HTTPException(status_code=400, detail="co_authors 格式不正确")

    paper = crud_paper.create_paper(
        db,
        title=title,
        abstract=abstract,
        keywords=keywords,
        topic=topic,
        submitter_id=current_user.id,
        co_authors=co_authors_data,
    )

    contents = await file.read()
    if len(contents) > settings.max_upload_size_mb * 1024 * 1024:
        raise HTTPException(status_code=413, detail=f"文件超过 {settings.max_upload_size_mb}MB 限制")

    object_name = f"papers/{paper.id}/submission.pdf"
    storage.upload_bytes(object_name, contents)
    crud_paper.update_paper_file(db, paper, object_name)

    db.refresh(paper)
    return paper


@router.get("/{paper_id}", summary="获取论文详情（双盲审稿人仅见摘要）")
def get_paper(
    paper_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    paper = crud_paper.get_paper(db, paper_id)
    if not paper:
        raise HTTPException(status_code=404, detail="论文不存在")

    is_owner = paper.submitter_id == current_user.id
    is_admin = has_role(current_user, "admin")
    is_reviewer = has_role(current_user, "reviewer")

    if not (is_owner or is_admin or is_reviewer):
        raise HTTPException(status_code=403, detail="无权访问此论文")

    if is_reviewer and not is_admin and not is_owner:
        return schemas.PaperBlindResponse.model_validate(paper)

    return schemas.PaperResponse.model_validate(paper)


@router.put(
    "/{paper_id}",
    response_model=schemas.PaperResponse,
    summary="更新论文元数据（截止前）",
)
def update_paper(
    paper_id: str,
    title: str | None = None,
    abstract: str | None = None,
    keywords: str | None = None,
    topic: str | None = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    paper = crud_paper.get_paper(db, paper_id)
    if not paper:
        raise HTTPException(status_code=404, detail="论文不存在")
    if paper.submitter_id != current_user.id:
        raise HTTPException(status_code=403, detail="无权修改此论文")
    if paper.status not in ("submitted", "revision_required"):
        raise HTTPException(status_code=400, detail="当前状态不允许修改")
    return crud_paper.update_paper_metadata(db, paper, title, abstract, keywords, topic)


@router.post(
    "/{paper_id}/upload-file",
    response_model=schemas.PaperResponse,
    summary="重新上传 PDF",
)
async def upload_file(
    paper_id: str,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    paper = crud_paper.get_paper(db, paper_id)
    if not paper:
        raise HTTPException(status_code=404, detail="论文不存在")
    if paper.submitter_id != current_user.id:
        raise HTTPException(status_code=403, detail="无权修改此论文")
    if file.content_type not in ("application/pdf", "application/octet-stream"):
        raise HTTPException(status_code=400, detail="仅接受 PDF 文件")

    contents = await file.read()
    if len(contents) > settings.max_upload_size_mb * 1024 * 1024:
        raise HTTPException(status_code=413, detail=f"文件超过 {settings.max_upload_size_mb}MB 限制")

    object_name = f"papers/{paper.id}/submission.pdf"
    storage.upload_bytes(object_name, contents)
    return crud_paper.update_paper_file(db, paper, object_name)


@router.post(
    "/{paper_id}/camera-ready",
    response_model=schemas.PaperResponse,
    summary="上传终稿",
)
async def upload_camera_ready(
    paper_id: str,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    paper = crud_paper.get_paper(db, paper_id)
    if not paper:
        raise HTTPException(status_code=404, detail="论文不存在")
    if paper.submitter_id != current_user.id:
        raise HTTPException(status_code=403, detail="无权修改此论文")
    if paper.status != "accepted":
        raise HTTPException(status_code=400, detail="仅接受状态的论文可上传终稿")
    if file.content_type not in ("application/pdf", "application/octet-stream"):
        raise HTTPException(status_code=400, detail="仅接受 PDF 文件")

    contents = await file.read()
    if len(contents) > settings.max_upload_size_mb * 1024 * 1024:
        raise HTTPException(status_code=413, detail=f"文件超过 {settings.max_upload_size_mb}MB 限制")

    object_name = f"papers/{paper.id}/camera_ready.pdf"
    storage.upload_bytes(object_name, contents)
    return crud_paper.update_camera_ready(db, paper, object_name)


@router.get("/{paper_id}/download-url", summary="获取论文 PDF 下载链接（presigned URL）")
def get_download_url(
    paper_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """返回有效期 15 分钟的 MinIO presigned URL，前端直接用此 URL 下载"""
    paper = crud_paper.get_paper(db, paper_id)
    if not paper:
        raise HTTPException(status_code=404, detail="论文不存在")

    is_owner = paper.submitter_id == current_user.id
    is_admin = has_role(current_user, "admin")
    is_reviewer = has_role(current_user, "reviewer")

    if not (is_owner or is_admin or is_reviewer):
        raise HTTPException(status_code=403, detail="无权下载此论文")

    if not paper.file_path:
        raise HTTPException(status_code=404, detail="文件不存在")

    url = storage.get_presigned_url(paper.file_path)
    return {"url": url, "filename": f"{paper.submission_number}.pdf"}


@router.get("/{paper_id}/camera-ready-url", summary="获取终稿下载链接")
def get_camera_ready_url(
    paper_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    paper = crud_paper.get_paper(db, paper_id)
    if not paper:
        raise HTTPException(status_code=404, detail="论文不存在")

    is_owner = paper.submitter_id == current_user.id
    is_admin = has_role(current_user, "admin")

    if not (is_owner or is_admin):
        raise HTTPException(status_code=403, detail="无权下载此文件")

    if not paper.camera_ready_path:
        raise HTTPException(status_code=404, detail="终稿文件不存在")

    url = storage.get_presigned_url(paper.camera_ready_path)
    return {"url": url, "filename": f"{paper.submission_number}_camera_ready.pdf"}
