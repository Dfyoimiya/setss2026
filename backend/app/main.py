"""
Author: Finley
创建时间: 2026-03-31 18:10:44
最后修改时间: 2026-03-31 18:10:44
文件路径: /backend/app/main.py
文件描述:
"""

from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from . import models, schemas, database

# 初始化数据库表（仅供开发测试使用，生产环境推荐使用 Alembic 做迁移）
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="SETSS 2026 API - MVP")

# 密码加密配置
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


@app.post(
    "/register",
    response_model=schemas.UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register_user(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    # 1. 检查邮箱是否已存在
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="该邮箱已被注册")

    # 2. 密码加密
    hashed_pwd = get_password_hash(user.password)

    # 3. 创建数据库对象并保存
    new_user = models.User(email=user.email, hashed_password=hashed_pwd)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user
