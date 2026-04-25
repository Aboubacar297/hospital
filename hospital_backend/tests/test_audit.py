def test_log_action(client):
    response = client.post("/audit/", json={
        "user_id": 1,
        "action": "LOGIN",
        "details": "User logged in successfully"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["action"] == "LOGIN"
    assert "timestamp" in data

def test_list_logs(client):
    response = client.get("/audit/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
