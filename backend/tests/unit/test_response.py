"""Unit tests for ``app.core.response`` models and helpers."""

import pytest
from pydantic import ValidationError

from app.core.response import ApiResponse, PagedApiResponse, ok, created, no_content
from shared.status_codes import BizCode


def test_api_response_ok_defaults():
    resp = ApiResponse.ok()
    assert resp.code == BizCode.SUCCESS
    assert resp.message == "success"
    assert resp.data is None


def test_api_response_ok_with_data():
    resp = ApiResponse.ok(data={"id": 42})
    assert resp.data == {"id": 42}


def test_api_response_error():
    resp = ApiResponse.error(
        biz_code=BizCode.PARAM_MISSING,
        message="Missing field 'name'",
        data={"field": "name"},
    )
    assert resp.code == BizCode.PARAM_MISSING
    assert resp.message == "Missing field 'name'"
    assert resp.data == {"field": "name"}


def test_ok_helper():
    resp = ok(data=[1, 2, 3])
    assert resp.code == BizCode.SUCCESS
    assert resp.data == [1, 2, 3]


def test_created_helper():
    resp = created(data={"id": 1})
    assert resp.message == "Created successfully"
    assert resp.data == {"id": 1}


def test_no_content_helper():
    resp = no_content()
    assert resp.data is None
    assert resp.message == "No content"


def test_paged_response_calculation():
    resp = PagedApiResponse.paged(
        data=["a", "b"],
        page=1,
        page_size=20,
        total=100,
    )
    assert resp.code == BizCode.SUCCESS
    assert resp.data == ["a", "b"]
    assert resp.pagination["total_pages"] == 5
    assert resp.pagination["page"] == 1


def test_paged_response_serialization():
    resp = PagedApiResponse.paged(
        data=[{"id": 1}],
        page=2,
        page_size=10,
        total=15,
    )
    dumped = resp.model_dump()
    assert dumped["pagination"]["total_pages"] == 2


def test_api_response_invalid_code_type():
    # code must be coercible to int; string should raise ValidationError
    with pytest.raises(ValidationError):
        ApiResponse(code="not-an-int", message="bad")
