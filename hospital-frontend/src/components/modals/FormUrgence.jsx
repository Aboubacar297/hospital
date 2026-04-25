import React from 'react';
import { FiAlertTriangle, FiUser, FiActivity, FiArrowRight } from 'react-icons/fi';

const FormUrgence = ({ formData, setFormData, handleAction, loading, medecins }) => {
  
  return (
    <div style={{ padding: '10px' }}>
      <div style={alertBannerStyle}>
        <FiAlertTriangle size={24} />
        <div style={{ marginLeft: '12px' }}>
          <strong style={{ display: 'block' }}>PRIORITÉ CRITIQUE</strong>
          <span style={{ fontSize: '12px', opacity: 0.9 }}>Admission rapide pour soins immédiats.</span>
        </div>
      </div>

      <form onSubmit={handleAction} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* IDENTITÉ RAPIDE */}
        <div style={fieldGroupStyle}>
          <label style={labelStyle}><FiUser size={14}/> Nom Complet du Patient</label>
          <input 
            type="text" 
            required
            placeholder="Ex: Jean Dupont"
            style={inputStyle}
            value={formData.nom_complet || ''}
            onChange={(e) => setFormData({...formData, nom_complet: e.target.value, priorite: 'URGENT'})}
          />
        </div>

        {/* MOTIF DE L'URGENCE */}
        <div style={fieldGroupStyle}>
          <label style={labelStyle}><FiActivity size={14}/> Motif de l'Urgence</label>
          <textarea 
            required
            placeholder="Ex: Douleurs thoraciques, Malaise, Accident..."
            style={{ ...inputStyle, height: '80px', resize: 'none' }}
            value={formData.motif_urgence || ''}
            onChange={(e) => setFormData({...formData, motif_urgence: e.target.value})}
          />
        </div>

        {/* AFFECTATION MÉDECIN DE GARDE */}
        <div style={fieldGroupStyle}>
          <label style={labelStyle}>Affecter au médecin de garde</label>
          <select 
            required
            style={inputStyle}
            value={formData.medecin_id || ''}
            onChange={(e) => setFormData({...formData, medecin_id: e.target.value})}
          >
            <option value="">Sélectionner un médecin disponible...</option>
            {medecins.map(m => (
              <option key={m.id} value={m.id}>Dr. {m.nom_utilisateur}</option>
            ))}
          </select>
        </div>

        {/* BOUTON D'ACTION */}
        <button 
          type="submit" 
          disabled={loading}
          style={submitBtnStyle}
        >
          {loading ? 'Traitement...' : 'VALIDER L\'ADMISSION IMMÉDIATE'} 
          <FiArrowRight style={{ marginLeft: '10px' }} />
        </button>

      </form>
    </div>
  );
};

// --- STYLES ---
const alertBannerStyle = {
  background: '#FFF1F2',
  border: '1px solid #FECDD3',
  color: '#E11D48',
  padding: '15px',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  marginBottom: '20px'
};

const fieldGroupStyle = { display: 'flex', flexDirection: 'column', gap: '5px' };
const labelStyle = { fontSize: '13px', fontWeight: '700', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' };
const inputStyle = { padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#F8FAFC', outline: 'none', fontSize: '14px' };

const submitBtnStyle = {
  marginTop: '10px',
  background: '#E11D48',
  color: 'white',
  border: 'none',
  padding: '16px',
  borderRadius: '12px',
  fontWeight: '800',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  transition: '0.2s',
  boxShadow: '0 4px 12px rgba(225, 29, 72, 0.3)'
};

export default FormUrgence;