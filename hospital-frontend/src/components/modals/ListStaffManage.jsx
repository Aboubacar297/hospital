import React, { useState } from 'react';
import { FiEdit, FiTrash2, FiUserCheck, FiShield, FiPlus, FiUsers, FiSearch } from 'react-icons/fi';

const ListStaffManage = ({ staff, handleDelete, setActiveModal, setFormData }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrage dynamique pour la recherche
  const filteredStaff = staff?.filter(member => 
    member.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.nom_utilisateur?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const styles = {
    container: { display: 'flex', flexDirection: 'column', gap: '15px', padding: '10px' },
    headerActions: { display: 'flex', gap: '10px', marginBottom: '10px' },
    searchWrapper: { 
      flex: 1, 
      position: 'relative', 
      display: 'flex', 
      alignItems: 'center' 
    },
    searchInput: {
      width: '100%',
      padding: '12px 12px 12px 40px',
      borderRadius: '12px',
      border: '1.5px solid #E2E8F0',
      fontSize: '13px',
      outline: 'none',
      background: '#F8FAFC'
    },
    addBtn: { 
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
      background: '#4F46E5', color: 'white', border: 'none', padding: '12px 20px',
      borderRadius: '12px', cursor: 'pointer', fontWeight: '800',
      boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)', transition: 'all 0.2s',
      fontSize: '12px'
    },
    row: { 
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
      padding: '16px 20px', background: 'white', borderRadius: '20px', 
      border: '1px solid #F1F5F9', transition: 'all 0.2s' 
    },
    info: { display: 'flex', alignItems: 'center', gap: '15px' },
    avatar: (isAdmin) => ({ 
      background: isAdmin ? '#FEE2E2' : '#EEF2FF', 
      padding: '12px', borderRadius: '14px', display: 'flex',
      color: isAdmin ? '#DC2626' : '#4F46E5'
    }),
    roleBadge: (role) => {
      const r = role?.toUpperCase();
      const isA = r === 'ADMIN';
      const isM = r === 'MEDECIN' || r === 'DOCTEUR';
      return {
        padding: '3px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: '900',
        background: isA ? '#FEE2E2' : isM ? '#DCFCE7' : '#E0F2FE',
        color: isA ? '#B91C1C' : isM ? '#166534' : '#0369A1',
        textTransform: 'uppercase', letterSpacing: '0.5px'
      };
    },
    actions: { display: 'flex', gap: '8px' },
    actionBtn: (bg) => ({ 
      border: 'none', background: bg, padding: '10px', borderRadius: '10px', 
      cursor: 'pointer', display: 'flex', transition: '0.2s' 
    })
  };

  return (
    <div style={styles.container}>
      {/* BARRE DE RECHERCHE ET BOUTON AJOUT */}
      <div style={styles.headerActions}>
        <div style={styles.searchWrapper}>
          <FiSearch style={{ position: 'absolute', left: '15px', color: '#94A3B8' }} />
          <input 
            style={styles.searchInput}
            placeholder="Rechercher un membre (Nom, login, rôle)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          className="add-staff-hover"
          style={styles.addBtn} 
          onClick={() => { setFormData({}); setActiveModal('form_user_admin'); }}
        >
          <FiPlus size={18} /> AJOUTER
        </button>
      </div>

      {/* LISTE SCROLLABLE */}
      <div className="no-scrollbar" style={{ maxHeight: '65vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredStaff?.length > 0 ? filteredStaff.map(member => {
          const isAdmin = member.role?.toUpperCase() === 'ADMIN';
          
          return (
            <div key={member.id} style={styles.row} className="staff-row-hover">
              <div style={styles.info}>
                <div style={styles.avatar(isAdmin)}>
                  {isAdmin ? <FiShield size={20} /> : <FiUserCheck size={20} />}
                </div>
                <div>
                  <div style={{ color: '#0F172A', fontSize: '15px', fontWeight: '900' }}>
                    {member.nom || member.nom_utilisateur}
                  </div>
                  <div style={{ marginTop: '5px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={styles.roleBadge(member.role)}>{member.role}</span>
                    <span style={{ fontSize: '11px', color: '#94A3B8' }}>ID: {member.id}</span>
                  </div>
                </div>
              </div>

              <div style={styles.actions}>
                <button 
                  title="Modifier le profil"
                  onClick={() => { setFormData(member); setActiveModal('form_user_admin'); }}
                  style={styles.actionBtn('#F1F5F9')}
                >
                  <FiEdit size={16} color="#64748B" />
                </button>
                <button 
                  title="Supprimer l'accès"
                  onClick={() => {
                    if(window.confirm(`Voulez-vous vraiment révoquer l'accès de ${member.nom_utilisateur} ?`)) {
                      handleDelete('users', member.id); 
                    }
                  }}
                  style={styles.actionBtn('#FFF1F2')}
                >
                  <FiTrash2 size={16} color="#E11D48" />
                </button>
              </div>
            </div>
          );
        }) : (
          <div style={{ textAlign: 'center', padding: '50px', background: '#F8FAFC', borderRadius: '24px', border: '2px dashed #E2E8F0' }}>
            <FiUsers size={40} color="#CBD5E1" style={{ marginBottom: '10px' }} />
            <p style={{ color: '#94A3B8', fontSize: '14px' }}>Aucun résultat trouvé.</p>
          </div>
        )}
      </div>

      <style>{`
        .add-staff-hover:hover { background: #4338CA !important; transform: translateY(-2px); }
        .staff-row-hover:hover { border-color: #4F46E5 !important; background: #F8FAFC !important; transform: scale(1.01); }
        .no-scrollbar::-webkit-scrollbar { width: 4px; }
        .no-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default ListStaffManage;