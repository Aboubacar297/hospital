def test_create_invoice(client):
    response = client.post("/billing/", json={
        "patient_id": 1,
        "amount": 250.0
    })
    assert response.status_code == 200
    data = response.json()
    assert data["amount"] == 250.0
    assert data["status"] == "unpaid"

def test_list_invoices(client):
    response = client.get("/billing/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0

def test_update_invoice_status(client):
    response = client.put("/billing/1?status=paid")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "paid"
