import React, { useState } from 'react';
import { 
  FiUserPlus, FiCalendar, FiUsers, FiUserCheck,
  FiDollarSign, FiGrid, 
  FiSettings, FiList, FiLogOut, FiActivity, 
  FiDatabase, FiSearch, FiBarChart2, FiPlusCircle,
  FiTerminal 
} from 'react-icons/fi';

const Sidebar = ({ isAdmin, isMedecin, setActiveModal, setFormData, onLogout, user }) => {
  const [isHovered, setIsHovered] = useState(false);

  // --- LOGIQUE DES RÔLES ---
  const role = user?.role?.toUpperCase();
  const isReceptionniste = ['ACCEUIL', 'ACCUEIL', 'RECEPTIONNISTE'].includes(role);
  const isInfirmier = role === 'INFIRMIER';
  
  // ✅ DROITS FILTRÉS
  const canSeeMedical = isMedecin || isAdmin;
  // L'infirmier voit l'accueil et les listes, mais pas la caisse (réservée Accueil/Admin)
  const canSeeReception = isReceptionniste || isInfirmier || isAdmin;

  const NAVBAR_HEIGHT = "70px"; 

  const styles = {
    sidebar: { 
      width: isHovered ? '260px' : '80px', 
      background: '#0F172A', 
      color: 'white', 
      padding: '15px 10px', 
      display: 'flex', 
      flexDirection: 'column', 
      position: 'fixed', 
      top: NAVBAR_HEIGHT, 
      left: 0,      
      height: `calc(100vh - ${NAVBAR_HEIGHT})`, 
      transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      zIndex: 1000, 
      boxShadow: '4px 0 10px rgba(0,0,0,0.1)',
      borderRight: '1px solid rgba(255,255,255,0.05)',
    },
    scrollArea: { flex: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', gap: '4px' },
    btn: (active) => ({
      display: 'flex', alignItems: 'center', gap: '15px', padding: '10px 12px', minHeight: '40px',
      cursor: 'pointer', border: 'none', background: active ? 'rgba(99, 102, 241, 0.15)' : 'transparent', 
      borderRadius: '10px', color: active ? '#818CF8' : '#94A3B8', transition: 'all 0.2s', width: '100%',
      justifyContent: isHovered ? 'flex-start' : 'center',
    }),
    label: { opacity: isHovered ? 1 : 0, display: isHovered ? 'block' : 'none', fontWeight: '600', whiteSpace: 'nowrap', fontSize: '12.5px' }
  };

  const NavItem = ({ icon: Icon, label, modal, show = true, active = false, customColor = null }) => {
    if (!show) return null;
    return (
      <button 
        style={{...styles.btn(active), color: customColor || (active ? '#818CF8' : '#94A3B8')}} 
        onClick={() => {
          if (modal) {
            if (setFormData) setFormData({}); 
            setActiveModal(modal);
          }
        }}
        title={!isHovered ? label : ""} 
      >
        <div style={{ fontSize: '18px', minWidth: '24px', display: 'flex', justifyContent: 'center' }}>
          <Icon />
        </div>
        <span style={styles.label}>{label}</span>
      </button>
    );
  };

  return (
    <>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { width: 3px; }
        .no-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
      
      <aside style={styles.sidebar} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <nav style={styles.scrollArea} className="no-scrollbar">
          <NavItem icon={FiGrid} label="Dashboard" active={true} />
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '8px 5px' }} />

          {/* ACCUEIL & ADMISSIONS */}
          <NavItem icon={FiUserPlus} label="Nouveau Patient" modal="form_patient" show={canSeeReception} />
          <NavItem icon={FiSearch} label="Liste Patients" modal="list_patients_dme" show={canSeeReception || isMedecin} />
          <NavItem icon={FiCalendar} label="Créer RDV" modal="form_rdv" show={canSeeReception} />
          
          {/* CAISSE (Masqué pour l'Infirmier) */}
          <NavItem icon={FiDollarSign} label="Caisse & Factures" modal="list_factures" show={isReceptionniste || isAdmin} />

          {/* MEDICAL (Masqué pour l'Infirmier) */}
          <NavItem icon={FiActivity} label="Consultations" modal="form_consultation" show={canSeeMedical} />
          
          {/* PLANNING & LISTES */}
          <NavItem icon={FiList} label="Liste des RDV" modal="list_rdv_manage" show={isAdmin || isReceptionniste || isInfirmier} />
          <NavItem icon={FiPlusCircle} label="Ajouter Planning" modal="form_add_planning" show={canSeeMedical} />
          
          {/* PERSO */}
          <NavItem icon={FiUserCheck} label="RDV Perso" modal="list_rdv_perso" show={isMedecin && !isAdmin} />

          {/* ADMIN SECTION */}
          {isAdmin && (
            <>
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '15px 5px 8px 5px' }} />
              <NavItem icon={FiBarChart2} label="Analyses & Rapports" modal="view_staff_stats" />
              <NavItem icon={FiUsers} label="Gestion Staff" modal="list_staff_manage" />
              <NavItem icon={FiDatabase} label="Logs d'Audit" modal="view_audit_logs" />
              <NavItem icon={FiTerminal} label="Console Logs" modal="view_system_logs" customColor="#6366F1" />
              <NavItem icon={FiSettings} label="Configuration" modal="form_settings" />
            </>
          )}
        </nav>

        <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
          <button onClick={onLogout} style={styles.btn(false)}>
            <div style={{ fontSize: '18px', minWidth: '24px', display: 'flex', justifyContent: 'center', color: '#F87171' }}><FiLogOut /></div>
            <span style={{ ...styles.label, color: '#F87171' }}>Quitter</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;