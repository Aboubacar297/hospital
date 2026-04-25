import React, { useState, useEffect } from 'react';
import { 
  FiHome, FiDollarSign, FiList, FiTool, FiShield, 
  FiPlus, FiTrash2, FiSave, FiRefreshCw 
} from 'react-icons/fi';
import api from '../../services/api';

const SettingsModal = ({ formData, setFormData, handleAction, loading }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [actes, setActes] = useState([]);
  const [newActe, setNewActe] = useState({ nom_acte: '', prix: '', code_acte: '' });

  const tabs = [
    { id: 'general', label: 'Clinique', icon: <FiHome /> },
    { id: 'finance', label: 'Tarification', icon: <FiDollarSign /> },
    { id: 'catalogue', label: 'Catalogue Actes', icon: <FiList /> },
    { id: 'system', label: 'Système', icon: <FiTool /> },
    { id: 'security', label: 'Sécurité', icon: <FiShield /> },
  ];

  useEffect(() => {
    fetchTarifs();
  }, []);

  const fetchTarifs = async () => {
    try {
      const res = await api.get('/tarifications/');
      setActes(res.data);
    } catch (err) { console.error("Erreur tarifs:", err); }
  };

  const handleAddActe = async () => {
    if (!newActe.nom_acte || !newActe.prix) return;
    try {
      await api.post('/tarifications/', newActe);
      setNewActe({ nom_acte: '', prix: '', code_acte: '' });
      fetchTarifs();
    } catch (err) { alert("Erreur lors de l'ajout"); }
  };

  const handleDeleteActe = async (id) => {
    if (window.confirm("Supprimer cet acte ?")) {
      try {
        await api.delete(`/tarifications/${id}`);
        fetchTarifs();
      } catch (err) { alert("Erreur suppression"); }
    }
  };

  const FormField = ({ label, type = "text", placeholder, value, name, options }) => (
    <div style={{ marginBottom: '15px' }}>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#64748B', marginBottom: '5px' }}>{label}</label>
      {type === 'select' ? (
        <select style={inputStyle} value={value} onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}>
          {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      ) : (
        <input type={type} style={inputStyle} placeholder={placeholder} value={value || ''} onChange={(e) => setFormData({ ...formData, [name]: e.target.value })} />
      )}
    </div>
  );

  return (
    <div style={{ display: 'flex', gap: '30px', minHeight: '550px' }}>
      {/* SIDEBAR TABS */}
      <div style={{ width: '220px', borderRight: '1px solid #E2E8F0', paddingRight: '20px' }}>
        {tabs.map(tab => (
          <div 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id)} 
            style={{ 
              display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 15px', 
              borderRadius: '12px', cursor: 'pointer', marginBottom: '5px', 
              transition: '0.3s', 
              background: activeTab === tab.id ? '#4f46e5' : 'transparent', 
              color: activeTab === tab.id ? 'white' : '#64748B', 
              fontWeight: '600' 
            }}
          >
            {tab.icon} {tab.label}
          </div>
        ))}
      </div>

      {/* CONTENT AREA */}
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '10px' }}>
        {activeTab === 'general' && (
          <div className="animate-in">
            <h3 style={sectionTitleStyle}><FiHome /> Informations Clinique</h3>
            <FormField label="Nom de l'Hôpital" name="hospital_name" value={formData.hospital_name} />
            <FormField label="Adresse" name="hospital_address" value={formData.hospital_address} />
          </div>
        )}

        {activeTab === 'finance' && (
          <div className="animate-in">
            <h3 style={sectionTitleStyle}><FiDollarSign /> Paramètres Financiers</h3>
            <FormField label="TVA (%)" name="tax_rate" value={formData.tax_rate} />
            <FormField label="Devise Principale" name="currency" type="select" value={formData.currency} options={[{value:'MAD', label:'Dirham (MAD)'}, {value:'XOF', label:'CFA'}]} />
          </div>
        )}

        {activeTab === 'catalogue' && (
          <div className="animate-in">
            <h3 style={sectionTitleStyle}><FiList /> Catalogue des Actes (Prix)</h3>
            <div style={addBoxStyle}>
              <input style={{...inputStyle, flex:2}} placeholder="Nom acte" value={newActe.nom_acte} onChange={e => setNewActe({...newActe, nom_acte: e.target.value})}/>
              <input style={{...inputStyle, flex:1}} placeholder="Prix" type="number" value={newActe.prix} onChange={e => setNewActe({...newActe, prix: e.target.value})}/>
              <button type="button" onClick={handleAddActe} style={btnAddSmall}><FiPlus/></button>
            </div>
            <div style={{ marginTop: '20px' }}>
              {actes.map(acte => (
                <div key={acte.id} style={itemRowStyle}>
                  <span>{acte.nom_acte}</span>
                  <div style={{ display:'flex', gap:'15px', alignItems:'center'}}>
                    <b style={{color:'#4f46e5'}}>{acte.prix} DH</b>
                    <FiTrash2 style={{color:'#ef4444', cursor:'pointer'}} onClick={() => handleDeleteActe(acte.id)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Formulaire Global pour les autres réglages */}
        <form onSubmit={handleAction} style={{ marginTop: '30px', textAlign: 'right', borderTop: '1px solid #eee', paddingTop: '20px' }}>
            <button type="submit" style={btnSaveStyle} disabled={loading}>
              {loading ? <FiRefreshCw className="spin" /> : <FiSave />} Sauvegarder Config
            </button>
        </form>
      </div>
    </div>
  );
};

// --- STYLES INTERNES ---
const inputStyle = { width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '14px', background: '#F8FAFC' };
const sectionTitleStyle = { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px', color: '#1E293B', marginBottom: '20px' };
const btnSaveStyle = { background: '#4f46e5', color: 'white', border: 'none', padding: '14px 25px', borderRadius: '15px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', float: 'right' };
const addBoxStyle = { display: 'flex', gap: '10px', background: '#F8FAFC', padding: '10px', borderRadius: '12px', border: '1px solid #E2E8F0' };
const btnAddSmall = { background: '#10B981', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems:'center' };
const itemRowStyle = { display: 'flex', justifyContent: 'space-between', padding: '12px', borderBottom: '1px solid #eee' };

export default SettingsModal;