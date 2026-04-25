import React, { useState, useEffect } from 'react';
import { FiPrinter, FiClock, FiActivity, FiFileText, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import api from '../../services/api';
import { generatePDF } from '../../services/printService';

const ViewFullDme = ({ formData, patients }) => {
  const [history, setHistory] = useState([]);
  const [payments, setPayments] = useState([]);
  const [activeTab, setActiveTab] = useState('medical');
  // ✅ 'loading' supprimé car non utilisé pour le moment

  const patientId = formData?.patient_id || formData?.id;
  const patient = patients.find(p => String(p.id) === String(patientId));

  useEffect(() => {
    if (!patientId) return;
    
    // Récupération groupée des données
    Promise.all([
      api.get(`/consultations/patient/${patientId}`),
      api.get(`/patients/${patientId}/paiements`)
    ]).then(([resMed, resFin]) => {
      setHistory(resMed.data || []);
      setPayments(resFin.data || []);
    }).catch(err => console.error("Erreur de synchronisation DME", err));
  }, [patientId]);

  if (!patient) return <div style={{ padding: '20px', textAlign: 'center' }}><FiAlertCircle /> Patient introuvable</div>;

  const totalDu = payments.reduce((acc, p) => acc + (p.statut_paiement !== 'PAYE' ? p.montant : 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '15px' }}>
      
      {/* HEADER PATIENT */}
      <div style={styles.header}>
        <div>
          <h3 style={{ margin: 0 }}>{patient.nom} {patient.prenom}</h3>
          <span style={{ fontSize: '12px', color: totalDu > 0 ? '#FCA5A5' : '#86EFAC', fontWeight: 'bold' }}>
            {totalDu > 0 ? `Dette : ${totalDu} DH` : 'Règlement à jour'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setActiveTab('medical')} style={activeTab === 'medical' ? styles.tabActive : styles.tabStyle}>Médical</button>
          <button onClick={() => setActiveTab('finance')} style={activeTab === 'finance' ? styles.tabActive : styles.tabStyle}>Finances</button>
        </div>
      </div>

      {/* ZONE DE CONTENU */}
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '5px' }} className="no-scrollbar">
        {activeTab === 'medical' ? (
          history.map((h, i) => (
            <div key={i} style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.dateLabel}><FiClock /> {new Date(h.date_creation).toLocaleDateString()}</span>
                <button style={styles.printBtn} onClick={() => generatePDF('ORDONNANCE', h)}><FiPrinter /> Imprimer</button>
              </div>
              <div style={{ marginTop: '10px' }}>
                <div style={styles.sectionTitle}><FiActivity /> Diagnostic</div>
                <p style={styles.text}>{h.diagnostic}</p>
                <div style={styles.sectionTitle}><FiFileText /> Traitement</div>
                <p style={{ ...styles.text, color: '#4F46E5', fontWeight: '600' }}>{h.prescriptions || 'N/A'}</p>
              </div>
            </div>
          ))
        ) : (
          payments.map((p, i) => (
            <div key={i} style={styles.paymentRow}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FiCheckCircle color={p.statut_paiement === 'PAYE' ? '#10B981' : '#EF4444'} />
                <span>{new Date(p.date_paiement || Date.now()).toLocaleDateString()} - {p.mode_paiement}</span>
              </div>
              <span style={{ fontWeight: 'bold' }}>{p.montant} DH</span>
            </div>
          ))
        )}

        {(activeTab === 'medical' ? history : payments).length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#94A3B8' }}>Aucune donnée disponible.</div>
        )}
      </div>
    </div>
  );
};

// --- STYLES ---
const styles = {
  header: { 
    background: '#1E293B', color: 'white', padding: '20px', borderRadius: '20px', 
    display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
  },
  tabStyle: { padding: '8px 16px', cursor: 'pointer', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '10px', fontSize: '12px', fontWeight: '600' },
  tabActive: { padding: '8px 16px', cursor: 'pointer', background: '#4F46E5', border: 'none', color: 'white', borderRadius: '10px', fontSize: '12px', fontWeight: '700' },
  card: { background: 'white', padding: '15px', marginBottom: '12px', borderRadius: '16px', border: '1px solid #E2E8F0' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' },
  dateLabel: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748B', fontWeight: '600' },
  printBtn: { display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', color: '#4F46E5', cursor: 'pointer', fontSize: '12px', fontWeight: '700' },
  sectionTitle: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', marginTop: '10px' },
  text: { margin: '5px 0 0 0', fontSize: '13px', color: '#1E293B', lineHeight: '1.4' },
  paymentRow: { display: 'flex', justifyContent: 'space-between', padding: '15px', background: '#F8FAFC', borderRadius: '12px', marginBottom: '8px', border: '1px solid #E2E8F0', fontSize: '13px' }
};

export default ViewFullDme;