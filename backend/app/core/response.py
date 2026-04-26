"""Unified API response models and helpers.

Every successful or error response should use ``ApiResponse`` (or its
subclasses) so that clients receive a predictable envelope shape:

    {
        "code": 1000,
        "message": "success",
        "data": { ... }
    }
"""

from typing import Any, TypeVar

from pydantic import BaseModel, Field

from app.core.exceptions import AppError
from app.core.status_codes import BizCode

T = TypeVar("T")


class ApiResponse[T](BaseModel):
    """Standard API response envelope.

    Attributes:
        code: Business status code (see ``BizCode``).
        message: Human-readable description.
        data: Payload; type varies per endpoint.
    """

    code: int = Field(default=BizCode.SUCCESS, description="Business status code")
    message: str = Field(default="success", description="Status message")
    data: Any | None = Field(default=None, description="Response payload")

    @classmethod
    def ok(cls, data: Any = None, message: str = "success") -> "ApiResponse":
        """Build a successful response."""
        return cls(code=BizCode.SUCCESS, message=message, data=data)

    @classmethod
    def error(
        cls,
        biz_code: BizCode,
        message: str,
        data: Any = None,
    ) -> "ApiResponse":
        """Build an error response."""
        return cls(code=int(biz_code), message=message, data=data)


class PagedApiResponse(ApiResponse):
    """Paged list response with standard pagination metadata.

    Example::

        {
            "code": 1000,
            "message": "success",
            "data": [ ... ],
            "pagination": {
                "page": 1,
                "page_size": 20,
                "total": 100,
                "total_pages": 5
            }
        }
    """

    pagination: dict | None = Field(
        default=None,
        description="Pagination metadata",
    )

    @classmethod
    def paged(
        cls,
        data: list[Any],
        page: int,
        page_size: int,
        total: int,
        message: str = "success",
    ) -> "PagedApiResponse":
        total_pages = (total + page_size - 1) // page_size if page_size > 0 else 0
        return cls(
            code=BizCode.SUCCESS,
            message=message,
            data=data,
            pagination={
                "page": page,
                "page_size": page_size,
                "total": total,
                "total_pages": total_pages,
            },
        )


# ---------------------------------------------------------------------------
# Router-level convenience helpers
# ---------------------------------------------------------------------------


def ok(data: Any = None, message: str = "success") -> ApiResponse:
    """Return a successful ``ApiResponse`` (shortcut)."""
    return ApiResponse.ok(data=data, message=message)


def created(data: Any = None, message: str = "Created successfully") -> ApiResponse:
    """Return a 201-style successful response.

    Note: the HTTP status code is still controlled by the endpoint; this helper
    only standardises the body envelope.
    """
    return ApiResponse.ok(data=data, message=message)


def no_content(message: str = "No content") -> ApiResponse:
    """Return an empty successful response."""
    return ApiResponse.ok(data=None, message=message)


def fail(exc: AppError) -> None:
    """Raise the HTTPException derived from an AppException.

    Usage::

        from app.core.exceptions import ItemNotFoundException
        fail(ItemNotFoundException("No such item"))
    """
    raise exc.to_http()
