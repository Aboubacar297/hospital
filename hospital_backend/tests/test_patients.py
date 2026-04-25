def test_create_patient(client):
    response = client.post("/patients/", json={
        "first_name": "Alice",
        "last_name": "Smith",
        "dob": "1990-05-12",
        "email": "alice@example.com",
        "phone": "987654321"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["first_name"] == "Alice"

def test_list_patients(client):
    response = client.get("/patients/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
