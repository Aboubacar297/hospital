from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from .. import models, schemas
from ..auth import oauth2 # Assurez-vous d'avoir l'authentification

router = APIRouter(prefix="/system-logs", tags=["Système"])

@router.get("/", response_model=List[schemas.SystemLogRead])
def get_logs(db: Session = Depends(get_db)):
    return db.query(models.log.SystemLog).order_by(models.log.SystemLog.date_evenement.desc()).limit(100).all()

# ✅ NOUVELLE ROUTE : VIDER LES LOGS
@router.delete("/clear", status_code=status.HTTP_204_NO_CONTENT)
def clear_system_logs(
    db: Session = Depends(get_db), 
    current_user: models.user.User = Depends(oauth2.get_current_user)
):
    # Sécurité : Seul l'ADMIN peut vider les logs système
    if current_user.role.upper() != "ADMIN":
        raise HTTPException(status_code=403, detail="Droits insuffisants pour vider les logs.")
    
    try:
        db.query(models.log.SystemLog).delete()
        db.commit()
        return None
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Erreur lors du nettoyage : {str(e)}")