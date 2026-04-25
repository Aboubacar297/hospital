# app/routers/__init__.py

from .users import router as users
from .patients import router as patients
from .rendezvous import router as rendezvous
from .planning import router as planning
from .consultations import router as consultations  # ✅ Mis au pluriel pour correspondre au fichier
from .finance import router as finance
from .audit import router as audit
from .logs import router as logs
from .ia import router as ia
from .logs import router as logs