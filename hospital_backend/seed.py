# seed.py
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app import models
import datetime

def seed_data():
    db = SessionLocal()
    try:
        # On vérifie si la table est vide pour éviter les doublons
        if db.query(models.patient.Patient).count() > 0:
            print("La base contient déjà des données. Abandon du seed.")
            return

        patients_test = [
            models.patient.Patient(
                nom="ALAOUI", prenom="Sami", telephone="0661223344", 
                sexe="M", identifiant_unique="PAT-ALA-1001", 
                date_naissance=datetime.date(1990, 5, 12)
            ),
            models.patient.Patient(
                nom="BENNANI", prenom="Sara", telephone="0661556677", 
                sexe="F", identifiant_unique="PAT-BEN-2002", 
                date_naissance=datetime.date(1985, 8, 22)
            ),
            models.patient.Patient(
                nom="CHRAIBI", prenom="Omar", telephone="0661889900", 
                sexe="M", identifiant_unique="PAT-CHR-3003", 
                date_naissance=datetime.date(1998, 12, 5)
            ),
            models.patient.Patient(
                nom="IDRISSI", prenom="Laila", telephone="0661112233", 
                sexe="F", identifiant_unique="PAT-IDR-4004", 
                date_naissance=datetime.date(1975, 3, 15)
            ),
            models.patient.Patient(
                nom="TOUIMI", prenom="Hamza", telephone="0661445566", 
                sexe="M", identifiant_unique="PAT-TOU-5005", 
                date_naissance=datetime.date(2002, 7, 30)
            )
        ]

        db.add_all(patients_test)
        db.commit()
        print(f"Succès ! {len(patients_test)} patients ont été ajoutés.")
        
    except Exception as e:
        print(f"Erreur lors du seed : {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()