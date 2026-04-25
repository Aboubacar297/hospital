from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import database, models, schemas
from ..auth import oauth2 
from ..models.audit import AuditLog

router = APIRouter(prefix="/patients", tags=["Patients"])

@router.get("/", response_model=List[schemas.PatientRead])
def get_all_patients(db: Session = Depends(database.get_db), current_user: models.user.User = Depends(oauth2.get_current_user)):
    return db.query(models.patient.Patient).all()

@router.post("/", response_model=schemas.PatientRead)
def create_patient(patient: schemas.PatientCreate, db: Session = Depends(database.get_db), current_user: models.user.User = Depends(oauth2.get_current_user)):
    if db.query(models.patient.Patient).filter(models.patient.Patient.identifiant_unique == patient.identifiant_unique).first():
        raise HTTPException(status_code=400, detail="Identifiant unique déjà utilisé")
    
    new_patient = models.patient.Patient(**patient.model_dump())
    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)

    db.add(AuditLog(user_id=current_user.id, action="CREATE", table_visee="patients", 
                    description=f"Création du patient {new_patient.nom}"))
    db.commit()
    return new_patient

@router.get("/{id}/paiements", response_model=List[schemas.FactureRead])
def get_patient_payments(id: int, db: Session = Depends(database.get_db), current_user: models.user.User = Depends(oauth2.get_current_user)):
    return db.query(models.finance.Facture).filter(models.finance.Facture.patient_id == id).all()

# ✅ AJOUT DE LA SUPPRESSION
@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_patient(id: int, db: Session = Depends(database.get_db), current_user: models.user.User = Depends(oauth2.get_current_user)):
    if current_user.role.upper() != "ADMIN":
        raise HTTPException(status_code=403, detail="ADMIN requis")
    
    patient = db.query(models.patient.Patient).filter(models.patient.Patient.id == id).first()
    if not patient: 
        raise HTTPException(status_code=404, detail="Non trouvé")
    
    nom_sauve = patient.nom
    db.delete(patient)
    
    # Audit Log de suppression
    db.add(AuditLog(user_id=current_user.id, action="DELETE", table_visee="patients", description=f"Suppression de {nom_sauve}"))
    db.commit()
    return None