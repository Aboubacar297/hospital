from sqlalchemy import create_engine, event
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./sih_database.db")

# ✅ Optimisation du moteur pour le multi-threading
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={
        "check_same_thread": False,
        "timeout": 30  # Attend 30s si la base est occupée
    }
)

# ✅ Configuration SQLite avancée
@event.listens_for(engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    
    # 1. Active les clés étrangères pour l'intégrité du DME
    cursor.execute("PRAGMA foreign_keys=ON")
    
    # 2. MODE WAL (Write-Ahead Logging) : 
    # Indispensable pour éviter "Database is locked" lors des écritures
    cursor.execute("PRAGMA journal_mode=WAL")
    
    # 3. Synchronisation normale (plus rapide, moins de verrous)
    cursor.execute("PRAGMA synchronous=NORMAL")
    
    cursor.close()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 