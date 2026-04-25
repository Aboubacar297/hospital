from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models.tarification import Tarification
from ..schemas.tarification import TarificationRead, TarificationCreate

router = APIRouter(prefix="/tarifications", tags=["Tarification"])

@router.get("/", response_model=List[TarificationRead])
def get_all_tarifs(db: Session = Depends(get_db)):
    return db.query(Tarification).all()

@router.post("/", response_model=TarificationRead)
def create_tarif(tarif: TarificationCreate, db: Session = Depends(get_db)):
    db_tarif = Tarification(**tarif.model_dump())
    db.add(db_tarif)
    db.commit()
    db.refresh(db_tarif)
    return db_tarif

@router.put("/{id}", response_model=TarificationRead)
def update_tarif(id: int, tarif_update: TarificationCreate, db: Session = Depends(get_db)):
    db_tarif = db.query(Tarification).filter(Tarification.id == id).first()
    if not db_tarif: raise HTTPException(status_code=404)
    for k, v in tarif_update.model_dump().items(): setattr(db_tarif, k, v)
    db.commit()
    return db_tarif

@router.delete("/{id}")
def delete_tarif(id: int, db: Session = Depends(get_db)):
    db_tarif = db.query(Tarification).filter(Tarification.id == id).first()
    db.delete(db_tarif)
    db.commit()
    return {"status": "success"}