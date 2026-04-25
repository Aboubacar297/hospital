def test_create_appointment(client):
    response = client.post("/appointments/", json={
        "patient_id": 1,
        "doctor_name": "Dr. House",
        "date_time": "2026-02-01T09:00:00"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["doctor_name"] == "Dr. House"

def test_list_appointments(client):
    response = client.get("/appointments/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
