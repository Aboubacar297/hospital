import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getRendezvous, getPatients, getUsers } from '../services/api';
import { FiCalendar, FiPlus, FiArrowLeft, FiClock, FiUser } from 'react-icons/fi';

const Rendezvous = () => {
  const navigate = useNavigate();
  const [rdvs, setRdvs] = useState([]);
  const [patients, setPatients] = useState([]);
  const [medecins, setMedecins] = useState([]);
  const [slots, setSlots] = useState([]); 
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user')) || {};
  const userRole = user.role?.toLowerCase();
  
  // L'accueil est autorisé ici
  const canCreate = ["admin", "accueil", "reception", "secretaire"].includes(userRole) || user.is_admin_privilege;

  const [newRdv, setNewRdv] = useState({
    patient_id: '',
    medecin_id: '',
    slot_id: '', 
    motif: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  // Déclenchement automatique de la recherche de créneaux
  useEffect(() => {
    if (newRdv.medecin_id) {
      fetchSlots(newRdv.medecin_id);
    } else {
      setSlots([]);
    }
  }, [newRdv.medecin_id]);

  const fetchData = async () => {
    try {
      const [resRdv, resPatients, resUsers] = await Promise.all([
        getRendezvous(),
        getPatients(),
        getUsers()
      ]);
      setRdvs(resRdv.data);
      setPatients(resPatients.data);
      setMedecins(resUsers.data.filter(u => u.role?.toLowerCase() === 'medecin'));
    } catch (err) {
      console.error("Erreur chargement données:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSlots = async (medecinId) => {
    try {
      const res = await api.get(`/rendezvous/disponibilites/${medecinId}`);
      setSlots(res.data);
    } catch (err) {
      console.error("Erreur lors de la récupération des créneaux:", err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      // Conversion Number pour éviter l'erreur 422 de type
      const payload = {
        patient_id: Number(newRdv.patient_id),
        medecin_id: Number(newRdv.medecin_id),
        slot_id: Number(newRdv.slot_id),
        motif: newRdv.motif || "Consultation"
      };

      await api.post('/rendezvous/', payload);
      alert("Rendez-vous programmé !");
      setShowForm(false);
      setNewRdv({ patient_id: '', medecin_id: '', slot_id: '', motif: '' });
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.detail || "Erreur de validation.";
      alert(`Erreur : ${msg}`);
    }
  };

  return (
    <div className="rdv-page animate-in" style={{ padding: '20px' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
        <button className="btn-blue-outline" onClick={() => navigate(-1)}><FiArrowLeft /> Retour</button>
        <h1 className="medical-blue-text"><FiCalendar /> Planning Hospitalier</h1>
        {canCreate && (
          <button className="btn-blue-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Fermer" : <><FiPlus /> Nouveau RDV</>}
          </button>
        )}
      </div>

      {showForm && (
        <div className="form-card card shadow animate-in" style={{ padding: '25px', marginBottom: '30px', background: '#f8f9fa' }}>
          <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="input-group">
              <label>Patient</label>
              <select required value={newRdv.patient_id} onChange={e => setNewRdv({...newRdv, patient_id: e.target.value})}>
                <option value="">-- Choisir un patient --</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.nom} {p.prenom}</option>)}
              </select>
            </div>

            <div className="input-group">
              <label>Médecin</label>
              <select required value={newRdv.medecin_id} onChange={e => setNewRdv({...newRdv, medecin_id: e.target.value})}>
                <option value="">-- Choisir un médecin --</option>
                {medecins.map(m => <option key={m.id} value={m.id}>Dr. {m.nom_utilisateur}</option>)}
              </select>
            </div>

            <div className="input-group">
              <label>Heures Disponibles</label>
              <select required value={newRdv.slot_id} onChange={e => setNewRdv({...newRdv, slot_id: e.target.value})} disabled={!newRdv.medecin_id}>
                <option value="">{slots.length > 0 ? "-- Sélectionner un horaire --" : "Aucun créneau libre"}</option>
                {slots.map(s => (
                  <option key={s.id} value={s.id}>
                    {new Date(s.debut).toLocaleString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>Motif</label>
              <input type="text" placeholder="Raison de la visite" value={newRdv.motif} onChange={e => setNewRdv({...newRdv, motif: e.target.value})} />
            </div>

            <button type="submit" className="btn-blue-primary" style={{ gridColumn: 'span 2' }}>
              Enregistrer en Base de Données
            </button>
          </form>
        </div>
      )}

      <div className="table-container card shadow">
        <table className="data-table" style={{ width: '100%' }}>
          <thead>
            <tr style={{ background: '#0056b3', color: 'white' }}>
              <th>Date & Heure</th>
              <th>Patient</th>
              <th>Médecin</th>
              <th>Motif</th>
            </tr>
          </thead>
          <tbody>
            {rdvs.map(r => (
              <tr key={r.id}>
                <td><FiClock /> {new Date(r.date_heure).toLocaleString()}</td>
                <td><FiUser /> {r.patient_nom || r.patient_id}</td>
                <td>Dr. {r.medecin_nom || r.medecin_id}</td>
                <td>{r.motif}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Rendezvous;