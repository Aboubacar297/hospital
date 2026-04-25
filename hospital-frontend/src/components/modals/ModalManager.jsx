import React, { useState, useEffect, useCallback } from 'react';
import { FiX } from 'react-icons/fi';
import api from '../../services/api'; 

import FormPatient from './FormPatient';
import FormRdv from './FormRdv';
import FormConsultation from './FormConsultation';
import ListPatientsDme from './ListPatientsDme';
import ViewFullDme from './ViewFullDme';
import ListFactures from './ListFactures';
import ViewStaffStats from './ViewStaffStats';
import FormAddPlanning from './FormAddPlanning';
import ListStaffManage from './ListStaffManage'; 
import FormUserAdmin from './FormUserAdmin';
import ViewAuditLogs from './ViewAuditLogs'; 
import ViewSystemLogs from './ViewSystemLogs';
import FormPaiement from './FormPaiement';
import SettingsModal from './SettingsModal';
import ListRdvManage from './ListRdvManage';
import ListRdvPerso from './ListRdvPerso';

const ModalManager = (props) => {
  const { activeModal, setActiveModal, setFormData, formData, fetchData } = props;
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Nettoyage des données à la fermeture de la modale
  useEffect(() => {
    if (!activeModal) {
      const timer = setTimeout(() => {
        setFormData({});
        setIsSubmitting(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [activeModal, setFormData]); 

  // ✅ LOGIQUE DE SUPPRESSION LOCALE ET CORRIGÉE
  const handleDelete = useCallback(async (entity, id) => {
    // Normalisation du nom de l'entité (ex: patient -> patients) pour l'URL
    const entityKey = entity.endsWith('s') ? entity : `${entity}s`;
    
    const confirmMsg = `Confirmer la suppression définitive de cet élément (${entity}) ?`;
    if (!window.confirm(confirmMsg)) return;

    setLoading(true);
    try {
      const endpoints = { 
        patients: '/patients/', 
        rendezvous: '/rendezvous/', 
        users: '/users/' 
      };

      if (!endpoints[entityKey]) {
        throw new Error(`Endpoint non configuré pour : ${entityKey}`);
      }

      console.log(`[API DELETE] Tentative sur : ${endpoints[entityKey]}${id}`);
      const response = await api.delete(`${endpoints[entityKey]}${id}`);
      
      if (response.status === 200 || response.status === 204) { 
        // Rafraîchit les données globales après suppression
        if (fetchData) await fetchData(); 
        alert("Suppression effectuée avec succès.");
      }
    } catch (err) {
      console.error("Erreur suppression:", err);
      const errorDetail = err.response?.data?.detail || "Action impossible (vérifiez les contraintes d'intégrité)";
      alert("Erreur: " + errorDetail);
    } finally { 
      setLoading(false); 
    }
  }, [fetchData]);

  const handleAction = async (e, customData = null) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setLoading(true);
    
    const rawData = customData || formData;
    const rdvIdToLink = rawData.rdv_id || (activeModal === 'form_consultation' ? rawData.id : null);
    
    const dataToSend = { 
      ...rawData,
      rdv_id: rdvIdToLink ? parseInt(rdvIdToLink) : null, 
      medecin_id: rawData.medecin_id ? parseInt(rawData.medecin_id) : (props.user?.id ? parseInt(props.user.id) : null),
      patient_id: rawData.patient_id ? parseInt(rawData.patient_id) : null,
      montant: parseFloat(rawData.montant) || parseFloat(rawData.montant_acte) || 0.0
    };

    try {
      let endpoint = "";
      if (activeModal.includes('patient')) endpoint = "/patients/";
      else if (activeModal.includes('rdv')) endpoint = "/rendezvous/";
      else if (activeModal.includes('consultation')) endpoint = "/consultations/";
      else if (activeModal.includes('planning')) endpoint = "/planning/"; 
      else if (activeModal.includes('paiement') || activeModal.includes('facture')) endpoint = "/factures/";
      else if (activeModal.includes('user') || activeModal.includes('staff')) endpoint = "/users/"; 

      let response;
      if (activeModal === 'form_consultation') {
        const payload = { ...dataToSend };
        delete payload.id; 
        response = await api.post(endpoint, payload);
        if ((response.status === 201 || response.status === 200) && rdvIdToLink) {
          await api.put(`/rendezvous/${rdvIdToLink}`, { ...dataToSend, statut: 'TERMINE' });
        }
      } else if (dataToSend.id) {
        response = await api.put(`${endpoint}${dataToSend.id}`, dataToSend);
      } else {
        response = await api.post(endpoint, dataToSend);
      }
      
      if (response.status === 200 || response.status === 201) {
        await fetchData(); 
        setActiveModal(null); 
        setFormData({}); 
      }
    } catch (err) {
      alert("Erreur: " + (err.response?.data?.detail || "Action impossible"));
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  if (!activeModal) return null;

  const isLarge = activeModal.startsWith('list') || activeModal.startsWith('view') || 
                  ['form_consultation', 'form_settings', 'list_rdv_manage', 'list_rdv_perso'].includes(activeModal);

  const isFull = ['view_full_dme', 'view_staff_stats', 'view_audit_logs', 'view_system_logs'].includes(activeModal);

  // ✅ INJECTION : safeProps transmet la fonction handleDelete locale aux composants enfants
  const safeProps = {
    ...props,
    formData: formData || {}, 
    handleAction,
    handleDelete, 
    loading: loading || isSubmitting,
    isAdmin: props.user?.role?.toUpperCase() === 'ADMIN'
  };

  const renderContent = () => {
    switch (activeModal) {
      case 'list_patients_dme': return <ListPatientsDme {...safeProps} />;
      case 'form_patient':      return <FormPatient {...safeProps} />;
      case 'form_rdv':          return <FormRdv {...safeProps} />;
      case 'form_consultation': return <FormConsultation {...safeProps} />;
      case 'view_full_dme':     return <ViewFullDme {...safeProps} />;
      case 'list_factures':     return <ListFactures {...safeProps} />;
      case 'form_add_planning': return <FormAddPlanning {...safeProps} />;
      case 'view_staff_stats':  return <ViewStaffStats {...safeProps} />;
      case 'list_staff_manage': return <ListStaffManage {...safeProps} />;
      case 'form_user_admin':   return <FormUserAdmin {...safeProps} />;
      case 'view_audit_logs':   return <ViewAuditLogs {...safeProps} />;
      case 'view_system_logs':  return <ViewSystemLogs {...safeProps} />;
      case 'form_paiement':     return <FormPaiement {...safeProps} />;
      case 'form_settings':     return <SettingsModal {...safeProps} />;
      case 'list_rdv_manage':   return <ListRdvManage {...safeProps} />;
      case 'list_rdv_perso':    return <ListRdvPerso {...safeProps} />;
      default: return null;
    }
  };

  return (
    <div style={styles.overlay} onClick={() => setActiveModal(null)}>
      <div 
        style={{ 
            ...styles.container, 
            maxWidth: isFull ? '1350px' : isLarge ? '1100px' : '520px',
            height: isLarge || isFull ? '92vh' : 'auto',
        }} 
        onClick={(e) => e.stopPropagation()}
      >
        <div style={styles.header}>
          <div style={styles.titleWrapper}>
            <div style={styles.indicator}></div>
            <h2 style={styles.title}>{String(activeModal).replace(/_/g, ' ').toUpperCase()}</h2>
          </div>
          <button onClick={() => setActiveModal(null)} style={styles.closeBtn}><FiX size={18} /></button>
        </div>
        <div style={styles.body} className="no-scrollbar">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.88)', backdropFilter: 'blur(12px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '20px' },
  container: { background: 'white', borderRadius: '32px', width: '100%', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', overflow: 'hidden', border: '1px solid #E2E8F0', transition: '0.3s' },
  header: { padding: '15px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F1F5F9' },
  titleWrapper: { display: 'flex', alignItems: 'center', gap: '10px' },
  indicator: { width: '4px', height: '18px', background: '#4F46E5', borderRadius: '4px' },
  title: { margin: 0, fontSize: '11px', color: '#1E293B', fontWeight: '900', letterSpacing: '1px' },
  closeBtn: { background: '#F1F5F9', border: 'none', borderRadius: '12px', padding: '8px', cursor: 'pointer', color: '#64748B', display: 'flex' },
  body: { padding: '20px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column' }
};

export default ModalManager;