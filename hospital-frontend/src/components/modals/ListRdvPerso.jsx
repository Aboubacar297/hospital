import React, { useMemo } from 'react';
import { 
  FiClock, 
  FiCalendar, 
  FiArrowRight, 
  FiCheckCircle, 
  FiActivity,
  FiPhone
} from 'react-icons/fi';

const ListRdvPerso = ({ allAppointments, patients, user, setActiveModal, setFormData }) => {
  
  // ✅ FILTRAGE AVEC NORMALISATION TOTALE
  const mesRdvDuJour = useMemo(() => {
    // 1. Obtenir la date du jour au format YYYY-MM-DD local
    const today = new Date();
    const todayStr = today.toLocaleDateString('en-CA'); // "2026-02-07"

    // 2. ID de l'utilisateur connecté normalisé en String
    const currentUserId = user?.id ? String(user.id) : null;

    return (allAppointments || []).filter(rdv => {
      if (!rdv.date || !rdv.medecin_id) return false;

      // Normalisation des IDs (Force le passage en String)
      const rdvMedecinId = String(rdv.medecin_id);
      
      // Normalisation de la date (Prend les 10 premiers caractères YYYY-MM-DD)
      const rdvDate = String(rdv.date).substring(0, 10);

      const isMine = rdvMedecinId === currentUserId;
      const isToday = rdvDate === todayStr;
      const isActive = rdv.statut?.toUpperCase() !== 'ANNULE';

      return isMine && isToday && isActive;
    }).sort((a, b) => (a.heure || "").localeCompare(b.heure || "")); 
  }, [allAppointments, user]);

  const getPatientInfo = (id) => {
    // Normalisation de l'ID patient pour la recherche dans la liste
    const p = patients.find(p => String(p.id) === String(id));
    return p ? { 
      name: `${String(p.nom).toUpperCase()} ${p.prenom}`, 
      phone: p.telephone || "Sans numéro" 
    } : { name: "Patient inconnu", phone: "-" };
  };

  const handleStartConsultation = (rdv) => {
    const patient = getPatientInfo(rdv.patient_id);
    setFormData({
      ...rdv,
      rdv_id: rdv.id, 
      patient_name: patient.name,
      patient_id: rdv.patient_id,
      // Supporte les deux noms de colonnes pour la transition finance
      montant_acte: rdv.montant || rdv.montant_acte || 0 
    });
    setActiveModal('form_consultation');
  };

  return (
    <div style={styles.container}>
      {/* Header Statutaire : Profil du médecin et compteur */}
      <div style={styles.headerStats}>
        <div style={styles.doctorBadge}>
          <div style={styles.avatar}>
            {user?.nom ? user.nom.substring(0, 2).toUpperCase() : "DR"}
          </div>
          <div>
            <div style={styles.docName}>Dr. {user?.nom || 'Médecin'}</div>
            <div style={styles.docRole}>Session Active • ID #{user?.id}</div>
          </div>
        </div>
        <div style={styles.countBadge}>
          <span style={styles.countNumber}>{mesRdvDuJour.length}</span>
          <span style={styles.countLabel}>PATIENTS CE JOUR</span>
        </div>
      </div>

      <div style={styles.listWrapper} className="no-scrollbar">
        {mesRdvDuJour.length > 0 ? (
          mesRdvDuJour.map((rdv) => {
            const patient = getPatientInfo(rdv.patient_id);
            const status = String(rdv.statut || '').toUpperCase();
            // Liste des statuts considérés comme "Traités"
            const isDone = ['TERMINE', 'CONSULTE', 'PAYE'].includes(status);

            return (
              <div key={rdv.id} style={{
                ...styles.rdvCard, 
                opacity: isDone ? 0.7 : 1,
                borderLeft: isDone ? '5px solid #10B981' : '5px solid #3B82F6',
                background: isDone ? '#F8FAFC' : '#FFFFFF'
              }}>
                <div style={styles.timeBox}>
                  <FiClock size={14} />
                  <span>{String(rdv.heure).substring(0, 5)}</span>
                </div>

                <div style={styles.mainInfo}>
                  <div style={styles.patientName}>{patient.name}</div>
                  <div style={styles.detailsLine}>
                    <span style={styles.detailItem}>
                       <FiActivity size={12} color="#3B82F6" /> {rdv.motif || 'Consultation'}
                    </span>
                    <span style={styles.detailItem}>
                       <FiPhone size={12} color="#64748B" /> {patient.phone}
                    </span>
                  </div>
                </div>

                <div style={styles.actionArea}>
                  {isDone ? (
                    <div style={styles.doneBadge}>
                      <FiCheckCircle /> TRAITÉ
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleStartConsultation(rdv)}
                      style={styles.examineBtn}
                    >
                      CONSULTER <FiArrowRight />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div style={styles.emptyState}>
            <FiCalendar size={50} color="#E2E8F0" />
            <p style={{ margin: '15px 0 5px 0', fontWeight: '800', color: '#64748B' }}>
              LISTE D'ATTENTE VIDE
            </p>
            <small style={{ color: '#94A3B8', maxWidth: '300px', lineHeight: 1.5 }}>
              Aucun rendez-vous n'est programmé à votre nom pour aujourd'hui ({new Date().toLocaleDateString('fr-FR')}).
            </small>
          </div>
        )}
      </div>
    </div>
  );
};

// --- STYLES ---
const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '20px' },
  headerStats: { 
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    background: '#0F172A', padding: '25px', borderRadius: '24px', color: 'white',
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
  },
  doctorBadge: { display: 'flex', alignItems: 'center', gap: '15px' },
  avatar: { 
    width: '50px', height: '50px', borderRadius: '15px', background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)', 
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '20px' 
  },
  docName: { fontSize: '18px', fontWeight: '800', letterSpacing: '-0.5px' },
  docRole: { fontSize: '10px', color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase', marginTop: '2px' },
  countBadge: { textAlign: 'right', display: 'flex', flexDirection: 'column' },
  countNumber: { fontSize: '38px', fontWeight: '900', lineHeight: 1, color: '#3B82F6' },
  countLabel: { fontSize: '9px', fontWeight: '800', color: '#94A3B8', marginTop: '5px' },
  
  listWrapper: { display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '60vh', overflowY: 'auto', paddingRight: '5px' },
  rdvCard: { 
    display: 'flex', alignItems: 'center', padding: '18px 20px', 
    borderRadius: '20px', border: '1px solid #F1F5F9',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
    transition: 'all 0.2s ease'
  },
  timeBox: { 
    width: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', 
    gap: '6px', color: '#4F46E5', fontWeight: '900', fontSize: '15px', borderRight: '1px solid #F1F5F9', paddingRight: '20px'
  },
  mainInfo: { flex: 1, paddingLeft: '20px' },
  patientName: { fontSize: '15px', fontWeight: '800', color: '#1E293B', textTransform: 'uppercase' },
  detailsLine: { display: 'flex', gap: '20px', marginTop: '6px' },
  detailItem: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748B', fontWeight: '600' },
  
  actionArea: { paddingLeft: '20px' },
  examineBtn: { 
    background: '#0F172A', color: 'white', border: 'none', padding: '10px 20px', 
    borderRadius: '12px', fontSize: '11px', fontWeight: '900', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: '10px', transition: 'transform 0.2s'
  },
  doneBadge: { display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', fontSize: '11px', fontWeight: '900' },
  emptyState: { padding: '60px 0', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }
};

export default ListRdvPerso;