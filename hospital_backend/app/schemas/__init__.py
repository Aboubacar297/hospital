# ✅ USERS (Staff & Admin)
from .user import UserCreate, UserRead, UserBase

# ✅ PATIENTS
from .patient import PatientCreate, PatientRead, PatientBase

# ✅ RENDEZ-VOUS
from .rdv import RdvCreate, RdvRead, RdvBase

# ✅ PLANNING
from .planning import PlanningCreate, PlanningRead, PlanningBase

# ✅ CONSULTATION
from .consultation import ConsultationCreate, ConsultationRead, ConsultationBase

# ✅ FINANCE
from .finance import FactureCreate, FactureRead, FactureBase

# ✅ AUDIT 
from .audit import AuditLogCreate, AuditLogRead

# ✅ LOGS SYSTÈME (Correction ici)
# On importe le nom exact défini dans log.py
from .log import SystemLogRead 

# ✅ IA & PRÉDICTIONS
# from .ia import PredictionRead