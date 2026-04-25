# init_admin.py
from app.database import SessionLocal, engine, Base
from app.models.utilisateur import Utilisateur
from app.auth.hashing import Hash

def init_db():
    # 1. Crée les tables selon les derniers modèles (avec 'telephone', etc.)
    print("Création des tables...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # 2. Vérifie si l'admin existe déjà
        admin_email = "admin@aicura"
        existing_admin = db.query(Utilisateur).filter(Utilisateur.email == admin_email).first()

        if not existing_admin:
            print(f"Création du compte administrateur : {admin_email}")
            new_admin = Utilisateur(
                nom_utilisateur="Administrateur Système",
                email=admin_email,
                mot_de_passe_hache=Hash.bcrypt("admin123"), # Change le mot de passe ici
                role="admin" # Assure-toi que cela correspond à ton Enum/String
            )
            db.add(new_admin)
            db.commit()
            print("Admin créé avec succès !")
        else:
            print("L'administrateur existe déjà.")
    except Exception as e:
        print(f"Erreur : {e}")
    finally:
        db.close()

if __name__ == "__main__":
    init_db()