"""
Author: K-ON! Team
文件描述: 参会注册 CRUD 操作
"""

import random
import string

from sqlalchemy.orm import Session

from app import models, schemas


def generate_confirmation_code() -> str:
    chars = string.ascii_uppercase + string.digits
    return "REG-" + "".join(random.choices(chars, k=6))


def get_registration_by_user(db: Session, user_id: str) -> models.Registration | None:
    return (
        db.query(models.Registration)
        .filter(models.Registration.user_id == user_id)
        .first()
    )


def get_all_registrations(
    db: Session, skip: int = 0, limit: int = 20
) -> tuple[list[models.Registration], int]:
    query = db.query(models.Registration)
    total = query.count()
    return query.offset(skip).limit(limit).all(), total


def get_registration(db: Session, registration_id: str) -> models.Registration | None:
    return (
        db.query(models.Registration)
        .filter(models.Registration.id == registration_id)
        .first()
    )


def create_registration(
    db: Session, reg_in: schemas.RegistrationCreate, user_id: str
) -> models.Registration:
    code = generate_confirmation_code()
    db_reg = models.Registration(
        confirmation_code=code,
        user_id=user_id,
        registration_type=reg_in.registration_type,
        institution=reg_in.institution,
        position=reg_in.position,
        dietary_preference=reg_in.dietary_preference,
    )
    db.add(db_reg)
    db.commit()
    db.refresh(db_reg)
    return db_reg


def update_registration(
    db: Session, reg: models.Registration, reg_update: schemas.RegistrationUpdate
) -> models.Registration:
    update_data = reg_update.model_dump(exclude_none=True)
    for field, value in update_data.items():
        setattr(reg, field, value)
    db.commit()
    db.refresh(reg)
    return reg


def update_registration_status(
    db: Session, reg: models.Registration, status: str
) -> models.Registration:
    reg.status = status
    db.commit()
    db.refresh(reg)
    return reg
