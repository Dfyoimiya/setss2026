"""
Author: K-ON! Team
文件描述: 用户认证与个人信息路由，含邮件验证和密码找回
"""

import secrets
from datetime import UTC, datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import schemas
from app.auth import (
    create_access_token,
    get_current_active_user,
    get_password_hash,
    verify_password,
)
from app.config import settings
from app.crud import crud_user
from app.database import get_db
from app.email_service import (
    send_password_reset_email,
    send_verification_email,
)
from app.models import User

router = APIRouter(prefix="/users", tags=["用户"])


@router.post(
    "/register",
    response_model=schemas.MessageResponse,
    status_code=status.HTTP_201_CREATED,
    summary="用户注册（发送验证邮件）",
)
def register(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    if crud_user.get_user_by_email(db, user_in.email):
        raise HTTPException(status_code=400, detail="该邮箱已被注册")

    token = secrets.token_urlsafe(32)
    user = crud_user.create_user(db, user_in, verify_token=token)
    send_verification_email(user.email, user.full_name or "", token)
    return {"message": "注册成功，请查收验证邮件以激活账户"}


@router.get("/verify-email", response_model=schemas.MessageResponse, summary="邮箱验证")
def verify_email(token: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email_verify_token == token).first()
    if not user:
        raise HTTPException(status_code=400, detail="验证链接无效或已过期")
    user.is_active = True
    user.email_verified = True
    user.email_verify_token = None
    db.commit()
    return {"message": "邮箱验证成功，您现在可以登录"}


@router.post("/login", response_model=schemas.Token, summary="用户登录")
def login(login_data: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = crud_user.get_user_by_email(db, login_data.email)
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="邮箱或密码错误")
    if not user.is_active:
        raise HTTPException(status_code=400, detail="账户未激活，请先验证邮箱")
    access_token = create_access_token(
        data={"sub": user.id},
        expires_delta=timedelta(minutes=settings.access_token_expire_minutes),
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/forgot-password", response_model=schemas.MessageResponse, summary="申请密码重置")
def forgot_password(body: schemas.ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = crud_user.get_user_by_email(db, body.email)
    # 无论用户是否存在都返回相同消息，防止枚举
    if user and user.is_active:
        token = secrets.token_urlsafe(32)
        user.password_reset_token = token
        user.password_reset_expires = datetime.now(UTC) + timedelta(hours=1)
        db.commit()
        send_password_reset_email(user.email, user.full_name or "", token)
    return {"message": "如果该邮箱已注册，您将收到密码重置邮件"}


@router.post("/reset-password", response_model=schemas.MessageResponse, summary="重置密码")
def reset_password(body: schemas.ResetPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.password_reset_token == body.token).first()
    if not user or not user.password_reset_expires:
        raise HTTPException(status_code=400, detail="重置链接无效或已过期")
    if user.password_reset_expires < datetime.now(UTC):
        raise HTTPException(status_code=400, detail="重置链接已过期，请重新申请")
    user.hashed_password = get_password_hash(body.new_password)
    user.password_reset_token = None
    user.password_reset_expires = None
    db.commit()
    return {"message": "密码重置成功，请使用新密码登录"}


@router.get("/me", response_model=schemas.UserDetailResponse, summary="获取当前用户信息")
def get_me(current_user: User = Depends(get_current_active_user)):
    return current_user


@router.patch("/me", response_model=schemas.UserDetailResponse, summary="更新个人信息")
def update_me(
    user_update: schemas.UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    return crud_user.update_user(db, current_user, user_update)


@router.post("/me/change-password", response_model=schemas.MessageResponse, summary="修改密码")
def change_password(
    password_data: schemas.PasswordChange,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    if not crud_user.change_password(db, current_user, password_data.old_password, password_data.new_password):
        raise HTTPException(status_code=400, detail="旧密码不正确")
    return {"message": "密码修改成功"}
