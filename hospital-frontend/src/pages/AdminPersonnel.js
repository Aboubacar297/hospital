import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiUserPlus, FiArrowLeft, FiShield, FiUser, FiX } from 'react-icons/fi';
import api from '../services/api';

const AdminPersonnel = () => {
  const navigate = useNavigate();
  const [staff, setStaff] = useState([]);
  const [showForm, setShowForm] = useState(false);
  
  // Récupération des données utilisateur stockées au login
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : {};
  
  // Condition de sécurité : Admin ou Médecin avec privilège
  const isAuthorized = user.role === 'admin' || user.is_admin_privilege === true;

  const [newUser, setNewUser] = useState({ 
    nom_utilisateur: '', email: '', role: 'medecin', password: '', is_admin_privilege: false 
  });

  useEffect(() => {
    if (isAuthorized) {
      fetchStaff();
    }
  }, [isAuthorized]);

  const fetchStaff = async () => {
    try {
      const res = await api.get('/utilisateurs/personnel');
      setStaff(res.data);
    } catch (err) { 
      console.error("Erreur API personnel:", err); 
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', newUser);
      setShowForm(false);
      fetchStaff();
      alert("Membre du personnel enregistré avec succès !");
      setNewUser({ nom_utilisateur: '', email: '', role: 'medecin', password: '', is_admin_privilege: false });
    } catch (err) { 
      alert("Erreur lors de l'enregistrement. Vérifiez si l'email existe déjà."); 
    }
  };

  // Écran de blocage si non autorisé
  if (!isAuthorized) {
    return (
      <div style={{padding: '100px', textAlign: 'center', color: '#721c24'}}>
        <FiShield size={80} style={{marginBottom: '20px'}} />
        <h1>Accès Strictement Réservé</h1>
        <p>Vous n'avez pas les permissions nécessaires pour gérer le personnel.</p>
        <button 
          className="btn-blue-outline" 
          onClick={() => navigate(-1)}
          style={{marginTop: '20px', padding: '10px 30px', cursor: 'pointer'}}
        >
          Retourner au tableau de bord
        </button>
      </div>
    );
  }

  return (
    <div className="admin-page animate-in" style={{ padding: '30px' }}>
      {/* HEADER AVEC LE BOUTON BLEU */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '2px solid #eee', paddingBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button className="btn-blue-outline" onClick={() => navigate(-1)} style={{ cursor: 'pointer' }}>
            <FiArrowLeft /> Retour
          </button>
          <h1 style={{ color: '#0056b3', margin: 0 }}><FiShield /> Ressources Humaines</h1>
        </div>
        
        <button 
          className="btn-blue-primary" 
          onClick={() => setShowForm(!showForm)}
          style={{ background: '#0056b3', color: 'white', padding: '12px 25px', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
        >
          {showForm ? <><FiX /> Fermer</> : <><FiUserPlus /> Inscrire un employé</>}
        </button>
      </div>

      {/* FORMULAIRE MASQUABLE */}
      {showForm && (
        <div className="form-container" style={{ animation: 'slideDown 0.3s ease-out' }}>
          <form onSubmit={handleAddUser} className="form-card card shadow" style={{ padding: '25px', background: '#ffffff', borderRadius: '12px', marginBottom: '30px', border: '1px solid #e0e0e0' }}>
            <h3 style={{ color: '#0056b3', marginTop: 0 }}>Ajouter un nouveau membre</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="input-group">
                  <label>Nom complet</label>
                  <input type="text" placeholder="ex: Dr. Amine" value={newUser.nom_utilisateur} onChange={e => setNewUser({...newUser, nom_utilisateur: e.target.value})} required style={{width: '100%', padding: '10px', marginTop: '5px'}} />
                </div>
                <div className="input-group">
                  <label>Email Professionnel</label>
                  <input type="email" placeholder="email@hopital.ma" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} required style={{width: '100%', padding: '10px', marginTop: '5px'}} />
                </div>
                <div className="input-group">
                  <label>Rôle attribué</label>
                  <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})} style={{width: '100%', padding: '10px', marginTop: '5px'}}>
                      <option value="medecin">Médecin</option>
                      <option value="admin">Administrateur</option>
                      <option value="infirmier">Infirmier</option>
                      <option value="secretaire">Secrétaire</option>
                      <option value="accueil">Chargé d'accueil</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Mot de passe temporaire</label>
                  <input type="password" placeholder="Min. 8 caractères" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} required style={{width: '100%', padding: '10px', marginTop: '5px'}} />
                </div>
            </div>
            {newUser.role === 'medecin' && (
              <div style={{ marginTop: '15px', background: '#eef6ff', padding: '10px', borderRadius: '5px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={newUser.is_admin_privilege} onChange={e => setNewUser({...newUser, is_admin_privilege: e.target.checked})} /> 
                  <strong>Droit de gestion administrative (Médecin-Chef)</strong>
                </label>
              </div>
            )}
            <button type="submit" className="btn-blue-primary" style={{ marginTop: '20px', width: '100%', padding: '12px', background: '#28a745' }}>Valider l'inscription</button>
          </form>
        </div>
      )}

      {/* TABLEAU DES EMPLOYÉS */}
      <div className="table-container card shadow" style={{ background: 'white', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #eee' }}>
              <th style={{ padding: '15px', textAlign: 'left' }}>Nom</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Email</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Fonction</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Niveau d'accès</th>
            </tr>
          </thead>
          <tbody>
            {staff.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid #f1f1f1' }}>
                <td style={{ padding: '15px' }}><FiUser color="#0056b3" /> {u.nom_utilisateur}</td>
                <td style={{ padding: '15px' }}>{u.email}</td>
                <td style={{ padding: '15px' }}>
                  <span className={`badge-${u.role}`} style={{ background: '#eef2f7', padding: '4px 10px', borderRadius: '15px', fontSize: '0.85rem' }}>
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: '15px' }}>
                  {u.is_admin_privilege || u.role === 'admin' ? 
                    <span style={{ color: '#155724', background: '#d4edda', padding: '4px 10px', borderRadius: '5px', fontWeight: 'bold' }}>👑 Gestionnaire</span> : 
                    <span style={{ color: '#666' }}>Standard</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPersonnel;