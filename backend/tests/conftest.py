"""Pytest shared fixtures and test configuration.

This module sets up an in-memory SQLite database and overrides the FastAPI
dependency injection so that all tests run against an isolated, fresh schema.
"""

import os

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import StaticPool, create_engine
from sqlalchemy.orm import sessionmaker

# Force in-memory SQLite and a deterministic secret key for the test suite.
os.environ["DATABASE_URL"] = "sqlite:///:memory:"
os.environ["SECRET_KEY"] = "test-secret"

from app.core.database import Base, get_db  # noqa: E402
from app.main import app  # noqa: E402

# Create a single in-memory engine shared across the test process.
# `StaticPool` keeps the same connection open so SQLite :memory: survives
# across sessionmaker-created sessions.
engine = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Initialise the schema once at import time.
Base.metadata.create_all(bind=engine)


def override_get_db():
    """Yield a new SQLAlchemy session from the test engine."""
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


# Replace the production `get_db` dependency with the test variant.
app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(scope="function")
def client():
    """Return a FastAPI TestClient with a freshly reset database.

    Drops and recreates all tables before each test function to guarantee
    a clean state.
    """
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield TestClient(app)


@pytest.fixture(scope="function")
def db():
    """Return a SQLAlchemy session bound to the test database."""
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
