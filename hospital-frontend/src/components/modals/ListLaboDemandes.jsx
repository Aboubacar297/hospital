import React from 'react';
import { FiActivity, FiCheckCircle, FiClock, FiSearch, FiUser } from 'react-icons/fi';

const ListLaboDemandes = ({ consultations, handleAction, setFormData, styles }) => {
  // On filtre les consultations qui possèdent une demande d'examen non encore traitée
  const demandes = consultations?.filter(c => c.examen_demande && !c.resultat_analyse) || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      {/* HEADER DE SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
        <h3 style={{ fontSize: '14px', color: '#64748B', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Analyses en attente ({demandes.length})
        </h3>
      </div>

      <div className="no-scrollbar" style={{ maxHeight: '60vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {demandes.length > 0 ? demandes.map((d) => (
          <div key={d.id} style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4F46E5', fontWeight: '800', fontSize: '15px' }}>
                  <FiActivity /> <span>Examen : {d.examen_demande}</span>
                </div>
                <div style={{ marginTop: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div style={infoText}>
                    <FiUser size={12}/> <strong>Patient:</strong> {d.patient_nom || `ID: ${d.patient_id}`}
                  </div>
                  <div style={infoText}>
                    <FiSearch size={12}/> <strong>Prescripteur:</strong> Dr. {d.medecin_nom || d.medecin_id}
                  </div>
                </div>
              </div>
              
              <div style={badgeStyle}>
                <FiClock size={12} /> EN ATTENTE
              </div>
            </div>

            {/* ZONE DE SAISIE RÉSULTATS */}
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px', background: '#F8FAFC', padding: '10px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <input 
                placeholder="Saisir les conclusions de l'analyse biologique..." 
                style={inputLaboStyle}
                onChange={(e) => setFormData({ 
                   id: d.id, // On garde l'ID original pour l'UPDATE
                   resultat_analyse: e.target.value 
                })}
              />
              <button 
                onClick={(e) => handleAction(e)}
                style={btnValiderStyle}
              >
                <FiCheckCircle size={18} /> Transmettre
              </button>
            </div>
          </div>
        )) : (
          <div style={emptyStateStyle}>
            <FiActivity size={40} style={{ opacity: 0.1, marginBottom: '15px' }} />
            <p>Aucune demande d'analyse biologique en attente de traitement.</p>
          </div>
        )}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { width: 4px; }
        .no-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
      `}</style>
    </div>
  );
};

// --- STYLES INTERNES ---
const cardStyle = { 
  background: 'white', 
  padding: '20px', 
  borderRadius: '18px', 
  border: '1px solid #E2E8F0', 
  boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
  transition: 'transform 0.2s'
};

const badgeStyle = { 
  fontSize: '10px', 
  background: '#FFF1F2', 
  color: '#E11D48', 
  padding: '6px 12px', 
  borderRadius: '20px',
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
  fontWeight: '800'
};

const infoText = { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#64748B' };

const inputLaboStyle = { 
  flex: 1, 
  border: 'none', 
  background: 'transparent', 
  outline: 'none', 
  fontSize: '14px', 
  color: '#1E293B',
  padding: '5px'
};

const btnValiderStyle = { 
  background: '#4F46E5', 
  color: 'white', 
  border: 'none', 
  padding: '10px 20px', 
  borderRadius: '10px', 
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontWeight: '800',
  fontSize: '13px',
  boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)'
};

const emptyStateStyle = { 
  textAlign: 'center', 
  padding: '60px', 
  color: '#94A3B8', 
  background: '#F8FAFC', 
  borderRadius: '24px', 
  border: '2px dashed #E2E8F0' 
};

export default ListLaboDemandes;