from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base
import datetime

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True)
    action = Column(String) 
    table_visee = Column(String) 
    description = Column(Text) 
    date_action = Column(DateTime, default=datetime.datetime.utcnow)
    
    user_id = Column(Integer, ForeignKey("users.id"))
    
    # ✅ Indispensable pour que FastAPI puisse inclure l'objet User dans le JSON
    user = relationship("User", back_populates="audit_logs")