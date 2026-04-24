"""Application exception hierarchy.

All service-layer code should raise subclasses of ``AppException`` instead of
raw ``HTTPException``.  Global exception handlers in ``main.py`` convert these
into the standard JSON response format automatically.
"""

from fastapi import HTTPException, status

from app.core.status_codes import BizCode


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


class SubmissionNotFoundException(NotFoundException):
    def __init__(self, message: str = "Submission not found"):
        super().__init__(
            message=message,
            code="SUBMISSION_NOT_FOUND",
            biz_code=BizCode.SUBMISSION_NOT_FOUND,
        )


class ReviewNotFoundException(NotFoundException):
    def __init__(self, message: str = "Review not found"):
        super().__init__(
            message=message,
            code="REVIEW_NOT_FOUND",
            biz_code=BizCode.REVIEW_NOT_FOUND,
        )


class AssignmentNotFoundException(NotFoundException):
    def __init__(self, message: str = "Review assignment not found"):
        super().__init__(
            message=message,
            code="ASSIGNMENT_NOT_FOUND",
            biz_code=BizCode.ASSIGNMENT_NOT_FOUND,
        )


class PeriodNotFoundException(NotFoundException):
    def __init__(self, message: str = "Submission period not found"):
        super().__init__(
            message=message,
            code="PERIOD_NOT_FOUND",
            biz_code=BizCode.PERIOD_NOT_FOUND,
        )


class SubmissionAlreadyExistsException(ConflictException):
    def __init__(self, message: str = "Submission already exists"):
        super().__init__(
            message=message,
            code="SUBMISSION_ALREADY_EXISTS",
            biz_code=BizCode.SUBMISSION_ALREADY_EXISTS,
        )


class PeriodClosedException(BusinessException):
    def __init__(self, message: str = "Submission period is closed"):
        super().__init__(
            message=message,
            code="PERIOD_CLOSED",
            biz_code=BizCode.PERIOD_CLOSED,
        )


class ReviewDeadlineExceededException(BusinessException):
    def __init__(self, message: str = "Review deadline has passed"):
        super().__init__(
            message=message,
            code="REVIEW_DEADLINE_EXCEEDED",
            biz_code=BizCode.REVIEW_DEADLINE_EXCEEDED,
        )


class RebuttalClosedException(BusinessException):
    def __init__(self, message: str = "Rebuttal period is closed"):
        super().__init__(
            message=message,
            code="REBUTTAL_CLOSED",
            biz_code=BizCode.REBUTTAL_CLOSED,
        )


class InvalidStateTransitionException(BusinessException):
    def __init__(self, message: str = "Invalid state transition"):
        super().__init__(
            message=message,
            code="INVALID_STATE_TRANSITION",
            biz_code=BizCode.INVALID_STATE_TRANSITION,
        )


class ReviewerAlreadyAssignedException(BusinessException):
    def __init__(self, message: str = "Reviewer already assigned to this submission"):
        super().__init__(
            message=message,
            code="REVIEWER_ALREADY_ASSIGNED",
            biz_code=BizCode.REVIEWER_ALREADY_ASSIGNED,
        )
