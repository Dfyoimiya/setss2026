"""
Author: K-ON! Team
最后修改时间: 2026-04-16
文件描述: JWT 认证工具函数，密码哈希，权限依赖注入
"""

from datetime import UTC, datetime, timedelta

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app import models
from app.config import settings
from app.database import get_db

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/users/login")


# ─────────────────────────────────────────────
# 密码工具
# ─────────────────────────────────────────────


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


# ─────────────────────────────────────────────
# JWT 工具
# ─────────────────────────────────────────────


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(UTC) + (
        expires_delta or timedelta(minutes=settings.access_token_expire_minutes)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)


# ─────────────────────────────────────────────
# 角色工具
# ─────────────────────────────────────────────


def has_role(user: models.User, role: str) -> bool:
    """检查用户是否拥有指定角色（角色存储为逗号分隔字符串）"""
    return role in user.role.split(",")


# ─────────────────────────────────────────────
# FastAPI 依赖注入
# ─────────────────────────────────────────────


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> models.User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="无效的认证凭据",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, settings.secret_key, algorithms=[settings.algorithm]
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user


def get_current_active_user(
    current_user: models.User = Depends(get_current_user),
) -> models.User:
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="账户已被禁用")
    return current_user


def require_admin(
    current_user: models.User = Depends(get_current_active_user),
) -> models.User:
    if not has_role(current_user, "admin"):
        raise HTTPException(status_code=403, detail="需要管理员权限")
    return current_user


def require_reviewer(
    current_user: models.User = Depends(get_current_active_user),
) -> models.User:
    if not has_role(current_user, "reviewer") and not has_role(current_user, "admin"):
        raise HTTPException(status_code=403, detail="需要审稿人权限")
    return current_user
