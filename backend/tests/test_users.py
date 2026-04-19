"""
Author: K-ON! Team
文件描述: 用户系统 API 测试
"""

from fastapi.testclient import TestClient


def test_register_success(client: TestClient):
    resp = client.post(
        "/api/v1/users/register",
        json={"email": "test@example.com", "password": "Password123"},
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["email"] == "test@example.com"
    assert "hashed_password" not in data


def test_register_duplicate_email(client: TestClient):
    client.post(
        "/api/v1/users/register",
        json={"email": "dup@example.com", "password": "Password123"},
    )
    resp = client.post(
        "/api/v1/users/register",
        json={"email": "dup@example.com", "password": "Another123"},
    )
    assert resp.status_code == 400


def test_login_success(client: TestClient):
    client.post(
        "/api/v1/users/register",
        json={"email": "login@example.com", "password": "Password123"},
    )
    resp = client.post(
        "/api/v1/users/login",
        json={"email": "login@example.com", "password": "Password123"},
    )
    assert resp.status_code == 200
    assert "access_token" in resp.json()


def test_login_wrong_password(client: TestClient):
    client.post(
        "/api/v1/users/register",
        json={"email": "fail@example.com", "password": "RightPass"},
    )
    resp = client.post(
        "/api/v1/users/login",
        json={"email": "fail@example.com", "password": "WrongPass"},
    )
    assert resp.status_code == 401


def test_get_me(client: TestClient):
    client.post(
        "/api/v1/users/register",
        json={"email": "me@example.com", "password": "Password123"},
    )
    login_resp = client.post(
        "/api/v1/users/login",
        json={"email": "me@example.com", "password": "Password123"},
    )
    token = login_resp.json()["access_token"]
    resp = client.get("/api/v1/users/me", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    assert resp.json()["email"] == "me@example.com"


def test_change_password(client: TestClient):
    client.post(
        "/api/v1/users/register",
        json={"email": "chpwd@example.com", "password": "OldPass123"},
    )
    login_resp = client.post(
        "/api/v1/users/login",
        json={"email": "chpwd@example.com", "password": "OldPass123"},
    )
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    resp = client.post(
        "/api/v1/users/me/change-password",
        json={"old_password": "OldPass123", "new_password": "NewPass456"},
        headers=headers,
    )
    assert resp.status_code == 200

    # 新密码可以登录
    resp2 = client.post(
        "/api/v1/users/login",
        json={"email": "chpwd@example.com", "password": "NewPass456"},
    )
    assert resp2.status_code == 200
