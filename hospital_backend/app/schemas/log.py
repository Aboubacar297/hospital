from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class SystemLogBase(BaseModel):
    niveau: str
    message: str
    ip_adresse: Optional[str] = None

# ✅ On définit uniquement SystemLogRead (celui utilisé par le router)
class SystemLogRead(SystemLogBase):
    id: int
    date_evenement: datetime

    model_config = ConfigDict(from_attributes=True)