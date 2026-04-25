from app.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.patient import Patient
from app.models.tarification import Tarification
from app.auth.oauth2 import pwd_context
from datetime import date # ✅ INDISPENSABLE pour SQLite

def seed_hospital_data():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    try:
        # --- 1. PEUPLEMENT DU STAFF ---
        if not db.query(User).filter(User.nom_utilisateur == "admin.hosp").first():
            db.add(User(
                nom_utilisateur="admin.hosp",
                nom="Admin AI CURA",
                role="ADMIN",
                specialite="Management",
                mot_de_passe=pwd_context.hash("admin123")
            ))
            
        if not db.query(User).filter(User.nom_utilisateur == "dr.amine").first():
            db.add(User(
                nom_utilisateur="dr.amine",
                nom="Dr. Amine Alami",
                role="MEDECIN",
                specialite="Cardiologie",
                mot_de_passe=pwd_context.hash("medecin123")
            ))

        # --- 2. PEUPLEMENT DU CATALOGUE DES TARIFS ---
        actes_initiaux = [
            {"nom": "Consultation Générale", "code": "CONS-GEN", "prix": 300.0},
            {"nom": "Consultation Spécialisée", "code": "CONS-SPEC", "prix": 500.0},
            {"nom": "Radio Thorax", "code": "RAD-THO", "prix": 450.0},
            {"nom": "Analyse Glycémie", "code": "LAB-GLY", "prix": 150.0}
        ]

        for acte in actes_initiaux:
            if not db.query(Tarification).filter(Tarification.nom_acte == acte["nom"]).first():
                db.add(Tarification(nom_acte=acte["nom"], code_acte=acte["code"], prix=acte["prix"]))

        # --- 3. PEUPLEMENT DES PATIENTS (Correction des Dates) ---
        if db.query(Patient).count() == 0:
            patients_test = [
                Patient(
                    nom="BENANI", 
                    prenom="Mehdi", 
                    identifiant_unique="P-1000", 
                    sexe="Masculin", 
                    telephone="0611223344", 
                    # ✅ On utilise date.fromisoformat pour convertir le texte en objet date
                    date_naissance=date.fromisoformat("1985-05-12") 
                ),
                Patient(
                    nom="IDRISSI", 
                    prenom="Sara", 
                    identifiant_unique="P-2000", 
                    sexe="Féminin", 
                    telephone="0655667788", 
                    date_naissance=date.fromisoformat("1992-11-20")
                )
            ]
            db.add_all(patients_test)

        db.commit()
        print("\n✅ SUCCÈS : Base de données initialisée proprement !")
        print("🚀 Tu peux maintenant te connecter avec admin.hosp / admin123")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Erreur : {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_hospital_data()