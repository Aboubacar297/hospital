from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from ..database import Base  # ✅ NE PAS OUBLIER CETTE LIGNE

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    nom_utilisateur = Column(String, unique=True, index=True)
    mot_de_passe = Column(String)
    role = Column(String) # ADMIN, MEDECIN, INFIRMIER, CAISSIER
    nom = Column(String)
    specialite = Column(String, nullable=True)

    # Relations
    rdvs = relationship("RendezVous", back_populates="medecin", cascade="all, delete-orphan")
    # ✅ On utilise lazy="joined" ici pour corriger ton problème de liste déroulante vide
    plannings = relationship("Planning", back_populates="medecin", cascade="all, delete-orphan", lazy="joined")
    audit_logs = relationship("AuditLog", back_populates="user")

    def __repr__(self):
        return f"<User {self.nom_utilisateur} - {self.role}>"