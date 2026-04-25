import React, { useEffect } from 'react';
import { FiUser, FiPhone, FiUserPlus, FiTarget, FiCalendar } from 'react-icons/fi';

const FormPatient = ({ handleAction, setFormData, formData, loading }) => {
  
  // Diagnostic : Vérifie si la fonction handleAction est bien reçue
  useEffect(() => {
    if (!handleAction) {
      console.error("ALERTE : La fonction handleAction est undefined dans FormPatient !");
    }
  }, [handleAction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const updatedData = { ...prev, [name]: value };
      
      // Génération automatique de l'ID unique
      if (name === 'nom' || name === 'prenom') {
        const codeNom = (updatedData.nom || "").substring(0, 3).toUpperCase();
        const codePre = (updatedData.prenom || "").substring(0, 2).toUpperCase();
        const ts = Date.now().toString().slice(-4);
        updatedData.identifiant_unique = `PAT-${codeNom}${codePre}-${ts}`;
      }
      
      return updatedData;
    });
  };

  const onLocalSubmit = (e) => {
    console.log("Bouton cliqué ! Tentative d'envoi de :", formData);
    handleAction(e); // Appelle la fonction parent dans ModalManager
  };

  return (
    <form onSubmit={onLocalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      
      {/* Badge ID Auto-généré - Visuel crucial pour le debug */}
      <div style={formData.identifiant_unique ? idBadgeS : {...idBadgeS, background: '#FEF2F2', color: '#EF4444'}}>
        {formData.identifiant_unique 
          ? `ID GÉNÉRÉ : ${formData.identifiant_unique}` 
          : "⚠️ EN ATTENTE DE NOM/PRÉNOM"}
      </div>

      <div style={gridS}>
        <div>
          <label style={labelS}><FiUser/> Nom</label>
          <input name="nom" style={inputS} required value={formData.nom || ''} onChange={handleChange} placeholder="Nom" />
        </div>
        <div>
          <label style={labelS}><FiUser/> Prénom</label>
          <input name="prenom" style={inputS} required value={formData.prenom || ''} onChange={handleChange} placeholder="Prénom" />
        </div>
      </div>

      <div style={gridS}>
        <div>
          <label style={labelS}><FiCalendar/> Date de Naissance</label>
          <input name="date_naissance" type="date" style={inputS} required value={formData.date_naissance || ''} onChange={handleChange} />
        </div>
        <div>
          <label style={labelS}><FiTarget/> Sexe</label>
          <select name="sexe" style={inputS} required value={formData.sexe || ''} onChange={handleChange}>
            <option value="">Choisir...</option>
            <option value="M">Masculin</option>
            <option value="F">Féminin</option>
          </select>
        </div>
      </div>

      <div>
        <label style={labelS}><FiPhone/> Téléphone</label>
        <input name="telephone" style={inputS} required value={formData.telephone || ''} placeholder="06..." onChange={handleChange} />
      </div>

      <button 
        type="submit" 
        style={{...btnS, opacity: loading ? 0.7 : 1}} 
        disabled={loading}
      >
        <FiUserPlus /> {loading ? "Connexion au serveur..." : "Confirmer l'admission"}
      </button>
    </form>
  );
};

// Styles
const labelS = { fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', marginBottom: '5px', display: 'block' };
const inputS = { width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', background: '#F8FAFC', boxSizing: 'border-box', outline: 'none', fontSize: '14px' };
const btnS = { padding: '15px', borderRadius: '12px', border: 'none', background: '#4F46E5', color: 'white', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '10px', transition: '0.3s' };
const idBadgeS = { padding: '10px', background: '#F5F3FF', color: '#4F46E5', borderRadius: '10px', fontSize: '10px', fontWeight: '900', textAlign: 'center', border: '1px dashed #C7D2FE' };
const gridS = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' };

export default FormPatient;