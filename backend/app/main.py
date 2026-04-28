from contextlib import asynccontextmanager
from datetime import UTC, datetime

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.api.items import router as items_router
from app.core.config import settings
from app.core.database import SessionLocal
from app.core.exceptions import AppError
from app.core.response import ApiResponse, ok
from app.core.status_codes import BizCode
from app.models.submission_period import SubmissionPeriod
from app.routers.admin.periods import router as admin_periods_router
from app.routers.admin.reviews import router as admin_reviews_router
from app.routers.admin.submissions import router as admin_submissions_router
from app.routers.admin.users import router as admin_users_router
from app.routers.reviews import router as reviews_router
from app.routers.submissions import router as submissions_router
from app.routers.users import router as users_router


def _seed_default_period() -> None:
    """Create a default submission period for SETSS 2026 if none exist."""
    db = SessionLocal()
    try:
        existing = db.query(SubmissionPeriod).first()
        if existing is not None:
            return
        period = SubmissionPeriod(
            name="SETSS 2026",
            description="8th Spring School on Engineering Trustworthy Software Systems",
            start_date=datetime(2026, 1, 1, tzinfo=UTC),
            end_date=datetime(2026, 6, 30, tzinfo=UTC),
            review_deadline=datetime(2026, 7, 31, tzinfo=UTC),
            rebuttal_deadline=datetime(2026, 8, 15, tzinfo=UTC),
            final_decision_deadline=datetime(2026, 8, 31, tzinfo=UTC),
            reviewers_per_paper=3,
            is_active=True,
        )
        db.add(period)
        db.commit()
    finally:
        db.close()


@asynccontextmanager
async def lifespan(_app: FastAPI):
    _seed_default_period()
    yield


app = FastAPI(
    title="SETSS2026 API",
    version="0.1.0",
    debug=settings.DEBUG,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== Global exception handlers =====


@app.exception_handler(AppError)
async def app_exception_handler(request: Request, exc: AppError):
    return JSONResponse(
        status_code=exc.status_code,
        content=ApiResponse.error(
            biz_code=exc.biz_code,
            message=exc.message,
        ).model_dump(),
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = [{"field": ".".join(str(x) for x in e["loc"]), "msg": e["msg"]} for e in exc.errors()]
    return JSONResponse(
        status_code=422,
        content=ApiResponse.error(
            biz_code=BizCode.PARAM_ERROR,
            message="Request validation failed",
            data={"errors": errors},
        ).model_dump(),
    )


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    # If detail is already our ApiResponse format, pass through
    if isinstance(exc.detail, dict) and "code" in exc.detail:
        return JSONResponse(status_code=exc.status_code, content=exc.detail)

    return JSONResponse(
        status_code=exc.status_code,
        content=ApiResponse.error(
            biz_code=BizCode.INTERNAL_ERROR,
            message=str(exc.detail),
        ).model_dump(),
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content=ApiResponse.error(
            biz_code=BizCode.INTERNAL_ERROR,
            message=str(exc) if settings.DEBUG else "Internal server error",
        ).model_dump(),
    )


# ===== Routes =====

app.include_router(items_router)
app.include_router(users_router)
app.include_router(submissions_router)
app.include_router(reviews_router)
app.include_router(admin_periods_router)
app.include_router(admin_submissions_router)
app.include_router(admin_reviews_router)
app.include_router(admin_users_router)


@app.get("/")
def read_root():
    return ok(data={"message": "Hello World"})


@app.get("/health")
def health_check():
    return ok(data={"status": "ok"})
