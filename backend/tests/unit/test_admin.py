"""Unit tests for admin user management endpoints."""

from unittest.mock import patch

import pytest
from fastapi.testclient import TestClient

from app.auth import require_admin
from app.main import app
from app.models.user import User

mock_admin_user = User(
    id="admin-1",
    email="admin@test.com",
    role="admin",
    is_active=True,
    created_at=None,
)


def override_require_admin():
    return mock_admin_user


def _make_user_dict(role="participant", is_active=True):
    return {
        "id": "user-1",
        "email": "user@test.com",
        "full_name": None,
        "institution": None,
        "role": role,
        "is_active": is_active,
        "created_at": None,
    }


def test_admin_list_users_unauthorized(client):
    response = client.get("/api/v1/admin/users")
    assert response.status_code in [401, 403]


@patch("app.routers.admin.users.crud_user.get_users_paginated")
def test_admin_list_users_success(mock_get_users, client):
    mock_get_users.return_value = ([], 0)

    app.dependency_overrides[require_admin] = override_require_admin

    response = client.get("/api/v1/admin/users?page=1&size=10")
    del app.dependency_overrides[require_admin]

    assert response.status_code == 200
    data = response.json()
    assert data["code"] == 1000
    assert data["message"] == "success"
    assert "data" in data
    assert "pagination" in data


@patch("app.routers.admin.users.crud_user.get_by_id")
def test_admin_update_user_role_not_found(mock_get_by_id, client):
    mock_get_by_id.return_value = None

    app.dependency_overrides[require_admin] = override_require_admin

    response = client.patch(
        "/api/v1/admin/users/non_existent_id/role",
        json={"role": "reviewer"},
    )
    del app.dependency_overrides[require_admin]

    assert response.status_code == 404


@patch("app.routers.admin.users.crud_user.update_role")
@patch("app.routers.admin.users.crud_user.get_by_id")
def test_admin_update_user_role_success(mock_get_by_id, mock_update_role, client):
    mock_get_by_id.return_value = _make_user_dict()
    mock_update_role.return_value = _make_user_dict(role="reviewer")

    app.dependency_overrides[require_admin] = override_require_admin

    response = client.patch(
        "/api/v1/admin/users/user-1/role",
        json={"role": "reviewer"},
    )
    del app.dependency_overrides[require_admin]

    assert response.status_code == 200
    data = response.json()
    assert data["code"] == 1000
    assert data["data"]["role"] == "reviewer"


@patch("app.routers.admin.users.crud_user.update_status")
@patch("app.routers.admin.users.crud_user.get_by_id")
def test_admin_update_user_status_success(mock_get_by_id, mock_update_status, client):
    mock_get_by_id.return_value = _make_user_dict()
    mock_update_status.return_value = _make_user_dict(is_active=False)

    app.dependency_overrides[require_admin] = override_require_admin

    response = client.patch(
        "/api/v1/admin/users/user-1/status",
        json={"is_active": False},
    )
    del app.dependency_overrides[require_admin]

    assert response.status_code == 200
    data = response.json()
    assert data["code"] == 1000
    assert data["data"]["is_active"] is False
