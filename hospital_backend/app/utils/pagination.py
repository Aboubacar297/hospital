from sqlalchemy.orm import Session
from typing import Type, List, Generic, TypeVar
from pydantic import BaseModel

# Type générique pour les schémas Pydantic
T = TypeVar("T")

class PaginatedResponse(BaseModel, Generic[T]):
    total: int
    page: int
    taille_page: int
    resultats: List[T]

def paginate(db: Session, model, schema: Type[T], page: int = 1, taille_page: int = 20) -> PaginatedResponse[T]:
    """
    Fonction utilitaire pour paginer n'importe quelle requête SQLAlchemy.
    """
    if page < 1:
        page = 1
        
    # Calcul de l'offset (le point de départ)
    offset = (page - 1) * taille_page
    
    # Compter le total d'enregistrements
    total = db.query(model).count()
    
    # Récupérer les données limitées
    items = db.query(model).offset(offset).limit(taille_page).all()
    
    return PaginatedResponse(
        total=total,
        page=page,
        taille_page=taille_page,
        resultats=[schema.from_orm(item) for item in items]
    )