import React, { useState } from 'react';
import { FiPrinter, FiCheckCircle, FiX } from 'react-icons/fi';
import api from '../services/api';

const ConsultationForm = ({ rendezvous, onComplete }) => {
  const [report, setReport] = useState({ 
    diagnostic: '', 
    prescriptions: '', 
    observations: '',
    poids: '',
    tension: '',
    temperature: '' 
  });

  const handleSaveAndClose = async (e) => {
    e.preventDefault();
    try {
      // Nettoyage rigoureux des données avant envoi
      const payload = {
        diagnostic: report.diagnostic.trim(),
        prescriptions: report.prescriptions.trim() || null,
        observations: report.observations.trim(),
        // On s'assure d'envoyer soit un float, soit null (pas de string vide)
        poids: report.poids !== '' ? parseFloat(report.poids) : null,
        temperature: report.temperature !== '' ? parseFloat(report.temperature) : null,
        tension: report.tension.trim() || null,
        rendezvous_id: parseInt(rendezvous.id)
      };

      await api.post('/consultations/', payload);
      alert("Fiche de consultation enregistrée. Statut du RDV mis à jour.");

      if (onComplete) onComplete(); 
      
    } catch (err) { 
      // Log détaillé pour débugger les erreurs 422 en Master
      console.error("Détails validation FastAPI:", err.response?.data?.detail);
      alert("Erreur de validation. Vérifiez que les champs obligatoires sont remplis."); 
    }
  };

  const handlePrint = () => { window.print(); };

  return (
    <div className="consultation-module card shadow animate-in" style={{ padding: '20px', borderTop: '4px solid #0056b3' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h2 className="medical-blue-text">Examen Clinique : {rendezvous.patient_nom || "Patient"}</h2>
        <button className="btn-icon" onClick={onComplete} title="Fermer"><FiX /></button>
      </div>

      <form onSubmit={handleSaveAndClose}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '15px' }}>
          <div className="input-group">
            <label>Poids (kg)</label>
            <input type="number" step="0.1" className="form-control"
                   onChange={e => setReport({...report, poids: e.target.value})} />
          </div>
          <div className="input-group">
            <label>Tension</label>
            <input type="text" placeholder="12/8" className="form-control"
                   onChange={e => setReport({...report, tension: e.target.value})} />
          </div>
          <div className="input-group">
            <label>Temp. (°C)</label>
            <input type="number" step="0.1" className="form-control"
                   onChange={e => setReport({...report, temperature: e.target.value})} />
          </div>
        </div>

        <div className="input-group" style={{ marginBottom: '10px' }}>
          <label>Observations *</label>
          <textarea required rows="2" className="form-control"
                    onChange={(e) => setReport({...report, observations: e.target.value})} />
        </div>

        <div className="input-group" style={{ marginBottom: '10px' }}>
          <label>Diagnostic *</label>
          <textarea required rows="2" className="form-control"
                    onChange={(e) => setReport({...report, diagnostic: e.target.value})} />
        </div>
        
        <div className="input-group" style={{ marginBottom: '15px' }}>
          <label>Ordonnance</label>
          <textarea rows="3" className="form-control" style={{ border: '1px dashed #0056b3' }}
                    onChange={(e) => setReport({...report, prescriptions: e.target.value})} />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" className="btn-blue-primary" style={{ flex: 2 }}>
            <FiCheckCircle /> Valider et Terminer
          </button>
          <button type="button" className="btn-blue-outline" onClick={handlePrint}>
            <FiPrinter /> Imprimer
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConsultationForm;