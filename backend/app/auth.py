from datetime import UTC, datetime, timedelta

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.models.user import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/users/login")


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(UTC) + (
        expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode["exp"] = expire
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def has_role(user: User, role: str) -> bool:
    return role in user.role.split(",")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str | None = payload.get("sub")
        if user_id is None:
            raise exc
    except JWTError as jwt_err:
        raise exc from jwt_err

    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise exc
    return user


def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    if not bool(current_user.is_active):
        raise HTTPException(status_code=400, detail="Account is disabled")
    return current_user


def require_admin(current_user: User = Depends(get_current_active_user)) -> User:
    if not has_role(current_user, "admin"):
        raise HTTPException(status_code=403, detail="Admin privileges required")
    return current_user


def require_organizer(current_user: User = Depends(get_current_active_user)) -> User:
    if not (has_role(current_user, "admin") or has_role(current_user, "organizer")):
        raise HTTPException(status_code=403, detail="Organizer privileges required")
    return current_user


def require_reviewer(current_user: User = Depends(get_current_active_user)) -> User:
    if not (has_role(current_user, "admin") or has_role(current_user, "reviewer")):
        raise HTTPException(status_code=403, detail="Reviewer privileges required")
    return current_user
