from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import database, models, schemas, auth

router = APIRouter(prefix="/planning", tags=["Planning"])

@router.post("/", response_model=schemas.PlanningRead)
def create_planning(
    planning: schemas.PlanningCreate, 
    db: Session = Depends(database.get_db),
    current_user: models.user.User = Depends(auth.oauth2.get_current_user)
):
    # ✅ FORCE l'ID du médecin connecté pour éviter le NULL en base
    new_planning = models.planning.Planning(
        jour=planning.jour,
        heure_debut=planning.heure_debut,
        heure_fin=planning.heure_fin,
        medecin_id=current_user.id 
    )
    
    try:
        db.add(new_planning)
        
        # ✅ LOG D'AUDIT
        new_log = models.audit.AuditLog(
            user_id=current_user.id,
            action="CREATE",
            table_visee="plannings",
            description=f"Planning défini : {planning.jour} ({planning.heure_debut}-{planning.heure_fin})"
        )
        db.add(new_log)
        
        db.commit()
        db.refresh(new_planning)
        return new_planning

    except Exception as e:
        db.rollback()
        print(f"Erreur Planning: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail="Erreur lors de l'enregistrement du planning"
        )

# ✅ AJOUT D'UNE ROUTE POUR RÉCUPÉRER SON PROPRE PLANNING
@router.get("/me", response_model=List[schemas.PlanningRead])
def get_my_planning(
    db: Session = Depends(database.get_db),
    current_user: models.user.User = Depends(auth.oauth2.get_current_user)
):
    return db.query(models.planning.Planning).filter(
        models.planning.Planning.medecin_id == current_user.id
    ).all()