"""Integration tests for submission and review workflow."""

from datetime import UTC, datetime, timedelta
from unittest.mock import MagicMock, patch

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models.user import User


# Patch MinIO storage for tests
@pytest.fixture(autouse=True)
def mock_storage():
    with (
        patch("app.routers.submissions.get_storage_service") as mock_sub,
        patch("app.routers.reviews.get_storage_service") as mock_rev,
        patch("app.routers.admin.submissions.get_storage_service") as mock_adm,
    ):
        mock_service = MagicMock()
        mock_sub.return_value = mock_service
        mock_rev.return_value = mock_service
        mock_adm.return_value = mock_service
        yield mock_service


def _register_user(client: TestClient, email: str, password: str = "password123") -> str:
    client.post(
        "/api/v1/users/register",
        json={"email": email, "password": password, "full_name": "Test User"},
    )
    resp = client.post(
        "/api/v1/users/login",
        json={"email": email, "password": password},
    )
    return resp.json()["data"]["access_token"]


def _get_auth_headers(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


def _create_period(client: TestClient, admin_token: str) -> str:
    now = datetime.now(UTC)
    resp = client.post(
        "/api/v1/admin/periods",
        headers=_get_auth_headers(admin_token),
        json={
            "name": "Test Period",
            "start_date": (now - timedelta(days=1)).isoformat(),
            "end_date": (now + timedelta(days=7)).isoformat(),
            "review_deadline": (now + timedelta(days=14)).isoformat(),
            "rebuttal_deadline": (now + timedelta(days=21)).isoformat(),
            "final_decision_deadline": (now + timedelta(days=28)).isoformat(),
            "reviewers_per_paper": 3,
        },
    )
    assert resp.status_code == 200, resp.text
    return resp.json()["data"]["id"]


def _activate_user(db: Session, email: str) -> None:
    user = db.query(User).filter_by(email=email).first()
    user.is_active = True
    db.commit()


def _set_role(db: Session, email: str, role: str) -> None:
    user = db.query(User).filter_by(email=email).first()
    user.role = role
    db.commit()


class TestSubmissionWorkflow:
    def test_create_submission(self, client: TestClient, db: Session, mock_storage):
        author_token = _register_user(client, "author@test.com")
        admin_token = _register_user(client, "admin@test.com")
        _activate_user(db, "author@test.com")
        _set_role(db, "admin@test.com", "admin,organizer")
        _activate_user(db, "admin@test.com")

        period_id = _create_period(client, admin_token)

        # Create submission
        resp = client.post(
            "/api/v1/submissions",
            headers=_get_auth_headers(author_token),
            json={
                "period_id": period_id,
                "title": "Test Paper",
                "abstract": "This is a test abstract.",
                "keywords": "test, paper, ai",
                "authors": [
                    {"name": "John Doe", "institution": "MIT", "email": "john@mit.edu"}
                ],
                "corresponding_author": {
                    "name": "John Doe",
                    "institution": "MIT",
                    "email": "john@mit.edu",
                },
            },
        )
        assert resp.status_code == 201
        data = resp.json()["data"]
        assert data["status"] == "draft"
        submission_id = data["id"]

        # Upload file
        mock_storage.upload_file.return_value = f"submissions/{submission_id}/v1/paper.pdf"
        resp = client.post(
            f"/api/v1/submissions/{submission_id}/files",
            headers=_get_auth_headers(author_token),
            files={"file": ("paper.pdf", b"%PDF-1.4 fake pdf content", "application/pdf")},
        )
        assert resp.status_code == 201
        assert resp.json()["data"]["file_name"] == "paper.pdf"

        # Submit
        resp = client.post(
            f"/api/v1/submissions/{submission_id}/submit",
            headers=_get_auth_headers(author_token),
        )
        assert resp.status_code == 200
        assert resp.json()["data"]["status"] == "submitted"

    def test_full_review_workflow(self, client: TestClient, db: Session, mock_storage):
        # Setup users
        author_token = _register_user(client, "author2@test.com")
        reviewer_token = _register_user(client, "reviewer@test.com")
        admin_token = _register_user(client, "admin2@test.com")

        _activate_user(db, "author2@test.com")
        _activate_user(db, "reviewer@test.com")
        _set_role(db, "reviewer@test.com", "reviewer")
        _activate_user(db, "admin2@test.com")
        _set_role(db, "admin2@test.com", "admin,organizer")

        period_id = _create_period(client, admin_token)

        # Create and submit paper
        resp = client.post(
            "/api/v1/submissions",
            headers=_get_auth_headers(author_token),
            json={
                "period_id": period_id,
                "title": "Full Workflow Paper",
                "abstract": "Abstract here",
                "keywords": "workflow",
                "authors": [
                    {"name": "Alice", "institution": "Stanford", "email": "alice@stanford.edu"}
                ],
                "corresponding_author": {
                    "name": "Alice",
                    "institution": "Stanford",
                    "email": "alice@stanford.edu",
                },
            },
        )
        submission_id = resp.json()["data"]["id"]

        mock_storage.upload_file.return_value = f"submissions/{submission_id}/v1/paper.pdf"
        client.post(
            f"/api/v1/submissions/{submission_id}/files",
            headers=_get_auth_headers(author_token),
            files={"file": ("paper.pdf", b"%PDF-1.4 fake", "application/pdf")},
        )

        client.post(
            f"/api/v1/submissions/{submission_id}/submit",
            headers=_get_auth_headers(author_token),
        )

        # Admin auto-assign reviewers
        resp = client.post(
            f"/api/v1/admin/reviews/assignments/auto?submission_id={submission_id}",
            headers=_get_auth_headers(admin_token),
        )
        assert resp.status_code == 201
        assignments = resp.json()["data"]
        assert len(assignments) == 1  # Only 1 reviewer in DB
        assignment_id = assignments[0]["id"]

        # Reviewer accepts
        resp = client.post(
            f"/api/v1/review/assignments/{assignment_id}/accept",
            headers=_get_auth_headers(reviewer_token),
        )
        assert resp.status_code == 200
        assert resp.json()["data"]["status"] == "accepted"

        # Reviewer submits review
        resp = client.post(
            f"/api/v1/review/assignments/{assignment_id}/review",
            headers=_get_auth_headers(reviewer_token),
            json={
                "overall_score": 8,
                "detailed_comments": "Good paper with minor issues.",
                "recommendation": "minor_revision",
            },
        )
        assert resp.status_code == 201
        review_id = resp.json()["data"]["id"]

        # Admin makes decision
        resp = client.post(
            f"/api/v1/admin/submissions/{submission_id}/decision",
            headers=_get_auth_headers(admin_token),
            json={"decision": "minor_revision"},
        )
        assert resp.status_code == 200
        assert resp.json()["data"]["status"] == "minor_revision"

        # Admin reveals review to author
        resp = client.post(
            f"/api/v1/admin/reviews/reviews/{review_id}/visibility",
            headers=_get_auth_headers(admin_token),
            json={"is_visible_to_author": True},
        )
        assert resp.status_code == 200
        assert resp.json()["data"]["is_visible_to_author"] is True

        # Author views submission with reviews
        resp = client.get(
            f"/api/v1/submissions/{submission_id}",
            headers=_get_auth_headers(author_token),
        )
        assert resp.status_code == 200
        reviews = resp.json()["data"]["reviews"]
        assert len(reviews) == 1
        assert reviews[0]["overall_score"] == 8
        assert "reviewer_number" in reviews[0]

        # Author submits rebuttal
        resp = client.post(
            f"/api/v1/submissions/reviews/{review_id}/rebuttal",
            headers=_get_auth_headers(author_token),
            json={"content": "Thank you for the feedback. We have addressed the issues."},
        )
        assert resp.status_code == 201
        assert resp.json()["data"]["content"] == "Thank you for the feedback. We have addressed the issues."

        # Author submits revision
        resp = client.post(
            f"/api/v1/submissions/{submission_id}/revision",
            headers=_get_auth_headers(author_token),
        )
        assert resp.status_code == 200
        assert resp.json()["data"]["status"] == "revision_submitted"

    def test_withdraw_submission(self, client: TestClient, db: Session, mock_storage):
        author_token = _register_user(client, "author3@test.com")
        _activate_user(db, "author3@test.com")

        admin_token = _register_user(client, "admin3@test.com")
        _activate_user(db, "admin3@test.com")
        _set_role(db, "admin3@test.com", "admin,organizer")

        period_id = _create_period(client, admin_token)

        resp = client.post(
            "/api/v1/submissions",
            headers=_get_auth_headers(author_token),
            json={
                "period_id": period_id,
                "title": "To Withdraw",
                "abstract": "Abstract",
                "keywords": "withdraw",
                "authors": [
                    {"name": "Bob", "institution": "CMU", "email": "bob@cmu.edu"}
                ],
                "corresponding_author": {
                    "name": "Bob",
                    "institution": "CMU",
                    "email": "bob@cmu.edu",
                },
            },
        )
        submission_id = resp.json()["data"]["id"]

        resp = client.delete(
            f"/api/v1/submissions/{submission_id}",
            headers=_get_auth_headers(author_token),
        )
        assert resp.status_code == 200
        assert resp.json()["data"]["status"] == "withdrawn"

    def test_unauthorized_access(self, client: TestClient, db: Session, mock_storage):
        user1_token = _register_user(client, "user1@test.com")
        user2_token = _register_user(client, "user2@test.com")

        _activate_user(db, "user1@test.com")
        _activate_user(db, "user2@test.com")

        admin_token = _register_user(client, "admin4@test.com")
        _activate_user(db, "admin4@test.com")
        _set_role(db, "admin4@test.com", "admin,organizer")

        period_id = _create_period(client, admin_token)

        resp = client.post(
            "/api/v1/submissions",
            headers=_get_auth_headers(user1_token),
            json={
                "period_id": period_id,
                "title": "Private Paper",
                "abstract": "Abstract",
                "keywords": "private",
                "authors": [
                    {"name": "Eve", "institution": "Berkeley", "email": "eve@berkeley.edu"}
                ],
                "corresponding_author": {
                    "name": "Eve",
                    "institution": "Berkeley",
                    "email": "eve@berkeley.edu",
                },
            },
        )
        submission_id = resp.json()["data"]["id"]

        # User2 cannot access user1's submission
        resp = client.get(
            f"/api/v1/submissions/{submission_id}",
            headers=_get_auth_headers(user2_token),
        )
        assert resp.status_code == 401
