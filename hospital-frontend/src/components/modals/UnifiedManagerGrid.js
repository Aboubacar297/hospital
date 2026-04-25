import React, { useState } from 'react';
import { 
  FiSearch, FiPlus, FiEdit, FiTrash2, FiCalendar, 
  FiUsers, FiClock, FiPhone, FiTag, FiFolder, FiX, FiActivity, FiUser 
} from 'react-icons/fi';

const UnifiedManagerGrid = ({ type, data, setActiveModal, setFormData, handleDelete, isAdmin }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const config = {
    patient: {
      title: "Registre des Patients",
      color: "#4f46e5",
      form: "form_patient",
      entity: "patients", 
      renderInfo: (p) => (
        <>
          <div style={infoRow}><FiTag size={12}/> {p.identifiant_unique || `ID: ${p.id}`}</div>
          <div style={infoRow}><FiPhone size={12}/> {p.telephone || 'Non renseigné'}</div>
          <div style={{fontSize: '9px', color: '#94A3B8', marginTop: '4px'}}>
             <FiActivity size={10} /> Dossier créé le: {p.date_inscription || 'Récemment'}
          </div>
        </>
      )
    },
    rdv: {
      title: "Gestion des Rendez-vous",
      color: "#10b981",
      form: "form_rdv",
      entity: "rendezvous", 
      renderInfo: (r) => (
        <>
          <div style={{...infoRow, color: '#1E293B', fontWeight: '700'}}>
            <FiUser size={12}/> {r.nom_patient || "Patient #" + r.patient_id}
          </div>
          <div style={infoRow}><FiCalendar size={12}/> {r.date}</div>
          <div style={infoRow}><FiClock size={12}/> {r.heure}</div>
          <div style={{fontSize: '10px', color: '#4F46E5', fontWeight: '600', marginTop: '4px'}}>
              Dr. {r.nom_medecin || "Non assigné"}
          </div>
          <div style={statusBadge(r.statut)}>{r.statut || 'EN ATTENTE'}</div>
        </>
      )
    },
    staff: {
      title: "Équipe Médicale",
      color: "#f59e0b",
      form: "form_user_admin",
      entity: "users", 
      renderInfo: (s) => (
        <>
          <div style={infoRow}><FiUsers size={12}/> {s.role}</div>
          {s.specialite && <div style={{...infoRow, color: '#10B981'}}><FiActivity size={12}/> {s.specialite}</div>}
          <div style={{fontSize: '11px', color: '#4F46E5', fontWeight: '700'}}>@{s.nom_utilisateur}</div>
        </>
      )
    }
  }[type];

  const filtered = (data || []).filter(item => {
    const term = searchTerm.toLowerCase();
    return (
      item.nom?.toLowerCase().includes(term) ||
      item.prenom?.toLowerCase().includes(term) ||
      item.nom_utilisateur?.toLowerCase().includes(term) ||
      item.nom_patient?.toLowerCase().includes(term) || 
      item.nom_medecin?.toLowerCase().includes(term) ||  
      item.date?.includes(term) ||
      item.telephone?.includes(term)
    );
  });

  return (
    <div style={{ padding: '5px' }}>
      <div style={topBar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '4px', height: '24px', background: config.color, borderRadius: '4px' }}></div>
            <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#1E293B', margin: 0 }}>{config.title}</h2>
            <span style={countPill}>{filtered.length} dossiers</span>
        </div>
        <button 
          onClick={() => { setFormData({}); setActiveModal(config.form); }} 
          style={addButton(config.color)}
        >
          <FiPlus size={16} /> Nouveau
        </button>
      </div>

      <div style={searchBox}>
        <FiSearch color="#94a3b8" size={18} />
        <input 
          style={inputStyle} 
          placeholder={`Rechercher un ${type === 'patient' ? 'patient' : type === 'rdv' ? 'rendez-vous' : 'membre'}...`} 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
        {searchTerm && <FiX style={{ cursor: 'pointer', color: '#94A3B8' }} onClick={() => setSearchTerm('')} />}
      </div>

      <div style={gridStyle}>
        {filtered.length > 0 ? filtered.map(item => (
          <div key={item.id} style={cardStyle} className="card-hover">
            <div style={cardHeader}>
              <div style={avatar(config.color)}>
                {(item.nom || item.nom_patient || item.nom_utilisateur || 'P').charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={nameTitle}>
                    {type === 'rdv' 
                      ? `RDV #${item.id}` 
                      : (item.nom ? `${item.nom.toUpperCase()} ${item.prenom || ''}` : item.nom_utilisateur)
                    }
                </div>
                {config.renderInfo(item)}
              </div>
            </div>
            
            <div style={actionArea}>
              <button 
                title="Modifier"
                onClick={() => { setFormData(item); setActiveModal(config.form); }} 
                style={btnAction('#F1F5F9', '#475569')}
              >
                <FiEdit size={14}/>
              </button>

              {type === 'patient' && (
                <button 
                  title="Dossier Médical"
                  onClick={() => { setFormData({ ...item, patient_id: item.id }); setActiveModal('view_full_dme'); }} 
                  style={btnAction('#EEF2FF', '#4F46E5')}
                >
                  <FiFolder size={14}/>
                </button>
              )}

              {isAdmin && (
                <button 
                  title="Supprimer"
                  onClick={(e) => {
                    e.stopPropagation();
                    // ✅ Sécurité : On vérifie que handleDelete est bien une fonction reçue par les props
                    if (typeof handleDelete === 'function') {
                      handleDelete(config.entity, item.id);
                    } else {
                      console.error("handleDelete n'est pas défini dans UnifiedManagerGrid");
                    }
                  }} 
                  style={btnAction('#FFF1F2', '#E11D48')}
                >
                  <FiTrash2 size={14}/>
                </button>
              )}
            </div>
          </div>
        )) : (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: '#94A3B8' }}>
                <FiSearch size={40} style={{ opacity: 0.2, marginBottom: '10px' }} />
                <p>Aucun résultat pour "{searchTerm}"</p>
            </div>
        )}
      </div>

      <style>{`
        .card-hover { transition: all 0.2s ease; }
        .card-hover:hover { transform: translateY(-5px); border-color: ${config.color}40 !important; box-shadow: 0 10px 20px rgba(0,0,0,0.05) !important; }
      `}</style>
    </div>
  );
};

