from sqlalchemy import Column, Integer, Text, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from ..database import Base 
import datetime

class Consultation(Base):
    __tablename__ = "consultations"
    
    id = Column(Integer, primary_key=True, index=True)
    diagnostic = Column(Text)
    prescriptions = Column(Text)
    notes_medicales = Column(Text, nullable=True)
    date_creation = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Suivi financier
    montant_acte = Column(Float, default=0.0)

    # ✅ CLÉS ÉTRANGÈRES
    patient_id = Column(Integer, ForeignKey("patients.id"))
    rdv_id = Column(Integer, ForeignKey("rendezvous.id"), nullable=True)
    medecin_id = Column(Integer, ForeignKey("users.id"), nullable=False) 

    # ✅ RELATIONS
    # Assurez-vous que le modèle Patient a : consultations = relationship("Consultation", back_populates="patient")
    patient = relationship("Patient", back_populates="consultations")
    
    # Liaison vers le RDV
    rdv = relationship("RendezVous", back_populates="consultation")
    
    # Liaison vers le médecin (User)
    medecin = relationship("User")