from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session, joinedload 
from typing import List

from .. import database, models, schemas
from ..auth import oauth2 

router = APIRouter(prefix="/users", tags=['Utilisateurs'])

# --- 1. CONNEXION (LOGIN) ---
@router.post('/login')
def login(request: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    user = db.query(models.user.User).filter(
        models.user.User.nom_utilisateur == request.username
    ).first()
    
    if not user or not oauth2.verify_password(request.password, user.mot_de_passe):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Identifiants incorrects")

    access_token = oauth2.create_access_token(data={"sub": user.nom_utilisateur})
    
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "user": {
            "id": user.id,
            "nom_utilisateur": user.nom_utilisateur,
            "role": user.role,
            "nom": user.nom
        }
    }

# --- 2. LISTER (CRITIQUE POUR LES RDV) ---
@router.get('/', response_model=List[schemas.UserRead])
def all_users(
    db: Session = Depends(database.get_db), 
    current_user: models.user.User = Depends(oauth2.get_current_user)
):
    # ✅ Le joinedload permet au frontend de recevoir "user.plannings" immédiatement
    return db.query(models.user.User).options(joinedload(models.user.User.plannings)).all()

# --- 3. CRÉER (ADMIN) ---
@router.post('/', response_model=schemas.UserRead, status_code=status.HTTP_201_CREATED)
def create_user(
    request: schemas.UserCreate, 
    db: Session = Depends(database.get_db),
    current_user: models.user.User = Depends(oauth2.get_current_user)
):
    if current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Accès réservé aux administrateurs")

    existing_user = db.query(models.user.User).filter(models.user.User.nom_utilisateur == request.nom_utilisateur).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Ce nom d'utilisateur existe déjà.")

    new_user = models.user.User(
        nom_utilisateur=request.nom_utilisateur,
        nom=request.nom,
        role=request.role.upper(),
        specialite=request.specialite,
        mot_de_passe=oauth2.get_password_hash(request.mot_de_passe) 
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# --- 4. MODIFIER (ADMIN) ---
@router.put('/{user_id}', response_model=schemas.UserRead)
def update_user(
    user_id: int, 
    request: schemas.UserCreate, 
    db: Session = Depends(database.get_db),
    current_user: models.user.User = Depends(oauth2.get_current_user)
):
    if current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Action non autorisée")

    db_user = db.query(models.user.User).filter(models.user.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")

    db_user.nom = request.nom
    db_user.nom_utilisateur = request.nom_utilisateur
    db_user.role = request.role.upper()
    db_user.specialite = request.specialite

    if request.mot_de_passe and request.mot_de_passe.strip() != "":
        db_user.mot_de_passe = oauth2.get_password_hash(request.mot_de_passe)

    db.commit()
    db.refresh(db_user)
    return db_user

# --- 5. SUPPRIMER ---
@router.delete('/{user_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: int, 
    db: Session = Depends(database.get_db),
    current_user: models.user.User = Depends(oauth2.get_current_user)
):
    if current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Action réservée à l'administrateur")

    db_user = db.query(models.user.User).filter(models.user.User.id == user_id).first()
    if not db_user: raise HTTPException(status_code=404, detail="Utilisateur introuvable")
    
    db.delete(db_user)
    db.commit()
    return None