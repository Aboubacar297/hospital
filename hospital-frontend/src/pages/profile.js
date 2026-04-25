import React, { useState } from 'react';
import api from '../services/api';
import { FiUser, FiMail, FiShield, FiLock, FiSave } from 'react-icons/fi';

const Profile = () => {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const [passwordData, setPasswordData] = useState({
    ancien: '',
    nouveau: '',
    confirmation: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.nouveau !== passwordData.confirmation) {
      return setMessage({ type: 'error', text: 'Les nouveaux mots de passe ne correspondent pas.' });
    }

    try {
      await api.put('/utilisateurs/change-password', {
        ancien_password: passwordData.ancien,
        nouveau_password: passwordData.nouveau
      });
      setMessage({ type: 'success', text: 'Mot de passe mis à jour avec succès !' });
      setPasswordData({ ancien: '', nouveau: '', confirmation: '' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Erreur : Ancien mot de passe incorrect.' });
    }
  };

  return (
    <div className="profile-container animate-in">
      <div className="page-header">
        <h1>Mon Profil</h1>
      </div>

      <div className="profile-grid">
        {/* Informations Personnelles */}
        <div className="card profile-info">
          <h2><FiUser /> Informations</h2>
          <div className="info-item">
            <label><FiUser /> Nom d'utilisateur</label>
            <p>{user.nom_utilisateur}</p>
          </div>
          <div className="info-item">
            <label><FiMail /> Email</label>
            <p>{user.email || 'Non renseigné'}</p>
          </div>
          <div className="info-item">
            <label><FiShield /> Rôle</label>
            <span className={`badge-role ${user.role}`}>{user.role}</span>
          </div>
        </div>

        {/* Sécurité / Mot de passe */}
        <div className="card profile-security">
          <h2><FiLock /> Sécurité</h2>
          <form onSubmit={handleChangePassword}>
            <div className="input-group">
              <label>Ancien mot de passe</label>
              <input 
                type="password" 
                required 
                value={passwordData.ancien}
                onChange={(e) => setPasswordData({...passwordData, ancien: e.target.value})}
              />
            </div>
            <div className="input-group">
              <label>Nouveau mot de passe</label>
              <input 
                type="password" 
                required 
                value={passwordData.nouveau}
                onChange={(e) => setPasswordData({...passwordData, nouveau: e.target.value})}
              />
            </div>
            <div className="input-group">
              <label>Confirmer le nouveau mot de passe</label>
              <input 
                type="password" 
                required 
                value={passwordData.confirmation}
                onChange={(e) => setPasswordData({...passwordData, confirmation: e.target.value})}
              />
            </div>
            {message.text && <p className={`message ${message.type}`}>{message.text}</p>}
            <button type="submit" className="btn-submit"><FiSave /> Mettre à jour</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;