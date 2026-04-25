import React from 'react';
import { FiDollarSign, FiCheckCircle, FiFileText, FiClock, FiPrinter } from 'react-icons/fi';
import api from '../../services/api'; // ✅ Assurez-vous d'importer votre config API

const cardS = { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'15px', borderBottom:'1px solid #F1F5F9', background:'white', borderRadius:'12px', marginBottom:'8px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' };
const payBtn = { background:'#4F46E5', color:'white', border:'none', padding:'8px 16px', borderRadius:'10px', cursor:'pointer', display:'flex', alignItems:'center', gap:'5px', fontSize:'12px', fontWeight:'800' };
const paidBtn = { background:'#DCFCE7', color:'#15803D', border:'none', padding:'8px 16px', borderRadius:'10px', display:'flex', alignItems:'center', gap:'5px', fontSize:'12px', fontWeight:'800' };
const printBtn = { background: '#F8FAFC', color: '#64748B', border: '1px solid #E2E8F0', padding: '8px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: '0.2s' };

const ListFactures = ({ factures, patients, setActiveModal, setFormData }) => {
  
  const ouvrirPaiement = (facture) => {
    setFormData({
      id: facture.id,
      montant: facture.montant,
      patient_id: facture.patient_id,
      rdv_id: facture.rdv_id,
      statut_paiement: 'PAYE',
      mode_paiement: 'ESPECES'
    });
    setActiveModal('form_paiement');
  };

  const getPatientName = (id) => {
    const p = patients?.find(p => String(p.id) === String(id));
    return p ? `${p.nom.toUpperCase()} ${p.prenom}` : `Patient #${id}`;
  };

  // ✅ FONCTION IMPRESSION
  const handlePrint = (factureId) => {
    const url = `${api.defaults.baseURL}/factures/${factureId}/recu`;
    window.open(url, '_blank');
  };

  return (
    <div style={{ maxHeight: '65vh', overflowY: 'auto', padding: '10px' }} className="no-scrollbar">
      {factures && factures.length > 0 ? factures.map(f => {
        const isPaid = f.statut_paiement === 'PAYE';
        
        return (
          <div key={f.id} style={cardS}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ background: isPaid ? '#DCFCE7' : '#FEE2E2', padding: '10px', borderRadius: '12px', color: isPaid ? '#15803D' : '#991B1B' }}>
                <FiFileText size={20} />
              </div>
              <div>
                <div style={{fontWeight:'800', color: '#1E293B'}}>{getPatientName(f.patient_id)}</div>
                <div style={{fontSize:'11px', color:'#64748B', display: 'flex', alignItems: 'center', gap: '4px'}}>
                  <FiClock size={10} /> Facture N°{f.id}
                </div>
              </div>
            </div>

            <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:'18px', fontWeight:'900', color: '#0F172A', marginBottom: '5px'}}>
                  {parseFloat(f.montant || 0).toLocaleString()} DH
                </div>
                <div style={{display: 'flex', gap: '8px', justifyContent: 'flex-end'}}>
                    <button 
                        onClick={() => !isPaid && ouvrirPaiement(f)}
                        style={isPaid ? paidBtn : payBtn}
                    >
                        {isPaid ? <FiCheckCircle/> : <FiDollarSign/>} 
                        {isPaid ? 'PAYÉ' : 'ENCAISSER'}
                    </button>

                    {/* ✅ BOUTON IMPRIMER - Uniquement si payé */}
                    {isPaid && (
                        <button 
                            onClick={() => handlePrint(f.id)} 
                            style={printBtn}
                            title="Imprimer le reçu"
                        >
                            <FiPrinter size={16} />
                        </button>
                    )}
                </div>
              </div>
            </div>
          </div>
        );
      }) : (
        <div style={{textAlign:'center', padding:'60px 20px', color:'#94A3B8'}}>
            <FiFileText size={40} style={{ opacity: 0.3, marginBottom: '10px' }} />
            <p style={{ margin: 0, fontWeight: '700' }}>Aucune facture dans le registre financier.</p>
        </div>
      )}
    </div>
  );
};

export default ListFactures;