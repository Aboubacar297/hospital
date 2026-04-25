from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List
from ..database import get_db
from .. import models, schemas
from ..auth import oauth2 

router = APIRouter(prefix="/rendezvous", tags=["Rendez-vous"])

@router.get("/", response_model=List[schemas.rdv.RdvRead])
def get_rdvs(db: Session = Depends(get_db)):
    # ✅ On charge les relations 'patient' ET 'medecin'
    rdvs = db.query(models.rdv.RendezVous).options(
        joinedload(models.rdv.RendezVous.patient),
        joinedload(models.rdv.RendezVous.medecin)
    ).all()
    
    for r in rdvs:
        # Injection des données Patient
        if r.patient:
            r.patient_nom = r.patient.nom
            r.patient_prenom = r.patient.prenom
        
        # ✅ Injection dynamique du nom du médecin
        if r.medecin:
            r.nom_medecin = f"Dr. {r.medecin.nom}"
        else:
            r.nom_medecin = "Non assigné"
            
    return rdvs

@router.post("/", response_model=schemas.rdv.RdvRead, status_code=201)
def create_rdv(rdv: schemas.rdv.RdvCreate, db: Session = Depends(get_db)):
    patient = db.query(models.patient.Patient).filter(models.patient.Patient.id == rdv.patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient non trouvé")

    new_rdv = models.rdv.RendezVous(**rdv.model_dump())
    
    try:
        db.add(new_rdv)
        new_log = models.audit.AuditLog(
            user_id=rdv.medecin_id if rdv.medecin_id else None,
            action="CREATE",
            table_visee="rendezvous",
            description=f"RDV programmé le {rdv.date} pour le patient ID {rdv.patient_id}"
        )
        db.add(new_log)
        db.commit()
        db.refresh(new_rdv)
        return new_rdv
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{rdv_id}", response_model=schemas.rdv.RdvRead)
def update_rdv(rdv_id: int, rdv_update: schemas.rdv.RdvCreate, db: Session = Depends(get_db)):
    db_rdv = db.query(models.rdv.RendezVous).filter(models.rdv.RendezVous.id == rdv_id).first()
    if not db_rdv:
        raise HTTPException(status_code=404, detail="Rendez-vous introuvable")

    for key, value in rdv_update.model_dump().items():
        setattr(db_rdv, key, value)

    new_log = models.audit.AuditLog(
        user_id=db_rdv.medecin_id,
        action="UPDATE",
        table_visee="rendezvous",
        description=f"RDV ID {rdv_id} mis à jour (Statut: {db_rdv.statut})"
    )
    db.add(new_log)
    db.commit()
    db.refresh(db_rdv)
    return db_rdv

@router.delete("/{rdv_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_rdv(rdv_id: int, db: Session = Depends(get_db), current_user: models.user.User = Depends(oauth2.get_current_user)):
    if current_user.role.upper() != "ADMIN":
        raise HTTPException(status_code=403, detail="ADMIN requis")
        
    db_rdv = db.query(models.rdv.RendezVous).filter(models.rdv.RendezVous.id == rdv_id).first()
    if not db_rdv:
        raise HTTPException(status_code=404, detail="Rendez-vous introuvable")
    
    db.add(models.audit.AuditLog(
        user_id=current_user.id,
        action="DELETE",
        table_visee="rendezvous",
        description=f"Suppression du RDV ID {rdv_id} (Patient ID {db_rdv.patient_id})"
    ))
    
    db.delete(db_rdv)
    db.commit()
    return None