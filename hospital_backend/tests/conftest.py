import sys, os, pytest
from starlette.testclient import TestClient

# ✅ Ajoute la racine du projet au PYTHONPATH
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app
from app.database import Base, engine, SessionLocal
import app.models as models
from datetime import datetime

@pytest.fixture(scope="session", autouse=True)
def setup_database():
    # Supprime et recrée toutes les tables avant les tests
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    #  Données initiales
    user = models.User(email="admin@example.com", hashed_password="hashed", role="admin")
    patient = models.Patient(first_name="John", last_name="Doe", dob="1980-01-01", email="john@example.com", phone="123456789")
    appointment = models.Appointment(patient_id=1, doctor_name="Dr. Smith", date_time=datetime(2026, 1, 27, 10, 0), status="scheduled")
    billing = models.Billing(patient_id=1, amount=150.0, status="unpaid")
    audit = models.AuditLog(user_id=1, action="CREATE_PATIENT", details="Patient John Doe created")

    db.add_all([user, patient, appointment, billing, audit])
    db.commit()
    db.close()

    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="module")
def client():
    return TestClient(app)
