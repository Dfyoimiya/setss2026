"""
Author: K-ON! Team
文件描述: 参会注册路由
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import schemas
from app.auth import get_current_active_user
from app.crud import crud_registration
from app.database import get_db
from app.models import User

router = APIRouter(prefix="/registrations", tags=["参会注册"])

VALID_TYPES = {"student", "regular", "speaker", "virtual"}


@router.post(
    "/",
    response_model=schemas.RegistrationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="报名参会",
)
def register_for_conference(
    reg_in: schemas.RegistrationCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    if reg_in.registration_type not in VALID_TYPES:
        raise HTTPException(
            status_code=400, detail=f"注册类型须为 {'/'.join(VALID_TYPES)}"
        )
    existing = crud_registration.get_registration_by_user(db, current_user.id)
    if existing:
        raise HTTPException(status_code=400, detail="您已报名，不可重复提交")
    return crud_registration.create_registration(db, reg_in, current_user.id)


@router.get(
    "/me", response_model=schemas.RegistrationResponse, summary="查看我的报名状态"
)
def get_my_registration(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    reg = crud_registration.get_registration_by_user(db, current_user.id)
    if not reg:
        raise HTTPException(status_code=404, detail="您尚未报名")
    return reg


@router.patch(
    "/me", response_model=schemas.RegistrationResponse, summary="更新报名信息"
)
def update_my_registration(
    reg_update: schemas.RegistrationUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    reg = crud_registration.get_registration_by_user(db, current_user.id)
    if not reg:
        raise HTTPException(status_code=404, detail="您尚未报名")
    if reg.status == "cancelled":
        raise HTTPException(status_code=400, detail="已取消的报名不可修改")
    return crud_registration.update_registration(db, reg, reg_update)
