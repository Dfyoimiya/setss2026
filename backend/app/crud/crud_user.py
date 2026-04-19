"""
Author: K-ON! Team
文件描述: 用户 CRUD 操作
"""

from sqlalchemy.orm import Session

from app import models, schemas
from app.auth import get_password_hash, verify_password


def get_user_by_email(db: Session, email: str) -> models.User | None:
    return db.query(models.User).filter(models.User.email == email).first()


def get_user_by_id(db: Session, user_id: str) -> models.User | None:
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_users(
    db: Session, skip: int = 0, limit: int = 20
) -> tuple[list[models.User], int]:
    total = db.query(models.User).count()
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users, total


def create_user(db: Session, user_in: schemas.UserCreate) -> models.User:
    db_user = models.User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        institution=user_in.institution,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def update_user(
    db: Session, user: models.User, user_update: schemas.UserUpdate
) -> models.User:
    update_data = user_update.model_dump(exclude_none=True)
    for field, value in update_data.items():
        setattr(user, field, value)
    db.commit()
    db.refresh(user)
    return user


def change_password(
    db: Session, user: models.User, old_password: str, new_password: str
) -> bool:
    if not verify_password(old_password, user.hashed_password):
        return False
    user.hashed_password = get_password_hash(new_password)
    db.commit()
    return True


def update_user_role(db: Session, user: models.User, role: str) -> models.User:
    user.role = role
    db.commit()
    db.refresh(user)
    return user


def update_user_status(db: Session, user: models.User, is_active: bool) -> models.User:
    user.is_active = is_active
    db.commit()
    db.refresh(user)
    return user
