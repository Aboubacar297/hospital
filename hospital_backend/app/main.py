from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from .database import engine
from . import models 

# 1. IMPORTATION
from .routers.users import router as users
from .routers.patients import router as patients
from .routers.rendezvous import router as rendezvous
from .routers.ia import router as ia
from .routers.consultations import router as consultations
from .routers.audit import router as audit
from .routers.planning import router as planning
from .routers.tarification import router as tarification
from .routers.finance import router as finance
# ✅ AJOUT DU ROUTER DE LOGS
from .routers.logs import router as logs 

# 2. CRÉATION APP
app = FastAPI(title="AI CURA CORE v2.0", version="2.0.0")

# 3. MIDDLEWARE
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. BDD
models.Base.metadata.create_all(bind=engine)

# 5. ROUTERS
app.include_router(users)
app.include_router(patients)
app.include_router(rendezvous)
app.include_router(ia)
app.include_router(consultations) 
app.include_router(audit)
app.include_router(planning)
app.include_router(tarification)
app.include_router(finance)
# ✅ INCLUSION DU ROUTER DE LOGS
app.include_router(logs)

@app.get("/")
def root(): 
    return RedirectResponse(url="/docs")