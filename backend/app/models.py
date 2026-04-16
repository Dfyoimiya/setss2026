"""
Author: Finley
创建时间: 2026-03-31 18:09:47
最后修改时间: 2026-03-31 18:09:47
文件路径: /backend/app/models.py
文件描述:
"""

from sqlalchemy import Column, String
import uuid
from .database import Base


class User(Base):
    __tablename__ = "users"

    # 使用 UUID 作为主键，更安全，适合分布式
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
