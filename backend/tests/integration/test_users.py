"""Integration tests for user registration, login, and profile endpoints."""

import pytest
from fastapi.testclient import TestClient


def register(client: TestClient, email="test@example.com", password="password123", **kwargs):
    return client.post("/api/v1/users/register", json={"email": email, "password": password, **kwargs})


def login(client: TestClient, email="test@example.com", password="password123"):
    return client.post("/api/v1/users/login", json={"email": email, "password": password})


class TestRegister:
    def test_register_success(self, client):
        r = register(client)
        assert r.status_code == 201
        assert "message" in r.json()

    def test_register_duplicate_email(self, client):
        register(client)
        r = register(client)
        assert r.status_code == 409

    def test_register_invalid_email(self, client):
        r = register(client, email="not-an-email")
        assert r.status_code == 422

    def test_register_short_password(self, client):
        r = register(client, password="short")
        assert r.status_code == 422

    def test_register_with_profile(self, client):
        r = register(client, full_name="Alice", institution="MIT")
        assert r.status_code == 201


class TestLogin:
    def test_login_success(self, client):
        register(client)
        r = login(client)
        assert r.status_code == 200
        data = r.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

    def test_login_wrong_password(self, client):
        register(client)
        r = login(client, password="wrongpassword")
        assert r.status_code == 401

    def test_login_unknown_email(self, client):
        r = login(client, email="nobody@example.com")
        assert r.status_code == 401


class TestMe:
    def _auth_headers(self, client):
        register(client)
        token = login(client).json()["access_token"]
        return {"Authorization": f"Bearer {token}"}

    def test_get_me(self, client):
        headers = self._auth_headers(client)
        r = client.get("/api/v1/users/me", headers=headers)
        assert r.status_code == 200
        data = r.json()
        assert data["email"] == "test@example.com"
        assert data["role"] == "participant"
        assert data["is_active"] is True

    def test_get_me_unauthenticated(self, client):
        r = client.get("/api/v1/users/me")
        assert r.status_code == 401

    def test_update_me(self, client):
        headers = self._auth_headers(client)
        r = client.patch(
            "/api/v1/users/me",
            json={"full_name": "Alice", "institution": "MIT"},
            headers=headers,
        )
        assert r.status_code == 200
        data = r.json()
        assert data["full_name"] == "Alice"
        assert data["institution"] == "MIT"

    def test_change_password(self, client):
        headers = self._auth_headers(client)
        r = client.post(
            "/api/v1/users/me/change-password",
            json={"old_password": "password123", "new_password": "newpassword456"},
            headers=headers,
        )
        assert r.status_code == 200
        # Old password should no longer work
        r2 = login(client, password="password123")
        assert r2.status_code == 401
        # New password should work
        r3 = login(client, password="newpassword456")
        assert r3.status_code == 200

    def test_change_password_wrong_old(self, client):
        headers = self._auth_headers(client)
        r = client.post(
            "/api/v1/users/me/change-password",
            json={"old_password": "wrongpassword", "new_password": "newpassword456"},
            headers=headers,
        )
        assert r.status_code == 400


class TestPasswordReset:
    def test_forgot_password_always_200(self, client):
        # Should return 200 even for unknown email (prevent enumeration)
        r = client.post("/api/v1/users/forgot-password", json={"email": "nobody@example.com"})
        assert r.status_code == 200

    def test_reset_password_invalid_token(self, client):
        r = client.post(
            "/api/v1/users/reset-password",
            json={"token": "invalid-token", "new_password": "newpassword456"},
        )
        assert r.status_code == 400
