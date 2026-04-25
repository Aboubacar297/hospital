import React, { useState, useEffect, useMemo } from 'react';
import { 
  FiClock, 
  FiCalendar, 
  FiUser, 
  FiCheck, 
  FiX, 
  FiActivity, 
  FiDollarSign 
} from 'react-icons/fi';
import api from '../../services/api';

const FormRdv = ({ 
  patients, 
  medecins, 
  allAppointments, 
  handleAction, 
  setFormData, 
  formData, 
  loading, 
  setActiveModal 
}) => {
  const [actes, setActes] = useState([]);

  // 1. Chargement du catalogue des tarifs/actes au montage
  useEffect(() => {
    api.get('/tarifications/')
      .then(res => setActes(res.data))
      .catch(err => console.error("Erreur catalogue tarifs:", err));
  }, []);

  // 2. Filtrage des utilisateurs pour n'afficher que les médecins
  const listeMedecins = useMemo(() => {
    if (!medecins || !Array.isArray(medecins)) return [];
    return medecins.filter(u => u.role?.toUpperCase() === 'MEDECIN');
  }, [medecins]);

  // 3. Filtrage dynamique des créneaux (Plannings)
  const planningsDisponibles = useMemo(() => {
    if (!formData.medecin_id || listeMedecins.length === 0) return [];
    
    const medecinSelectionne = listeMedecins.find(m => String(m.id) === String(formData.medecin_id));
    const tousLesPlannings = medecinSelectionne?.plannings || [];

    // On retire les créneaux déjà occupés par un RDV actif
    return tousLesPlannings.filter(planning => {
      const estDejaPris = (allAppointments || []).some(rdv => 
        String(rdv.planning_selectionne) === String(planning.id) && 
        rdv.statut !== 'ANNULE'
      );
      return !estDejaPris; 
    });
  }, [formData.medecin_id, listeMedecins, allAppointments]);

  // 4. Gestion de la sélection d'un créneau
  const handleSelectPlanning = (e) => {
    const planningId = e.target.value;
    if (!planningId) return;

    const selectedPlan = planningsDisponibles.find(p => String(p.id) === String(planningId));
    
    if (selectedPlan) {
      const joursSemaine = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
      const targetDayIdx = joursSemaine.indexOf(selectedPlan.jour);
      
      const today = new Date();
      const nextDate = new Date();
      
      // Calcul de la prochaine occurrence du jour sélectionné
      const diff = (targetDayIdx + 7 - today.getDay()) % 7;
      nextDate.setDate(today.getDate() + (diff === 0 ? 0 : diff));
      
      // ✅ FORMAT DATE LOCALE YYYY-MM-DD (Compatible en-CA pour éviter le décalage UTC)
      const dateString = nextDate.toLocaleDateString('en-CA');

      setFormData({
        ...formData,
        planning_selectionne: planningId,
        date: dateString,
        heure: selectedPlan.heure_debut,
        statut: 'EN_ATTENTE' // ✅ CRUCIAL : Indispensable pour l'incrémentation du compteur "Attente"
      });
    }
  };

  return (
    <form onSubmit={(e) => handleAction(e)} style={styles.formContainer}>
      <div style={styles.infoBox}>
        <FiActivity size={18} color="#4F46E5" />
        <span style={{ fontSize: '13px', color: '#0369A1', fontWeight: '700' }}>RÉSERVATION UNITÉ OPÉRATIONNELLE</span>
      </div>

      <div style={styles.inputGroupGrid}>
        {/* MÉDECIN */}
        <div style={styles.inputWrapper}>
          <label style={styles.labelStyle}><FiUser size={13}/> Médecin Référent</label>
          <select 
            style={styles.modernInput} 
            required 
            value={formData.medecin_id || ''} 
            onChange={e => setFormData({ ...formData, medecin_id: e.target.value, planning_selectionne: '', date: '', heure: '' })}
          >
            <option value="">-- Choisir --</option>
            {listeMedecins.map(m => (
              <option key={m.id} value={m.id}>Dr. {m.nom?.toUpperCase()} ({m.specialite || 'Généraliste'})</option>
            ))}
          </select>
        </div>

        {/* CRÉNEAU */}
        <div style={styles.inputWrapper}>
          <label style={styles.labelStyle}><FiClock size={13}/> Créneaux Libres</label>
          <select 
            style={styles.modernInput} 
            disabled={!formData.medecin_id} 
            value={formData.planning_selectionne || ''} 
            onChange={handleSelectPlanning} 
            required
          >
            <option value="">{formData.medecin_id ? "-- Sélectionner --" : "Choisir un médecin"}</option>
            {planningsDisponibles.map(p => (
              <option key={p.id} value={p.id}>{p.jour} à {p.heure_debut}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={styles.inputGroupGrid}>
        <div style={styles.inputWrapper}>
          <label style={styles.labelStyle}><FiCalendar size={13}/> Date Validée</label>
          <input type="date" style={{...styles.modernInput, background: '#F8FAFC'}} readOnly value={formData.date || ''} />
        </div>
        <div style={styles.inputWrapper}>
          <label style={styles.labelStyle}><FiClock size={13}/> Heure Début</label>
          <input type="time" style={{...styles.modernInput, background: '#F8FAFC'}} readOnly value={formData.heure || ''} />
        </div>
      </div>

      {/* ACTE MÉDICAL */}
      <div style={styles.inputWrapper}>
        <label style={styles.labelStyle}><FiDollarSign size={13}/> Acte Médical & Tarification</label>
        <select 
          style={styles.modernInput} 
          required 
          value={formData.tarif_id || ''} 
          onChange={(e) => {
            const a = actes.find(ac => String(ac.id) === String(e.target.value));
            if(a) setFormData({...formData, tarif_id: a.id, montant_acte: a.prix, motif: a.nom_acte});
          }}
        >
            <option value="">-- Sélectionner l'acte --</option>
            {actes.map(a => <option key={a.id} value={a.id}>{a.nom_acte} ({a.prix} DH)</option>)}
        </select>
      </div>

      {/* PATIENT */}
      <div style={styles.inputWrapper}>
        <label style={styles.labelStyle}><FiUser size={13}/> Dossier Patient</label>
        <select 
          style={styles.modernInput} 
          required 
          value={formData.patient_id || ''} 
          onChange={e => setFormData({ ...formData, patient_id: e.target.value })}
        >
          <option value="">-- Sélectionner --</option>
          {patients && patients.map(p => (
            <option key={p.id} value={p.id}>{p.nom?.toUpperCase()} {p.prenom}</option>
          ))}
        </select>
      </div>

      <div style={styles.btnArea}>
        <button type="button" style={styles.cancelBtn} onClick={() => setActiveModal(null)}><FiX /> Annuler</button>
        <button type="submit" style={styles.primaryBtn} disabled={loading || !formData.date}>
          {loading ? "Traitement..." : <><FiCheck /> Confirmer le RDV</>}
        </button>
      </div>
    </form>
  );
};

const styles = {
  formContainer: { display: 'flex', flexDirection: 'column', gap: '12px' },
  infoBox: { background: '#F0F9FF', padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #E0F2FE' },
  inputGroupGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
  inputWrapper: { display: 'flex', flexDirection: 'column', gap: '5px' },
  labelStyle: { fontSize: '10px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' },
  modernInput: { padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '13px', outline: 'none', width: '100%', transition: '0.2s' },
  btnArea: { display: 'flex', gap: '12px', marginTop: '10px' },
  primaryBtn: { flex: 2, padding: '14px', borderRadius: '10px', background: '#0F172A', color: 'white', fontWeight: '800', cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
  cancelBtn: { flex: 1, padding: '14px', borderRadius: '10px', border: '1px solid #E2E8F0', background: 'white', color: '#64748B', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }
};

export default FormRdv;