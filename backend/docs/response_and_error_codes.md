# Response Format & Error Codes

This document describes the unified API response envelope and the complete set of business / error codes used by the **SETSS2026** backend.

---

## 1. Response Envelope

Every response—success or error—shares the same top-level JSON structure:

```json
{
  "code": 1000,
  "message": "success",
  "data": { }
}
```

| Field     | Type   | Description                                                    |
|-----------|--------|----------------------------------------------------------------|
| `code`    | int    | Machine-readable business status code (see tables below).      |
| `message` | string | Human-readable description. Suitable for toast / alert text.   |
| `data`    | any    | Endpoint-specific payload. May be `null`, an object, or array. |

### 1.1 Success example

```json
{
  "code": 1000,
  "message": "Item created successfully",
  "data": {
    "id": 7,
    "name": "Homework 1",
    "description": "Intro to Python",
    "created_at": "2026-04-23T08:00:00",
    "updated_at": "2026-04-23T08:00:00"
  }
}
```

### 1.2 Error example

```json
{
  "code": 300102,
  "message": "Item with id=999 not found",
  "data": null
}
```

### 1.3 Validation error example

```json
{
  "code": 1001,
  "message": "Request validation failed",
  "data": {
    "errors": [
      { "field": "body.name", "msg": "field required" }
    ]
  }
}
```

---

## 2. Business / Error Codes

Codes are grouped by **category** (the first digit) so clients can decide fallback behaviour quickly:

| Range | Category                              |
|-------|---------------------------------------|
| `1xxx`| Parameter / request format errors     |
| `2xxx`| Authentication / authorisation errors |
| `3xxx`| Resource errors (not found, conflict) |
| `4xxx`| Business logic errors                 |
| `5xxx`| Database / internal server errors     |
| `6xxx`| External service / network errors     |

### 2.1 Success

| Code | Name    | HTTP | Meaning           |
|------|---------|------|-------------------|
| 1000 | SUCCESS | 200  | Request succeeded.|

### 2.2 Parameter errors (`1xxx`)

| Code | Name              | HTTP | Typical usage                              |
|------|-------------------|------|--------------------------------------------|
| 1001 | PARAM_ERROR       | 422  | Generic parameter problem.                 |
| 1002 | PARAM_MISSING     | 422  | Required field absent.                     |
| 1003 | PARAM_TYPE_ERROR  | 422  | Value type mismatch (e.g. string vs int).  |
| 1004 | PARAM_FORMAT_ERROR| 422  | Regex / date format invalid.               |
| 1005 | PARAM_OUT_OF_RANGE| 422  | Numeric value outside allowed bounds.      |
| 1006 | PARAM_TOO_LONG    | 422  | String exceeds maximum length.             |
| 1007 | PARAM_TOO_SHORT   | 422  | String below minimum length.               |

### 2.3 Auth errors (`2xxx`)

| Code | Name                      | HTTP | Typical usage                        |
|------|---------------------------|------|--------------------------------------|
| 2001 | UNAUTHORIZED              | 401  | Missing or invalid credentials.      |
| 2002 | FORBIDDEN                 | 403  | Authenticated but not permitted.     |
| 2003 | TOKEN_EXPIRED             | 401  | JWT / session expired.               |
| 2004 | TOKEN_INVALID             | 401  | Token signature or format bad.       |
| 2005 | INSUFFICIENT_PERMISSIONS  | 403  | Role-based access denied.            |
| 2006 | ACCOUNT_LOCKED            | 403  | User account temporarily locked.     |
| 2007 | ACCOUNT_DISABLED          | 403  | User account deactivated.            |

### 2.4 Resource errors (`3xxx`)

**Generic resource codes:**

| Code | Name                 | HTTP | Typical usage                          |
|------|----------------------|------|----------------------------------------|
| 3001 | NOT_FOUND            | 404  | Generic resource missing.              |
| 3002 | CONFLICT             | 409  | Update collision or duplicate key.     |
| 3003 | ALREADY_EXISTS       | 409  | Resource creation blocked by duplicate.|
| 3004 | RESOURCE_GONE        | 410  | Previously existed, now permanently removed.|
| 3005 | RESOURCE_NOT_AVAILABLE| 403 | Resource exists but not accessible now.|

**Redundant granular `NOT_FOUND` codes** (kept for precise client messages):

| Code   | Name              | HTTP | Typical usage                |
|--------|-------------------|------|------------------------------|
| 300101 | USER_NOT_FOUND    | 404  | User ID / email unknown.     |
| 300102 | ITEM_NOT_FOUND    | 404  | Item ID unknown.             |
| 300103 | FILE_NOT_FOUND    | 404  | S3 / storage object missing. |
| 300104 | COURSE_NOT_FOUND  | 404  | Course ID unknown.           |
| 300105 | PROJECT_NOT_FOUND | 404  | Project ID unknown.          |
| 300106 | TEAM_NOT_FOUND    | 404  | Team ID unknown.             |
| 300107 | COMMENT_NOT_FOUND | 404  | Comment ID unknown.          |

