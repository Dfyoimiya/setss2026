"""Application-wide exception classes.

Provides a unified exception hierarchy for business logic errors,
allowing consistent HTTP response generation and logging.
"""

from fastapi import HTTPException, status


class AppException(Exception):
    """Base application exception.

    Args:
        message: Human-readable error description.
        status_code: HTTP status code associated with this error.
        code: Machine-readable error code for client handling.
    """

    def __init__(
        self,
        message: str,
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        code: str = "INTERNAL_ERROR",
    ):
        self.message = message
        self.status_code = status_code
        self.code = code
        super().__init__(self.message)

    def to_http(self) -> HTTPException:
        """Convert to a FastAPI HTTPException."""
        return HTTPException(
            status_code=self.status_code,
            detail={"code": self.code, "message": self.message},
        )


class NotFoundException(AppException):
    """Resource not found."""

    def __init__(self, message: str = "Resource not found", code: str = "NOT_FOUND"):
        super().__init__(
            message=message,
            status_code=status.HTTP_404_NOT_FOUND,
            code=code,
        )


class ConflictException(AppException):
    """Resource conflict (e.g., duplicate unique key)."""

    def __init__(self, message: str = "Resource conflict", code: str = "CONFLICT"):
        super().__init__(
            message=message,
            status_code=status.HTTP_409_CONFLICT,
            code=code,
        )


class UnauthorizedException(AppException):
    """Authentication required or failed."""

    def __init__(self, message: str = "Unauthorized", code: str = "UNAUTHORIZED"):
        super().__init__(
            message=message,
            status_code=status.HTTP_401_UNAUTHORIZED,
            code=code,
        )


class ForbiddenException(AppException):
    """Permission denied."""

    def __init__(self, message: str = "Forbidden", code: str = "FORBIDDEN"):
        super().__init__(
            message=message,
            status_code=status.HTTP_403_FORBIDDEN,
            code=code,
        )


class ValidationException(AppException):
    """Request validation error (business logic level)."""

    def __init__(self, message: str = "Validation error", code: str = "VALIDATION_ERROR"):
        super().__init__(
            message=message,
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            code=code,
        )
