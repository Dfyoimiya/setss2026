"""
Author: Finley
创建时间: 2026-03-29 01:41:32
最后修改时间: 2026-04-16
文件描述: SETSS 2026 API Gateway — 所有路由的统一入口
"""

import json

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import (
    admin,
    announcements,
    config_router,
    papers,
    registrations,
    reviews,
    users,
)

# ─────────────────────────────────────────────
# FastAPI 应用
# ─────────────────────────────────────────────
app = FastAPI(
    title="SETSS 2026 API",
    description="SETSS 2026 国际学术会议网站后端接口",
    version="1.0.0",
)

# CORS（开发阶段允许本地前端；Vite proxy 同样可绕过此处）
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:80",
        "http://localhost",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────
# 注册路由
# ─────────────────────────────────────────────
PREFIX = "/api/v1"

app.include_router(users.router, prefix=PREFIX)
app.include_router(announcements.router, prefix=PREFIX)
app.include_router(config_router.router, prefix=PREFIX)
app.include_router(papers.router, prefix=PREFIX)
app.include_router(reviews.router, prefix=PREFIX)
app.include_router(registrations.router, prefix=PREFIX)
app.include_router(admin.router, prefix=PREFIX)


# ─────────────────────────────────────────────
# 启动事件：建表 + 种子数据（延迟到真正启动时）
# ─────────────────────────────────────────────
@app.on_event("startup")
def on_startup():
    try:
        from app import models
        from app.database import SessionLocal, engine

        models.Base.metadata.create_all(bind=engine)

        DEFAULT_CONFIGS = [
            {
                "key": "submission_deadline",
                "value": "2026-06-01",
                "description": "论文投稿截止日",
            },
            {
                "key": "review_deadline",
                "value": "2026-07-01",
                "description": "审稿截止日",
            },
            {
                "key": "notification_date",
                "value": "2026-07-15",
                "description": "录用通知日",
            },
            {
                "key": "registration_deadline",
                "value": "2026-08-01",
                "description": "注册报名截止日",
            },
            {
                "key": "conference_start",
                "value": "2026-09-15",
                "description": "会议开始日期",
            },
            {
                "key": "conference_end",
                "value": "2026-09-17",
                "description": "会议结束日期",
            },
            {
                "key": "conference_venue",
                "value": "西南大学 行政楼报告厅",
                "description": "会议地点",
            },
            {
                "key": "topics",
                "value": json.dumps(
                    [
                        "软件工程方法与实践",
                        "人工智能与机器学习",
                        "分布式系统与云计算",
                        "网络安全",
                        "人机交互",
                        "大数据与数据工程",
                        "嵌入式系统与物联网",
                        "其他",
                    ],
                    ensure_ascii=False,
                ),
                "description": "会议主题列表（JSON 数组）",
            },
            {
                "key": "max_file_size_mb",
                "value": "20",
                "description": "上传文件最大 MB",
            },
        ]

        db = SessionLocal()
        try:
            for item in DEFAULT_CONFIGS:
                exists = (
                    db.query(models.SystemConfig)
                    .filter(models.SystemConfig.key == item["key"])
                    .first()
                )
                if not exists:
                    db.add(models.SystemConfig(**item))
            db.commit()
        finally:
            db.close()
    except Exception as e:
        # 测试环境可能无 Postgres，允许启动事件静默失败
        import logging

        logging.getLogger(__name__).warning(f"Startup DB init skipped: {e}")


# ─────────────────────────────────────────────
# 基础端点
# ─────────────────────────────────────────────
@app.get("/", tags=["健康检查"])
async def read_root():
    return {"message": "SETSS 2026 API is running", "version": "1.0.0"}


@app.get("/health", tags=["健康检查"])
async def health_check():
    return {"status": "ok", "service": "backend-gateway"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app:app", host="127.0.0.1", port=8001, reload=True)
