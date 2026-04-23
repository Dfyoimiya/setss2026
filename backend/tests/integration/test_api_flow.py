"""Integration tests that exercise the full API flow.

These assertions verify that the unified response envelope is preserved
end-to-end, including the ``code``, ``message``, and ``data`` fields.
"""

from fastapi.testclient import TestClient
from app.core.database import Base, engine, SessionLocal
from app.main import app
from shared.status_codes import BizCode

client = TestClient(app)


def setup_module(module):
    Base.metadata.create_all(bind=engine)


def teardown_module(module):
    Base.metadata.drop_all(bind=engine)


def test_full_item_lifecycle():
    # Create
    r = client.post("/items/", json={"name": "Integration Item", "description": "flow test"})
    assert r.status_code == 201
    body = r.json()
    assert body["code"] == BizCode.SUCCESS
    item = body["data"]
    item_id = item["id"]

    # List
    r = client.get("/items/")
    assert r.status_code == 200
    body = r.json()
    assert body["code"] == BizCode.SUCCESS
    assert len(body["data"]) == 1

    # Read
    r = client.get(f"/items/{item_id}")
    assert r.status_code == 200
    body = r.json()
    assert body["code"] == BizCode.SUCCESS
    assert body["data"]["name"] == "Integration Item"

    # Update
    r = client.put(f"/items/{item_id}", json={"name": "Updated Item"})
    assert r.status_code == 200
    body = r.json()
    assert body["code"] == BizCode.SUCCESS
    assert body["data"]["name"] == "Updated Item"

    # Delete
    r = client.delete(f"/items/{item_id}")
    assert r.status_code == 200
    assert r.json()["code"] == BizCode.SUCCESS

    # Verify deletion
    r = client.get(f"/items/{item_id}")
    assert r.status_code == 404
    assert r.json()["code"] == BizCode.ITEM_NOT_FOUND


def test_health_endpoint():
    r = client.get("/health")
    assert r.status_code == 200
    body = r.json()
    assert body["code"] == BizCode.SUCCESS
    assert body["data"]["status"] == "ok"


def test_root_endpoint():
    r = client.get("/")
    assert r.status_code == 200
    body = r.json()
    assert body["code"] == BizCode.SUCCESS
    assert body["data"]["message"] == "Hello World"
