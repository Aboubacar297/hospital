from sqlalchemy import Column, Integer, String, DateTime, Text
from ..database import Base # Mise à jour
import datetime

class SystemLog(Base):
    __tablename__ = "system_logs"
    id = Column(Integer, primary_key=True)
    niveau = Column(String) # INFO, WARNING, ERROR
    message = Column(Text)
    ip_adresse = Column(String, nullable=True)
    date_evenement = Column(DateTime, default=datetime.datetime.utcnow)