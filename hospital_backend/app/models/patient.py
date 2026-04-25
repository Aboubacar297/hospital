from sqlalchemy import Column, Integer, String, Date
from sqlalchemy.orm import relationship
import datetime
from ..database import Base 

class Patient(Base):
    __tablename__ = "patients"
    __table_args__ = {'extend_existing': True} # ✅ Protection contre les erreurs de redéfinition

    id = Column(Integer, primary_key=True, index=True)
    identifiant_unique = Column(String, unique=True, index=True)
    nom = Column(String, nullable=False)
    prenom = Column(String, nullable=False)
    telephone = Column(String, nullable=True)
    sexe = Column(String, nullable=True) # "HOMME" ou "FEMME" pour vos graphiques
    date_naissance = Column(Date, nullable=True) 
    date_inscription = Column(Date, default=datetime.date.today)

    # ✅ RELATIONS (Cœur du SIH)
    
    # Lien vers les Rendez-vous
    rdvs = relationship("RendezVous", back_populates="patient", cascade="all, delete-orphan")
    
    # Lien vers le Dossier Médical (Consultations)
    consultations = relationship("Consultation", back_populates="patient", cascade="all, delete-orphan")
    
    # Lien avec la finance (Factures)
    factures = relationship("Facture", back_populates="patient", cascade="all, delete-orphan")

    # ✅ OPTIONNEL : Lien vers les documents (si vous gérez l'archivage)
    # documents = relationship("Document", back_populates="patient")