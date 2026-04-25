from sqlalchemy import Column, Integer, String, ForeignKey, Date, Time, Float
from sqlalchemy.orm import relationship
from ..database import Base 

class RendezVous(Base):
    __tablename__ = "rendezvous" 
    
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date)
    heure = Column(Time)
    motif = Column(String, nullable=True)
    statut = Column(String, default="EN_ATTENTE") 
    nom_medecin = Column(String, nullable=True)
    montant = Column(Float, default=0.0) 
    
    tarif_id = Column(Integer, ForeignKey("tarifications.id"), nullable=True)
    planning_selectionne = Column(Integer, ForeignKey("plannings.id"), nullable=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    medecin_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    # ✅ RELATIONS
    patient = relationship("Patient", back_populates="rdvs")
    medecin = relationship("User", back_populates="rdvs")
    
    # ✅ CORRECTION CRITIQUE : Cette ligne résout l'erreur InvalidRequestError
    # uselist=False car un RDV n'a qu'UNE seule consultation
    consultation = relationship("Consultation", back_populates="rdv", uselist=False)

    # Optionnel : Liens vers tarification et planning
    tarif = relationship("Tarification")
    planning = relationship("Planning")