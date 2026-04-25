from pydantic import BaseModel
from typing import Optional, List
from .planning import PlanningRead # ✅ Importation du schéma Planning

class UserBase(BaseModel):
    nom_utilisateur: str
    role: str
    nom: str
    specialite: Optional[str] = None

class UserCreate(UserBase):
    mot_de_passe: str

class UserRead(UserBase):
    id: int
    # ✅ INDISPENSABLE : Pour que le JSON envoyé au React contienne les disponibilités
    # On initialise avec une liste vide pour éviter les erreurs "null"
    plannings: List[PlanningRead] = [] 

    class Config:
        from_attributes = True