from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

# ✅ FactureBase
class FactureBase(BaseModel):
    montant: float
    statut_paiement: str = "EN_ATTENTE"
    mode_paiement: Optional[str] = "ESPECES"
    patient_id: int
    rdv_id: int
    consultation_id: Optional[int] = None

# ✅ FactureCreate (C'est celle-ci qui manquait)
class FactureCreate(FactureBase):
    pass

# ✅ FactureRead
class FactureRead(FactureBase):
    id: int
    date_paiement: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)