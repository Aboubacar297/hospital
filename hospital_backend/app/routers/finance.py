from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date
from typing import List
from ..database import get_db
from .. import models, schemas

router = APIRouter(prefix="/factures", tags=["Finance"])

@router.get("/", response_model=List[schemas.FactureRead])
def get_factures(db: Session = Depends(get_db)):
    return db.query(models.finance.Facture).order_by(models.finance.Facture.id.desc()).all()

# ✅ ROUTE GÉNÉRATION DE REÇU PERSONNALISÉ
@router.get("/{facture_id}/recu", response_class=HTMLResponse)
def generer_recu(facture_id: int, db: Session = Depends(get_db)):
    facture = db.query(models.finance.Facture).filter(models.finance.Facture.id == facture_id).first()
    if not facture:
        raise HTTPException(status_code=404, detail="Facture non trouvée")
    
    patient = db.query(models.Patient).filter(models.Patient.id == facture.patient_id).first()
    
    # --- CONFIGURATION CLINIQUE ---
    CLINIQUE_NOM = "CLINIQUE MÉDICALE EL AMAL"
    CLINIQUE_ADRESSE = "123 Avenue de la Liberté, Casablanca"
    CLINIQUE_TEL = "+212 5 22 00 00 00"
    CLINIQUE_ICE = "001234567890001"

    html_content = f"""
    <html>
        <head>
            <title>Recu_Facture_{facture.id}</title>
            <style>
                body {{ font-family: 'Segoe UI', sans-serif; padding: 20px; background: #f1f5f9; }}
                .page {{ background: white; max-width: 700px; margin: auto; padding: 40px; border-radius: 12px; border-top: 10px solid #4f46e5; box-shadow: 0 10px 15px rgba(0,0,0,0.1); }}
                .header {{ display: flex; justify-content: space-between; border-bottom: 2px solid #f1f5f9; padding-bottom: 20px; }}
                .clinic-name {{ font-size: 22px; font-weight: 900; color: #4f46e5; margin: 0; }}
                .receipt-title {{ text-align: right; }}
                .grid {{ display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin: 30px 0; }}
                .label {{ font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: 800; }}
                .value {{ font-size: 14px; font-weight: 600; color: #1e293b; }}
                .table-box {{ width: 100%; border-collapse: collapse; margin: 20px 0; }}
                .table-box th {{ background: #f8fafc; text-align: left; padding: 12px; font-size: 11px; }}
                .table-box td {{ padding: 15px 12px; border-bottom: 1px solid #f1f5f9; }}
                .total-box {{ background: #4f46e5; color: white; padding: 20px; border-radius: 12px; text-align: right; margin-top: 20px; }}
                .footer {{ margin-top: 50px; text-align: center; font-size: 10px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 20px; }}
                @media print {{ body {{ background: white; padding: 0; }} .page {{ box-shadow: none; border: 1px solid #eee; }} }}
            </style>
        </head>
        <body onload="window.print()">
            <div class="page">
                <div class="header">
                    <div>
                        <p class="clinic-name">✚ {CLINIQUE_NOM}</p>
                        <p style="font-size:11px; color:#64748b;">{CLINIQUE_ADRESSE}<br/>Tél: {CLINIQUE_TEL}</p>
                    </div>
                    <div class="receipt-title">
                        <h2 style="margin:0; font-size:18px;">REÇU DE PAIEMENT</h2>
                        <p style="color:#4f46e5; font-weight:800;">N° FAC-{facture.id:05d}</p>
                    </div>
                </div>
                <div class="grid">
                    <div>
                        <p class="label">Patient</p>
                        <p class="value">{patient.nom.upper() if patient else 'N/A'} {patient.prenom if patient else ''}</p>
                    </div>
                    <div style="text-align:right">
                        <p class="label">Date de paiement</p>
                        <p class="value">{date.today().strftime('%d/%m/%Y')}</p>
                    </div>
                </div>
                <table class="table-box">
                    <thead><tr><th>DESCRIPTION</th><th style="text-align:right">MONTANT</th></tr></thead>
                    <tbody>
                        <tr><td>Prestations de soins médicaux</td><td style="text-align:right; font-weight:700;">{facture.montant:.2f} DH</td></tr>
                    </tbody>
                </table>
                <div class="total-box">
                    <p style="margin:0; font-size:11px; opacity:0.8;">TOTAL RÉGLÉ</p>
                    <p style="margin:0; font-size:28px; font-weight:900;">{facture.montant:.2f} DH</p>
                </div>
                <div class="footer">
                    <p>ICE: {CLINIQUE_ICE} — Identifiant Fiscal: 12345678</p>
                    <p>Merci de votre confiance.</p>
                </div>
            </div>
        </body>
    </html>
    """
    return HTMLResponse(content=html_content)

@router.post("/", response_model=schemas.FactureRead)
def create_facture(facture: schemas.FactureCreate, db: Session = Depends(get_db)):
    new_facture = models.finance.Facture(**facture.model_dump())
    db.add(new_facture)
    if facture.rdv_id:
        rdv = db.query(models.RendezVous).filter(models.RendezVous.id == facture.rdv_id).first()
        if rdv: rdv.statut = "TERMINE"
    db.commit()
    db.refresh(new_facture)
    return new_facture

@router.put("/{facture_id}", response_model=schemas.FactureRead)
def update_facture(facture_id: int, facture_update: schemas.FactureCreate, db: Session = Depends(get_db)):
    db_f = db.query(models.finance.Facture).filter(models.finance.Facture.id == facture_id).first()
    if not db_f: raise HTTPException(status_code=404, detail="Facture non trouvée")
    for key, value in facture_update.model_dump().items():
        setattr(db_f, key, value)
    db.commit()
    db.refresh(db_f)
    return db_f