import React from 'react';
import { FiClipboard, FiThermometer, FiFileText } from 'react-icons/fi';

const FormSoins = ({ patients, handleAction, setFormData, formData, loading }) => {
  const styles = {
    formContainer: { display: 'flex', flexDirection: 'column', gap: '15px' },
    inputWrapper: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { fontSize: '13px', fontWeight: '700', color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' },
    input: { padding: '12px', borderRadius: '12px', border: '2px solid #e2e8f0' },
    btn: { padding: '15px', borderRadius: '12px', border: 'none', background: '#34d399', color: 'white', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }
  };

  return (
    <form onSubmit={handleAction} style={styles.formContainer}>
      <div style={styles.inputWrapper}>
        <label style={styles.label}>Patient concerné</label>
        <select style={styles.input} required onChange={e => setFormData({...formData, patient_id: e.target.value})}>
          <option value="">Choisir le patient...</option>
          {patients?.map(p => <option key={p.id} value={p.id}>{p.nom} {p.prenom}</option>)}
        </select>
      </div>

      <div style={styles.inputWrapper}>
        <label style={styles.label}><FiThermometer size={14}/> Constantes vitales</label>
        <input style={styles.input} placeholder="TA, Température, Pouls..." onChange={e => setFormData({...formData, constantes: e.target.value})} />
      </div>

      <div style={styles.inputWrapper}>
        <label style={styles.label}><FiFileText size={14}/> Observations & Soins</label>
        <textarea style={{...styles.input, minHeight: '100px', resize: 'none'}} placeholder="Détaillez les soins prodigués..." required onChange={e => setFormData({...formData, notes: e.target.value})} />
      </div>

      <button type="submit" style={styles.btn} disabled={loading}>
        <FiClipboard /> {loading ? "Enregistrement..." : "Valider les soins"}
      </button>
    </form>
  );
};

export default FormSoins;