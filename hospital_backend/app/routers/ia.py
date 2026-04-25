from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from ..database import get_db
from ..services.ia_service import PredictionService

# 1. Définition du Schéma (Vérifiez bien les deux points et l'indentation)
class IAPredictionResponse(BaseModel):
    historique_7_jours: List[int] = []
    prediction_lendemain: int
    message: Optional[str] = None
    tendance: Optional[str] = None

# 2. Initialisation du Router
router = APIRouter(prefix="/ia", tags=["Intelligence Artificielle"])

# 3. La Route (La ligne 12 qui posait problème)
@router.get("/predictions", response_model=IAPredictionResponse)
def get_predictions(db: Session = Depends(get_db)):
    """
    Fournit les prédictions de flux de patients pour le Dashboard React.
    """
    return PredictionService.predire_flux_patients(db)