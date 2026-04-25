import React, { useEffect } from 'react';
import { FiClock, FiCheckCircle, FiInfo, FiCalendar } from 'react-icons/fi';

const FormAddPlanning = ({ user, handleAction, formData, setFormData, loading, setActiveModal }) => {
  
  // ✅ On s'assure que l'ID médecin est injecté visuellement pour le formulaire
  useEffect(() => {
    if (user?.id) {
      setFormData(prev => ({ ...prev, medecin_id: user.id }));
    }
  }, [user, setFormData]);

  const labelStyle = { fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', marginBottom: '5px', display: 'block' };
  const inputStyle = { width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', background: '#F8FAFC', outline: 'none' };

  return (
    <form 
      onSubmit={(e) => handleAction(e)} 
      style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}
    >
      <div style={{ background: '#F0F9FF', padding: '12px', borderRadius: '12px', fontSize: '12px', color: '#0369A1', border: '1px solid #E0F2FE', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <FiInfo size={20} /> 
        Bonjour Dr. {user?.nom}, définissez vos créneaux pour permettre la prise de rendez-vous.
      </div>

      <div>
        <label style={labelStyle}><FiCalendar /> Jour de consultation</label>
        <select 
          required 
          style={inputStyle}
          value={formData.jour || ''} 
          onChange={e => setFormData({...formData, jour: e.target.value})}
        >
          <option value="">Choisir un jour...</option>
          {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map(j => (
            <option key={j} value={j}>{j}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <div>
          <label style={labelStyle}><FiClock /> Heure début</label>
          <input 
            type="time" 
            required 
            style={inputStyle} 
            value={formData.heure_debut || ''} 
            onChange={e => setFormData({...formData, heure_debut: e.target.value})} 
          />
        </div>
        <div>
          <label style={labelStyle}><FiClock /> Heure fin</label>
          <input 
            type="time" 
            required 
            style={inputStyle} 
            value={formData.heure_fin || ''} 
            onChange={e => setFormData({...formData, heure_fin: e.target.value})} 
          />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        style={{ 
          background: loading ? '#94A3B8' : '#0F172A', 
          color: 'white', 
          padding: '14px', 
          borderRadius: '12px', 
          border: 'none', 
          fontWeight: '800', 
          cursor: loading ? 'not-allowed' : 'pointer', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '10px',
          transition: '0.3s'
        }}
      >
        <FiCheckCircle size={18} /> 
        {loading ? "SÉCURISATION BDD..." : "VALIDER DISPONIBILITÉ"}
      </button>

      <button 
        type="button"
        onClick={() => setActiveModal(null)}
        style={{ background: 'transparent', border: 'none', color: '#64748B', fontSize: '11px', cursor: 'pointer', fontWeight: '700', textTransform: 'uppercase' }}
      >
        Fermer
      </button>
    </form>
  );
};

export default FormAddPlanning;