"""
Integration tests that exercise the full API flow against a real database.
These are intended to run inside the Docker test environment.
"""

from fastapi.testclient import TestClient
from app.core.database import Base, engine, SessionLocal
from app.main import app

client = TestClient(app)


def setup_module(module):
    Base.metadata.create_all(bind=engine)


def teardown_module(module):
    Base.metadata.drop_all(bind=engine)


def test_full_item_lifecycle():
    # Create
    r = client.post("/items/", json={"name": "Integration Item", "description": "flow test"})
    assert r.status_code == 201
    item = r.json()
    item_id = item["id"]

    # List
    r = client.get("/items/")
    assert r.status_code == 200
    assert len(r.json()) == 1

    # Read
    r = client.get(f"/items/{item_id}")
    assert r.status_code == 200
    assert r.json()["name"] == "Integration Item"

    # Update
    r = client.put(f"/items/{item_id}", json={"name": "Updated Item"})
    assert r.status_code == 200
    assert r.json()["name"] == "Updated Item"

    # Delete
    r = client.delete(f"/items/{item_id}")
    assert r.status_code == 204

    # Verify deletion
    r = client.get(f"/items/{item_id}")
    assert r.status_code == 404


def test_health_endpoint():
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}


def test_root_endpoint():
    r = client.get("/")
    assert r.status_code == 200
    assert r.json()["message"] == "Hello World"
