import random
from datetime import date, timedelta, time
from app.database import SessionLocal
from app import models

def seed_appointments():
    db = SessionLocal()
    try:
        patients = db.query(models.patient.Patient).all()
        if not patients:
            print("❌ Lancez seed.py d'abord.")
            return

        rdvs_test = []
        for i in range(15):
            p = random.choice(patients)
            d = date.today() - timedelta(days=random.randint(0, 7))
            # Utilisation de l'objet time() pour SQLAlchemy
            h = time(random.randint(9, 17), 0) 
            
            new_rdv = models.rdv.RendezVous(
                patient_id=p.id,
                date=d,
                heure=h,
                motif="Suivi IA",
                statut=random.choice(["TERMINE", "EN_ATTENTE"]),
                nom_medecin="Dr. House"
            )
            rdvs_test.append(new_rdv)

        db.add_all(rdvs_test)
        db.commit()
        print(f"✅ Succès ! {len(rdvs_test)} RDV ajoutés.")
    finally:
        db.close()

if __name__ == "__main__":
    seed_appointments()