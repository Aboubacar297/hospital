import React, { useEffect } from 'react';
import { FiDollarSign, FiCheck } from 'react-icons/fi';

const FormPaiement = ({ handleAction, setFormData, formData, loading }) => {
  
  useEffect(() => {
    if (!formData.mode_paiement) {
      setFormData(prev => ({ ...prev, mode_paiement: 'ESPECES', statut_paiement: 'PAYE' }));
    }
  }, [formData.mode_paiement, setFormData]);

  // OBJET STYLES DÉFINI ICI
  const styles = {
    container: { textAlign: 'center', padding: '5px' },
    amountCard: { 
      background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)', 
      padding: '25px', borderRadius: '24px', color: 'white', 
      marginBottom: '25px', boxShadow: '0 10px 25px -5px rgba(79, 70, 229, 0.3)' 
    },
    label: { 
      display: 'block', textAlign: 'left', fontSize: '12px', fontWeight: '800', 
      color: '#64748B', marginBottom: '8px', textTransform: 'uppercase'
    },
    select: { 
      width: '100%', padding: '14px', borderRadius: '16px', border: '1px solid #E2E8F0', 
      fontSize: '15px', outline: 'none', background: '#F8FAFC', marginBottom: '20px'
    },
    btn: { 
      width: '100%', padding: '16px', borderRadius: '16px', border: 'none', 
      background: '#0F172A', color: 'white', fontWeight: '800', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.amountCard}>
        <FiDollarSign size={28} />
        <p style={{margin:0, opacity:0.8, fontSize:'13px'}}>TOTAL À ENCAISSER</p>
        <h1 style={{margin:'5px 0 0 0', fontSize:'32px', fontWeight: '900'}}>
          {formData.montant ? Number(formData.montant).toLocaleString() : '0'} DH
        </h1>
      </div>

      <form onSubmit={handleAction}>
        <div style={{textAlign: 'left'}}>
          <label style={styles.label}>Méthode de règlement</label>
          <select 
            style={styles.select} 
            value={formData.mode_paiement || 'ESPECES'}
            onChange={e => setFormData({...formData, mode_paiement: e.target.value})}
          >
            <option value="ESPECES">💵 Espèces</option>
            <option value="CARTE">💳 Carte Bancaire</option>
            <option value="MOBILE">📱 Mobile Money</option>
            <option value="ASSURANCE">🏥 Assurance</option>
          </select>
        </div>
        <button type="submit" style={styles.btn} disabled={loading}>
          {loading ? 'Validation...' : <><FiCheck size={20}/> Valider le paiement</>}
        </button>
      </form>
    </div>
  );
};

export default FormPaiement;