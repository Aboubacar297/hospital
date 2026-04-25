# app/models/__init__.py
from ..database import Base  # ✅ INDISPENSABLE pour que models.Base fonctionne

from .user import User
from .patient import Patient
from .rdv import RendezVous
from .planning import Planning
from .consultation import Consultation
from .finance import Facture
from .audit import AuditLog
from .log import SystemLog
from .tarification import Tarification