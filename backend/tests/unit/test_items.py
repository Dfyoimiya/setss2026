"""Unit tests for the items router with unified response format.

All assertions verify the ``ApiResponse`` envelope shape:
``{"code": <int>, "message": <str>, "data": <Any>}``.
"""

import pytest
from fastapi import status
from app.core.status_codes import BizCode


def _unwrap(response):
    """Helper to unwrap the standard response envelope."""
    return response.json()["data"]


def test_list_items_empty(client):
    response = client.get("/items/")
    assert response.status_code == status.HTTP_200_OK
    body = response.json()
    assert body["code"] == BizCode.SUCCESS
    assert body["data"] == []


def test_create_item(client):
    payload = {"name": "Test Item", "description": "A test description"}
    response = client.post("/items/", json=payload)
    assert response.status_code == status.HTTP_201_CREATED
    body = response.json()
    assert body["code"] == BizCode.SUCCESS
    data = body["data"]
    assert data["name"] == "Test Item"
    assert data["description"] == "A test description"
    assert "id" in data


def test_get_item(client):
    create_resp = client.post("/items/", json={"name": "Get Me"})
    item_id = _unwrap(create_resp)["id"]

    response = client.get(f"/items/{item_id}")
    assert response.status_code == status.HTTP_200_OK
    body = response.json()
    assert body["code"] == BizCode.SUCCESS
    assert body["data"]["name"] == "Get Me"


def test_get_item_not_found(client):
    response = client.get("/items/999")
    assert response.status_code == status.HTTP_404_NOT_FOUND
    body = response.json()
    assert body["code"] == BizCode.ITEM_NOT_FOUND
    assert "not found" in body["message"].lower()


def test_update_item(client):
    create_resp = client.post("/items/", json={"name": "Old Name"})
    item_id = _unwrap(create_resp)["id"]

    response = client.put(f"/items/{item_id}", json={"name": "New Name"})
    assert response.status_code == status.HTTP_200_OK
    body = response.json()
    assert body["code"] == BizCode.SUCCESS
    assert body["data"]["name"] == "New Name"


def test_update_item_not_found(client):
    response = client.put("/items/999", json={"name": "New Name"})
    assert response.status_code == status.HTTP_404_NOT_FOUND
    body = response.json()
    assert body["code"] == BizCode.ITEM_NOT_FOUND


def test_update_item_empty_name(client):
    create_resp = client.post("/items/", json={"name": "Valid Name"})
    item_id = _unwrap(create_resp)["id"]

    response = client.put(f"/items/{item_id}", json={"name": "   "})
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    body = response.json()
    assert body["code"] == BizCode.PARAM_ERROR


def test_delete_item(client):
    create_resp = client.post("/items/", json={"name": "Delete Me"})
    item_id = _unwrap(create_resp)["id"]

    response = client.delete(f"/items/{item_id}")
    assert response.status_code == status.HTTP_200_OK
    body = response.json()
    assert body["code"] == BizCode.SUCCESS

    # verify deletion
    get_resp = client.get(f"/items/{item_id}")
    assert get_resp.status_code == status.HTTP_404_NOT_FOUND
    assert get_resp.json()["code"] == BizCode.ITEM_NOT_FOUND


def test_delete_item_not_found(client):
    response = client.delete("/items/999")
    assert response.status_code == status.HTTP_404_NOT_FOUND
    body = response.json()
    assert body["code"] == BizCode.ITEM_NOT_FOUND


def test_create_duplicate_name(client):
    payload = {"name": "Duplicate", "description": "first"}
    r1 = client.post("/items/", json=payload)
    assert r1.status_code == status.HTTP_201_CREATED

    r2 = client.post("/items/", json=payload)
    assert r2.status_code == status.HTTP_409_CONFLICT
    body = r2.json()
    assert body["code"] == BizCode.ITEM_ALREADY_EXISTS
