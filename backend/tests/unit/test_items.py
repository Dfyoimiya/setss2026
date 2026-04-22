def test_list_items_empty(client):
    response = client.get("/items/")
    assert response.status_code == 200
    assert response.json() == []


def test_create_item(client):
    payload = {"name": "Test Item", "description": "A test description"}
    response = client.post("/items/", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test Item"
    assert data["description"] == "A test description"
    assert "id" in data


def test_get_item(client):
    create_resp = client.post("/items/", json={"name": "Get Me"})
    item_id = create_resp.json()["id"]
    response = client.get(f"/items/{item_id}")
    assert response.status_code == 200
    assert response.json()["name"] == "Get Me"


def test_get_item_not_found(client):
    response = client.get("/items/999")
    assert response.status_code == 404


def test_update_item(client):
    create_resp = client.post("/items/", json={"name": "Old Name"})
    item_id = create_resp.json()["id"]
    response = client.put(f"/items/{item_id}", json={"name": "New Name"})
    assert response.status_code == 200
    assert response.json()["name"] == "New Name"


def test_update_item_not_found(client):
    response = client.put("/items/999", json={"name": "New Name"})
    assert response.status_code == 404


def test_delete_item(client):
    create_resp = client.post("/items/", json={"name": "Delete Me"})
    item_id = create_resp.json()["id"]
    response = client.delete(f"/items/{item_id}")
    assert response.status_code == 204
    assert client.get(f"/items/{item_id}").status_code == 404


def test_delete_item_not_found(client):
    response = client.delete("/items/999")
    assert response.status_code == 404
