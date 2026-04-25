from pydantic import BaseModel, ConfigDict
from datetime import date, time
from typing import Optional

# ✅ Classe de base
class RdvBase(BaseModel):
    date: date
    heure: time
    motif: Optional[str] = "Consultation"
    statut: str = "EN_ATTENTE"
    patient_id: int
    medecin_id: Optional[int] = None
    tarif_id: Optional[int] = None
    montant: float = 0.0
    planning_selectionne: Optional[int] = None

# ✅ Classe pour la création
class RdvCreate(RdvBase):
    pass

# ✅ Classe pour la lecture (Réponse API)
class RdvRead(RdvBase):
    id: int
    patient_nom: Optional[str] = None
    patient_prenom: Optional[str] = None
    # ✅ AJOUT CRITIQUE POUR REACT
    nom_medecin: Optional[str] = None 

    model_config = ConfigDict(from_attributes=True)