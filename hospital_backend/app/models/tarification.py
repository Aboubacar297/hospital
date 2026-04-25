from sqlalchemy import Column, Integer, String, Float
from ..database import Base

class Tarification(Base):
    __tablename__ = "tarifications"

    id = Column(Integer, primary_key=True, index=True)
    nom_acte = Column(String, unique=True, index=True, nullable=False) # ex: "Consultation"
    code_acte = Column(String, unique=True, index=True)               # ex: "CONS-01"
    prix = Column(Float, nullable=False, default=0.0)                 # ex: 300.0