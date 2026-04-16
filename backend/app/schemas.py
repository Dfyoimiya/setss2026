"""
Author: Finley
创建时间: 2026-03-31 18:10:15
最后修改时间: 2026-03-31 18:10:15
文件路径: /backend/app/schemas.py
文件描述:
"""

from pydantic import BaseModel, EmailStr


# 接收前端传来的注册数据
class UserCreate(BaseModel):
    email: EmailStr
    password: str


# 返回给前端的用户信息（绝不能包含密码）
class UserResponse(BaseModel):
    id: str
    email: str

    class Config:
        from_attributes = True
