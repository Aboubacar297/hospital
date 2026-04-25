import React, { useState } from 'react';
import { FiEye, FiSearch, FiEdit, FiTrash2, FiUser, FiXCircle, FiPhone } from 'react-icons/fi';

const ListPatientsDme = ({ patients, setActiveModal, setFormData, handleDelete, isAdmin }) => {
  const [query, setQuery] = useState("");

  const styles = {
    searchBox: { 
      position: 'relative', marginBottom: '20px', display: 'flex', 
      alignItems: 'center', background: '#F8FAFC', borderRadius: '16px', 
      border: '1px solid #E2E8F0', padding: '2px' 
    },
    searchInput: { 
      width: '100%', padding: '12px 12px 12px 45px', borderRadius: '14px', 
      border: 'none', outline: 'none', fontSize: '14px', background: 'transparent', color: '#1E293B' 
    },
    patientRow: { 
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
      padding: '12px 18px', borderRadius: '18px', background: 'white', 
      marginBottom: '10px', border: '1px solid #F1F5F9', transition: 'all 0.2s ease' 
    },
    avatar: { 
      background: '#EEF2FF', padding: '10px', borderRadius: '12px', color: '#4F46E5', display: 'flex' 
    },
    btnAction: (bg) => ({ 
      background: bg, color: 'white', border: 'none', padding: '10px', 
      borderRadius: '10px', cursor: 'pointer', display: 'flex', 
      alignItems: 'center', transition: '0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' 
    })
  };

  const filtered = (patients || []).filter(p => 
    `${p.nom} ${p.prenom}`.toLowerCase().includes(query.toLowerCase()) ||
    p.telephone?.includes(query)
  );

  const handleOpenDme = (patient) => {
    const patientData = { ...patient, patient_id: patient.id };
    setFormData(patientData);
    setActiveModal('view_full_dme');
  };

  return (
    <div style={{ padding: '2px' }}>
      <div style={styles.searchBox}>
        <FiSearch style={{ position: 'absolute', left: '15px', color: '#94A3B8' }} size={18} />
        <input 
          style={styles.searchInput} 
          placeholder="Rechercher (Nom, Prénom, Tél)..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && <FiXCircle onClick={() => setQuery("")} style={{ position: 'absolute', right: '15px', color: '#94A3B8', cursor: 'pointer' }} />}
      </div>

      <div className="no-scrollbar" style={{ maxHeight: '55vh', overflowY: 'auto', paddingRight: '5px' }}>
        {filtered.length > 0 ? filtered.map(p => (
          <div key={p.id} style={styles.patientRow} className="patient-item-hover">
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={styles.avatar}><FiUser size={18} /></div>
              <div>
                <div style={{ color: '#0F172A', fontWeight: '800', fontSize: '14px' }}>
                    {p.nom?.toUpperCase()} {p.prenom}
                </div>
                <div style={{ color: '#64748B', fontSize: '11px', fontWeight: '600', display: 'flex', gap: '8px' }}>
                    <span style={{color: '#4F46E5'}}>#{p.id}</span>
                    <span><FiPhone size={10}/> {p.telephone || 'N/A'}</span>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => handleOpenDme(p)} 
                style={styles.btnAction('#4F46E5')} 
                className="btn-scale"
                title="Consulter le DME"
              >
                <FiEye size={16} />
              </button>

              {isAdmin && (
                <>
                  <button 
                    onClick={() => { setFormData(p); setActiveModal('form_patient'); }} 
                    style={styles.btnAction('#F59E0B')} 
                    className="btn-scale"
                    title="Modifier le patient"
                  >
                    <FiEdit size={16} />
                  </button>
                  <button 
                    // ✅ FIX : On envoie explicitement 'patients' pour l'API
                    onClick={() => handleDelete('patients', p.id)} 
                    style={styles.btnAction('#EF4444')} 
                    className="btn-scale"
                    title="Supprimer le patient"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </>
              )}
            </div>
          </div>
        )) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#94A3B8' }}>Aucun patient trouvé.</div>
        )}
      </div>

      <style>{`
        .patient-item-hover:hover { border-color: #4F46E5 !important; background: #F8FAFC !important; transform: translateX(5px); }
        .btn-scale:hover { transform: scale(1.1); }
        .no-scrollbar::-webkit-scrollbar { width: 4px; }
        .no-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default ListPatientsDme;