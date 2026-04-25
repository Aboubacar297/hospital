from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from .. import models, schemas

router = APIRouter(prefix="/consultations", tags=["Consultations"])

@router.get("/", response_model=List[schemas.ConsultationRead])
def get_consultations(db: Session = Depends(get_db)):
    return db.query(models.Consultation).order_by(models.Consultation.date_creation.desc()).all()

@router.post("/", response_model=schemas.ConsultationRead, status_code=status.HTTP_201_CREATED)
def create_consultation(consul: schemas.ConsultationCreate, db: Session = Depends(get_db)):
    try:
        # 1. Création de la consultation
        new_c = models.Consultation(**consul.model_dump())
        db.add(new_c)
        db.flush() # Récupère l'ID de la consultation pour la facture sans valider tout de suite

        # 2. GÉNÉRATION AUTOMATIQUE DE LA FACTURE (Finances)
        # On utilise le montant_acte envoyé depuis le formulaire de consultation
        new_f = models.finance.Facture(
            montant=consul.montant_acte,
            statut_paiement="EN_ATTENTE",
            patient_id=consul.patient_id,
            rdv_id=consul.rdv_id,
            consultation_id=new_c.id
        )
        db.add(new_f)
        
        # 3. Clôture automatique du RDV
        if consul.rdv_id:
            rdv = db.query(models.RendezVous).filter(models.RendezVous.id == consul.rdv_id).first()
            if rdv:
                rdv.statut = "TERMINE"
        
        db.commit()
        db.refresh(new_c)
        return new_c

    except Exception as e:
        db.rollback()
        print(f"Erreur Sauvegarde Consultation: {str(e)}")
        raise HTTPException(status_code=500, detail="Erreur interne lors de la clôture.")

@router.get("/patient/{patient_id}", response_model=List[schemas.ConsultationRead])
def get_consultation_history_by_patient(patient_id: int, db: Session = Depends(get_db)):
    return db.query(models.Consultation).filter(models.Consultation.patient_id == patient_id).order_by(models.Consultation.date_creation.desc()).all()

@router.get("/{consultation_id}", response_model=schemas.ConsultationRead)
def get_consultation(consultation_id: int, db: Session = Depends(get_db)):
    db_consultation = db.query(models.Consultation).filter(models.Consultation.id == consultation_id).first()
    if not db_consultation:
        raise HTTPException(status_code=404, detail="Consultation non trouvée")
    return db_consultation