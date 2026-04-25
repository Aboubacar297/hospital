from pydantic import BaseModel
from datetime import date
from typing import Optional

class PatientBase(BaseModel):
    nom: str
    prenom: str
    telephone: str
    sexe: str
    identifiant_unique: str
    # AJOUTE CETTE LIGNE :
    date_naissance: date  

class PatientCreate(PatientBase):
    pass

class PatientRead(PatientBase):
    id: int
    date_inscription: date

    class Config:
        from_attributes = True