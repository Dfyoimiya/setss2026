"""
Author: K-ON! Team
文件描述: 用户系统 API 测试（适配邮件验证流程）
"""

from fastapi.testclient import TestClient

from app import models


def _register_and_activate(client: TestClient, db, email: str, password: str = "Password123"):
    """注册并直接激活账户（绕过邮件验证，用于测试）"""
    resp = client.post(
        "/api/v1/users/register",
        json={"email": email, "password": password},
    )
    assert resp.status_code == 201
    # 直接在数据库中激活账户
    user = db.query(models.User).filter(models.User.email == email).first()
    user.is_active = True
    user.email_verified = True
    db.commit()
    return user


def test_register_success(client: TestClient, db):
    resp = client.post(
        "/api/v1/users/register",
        json={"email": "test@example.com", "password": "Password123"},
    )
    assert resp.status_code == 201
    data = resp.json()
    assert "message" in data


def test_register_duplicate_email(client: TestClient, db):
    client.post(
        "/api/v1/users/register",
        json={"email": "dup@example.com", "password": "Password123"},
    )
    resp = client.post(
        "/api/v1/users/register",
        json={"email": "dup@example.com", "password": "Another123"},
    )
    assert resp.status_code == 400


def test_login_success(client: TestClient, db):
    _register_and_activate(client, db, "login@example.com", "Password123")
    resp = client.post(
        "/api/v1/users/login",
        json={"email": "login@example.com", "password": "Password123"},
    )
    assert resp.status_code == 200
    assert "access_token" in resp.json()


def test_login_wrong_password(client: TestClient, db):
    _register_and_activate(client, db, "fail@example.com", "RightPass")
    resp = client.post(
        "/api/v1/users/login",
        json={"email": "fail@example.com", "password": "WrongPass"},
    )
    assert resp.status_code == 401


def test_login_unverified_rejected(client: TestClient, db):
    client.post(
        "/api/v1/users/register",
        json={"email": "unverified@example.com", "password": "Password123"},
    )
    resp = client.post(
        "/api/v1/users/login",
        json={"email": "unverified@example.com", "password": "Password123"},
    )
    assert resp.status_code == 400


def test_get_me(client: TestClient, db):
    _register_and_activate(client, db, "me@example.com", "Password123")
    login_resp = client.post(
        "/api/v1/users/login",
        json={"email": "me@example.com", "password": "Password123"},
    )
    token = login_resp.json()["access_token"]
    resp = client.get("/api/v1/users/me", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    assert resp.json()["email"] == "me@example.com"


def test_change_password(client: TestClient, db):
    _register_and_activate(client, db, "chpwd@example.com", "OldPass123")
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

    resp2 = client.post(
        "/api/v1/users/login",
        json={"email": "chpwd@example.com", "password": "NewPass456"},
    )
    assert resp2.status_code == 200
