import time
from typing import Dict
import jwt
from decouple import config # Pour lire les variables d'environnement

# Configuration (Il est préférable de mettre ça dans un fichier .env)
JWT_SECRET = config("SECRET_KEY", default="votre_cle_secrete_tres_longue_et_safe")
JWT_ALGORITHM = config("ALGORITHM", default="HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 # Le token expire après 24h

def token_response(token: str):
    return {
        "access_token": token
    }

def signJWT(user_id: str, role: str) -> Dict[str, str]:
    """
    Génère un jeton JWT signé avec l'ID utilisateur et son rôle.
    """
    payload = {
        "user_id": user_id,
        "role": role,
        "expires": time.time() + (ACCESS_TOKEN_EXPIRE_MINUTES * 60)
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token_response(token)

def decodeJWT(token: str) -> dict:
    """
    Vérifie et décode le jeton. Retourne le payload si valide, sinon None.
    """
    try:
        decoded_token = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return decoded_token if decoded_token["expires"] >= time.time() else None
    except Exception:
        return None