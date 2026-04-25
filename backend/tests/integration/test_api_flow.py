"""Integration tests that exercise the full API flow."""

from app.core.status_codes import BizCode


def test_full_item_lifecycle(client):
    r = client.post("/items/", json={"name": "Integration Item", "description": "flow test"})
    assert r.status_code == 201
    body = r.json()
    assert body["code"] == BizCode.SUCCESS
    item_id = body["data"]["id"]

    r = client.get("/items/")
    assert r.status_code == 200
    assert r.json()["code"] == BizCode.SUCCESS
    assert len(r.json()["data"]) == 1

    r = client.get(f"/items/{item_id}")
    assert r.status_code == 200
    assert r.json()["data"]["name"] == "Integration Item"

    r = client.put(f"/items/{item_id}", json={"name": "Updated Item"})
    assert r.status_code == 200
    assert r.json()["data"]["name"] == "Updated Item"

    r = client.delete(f"/items/{item_id}")
    assert r.status_code == 200
    assert r.json()["code"] == BizCode.SUCCESS

    r = client.get(f"/items/{item_id}")
    assert r.status_code == 404
    assert r.json()["code"] == BizCode.ITEM_NOT_FOUND


def test_health_endpoint(client):
    r = client.get("/health")
    assert r.status_code == 200
    body = r.json()
    assert body["code"] == BizCode.SUCCESS
    assert body["data"]["status"] == "ok"


def test_root_endpoint(client):
    r = client.get("/")
    assert r.status_code == 200
    body = r.json()
    assert body["code"] == BizCode.SUCCESS
    assert body["data"]["message"] == "Hello World"
