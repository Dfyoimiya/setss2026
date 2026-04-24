"""Unit tests for ``app.core.exceptions``."""

from fastapi import HTTPException, status

from app.core.exceptions import (
    AppError,
    BusinessError,
    ConflictError,
    DatabaseError,
    ExternalServiceError,
    ForbiddenError,
    ItemNotFoundError,
    NotFoundError,
    UnauthorizedError,
    UserAlreadyExistsError,
    ValidationError,
)
from app.core.status_codes import BizCode


def test_app_exception_attributes():
    exc = AppError(
        message="Something went wrong",
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        code="SERVICE_DOWN",
        biz_code=BizCode.SERVICE_UNAVAILABLE,
    )
    assert exc.message == "Something went wrong"
    assert exc.status_code == 503
    assert exc.code == "SERVICE_DOWN"
    assert exc.biz_code == BizCode.SERVICE_UNAVAILABLE


def test_app_exception_to_http():
    exc = AppError("fail", status_code=500, biz_code=BizCode.INTERNAL_ERROR)
    http = exc.to_http()
    assert isinstance(http, HTTPException)
    assert http.status_code == 500
    assert http.detail["code"] == BizCode.INTERNAL_ERROR
    assert http.detail["message"] == "fail"


def test_not_found_exception_defaults():
    exc = NotFoundError()
    assert exc.status_code == 404
    assert exc.biz_code == BizCode.NOT_FOUND


def test_conflict_exception_defaults():
    exc = ConflictError("Email already registered")
    assert exc.status_code == 409
    assert exc.biz_code == BizCode.CONFLICT
    assert exc.message == "Email already registered"


def test_unauthorized_exception_defaults():
    exc = UnauthorizedError()
    assert exc.status_code == 401
    assert exc.biz_code == BizCode.UNAUTHORIZED


def test_forbidden_exception_defaults():
    exc = ForbiddenError("Admin only")
    assert exc.status_code == 403
    assert exc.biz_code == BizCode.FORBIDDEN
    assert exc.message == "Admin only"


def test_validation_exception_defaults():
    exc = ValidationError("Invalid date range")
    assert exc.status_code == 422
    assert exc.biz_code == BizCode.PARAM_ERROR


def test_business_exception_defaults():
    exc = BusinessError("Course is full")
    assert exc.status_code == 400
    assert exc.biz_code == BizCode.BUSINESS_ERROR


def test_database_exception_defaults():
    exc = DatabaseError("Connection refused")
    assert exc.status_code == 500
    assert exc.biz_code == BizCode.DB_ERROR


def test_external_service_exception_defaults():
    exc = ExternalServiceError("Minio unreachable")
    assert exc.status_code == 502
    assert exc.biz_code == BizCode.EXTERNAL_SERVICE_ERROR


def test_item_not_found_granular():
    exc = ItemNotFoundError("No item #99")
    assert exc.biz_code == BizCode.ITEM_NOT_FOUND
    assert exc.code == "ITEM_NOT_FOUND"
    assert exc.status_code == 404


def test_user_already_exists_granular():
    exc = UserAlreadyExistsError()
    assert exc.biz_code == BizCode.USER_ALREADY_EXISTS
    assert exc.code == "USER_ALREADY_EXISTS"
    assert exc.status_code == 409


def test_exception_str():
    exc = AppError("custom msg")
    assert str(exc) == "custom msg"
