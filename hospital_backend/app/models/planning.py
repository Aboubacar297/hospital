from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base

class Planning(Base):
    __tablename__ = "plannings"
    
    id = Column(Integer, primary_key=True, index=True)
    jour = Column(String, nullable=False) # Lundi, Mardi...
    heure_debut = Column(String, nullable=False) # 08:00
    heure_fin = Column(String, nullable=False) # 12:00
    medecin_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Relation vers l'utilisateur (Médecin)
    medecin = relationship("User", back_populates="plannings")