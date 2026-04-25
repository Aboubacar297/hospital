from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# On utilise 'get_password_hash' pour matcher l'appel dans users.py
def get_password_hash(password: str):
    return pwd_context.hash(password)

# On garde 'verify_password' pour être explicite
def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

# Compatibilité avec ton ancien code si nécessaire
def hash_password(password: str):
    return get_password_hash(password)

class Hash():
    @staticmethod
    def bcrypt(password: str):
        return get_password_hash(password)

    @staticmethod
    def verify(hashed_password, plain_password):
        return verify_password(plain_password, hashed_password)