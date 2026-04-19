"""
Author: K-ON! Team
文件描述: 用户认证与个人信息路由
"""

from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import schemas
from app.auth import (
    create_access_token,
    get_current_active_user,
    verify_password,
)
from app.config import settings
from app.crud import crud_user
from app.database import get_db
from app.models import User

router = APIRouter(prefix="/users", tags=["用户"])


@router.post(
    "/register",
    response_model=schemas.UserDetailResponse,
    status_code=status.HTTP_201_CREATED,
    summary="用户注册",
)
def register(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    if crud_user.get_user_by_email(db, user_in.email):
        raise HTTPException(status_code=400, detail="该邮箱已被注册")
    return crud_user.create_user(db, user_in)


@router.post("/login", response_model=schemas.Token, summary="用户登录")
def login(login_data: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = crud_user.get_user_by_email(db, login_data.email)
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="邮箱或密码错误")
    if not user.is_active:
        raise HTTPException(status_code=400, detail="账户已被禁用")
    access_token = create_access_token(
        data={"sub": user.id},
        expires_delta=timedelta(minutes=settings.access_token_expire_minutes),
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.get(
    "/me", response_model=schemas.UserDetailResponse, summary="获取当前用户信息"
)
def get_me(current_user: User = Depends(get_current_active_user)):
    return current_user


@router.patch("/me", response_model=schemas.UserDetailResponse, summary="更新个人信息")
def update_me(
    user_update: schemas.UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    return crud_user.update_user(db, current_user, user_update)


@router.post(
    "/me/change-password", response_model=schemas.MessageResponse, summary="修改密码"
)
def change_password(
    password_data: schemas.PasswordChange,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    success = crud_user.change_password(
        db, current_user, password_data.old_password, password_data.new_password
    )
    if not success:
        raise HTTPException(status_code=400, detail="旧密码不正确")
    return {"message": "密码修改成功"}
