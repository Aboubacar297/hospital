from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload
from typing import List
from ..database import get_db
from .. import models, schemas

router = APIRouter(prefix="/audit", tags=["Audit"])

@router.get("/", response_model=List[schemas.AuditLogRead])
def get_audit_logs(db: Session = Depends(get_db)):
    # ✅ 'joinedload' fusionne la table AuditLog et User en une seule requête
    # Sans cela, le champ 'user' dans votre JSON sera 'null'
    logs = db.query(models.AuditLog).options(joinedload(models.AuditLog.user)).all()
    return logs