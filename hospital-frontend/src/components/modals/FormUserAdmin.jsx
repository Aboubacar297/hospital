import React from 'react';
import { FiUser, FiLock, FiShield, FiPlusCircle, FiTag, FiCheckCircle, FiActivity } from 'react-icons/fi';

const FormUserAdmin = ({ handleAction, setFormData, formData, loading }) => {
  const isUpdate = !!formData.id;

  const styles = {
    form: { display: 'flex', flexDirection: 'column', gap: '18px' },
    group: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { 
      fontSize: '11px', 
      fontWeight: '800', 
      color: '#475569', 
      textTransform: 'uppercase', 
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px', 
      letterSpacing: '0.5px' 
    },
    input: { 
      padding: '12px 14px', 
      borderRadius: '12px', 
      border: '1.5px solid #E2E8F0', 
      outline: 'none', 
      background: '#F8FAFC', 
      fontSize: '14px', 
      color: '#1E293B',
      transition: 'all 0.2s ease'
    },
    select: {
      padding: '12px 14px',
      borderRadius: '12px',
      border: '1.5px solid #E2E8F0',
      outline: 'none',
      background: '#F8FAFC',
      fontSize: '14px',
      cursor: 'pointer'
    },
    btn: { 
      marginTop: '10px', 
      padding: '15px', 
      borderRadius: '14px', 
      border: 'none', 
      background: isUpdate ? '#4F46E5' : '#0F172A', 
      color: 'white', 
      fontWeight: '700', 
      cursor: 'pointer', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      gap: '10px', 
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.2s ease'
    }
  };

  return (
    <form onSubmit={(e) => handleAction(e)} style={styles.form}>
      
      {/* LIGNE 1 : IDENTITÉ PRÉNOM/NOM & LOGIN */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <div style={styles.group}>
          <label style={styles.label}><FiUser size={14}/> Nom Complet</label>
          <input 
            style={styles.input} 
            placeholder="Dr. Ahmed Alaoui" 
            required 
            value={formData.nom || ''} 
            onChange={e => setFormData({...formData, nom: e.target.value})} 
            className="form-input-focus"
          />
        </div>
        <div style={styles.group}>
          <label style={styles.label}><FiTag size={14}/> Identifiant (Login)</label>
          <input 
            style={styles.input} 
            placeholder="a.alaoui" 
            required 
            disabled={isUpdate} // Un login ne se change généralement pas
            value={formData.nom_utilisateur || ''} 
            onChange={e => setFormData({...formData, nom_utilisateur: e.target.value})} 
          />
        </div>
      </div>
      
      {/* SECTION SÉCURITÉ */}
      <div style={styles.group}>
        <label style={styles.label}><FiLock size={14}/> {isUpdate ? 'Changer le mot de passe (Laisser vide si inchangé)' : 'Mot de passe initial'}</label>
        <input 
          style={styles.input} 
          type="password" 
          placeholder="••••••••" 
          required={!isUpdate} 
          value={formData.mot_de_passe || ''} 
          onChange={e => setFormData({...formData, mot_de_passe: e.target.value})} 
        />
      </div>
      
      {/* SECTION RÔLE ET SPÉCIALITÉ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <div style={styles.group}>
          <label style={styles.label}><FiShield size={14}/> Rôle Système</label>
          <select 
            style={styles.select} 
            required 
            value={formData.role || ''} 
            onChange={e => setFormData({...formData, role: e.target.value})}
          >
            <option value="">Sélectionner...</option>
            <option value="ADMIN">ADMINISTRATEUR</option>
            <option value="MEDECIN">MÉDECIN</option>
            <option value="INFIRMIER">INFIRMIER</option>
            <option value="CAISSIER">CAISSIER</option>
          </select>
        </div>
        <div style={styles.group}>
          <label style={styles.label}><FiActivity size={14}/> Spécialité</label>
          <input 
            style={styles.input} 
            placeholder="ex: Cardiologue" 
            value={formData.specialite || ''} 
            onChange={e => setFormData({...formData, specialite: e.target.value})} 
          />
        </div>
      </div>

      {/* BOUTON D'ACTION DYNAMIQUE */}
      <button 
        type="submit" 
        style={styles.btn} 
        disabled={loading}
        className="btn-submit-hover"
      >
        {loading ? (
          'Traitement en cours...'
        ) : (
          <>
            {isUpdate ? <FiCheckCircle size={18}/> : <FiPlusCircle size={18}/>}
            {isUpdate ? 'METTRE À JOUR LE PROFIL' : 'CRÉER LE COMPTE STAFF'}
          </>
        )}
      </button>

      <style>{`
        .form-input-focus:focus { border-color: #4F46E5 !important; background: white !important; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1); }
        .btn-submit-hover:hover { transform: translateY(-2px); opacity: 0.9; }
        .btn-submit-hover:active { transform: translateY(0); }
      `}</style>
    </form>
  );
};

export default FormUserAdmin;