**Redundant granular `ALREADY_EXISTS` codes:**

| Code   | Name                | HTTP | Typical usage              |
|--------|---------------------|------|----------------------------|
| 300301 | USER_ALREADY_EXISTS | 409  | Duplicate email / username.|
| 300302 | ITEM_ALREADY_EXISTS | 409  | Duplicate item name.       |
| 300303 | FILE_ALREADY_EXISTS | 409  | Duplicate file key.        |
| 300304 | COURSE_ALREADY_EXISTS| 409 | Duplicate course code.     |

> **Why redundancy?**  In a course project it is convenient to import ``ItemNotFoundException`` and immediately get the correct ``300102`` code without manually mapping a generic ``NOT_FOUND`` to a resource-specific message in every router.

### 2.5 Business logic errors (`4xxx`)

| Code | Name                   | HTTP | Typical usage                              |
|------|------------------------|------|--------------------------------------------|
| 4001 | BUSINESS_ERROR         | 400  | Generic rule violation.                    |
| 4002 | OPERATION_NOT_ALLOWED  | 403  | Action forbidden in current state.         |
| 4003 | LIMIT_EXCEEDED         | 400  | Hard limit crossed (e.g. max team size).   |
| 4004 | QUOTA_EXHAUSTED        | 400  | Soft quota crossed (e.g. API rate budget). |
| 4005 | STATE_INVALID          | 400  | Illegal state transition.                  |
| 4006 | PRECONDITION_FAILED    | 412  | Required precondition not met.             |
| 4007 | DEPENDENCY_NOT_MET     | 400  | Missing prerequisite resource.             |

### 2.6 Database / internal errors (`5xxx`)

| Code | Name                 | HTTP | Typical usage                        |
|------|----------------------|------|--------------------------------------|
| 5001 | DB_ERROR             | 500  | Generic database failure.            |
| 5002 | DB_CONNECTION_ERROR  | 500  | Cannot reach PostgreSQL.             |
| 5003 | DB_TIMEOUT           | 504  | Query timed out.                     |
| 5004 | INTERNAL_ERROR       | 500  | Catch-all server error.              |
| 5005 | CACHE_ERROR          | 500  | Redis / in-memory cache failure.     |
| 5006 | CONFIG_ERROR         | 500  | Missing environment variable, etc.   |

### 2.7 External service errors (`6xxx`)

| Code | Name                    | HTTP | Typical usage                        |
|------|-------------------------|------|--------------------------------------|
| 6001 | EXTERNAL_SERVICE_ERROR  | 502  | Downstream returned error.           |
| 6002 | TIMEOUT_ERROR           | 504  | Downstream did not respond in time.  |
| 6003 | RATE_LIMITED            | 429  | Downstream throttled us.             |
| 6004 | SERVICE_UNAVAILABLE     | 503  | Downstream explicitly unavailable.   |
| 6005 | NETWORK_ERROR           | 502  | DNS / TCP failure.                   |

---

## 3. How to use in code

### 3.1 Returning success

```python
from app.core.response import ok

@router.get("/items")
def list_items(...):
    items = db.query(Item).all()
    return ok(data=items)
```

### 3.2 Raising an error

**Option A — explicit exception + `.to_http()`:**

```python
from app.core.exceptions import ItemNotFoundException

@router.get("/items/{item_id}")
def get_item(item_id: int, ...):
    item = db.query(Item).filter(...).first()
    if not item:
        raise ItemNotFoundException(f"Item {item_id} not found").to_http()
    return ok(data=item)
```

**Option B — generic business exception:**

```python
from app.core.exceptions import BusinessException

raise BusinessException("Course is already full").to_http()
```

### 3.3 Pagination

```python
from app.core.response import PagedApiResponse

return PagedApiResponse.paged(
    data=items,
    page=page,
    page_size=page_size,
    total=total_count,
)
```

---

## 4. Fast global handlers

All conversions from exceptions to the JSON envelope happen automatically in
``app/main.py`` via FastAPI ``@app.exception_handler`` decorators.  You do **not**
need to write try/except blocks in every router.

| Exception type            | Handler behaviour                                    |
|---------------------------|------------------------------------------------------|
| `AppException` (and subs) | Uses `exc.biz_code`, `exc.message`, `exc.status_code`. |
| `RequestValidationError`  | Returns `PARAM_ERROR` with field-level details.      |
| `StarletteHTTPException`  | Passes through if already an envelope; otherwise wraps in `INTERNAL_ERROR`. |
| Generic `Exception`       | Returns `INTERNAL_ERROR`; hides details in production (`DEBUG=false`). |