const statusBadge = (s) => {
  const status = s?.toUpperCase();
  const getColors = () => {
    if (status === 'TERMINE' || status === 'COMPLETED') return { bg: '#DCFCE7', text: '#166534' };
    if (status === 'ANNULE' || status === 'CANCELLED') return { bg: '#FEE2E2', text: '#991B1B' };
    if (status === 'CONFIRME') return { bg: '#DBEAFE', text: '#1E40AF' };
    return { bg: '#FEF9C3', text: '#854D0E' }; 
  };
  const colors = getColors();
  
  return {
    marginTop: '8px',
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '9px',
    fontWeight: '800',
    textTransform: 'uppercase',
    background: colors.bg,
    color: colors.text,
    border: `1px solid ${colors.text}20`
  };
};

const countPill = { background: '#F1F5F9', color: '#64748B', padding: '4px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: '700' };
const topBar = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' };
const addButton = (c) => ({ background: c, color: 'white', border: 'none', padding: '10px 20px', borderRadius: '14px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: `0 10px 15px -3px ${c}40` });
const searchBox = { display: 'flex', alignItems: 'center', gap: '12px', background: '#F8FAFC', padding: '14px 18px', borderRadius: '16px', border: '1px solid #E2E8F0', marginBottom: '25px' };
const inputStyle = { border: 'none', outline: 'none', width: '100%', fontSize: '14px', background: 'transparent', color: '#1E293B', fontWeight: '500' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' };
const cardStyle = { background: 'white', border: '1px solid #F1F5F9', borderRadius: '24px', padding: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' };
const cardHeader = { display: 'flex', gap: '15px', marginBottom: '18px' };
const avatar = (c) => ({ width: '48px', height: '48px', background: `${c}15`, color: c, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '20px' });
const nameTitle = { fontWeight: '800', color: '#0F172A', fontSize: '15px', marginBottom: '4px', letterSpacing: '-0.3px' };
const infoRow = { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#64748B', marginBottom: '4px' };
const actionArea = { display: 'flex', gap: '10px', borderTop: '1px solid #F8FAFC', paddingTop: '15px' };
const btnAction = (bg, c) => ({ flex: 1, background: bg, color: c, border: 'none', padding: '10px', borderRadius: '12px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', transition: '0.2s' });

export default UnifiedManagerGrid;