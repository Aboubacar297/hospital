import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPatients } from '../services/api';
import PatientForm from '../components/PatientForm';
import { FiPlus, FiArrowLeft, FiUser } from 'react-icons/fi';

const Patients = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // RÉCUPÉRATION ET DROITS D'ACCÈS
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const userRole = user.role?.toLowerCase();
  
  // Correction : L'accueil peut maintenant aussi gérer/ajouter des patients
  const canManage = userRole === 'admin' || userRole === 'accueil' || userRole === 'reception' || user.is_admin_privilege;

  const fetchPatients = async () => {
    try {
      const res = await getPatients();
      setPatients(res.data);
    } catch (err) { 
      console.error("Erreur lors de la récupération des patients:", err); 
    }
  };

  useEffect(() => { 
    fetchPatients(); 
  }, []);

  return (
    <div className="patients-page animate-in">
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '25px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {/* Bouton Retour */}
          <button className="btn-blue-outline" onClick={() => navigate(-1)}>
            <FiArrowLeft /> Retour
          </button>
          <h1 className="medical-blue-text" style={{ margin: 0 }}>Gestion des Dossiers Patients</h1>
        </div>
        
        {/* Bouton Ajouter visible pour Admin ET Accueil */}
        {canManage && (
          <button className="btn-blue-primary" onClick={() => setShowForm(!showForm)}>
            <FiPlus /> {showForm ? "Annuler" : "Inscrire un Patient"}
          </button>
        )}
      </div>

      {/* Formulaire d'inscription (visible si activé) */}
      {showForm && canManage && (
        <div className="form-card card shadow animate-in" style={{ marginBottom: '30px', padding: '20px' }}>
          <h2 className="medical-blue-text" style={{ fontSize: '1.2rem', marginBottom: '15px' }}>Nouvelle Admission</h2>
          <PatientForm onSave={() => { setShowForm(false); fetchPatients(); }} />
        </div>
      )}

      {/* Liste des Patients */}
      <div className="table-container card shadow">
        <table className="data-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Maladie / Motif</th>
              <th>Statut</th>
              <th>Date d'Entrée</th>
            </tr>
          </thead>
          <tbody>
            {patients.length > 0 ? (
              patients.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <FiUser className="text-blue" />
                      <strong>{p.nom} {p.prenom}</strong>
                    </div>
                  </td>
                  <td>{p.type_maladie}</td>
                  <td>
                    <span className={`badge ${p.est_hospitalise ? 'hosp' : 'ext'}`}>
                      {p.est_hospitalise ? "Hospitalisé" : "Externe"}
                    </span>
                  </td>
                  <td>{p.date_entree}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center" style={{ padding: '30px' }}>
                  Aucun dossier patient trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Patients;