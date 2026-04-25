from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth import require_admin
from app.core.database import get_db
from app.core.response import ApiResponse, PagedApiResponse, ok
from app.crud import user as crud_user
from app.models.user import User
from app.schemas.user import RoleUpdate, StatusUpdate, UserResponse

router = APIRouter(prefix="/api/v1/admin/users", tags=["Admin - Users"])


@router.get("", response_model=PagedApiResponse)
def list_users(
    page: int = 1,
    size: int = 20,
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    skip = (page - 1) * size
    users, total = crud_user.get_users_paginated(db, skip=skip, limit=size)
    return PagedApiResponse.paged(data=users, page=page, page_size=size, total=total)


@router.patch("/{user_id}/role", response_model=ApiResponse[UserResponse])
def update_user_role(
    user_id: str,
    role_data: RoleUpdate,
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    user = crud_user.get_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    updated_user = crud_user.update_role(db, user, role_data.role)
    return ok(data=updated_user, message="Role updated successfully")


@router.patch("/{user_id}/status", response_model=ApiResponse[UserResponse])
def update_user_status(
    user_id: str,
    status_data: StatusUpdate,
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    user = crud_user.get_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    updated_user = crud_user.update_status(db, user, status_data.is_active)
    return ok(data=updated_user, message="Status updated successfully")
