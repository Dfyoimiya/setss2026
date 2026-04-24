import secrets
from datetime import UTC, datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth import (
    create_access_token,
    get_current_active_user,
    get_password_hash,
    verify_password,
)
from app.core.config import settings
from app.core.database import get_db
from app.crud import user as crud_user
from app.models.user import User
from app.schemas.user import (
    ForgotPasswordRequest,
    LoginRequest,
    MessageResponse,
    PasswordChange,
    ResetPasswordRequest,
    Token,
    UserCreate,
    UserResponse,
    UserUpdate,
)

router = APIRouter(prefix="/api/v1/users", tags=["Users"])


@router.post("/register", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    if crud_user.get_by_email(db, user_in.email):
        raise HTTPException(status_code=409, detail="Email already registered")

    if settings.EMAIL_ENABLED:
        token = secrets.token_urlsafe(32)
        crud_user.create(db, user_in, verify_token=token)
        # TODO: send_verification_email(user_in.email, user_in.full_name or "", token)
        return MessageResponse(message="Registration successful. Please check your email to activate your account.")
    else:
        # Dev mode: activate immediately
        crud_user.create(db, user_in, verify_token=None)
        return MessageResponse(message="Registration successful.")


@router.get("/verify-email", response_model=MessageResponse)
def verify_email(token: str, db: Session = Depends(get_db)):
    user = crud_user.get_by_verify_token(db, token)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired verification link")
    user.is_active = True
    user.email_verified = True
    user.email_verify_token = None
    db.commit()
    return MessageResponse(message="Email verified. You can now log in.")


@router.post("/login", response_model=Token)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    user = crud_user.get_by_email(db, login_data.email)
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Account not activated. Please verify your email.")
    access_token = create_access_token(
        data={"sub": user.id},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    return Token(access_token=access_token)


@router.post("/forgot-password", response_model=MessageResponse)
def forgot_password(body: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = crud_user.get_by_email(db, body.email)
    if user and user.is_active:
        token = secrets.token_urlsafe(32)
        user.password_reset_token = token
        user.password_reset_expires = datetime.now(UTC) + timedelta(hours=1)
        db.commit()
        # TODO: send_password_reset_email(user.email, user.full_name or "", token)
    # Always return the same message to prevent email enumeration
    return MessageResponse(message="If that email is registered, a reset link has been sent.")


@router.post("/reset-password", response_model=MessageResponse)
def reset_password(body: ResetPasswordRequest, db: Session = Depends(get_db)):
    user = crud_user.get_by_reset_token(db, body.token)
    if not user or not user.password_reset_expires:
        raise HTTPException(status_code=400, detail="Invalid or expired reset link")
    if user.password_reset_expires < datetime.now(UTC):
        raise HTTPException(status_code=400, detail="Reset link has expired. Please request a new one.")
    user.hashed_password = get_password_hash(body.new_password)
    user.password_reset_token = None
    user.password_reset_expires = None
    db.commit()
    return MessageResponse(message="Password reset successful. You can now log in.")


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_active_user)):
    return current_user


@router.patch("/me", response_model=UserResponse)
def update_me(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    return crud_user.update(db, current_user, user_update)


@router.post("/me/change-password", response_model=MessageResponse)
def change_password(
    body: PasswordChange,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    if not crud_user.change_password(db, current_user, body.old_password, body.new_password):
        raise HTTPException(status_code=400, detail="Old password is incorrect")
    return MessageResponse(message="Password changed successfully.")
