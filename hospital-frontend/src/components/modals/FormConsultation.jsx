import React, { useEffect, useState } from 'react';
import { FiActivity, FiEdit3, FiPlusCircle, FiPrinter, FiUser, FiFileText, FiDollarSign, FiLink } from 'react-icons/fi';
import api from '../../services/api'; 
import { generatePDF } from '../../services/printService';

const FormConsultation = ({ patients, handleAction, setFormData, formData, user, loading }) => {
  const [actes, setActes] = useState([]);

  // 1. Chargement des référentiels (Tarifs)
  useEffect(() => {
    api.get('/tarifications/')
      .then(res => setActes(res.data))
      .catch(err => console.error("Erreur chargement actes:", err));
  }, []);

  // 2. ✅ SYNCHRONISATION STABLE RDV -> Consultation
  // Déstructuration pour éviter de passer l'objet formData entier dans les dépendances
  const { id, rdv_id, patient_id, montant } = formData;
  const currentUserId = user?.id;

  useEffect(() => {
    if (id && !rdv_id) {
      setFormData(prev => ({
        ...prev,
        rdv_id: id,      
        patient_id: patient_id,
        medecin_id: currentUserId,     
        montant_acte: prev.montant_acte || montant || 0 
      }));
    }
    // Dépendances précises pour éviter les boucles infinies et les warnings
  }, [id, rdv_id, patient_id, montant, currentUserId, setFormData]);

  const handlePrint = () => {
    const pName = formData.nom_patient || (patients?.find(p => String(p.id) === String(formData.patient_id))?.nom);
    generatePDF('ORDONNANCE', { 
      ...formData, 
      nom_patient: pName, 
      medecin: user?.nom_utilisateur, 
      date: new Date().toLocaleDateString() 
    });
  };

  const styles = {
    container: { maxHeight: '80vh', overflowY: 'auto', paddingRight: '8px', display: 'flex', flexDirection: 'column', gap: '12px' },
    linkBadge: { 
      background: '#EEF2FF', color: '#4F46E5', padding: '6px 12px', borderRadius: '20px', 
      fontSize: '10px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px', alignSelf: 'flex-start' 
    },
    headerBadge: { 
      background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)', 
      border: '1px solid #E2E8F0', padding: '10px 15px', borderRadius: '12px', 
      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    },
    sectionCard: { background: '#FFFFFF', border: '1px solid #F1F5F9', borderRadius: '12px', padding: '12px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' },
    mainGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
    fieldGroup: { display: 'flex', flexDirection: 'column', gap: '4px' },
    label: { fontSize: '10px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px' },
    input: { padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '13px', background: '#F8FAFC' },
    textarea: { padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0', minHeight: '70px', resize: 'none', outline: 'none', fontSize: '13px', lineHeight: '1.4' },
    footer: { display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '10px', borderTop: '1px solid #F1F5F9' },
    btnSubmit: { padding: '10px 20px', borderRadius: '10px', border: 'none', background: '#4F46E5', color: 'white', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px', opacity: loading ? 0.7 : 1 },
    btnPrint: { padding: '10px 15px', borderRadius: '10px', border: '1px solid #E2E8F0', background: 'white', color: '#64748B', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }
  };

  return (
    <div style={styles.container} className="no-scrollbar">
      {formData.rdv_id && (
        <div style={styles.linkBadge}>
          <FiLink /> CONSULTATION LIÉE AU RDV #{formData.rdv_id}
        </div>
      )}

      <div style={styles.headerBadge}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
          <FiUser size={18} color="#4F46E5" />
          <div style={{ width: '100%' }}>
            <span style={styles.label}>Patient</span>
            <select 
              style={{ ...styles.input, width: '90%', border: 'none', background: 'transparent', fontWeight: '800', padding: 0 }}
              value={formData.patient_id || ''}
              onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
              disabled={!!formData.rdv_id} 
            >
              <option value="">-- Sélectionner un patient --</option>
              {patients?.map(p => (
                <option key={p.id} value={p.id}>{p.nom} {p.prenom}</option>
              ))}
            </select>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
            <span style={styles.label}>Praticien</span>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748B' }}>{user?.nom_utilisateur || user?.nom}</div>
        </div>
      </div>

      <div style={{...styles.sectionCard, borderLeft: '4px solid #4F46E5'}}>
        <div style={styles.fieldGroup}>
          <label style={styles.label}><FiDollarSign /> Acte Médical & Facturation</label>
          <select 
            required
            style={styles.input} 
            value={formData.tarif_id || ''} 
            onChange={(e) => {
                const selected = actes.find(a => String(a.id) === String(e.target.value));
                if (selected) {
                  setFormData({ 
                    ...formData, 
                    tarif_id: selected.id, 
                    montant_acte: parseFloat(selected.prix) 
                  });
                }
            }}
          >
            <option value="">-- Choisir l'acte --</option>
            {actes.map(a => (
              <option key={a.id} value={a.id}>{a.nom_acte} ({a.prix} DH)</option>
            ))}
          </select>
        </div>
      </div>

      <div style={styles.mainGrid}>
        <div style={styles.fieldGroup}>
          <label style={styles.label}><FiActivity color="#4F46E5" /> Diagnostic</label>
          <textarea 
            style={styles.textarea} 
            placeholder="Saisissez les conclusions médicales..."
            value={formData.diagnostic || ''} 
            onChange={e => setFormData({...formData, diagnostic: e.target.value})} 
          />
        </div>
        <div style={styles.fieldGroup}>
          <label style={styles.label}><FiEdit3 color="#10B981" /> Ordonnance</label>
          <textarea 
            style={styles.textarea} 
            placeholder="Médicaments, posologie..."
            value={formData.prescriptions || ''} 
            onChange={e => setFormData({...formData, prescriptions: e.target.value})} 
          />
        </div>
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}><FiFileText /> Notes & Recommandations</label>
        <textarea 
          style={{...styles.textarea, minHeight: '50px'}} 
          placeholder="Consignes additionnelles..."
          value={formData.notes_medicales || ''} 
          onChange={e => setFormData({...formData, notes_medicales: e.target.value})} 
        />
      </div>

      <div style={styles.footer}>
        <button type="button" onClick={handlePrint} style={styles.btnPrint}>
          <FiPrinter size={16} /> Imprimer
        </button>
        <button 
          type="button" 
          disabled={loading}
          onClick={(e) => {
            if(!formData.tarif_id) return alert("Veuillez sélectionner un acte médical.");
            handleAction(e);
          }} 
          style={styles.btnSubmit}
        >
          <FiPlusCircle size={18} /> {loading ? "Enregistrement..." : "Clôturer la séance"}
        </button>
      </div>
    </div>
  );
};

export default FormConsultation;