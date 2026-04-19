"""
Author: K-ON! Team
文件描述: 系统配置公开读取路由
"""

from fastapi import APIRouter, Depends, HTTPException

from app import schemas
from app.database import get_db
from app.models import SystemConfig
from sqlalchemy.orm import Session

router = APIRouter(prefix="/config", tags=["系统配置"])


@router.get(
    "/", response_model=list[schemas.ConfigResponse], summary="获取所有公开配置"
)
def get_all_config(db: Session = Depends(get_db)):
    return db.query(SystemConfig).all()


@router.get("/{key}", response_model=schemas.ConfigResponse, summary="获取单个配置项")
def get_config(key: str, db: Session = Depends(get_db)):
    cfg = db.query(SystemConfig).filter(SystemConfig.key == key).first()
    if not cfg:
        raise HTTPException(status_code=404, detail=f"配置项 '{key}' 不存在")
    return cfg
