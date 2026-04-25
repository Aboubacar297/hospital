from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from ..database import Base
import datetime

class Facture(Base):
    __tablename__ = "factures" # ✅ Nom exact de ta table en BDD

    id = Column(Integer, primary_key=True, index=True)
    montant = Column(Float, default=0.0) # ✅ Doit être 'montant'
    statut_paiement = Column(String, default="EN_ATTENTE")
    mode_paiement = Column(String, nullable=True)
    date_paiement = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Clés étrangères
    patient_id = Column(Integer, ForeignKey("patients.id"))
    rdv_id = Column(Integer, ForeignKey("rendezvous.id"))
    consultation_id = Column(Integer, ForeignKey("consultations.id"), nullable=True)

    # Relations
    patient = relationship("Patient", back_populates="factures")
    rdv = relationship("RendezVous")