import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, deleteUser, createUser } from '../services/api';
import { 
  FiUserPlus, FiTrash2, FiShield, FiUser, FiX, 
  FiCheck, FiArrowLeft, FiFileText 
} from 'react-icons/fi';

const Admin = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [newUser, setNewUser] = useState({ 
    nom_utilisateur: '', 
    email: '', 
    password: '', 
    role: 'medecin',
    is_admin_privilege: false 
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (err) {
      console.error("Erreur chargement personnel:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createUser(newUser); 
      setShowForm(false);
      setNewUser({ nom_utilisateur: '', email: '', password: '', role: 'medecin', is_admin_privilege: false });
      fetchUsers();
      alert("Membre du personnel ajouté avec succès !");
    } catch (err) {
      alert("Erreur : vérifiez que l'email n'est pas déjà utilisé.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
      try {
        await deleteUser(id);
        setUsers(users.filter(u => u.id !== id));
      } catch (err) { alert("Erreur lors de la suppression."); }
    }
  };

  return (
    <div className="admin-container animate-in" style={{ padding: '20px' }}>
      
      {/* BARRE DE NAVIGATION HYBRIDE (Retour + Consultation) */}
      <div className="navigation-header" style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
        <button 
          className="btn-blue-outline" 
          onClick={() => navigate(-1)} 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 15px', cursor: 'pointer' }}
        >
          <FiArrowLeft /> Retour en arrière
        </button>

        <button 
          className="btn-blue-primary" 
          onClick={() => navigate('/consultations/nouvelle')}
          style={{ backgroundColor: '#2c3e50', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <FiFileText /> Lancer une Consultation
        </button>
      </div>

      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 className="medical-blue-text"><FiShield /> Gestion des Ressources Humaines</h1>
        <button 
          className={showForm ? "btn-blue-outline" : "btn-blue-primary"} 
          onClick={() => setShowForm(!showForm)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          {showForm ? <><FiX /> Annuler</> : <><FiUserPlus /> Inscrire un employé</>}
        </button>
      </div>

      {showForm && (
        <div className="form-container card shadow animate-in" style={{ padding: '20px', marginBottom: '30px', background: '#f8f9fa', borderRadius: '10px' }}>
          <form onSubmit={handleCreate}>
            <div className="grid-2-columns" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="input-group">
                <label>Nom complet</label>
                <input type="text" placeholder="Ex: Dr. Ahmed" required value={newUser.nom_utilisateur} 
                       onChange={e => setNewUser({...newUser, nom_utilisateur: e.target.value})} />
              </div>
              
              <div className="input-group">
                <label>Email professionnel</label>
                <input type="email" placeholder="email@hopital.ma" required value={newUser.email} 
                       onChange={e => setNewUser({...newUser, email: e.target.value})} />
              </div>
              
              <div className="input-group">
                <label>Mot de passe temporaire</label>
                <input type="password" placeholder="********" required value={newUser.password} 
                       onChange={e => setNewUser({...newUser, password: e.target.value})} />
              </div>
              
              <div className="input-group">
                <label>Rôle</label>
                <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                  <option value="medecin">Médecin</option>
                  <option value="infirmier">Infirmier</option>
                  <option value="accueil">Réception / Accueil</option>
                  <option value="admin">Administrateur Système</option>
                </select>
              </div>
            </div>

            {newUser.role === 'medecin' && (
              <div style={{ marginTop: '15px', padding: '10px', background: '#eef6ff', borderRadius: '5px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={newUser.is_admin_privilege} 
                         onChange={e => setNewUser({...newUser, is_admin_privilege: e.target.checked})} />
                  <strong>Accorder les droits de gestion (Médecin-Chef)</strong>
                </label>
              </div>
            )}
            
            <button type="submit" className="btn-blue-primary" style={{ marginTop: '20px', width: '100%', padding: '12px' }}>
              Confirmer l'inscription
            </button>
          </form>
        </div>
      )}

      <div className="table-container card shadow" style={{ background: 'white', borderRadius: '10px', overflow: 'hidden' }}>
        {loading ? <p style={{ padding: '20px' }}>Chargement des données...</p> : (
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#0056b3', color: 'white' }}>
                <th style={{ padding: '15px', textAlign: 'left' }}>Utilisateur</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Email</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Rôle</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Privilèges</th>
                <th style={{ padding: '15px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '15px' }}><FiUser color="#0056b3" /> {u.nom_utilisateur}</td>
                  <td style={{ padding: '15px' }}>{u.email}</td>
                  <td style={{ padding: '15px' }}><span className={`badge-role ${u.role}`}>{u.role}</span></td>
                  <td style={{ padding: '15px' }}>
                    {u.is_admin_privilege || u.role === 'admin' ? 
                      <span style={{ color: '#28a745', fontWeight: 'bold' }}><FiCheck /> Gestionnaire</span> : 
                      <span style={{ color: '#666' }}>Standard</span>
                    }
                  </td>
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    <button 
                      className="btn-delete" 
                      onClick={() => handleDelete(u.id)} 
                      style={{ color: '#dc3545', border: 'none', background: 'none', cursor: 'pointer' }}
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Admin;