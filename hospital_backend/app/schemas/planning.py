from pydantic import BaseModel
from typing import Optional

class PlanningBase(BaseModel):
    jour: str
    heure_debut: str
    heure_fin: str

class PlanningCreate(PlanningBase):
    # medecin_id est optionnel ici car on le récupère via le token (current_user)
    medecin_id: Optional[int] = None 

class PlanningRead(PlanningBase):
    id: int
    medecin_id: int

    class Config:
        from_attributes = True