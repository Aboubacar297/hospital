from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ConsultationBase(BaseModel):
    diagnostic: str
    prescriptions: Optional[str] = None 
    notes_medicales: Optional[str] = None
    patient_id: int
    medecin_id: int 
    rdv_id: Optional[int] = None # ✅ Indispensable pour la liaison
    montant_acte: float = 0.0    # ✅ Reçu du frontend

class ConsultationCreate(ConsultationBase):
    pass

class ConsultationRead(ConsultationBase):
    id: int
    date_creation: datetime

    class Config:
        from_attributes = True