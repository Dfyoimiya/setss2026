"""Application exception hierarchy.

All service-layer code should raise subclasses of ``AppException`` instead of
raw ``HTTPException``.  Global exception handlers in ``main.py`` convert these
into the standard JSON response format automatically.
"""

from fastapi import HTTPException, status
from shared.status_codes import BizCode


class AppException(Exception):
    """Base application exception.

    Args:
        message: Human-readable error description.
        status_code: HTTP status code associated with this error.
        code: Machine-readable string code (kept for backward compatibility).
        biz_code: Business-specific integer code for client handling.
    """

    def __init__(
        self,
        message: str,
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        code: str = "INTERNAL_ERROR",
        biz_code: BizCode = BizCode.INTERNAL_ERROR,
    ):
        self.message = message
        self.status_code = status_code
        self.code = code
        self.biz_code = biz_code
        super().__init__(self.message)

    def to_http(self) -> HTTPException:
        """Convert to FastAPI HTTPException with standard response body."""
        from app.core.response import ApiResponse

        return HTTPException(
            status_code=self.status_code,
            detail=ApiResponse.error(
                biz_code=self.biz_code,
                message=self.message,
            ).model_dump(),
        )


# ---------------------------------------------------------------------------
# 4xx Client errors
# ---------------------------------------------------------------------------

class ValidationException(AppException):
    """Request validation error (business logic level)."""

    def __init__(
        self,
        message: str = "Validation error",
        code: str = "VALIDATION_ERROR",
        biz_code: BizCode = BizCode.PARAM_ERROR,
    ):
        super().__init__(
            message=message,
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            code=code,
            biz_code=biz_code,
        )


class NotFoundException(AppException):
    """Resource not found."""

    def __init__(
        self,
        message: str = "Resource not found",
        code: str = "NOT_FOUND",
        biz_code: BizCode = BizCode.NOT_FOUND,
    ):
        super().__init__(
            message=message,
            status_code=status.HTTP_404_NOT_FOUND,
            code=code,
            biz_code=biz_code,
        )


class ConflictException(AppException):
    """Resource conflict (e.g. duplicate unique key)."""

    def __init__(
        self,
        message: str = "Resource conflict",
        code: str = "CONFLICT",
        biz_code: BizCode = BizCode.CONFLICT,
    ):
        super().__init__(
            message=message,
            status_code=status.HTTP_409_CONFLICT,
            code=code,
            biz_code=biz_code,
        )


class UnauthorizedException(AppException):
    """Authentication required or failed."""

    def __init__(
        self,
        message: str = "Unauthorized",
        code: str = "UNAUTHORIZED",
        biz_code: BizCode = BizCode.UNAUTHORIZED,
    ):
        super().__init__(
            message=message,
            status_code=status.HTTP_401_UNAUTHORIZED,
            code=code,
            biz_code=biz_code,
        )


class ForbiddenException(AppException):
    """Permission denied."""

    def __init__(
        self,
        message: str = "Forbidden",
        code: str = "FORBIDDEN",
        biz_code: BizCode = BizCode.FORBIDDEN,
    ):
        super().__init__(
            message=message,
            status_code=status.HTTP_403_FORBIDDEN,
            code=code,
            biz_code=biz_code,
        )


class BusinessException(AppException):
    """Generic business rule violation."""

    def __init__(
        self,
        message: str = "Business rule violation",
        code: str = "BUSINESS_ERROR",
        biz_code: BizCode = BizCode.BUSINESS_ERROR,
    ):
        super().__init__(
            message=message,
            status_code=status.HTTP_400_BAD_REQUEST,
            code=code,
            biz_code=biz_code,
        )


# ---------------------------------------------------------------------------
# 5xx Server errors
# ---------------------------------------------------------------------------

class DatabaseException(AppException):
    """Database operation failure."""

    def __init__(
        self,
        message: str = "Database error",
        code: str = "DB_ERROR",
        biz_code: BizCode = BizCode.DB_ERROR,
    ):
        super().__init__(
            message=message,
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            code=code,
            biz_code=biz_code,
        )


class ExternalServiceException(AppException):
    """Downstream service call failure."""

    def __init__(
        self,
        message: str = "External service error",
        code: str = "EXTERNAL_SERVICE_ERROR",
        biz_code: BizCode = BizCode.EXTERNAL_SERVICE_ERROR,
    ):
        super().__init__(
            message=message,
            status_code=status.HTTP_502_BAD_GATEWAY,
            code=code,
            biz_code=biz_code,
        )


# ---------------------------------------------------------------------------
# Redundant granular exceptions (kept for convenience & precise codes)
# ---------------------------------------------------------------------------

class ItemNotFoundException(NotFoundException):
    def __init__(self, message: str = "Item not found"):
        super().__init__(
            message=message,
            code="ITEM_NOT_FOUND",
            biz_code=BizCode.ITEM_NOT_FOUND,
        )


class UserNotFoundException(NotFoundException):
    def __init__(self, message: str = "User not found"):
        super().__init__(
            message=message,
            code="USER_NOT_FOUND",
            biz_code=BizCode.USER_NOT_FOUND,
        )


class FileNotFoundException(NotFoundException):
    def __init__(self, message: str = "File not found"):
        super().__init__(
            message=message,
            code="FILE_NOT_FOUND",
            biz_code=BizCode.FILE_NOT_FOUND,
        )


class CourseNotFoundException(NotFoundException):
    def __init__(self, message: str = "Course not found"):
        super().__init__(
            message=message,
            code="COURSE_NOT_FOUND",
            biz_code=BizCode.COURSE_NOT_FOUND,
        )


class UserAlreadyExistsException(ConflictException):
    def __init__(self, message: str = "User already exists"):
        super().__init__(
            message=message,
            code="USER_ALREADY_EXISTS",
            biz_code=BizCode.USER_ALREADY_EXISTS,
        )


class ItemAlreadyExistsException(ConflictException):
    def __init__(self, message: str = "Item already exists"):
        super().__init__(
            message=message,
            code="ITEM_ALREADY_EXISTS",
            biz_code=BizCode.ITEM_ALREADY_EXISTS,
        )
