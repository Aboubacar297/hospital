from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from .user import UserRead 

class AuditLogBase(BaseModel):
    action: str
    table_visee: str
    description: str

class AuditLogCreate(AuditLogBase):
    user_id: int

class AuditLogRead(AuditLogBase):
    id: int
    date_action: datetime
    user_id: int
    # ✅ C'est ce champ que React utilise : log.user.nom_utilisateur
    user: Optional[UserRead] = None 

    class Config:
        from_attributes = True