from app.database import SessionLocal, engine, Base
from app.models.utilisateur import Utilisateur, RoleEnum
from app.auth.hashing import Hash

def init_admin():
    db = SessionLocal()
    # Vérifier si l'admin existe déjà
    admin = db.query(Utilisateur).filter(Utilisateur.email == "admin@hospital.com").first()
    
    if not admin:
        new_admin = Utilisateur(
            nom_utilisateur="Administrateur",
            email="admin@hospital.com",
            mot_de_passe_hache=Hash.bcrypt("admin123"), # TON MOT DE PASSE
            role=RoleEnum.ADMIN
        )
        db.add(new_admin)
        db.commit()
        print("Compte Admin créé : admin@hospital.com / admin123")
    else:
        print("Le compte Admin existe déjà.")
    db.close()

if __name__ == "__main__":
    init_admin()