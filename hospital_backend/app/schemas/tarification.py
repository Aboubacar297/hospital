from pydantic import BaseModel
from typing import Optional

class TarificationBase(BaseModel):
    nom_acte: str
    code_acte: Optional[str] = None
    prix: float

class TarificationCreate(TarificationBase):
    pass

class TarificationRead(TarificationBase):
    id: int

    class Config:
        from_attributes = True