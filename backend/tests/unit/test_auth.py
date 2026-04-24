"""Unit tests for auth utilities (password hashing, JWT, role checks)."""

from jose import jwt

from app.auth import (
    create_access_token,
    get_password_hash,
    has_role,
    verify_password,
)
from app.core.config import settings


class TestPasswordHashing:
    def test_hash_and_verify(self):
        hashed = get_password_hash("secret123")
        assert verify_password("secret123", hashed)

    def test_wrong_password_fails(self):
        hashed = get_password_hash("secret123")
        assert not verify_password("wrong", hashed)

    def test_hashes_are_unique(self):
        assert get_password_hash("same") != get_password_hash("same")


class TestJWT:
    def test_create_and_decode(self):
        token = create_access_token({"sub": "user-id-123"})
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        assert payload["sub"] == "user-id-123"

    def test_token_contains_expiry(self):
        token = create_access_token({"sub": "abc"})
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        assert "exp" in payload


class TestHasRole:
    def test_single_role_match(self, mocker=None):
        user = type("User", (), {"role": "participant"})()
        assert has_role(user, "participant")

    def test_multi_role_match(self):
        user = type("User", (), {"role": "participant,admin"})()
        assert has_role(user, "admin")
        assert has_role(user, "participant")

    def test_role_not_present(self):
        user = type("User", (), {"role": "participant"})()
        assert not has_role(user, "admin")
