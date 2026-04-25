import React from 'react';
import { FiAlertCircle, FiInfo, FiRefreshCw, FiTrash2 } from 'react-icons/fi';
import api from '../../services/api';

const ViewSystemLogs = ({ systemLogs, fetchData, isAdmin }) => {
  
  // ✅ FONCTION POUR VIDER LES LOGS
  const handleClearLogs = async () => {
    if (window.confirm("⚠️ Voulez-vous vraiment supprimer TOUS les logs système ? Cette action est irréversible.")) {
      try {
        await api.delete('/system-logs/clear');
        await fetchData(); // Rafraîchir la liste (qui sera vide)
      } catch (err) {
        alert("Erreur lors du nettoyage : " + (err.response?.data?.detail || "Action impossible"));
      }
    }
  };

  const getLevelStyle = (level) => {
    const l = level?.toUpperCase();
    if (l === 'ERROR' || l === 'CRITICAL') return { color: '#EF4444', bg: '#FEF2F2', icon: <FiAlertCircle /> };
    if (l === 'WARNING') return { color: '#F59E0B', bg: '#FFFBEB', icon: <FiAlertCircle /> };
    return { color: '#3B82F6', bg: '#EFF6FF', icon: <FiInfo /> };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div style={styles.toolbar}>
        <div style={styles.titleGroup}>
          <div style={styles.indicator}></div>
          <span style={styles.titleText}>LOGS DU SERVEUR ({systemLogs.length})</span>
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={fetchData} style={styles.actionBtn}>
            <FiRefreshCw /> Actualiser
          </button>
          
          {/* ✅ BOUTON VIDER (Visible uniquement pour l'ADMIN) */}
          {isAdmin && (
            <button onClick={handleClearLogs} style={styles.deleteBtn}>
              <FiTrash2 /> Vider la console
            </button>
          )}
        </div>
      </div>

      <div className="no-scrollbar" style={styles.logBox}>
        {systemLogs.length > 0 ? systemLogs.map(log => {
          const style = getLevelStyle(log.niveau);
          return (
            <div key={log.id} style={{ ...styles.entry, borderLeft: `4px solid ${style.color}` }}>
              <div style={styles.entryHeader}>
                <span style={{ ...styles.badge, color: style.color, background: style.bg }}>
                  {style.icon} {log.niveau}
                </span>
                <span style={styles.time}>{new Date(log.date_evenement).toLocaleString()}</span>
              </div>
              <div style={styles.msg}>{log.message}</div>
              <div style={styles.ip}>Source IP: {log.ip_adresse || 'Système'}</div>
            </div>
          );
        }) : (
          <div style={styles.empty}>Aucun log à afficher. Le système est propre.</div>
        )}
      </div>
    </div>
  );
};

const styles = {
  toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  titleGroup: { display: 'flex', alignItems: 'center', gap: '10px' },
  indicator: { width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' },
  titleText: { fontSize: '12px', fontWeight: '800', color: '#1E293B' },
  actionBtn: { display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 15px', borderRadius: '10px', background: 'white', border: '1px solid #E2E8F0', cursor: 'pointer', fontSize: '11px', fontWeight: '700' },
  deleteBtn: { display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 15px', borderRadius: '10px', background: '#FEE2E2', color: '#DC2626', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: '700' },
  logBox: { maxHeight: '65vh', overflowY: 'auto', background: '#0F172A', borderRadius: '18px', padding: '20px' },
  entry: { background: '#1E293B', padding: '15px', borderRadius: '12px', marginBottom: '12px' },
  entryHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
  badge: { display: 'flex', alignItems: 'center', gap: '5px', fontSize: '9px', fontWeight: '900', padding: '3px 10px', borderRadius: '6px' },
  time: { fontSize: '10px', color: '#64748B' },
  msg: { color: '#E2E8F0', fontSize: '13px', fontFamily: 'monospace', lineSize: '1.5' },
  ip: { fontSize: '10px', color: '#475569', marginTop: '10px' },
  empty: { textAlign: 'center', color: '#64748B', padding: '50px' }
};

export default ViewSystemLogs;