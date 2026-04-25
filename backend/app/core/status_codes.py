"""Business and error status codes for SETSS2026.

This module defines all machine-readable codes returned in API responses.
Codes are grouped by category (1xxx = client/param, 2xxx = auth,
3xxx = resource, 4xxx = business logic, 5xxx = internal/db, 6xxx = external).
Redundant granular codes are intentionally kept for precise client handling.
"""

from enum import IntEnum


class BizCode(IntEnum):
    """Unified business status code.

    Attributes:
        code: Integer code sent in every API response under the ``code`` field.
        name: Human-readable constant name for server-side use.
    """

    # ------------------------------------------------------------------
    # Success
    # ------------------------------------------------------------------
    SUCCESS = 1000

    # ------------------------------------------------------------------
    # Parameter / Request errors  (1xxx)
    # ------------------------------------------------------------------
    PARAM_ERROR = 1001          # generic parameter error
    PARAM_MISSING = 1002        # required field missing
    PARAM_TYPE_ERROR = 1003     # type mismatch
    PARAM_FORMAT_ERROR = 1004   # regex / format invalid
    PARAM_OUT_OF_RANGE = 1005   # numeric value out of allowed range
    PARAM_TOO_LONG = 1006       # string exceeds max length
    PARAM_TOO_SHORT = 1007      # string below min length

    # ------------------------------------------------------------------
    # Authentication / Authorization errors  (2xxx)
    # ------------------------------------------------------------------
    UNAUTHORIZED = 2001
    FORBIDDEN = 2002
    TOKEN_EXPIRED = 2003
    TOKEN_INVALID = 2004
    INSUFFICIENT_PERMISSIONS = 2005
    ACCOUNT_LOCKED = 2006
    ACCOUNT_DISABLED = 2007

    # ------------------------------------------------------------------
    # Resource errors  (3xxx)
    # ------------------------------------------------------------------
    NOT_FOUND = 3001
    CONFLICT = 3002
    ALREADY_EXISTS = 3003
    RESOURCE_GONE = 3004
    RESOURCE_NOT_AVAILABLE = 3005

    # Redundant granular NOT_FOUND codes for fine-grained client messages
    USER_NOT_FOUND = 300101
    ITEM_NOT_FOUND = 300102
    FILE_NOT_FOUND = 300103
    COURSE_NOT_FOUND = 300104
    PROJECT_NOT_FOUND = 300105
    TEAM_NOT_FOUND = 300106
    COMMENT_NOT_FOUND = 300107
    SUBMISSION_NOT_FOUND = 300108
    REVIEW_NOT_FOUND = 300109
    ASSIGNMENT_NOT_FOUND = 300110
    PERIOD_NOT_FOUND = 300111

    # Redundant granular ALREADY_EXISTS codes
    USER_ALREADY_EXISTS = 300301
    ITEM_ALREADY_EXISTS = 300302
    FILE_ALREADY_EXISTS = 300303
    COURSE_ALREADY_EXISTS = 300304
    SUBMISSION_ALREADY_EXISTS = 300305

    # ------------------------------------------------------------------
    # Business logic errors  (4xxx)
    # ------------------------------------------------------------------
    BUSINESS_ERROR = 4001
    OPERATION_NOT_ALLOWED = 4002
    LIMIT_EXCEEDED = 4003
    QUOTA_EXHAUSTED = 4004
    STATE_INVALID = 4005        # e.g. illegal state transition
    PRECONDITION_FAILED = 4006
    DEPENDENCY_NOT_MET = 4007
    PERIOD_CLOSED = 400101
    REVIEW_DEADLINE_EXCEEDED = 400102
    REBUTTAL_CLOSED = 400103
    INVALID_STATE_TRANSITION = 400104
    REVIEWER_ALREADY_ASSIGNED = 400105
    REVIEWER_CAPACITY_FULL = 400106

    # ------------------------------------------------------------------
    # Database / Internal errors  (5xxx)
    # ------------------------------------------------------------------
    DB_ERROR = 5001
    DB_CONNECTION_ERROR = 5002
    DB_TIMEOUT = 5003
    INTERNAL_ERROR = 5004
    CACHE_ERROR = 5005
    CONFIG_ERROR = 5006

    # ------------------------------------------------------------------
    # External service / Network errors  (6xxx)
    # ------------------------------------------------------------------
    EXTERNAL_SERVICE_ERROR = 6001
    TIMEOUT_ERROR = 6002
    RATE_LIMITED = 6003
    SERVICE_UNAVAILABLE = 6004
    NETWORK_ERROR = 6005
