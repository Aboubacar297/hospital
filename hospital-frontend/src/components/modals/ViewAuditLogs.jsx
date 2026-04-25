import React from 'react';
import { FiClock, FiUser, FiActivity, FiInfo, FiLayers, FiShield } from 'react-icons/fi';

const ViewAuditLogs = ({ auditLogs }) => {
  const getActionBadge = (action) => {
    const act = action?.toUpperCase() || 'UNKNOWN';
    const colors = {
      'CREATE': { bg: '#DCFCE7', text: '#166534' },
      'UPDATE': { bg: '#FEF9C3', text: '#854D0E' },
      'DELETE': { bg: '#FEE2E2', text: '#991B1B' },
      'LOGIN':  { bg: '#E0F2FE', text: '#075985' },
      'LOGOUT': { bg: '#F1F5F9', text: '#475569' }
    };
    
    let style = colors[act] || { bg: '#F1F5F9', text: '#475569' };
    if (act.includes('SUPPR')) style = colors['DELETE'];
    if (act.includes('AJOUT') || act.includes('CREAT')) style = colors['CREATE'];
    if (act.includes('MODIF')) style = colors['UPDATE'];

    return <span style={{ ...badgeBase, background: style.bg, color: style.text }}>{act}</span>;
  };

  const sortedLogs = auditLogs ? [...auditLogs].sort((a, b) => 
    new Date(b.date_action) - new Date(a.date_action)
  ) : [];

  return (
    <div style={{ padding: '10px' }}>
      <div className="no-scrollbar" style={{ maxHeight: '70vh', overflowY: 'auto', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
          <thead style={{ position: 'sticky', top: 0, background: '#F8FAFC', zIndex: 10 }}>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #F1F5F9', color: '#64748B', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              <th style={{ padding: '16px' }}><FiUser /> Utilisateur</th>
              <th style={{ padding: '16px' }}><FiActivity /> Action</th>
              <th style={{ padding: '16px' }}><FiInfo /> Description</th>
              <th style={{ padding: '16px' }}><FiClock /> Horodatage</th>
            </tr>
          </thead>
          <tbody>
            {sortedLogs.length > 0 ? (
              sortedLogs.map(log => {
                // ✅ RÉCUPÉRATION DU NOM DEPUIS L'OBJET IMBRIQUÉ 'user'
                const displayName = log.user?.nom_utilisateur || `ID: ${log.user_id}`;
                
                return (
                  <tr key={log.id} style={rowStyle}>
                    <td style={{ padding: '16px', fontWeight: '700', color: '#1E293B' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={avatarCircle}>{displayName.charAt(0)}</div>
                        <span>{displayName}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>{getActionBadge(log.action)}</td>
                    <td style={{ padding: '16px', color: '#475569', fontSize: '12.5px', lineHeight: '1.4' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '5px' }}>
                        <FiLayers size={14} style={{ marginTop: '2px', color: '#94A3B8' }} />
                        {log.description}
                      </div>
                    </td>
                    <td style={{ padding: '16px', fontSize: '11.5px', color: '#64748B', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>
                      {log.date_action ? new Date(log.date_action).toLocaleString('fr-FR') : 'Date inconnue'}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>
                  <FiShield size={40} style={{ marginBottom: '10px', opacity: 0.2 }} /><br />
                  Aucun journal d'audit disponible.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- STYLES ---
const badgeBase = { padding: '5px 12px', borderRadius: '6px', fontWeight: '800', fontSize: '10px' };
const rowStyle = { borderBottom: '1px solid #F1F5F9', transition: 'background 0.2s' };
const avatarCircle = { width: '24px', height: '24px', borderRadius: '50%', background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#475569', textTransform: 'uppercase' };

export default ViewAuditLogs;