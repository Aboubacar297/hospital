import React from 'react';
import { FiCalendar, FiClock, FiUser, FiActivity, FiFilter, FiInfo } from 'react-icons/fi';
import UnifiedManagerGrid from './UnifiedManagerGrid';

const ListRdvManage = (props) => {
  const { allAppointments } = props;

  // Calcul rapide des statistiques pour le bandeau supérieur de la modale
  const totalRdv = allAppointments?.length || 0;
  const enAttente = allAppointments?.filter(r => r.statut?.toUpperCase().includes('ATTENTE')).length || 0;

  return (
    <div style={styles.wrapper}>
      {/* 1. Header informatif interne à la liste */}
      <div style={styles.miniStatsBar}>
        <div style={styles.statItem}>
          <div style={{ ...styles.iconCircle, background: '#EEF2FF', color: '#4F46E5' }}>
            <FiActivity size={16} />
          </div>
          <div>
            <div style={styles.statValue}>{totalRdv}</div>
            <div style={styles.statLabel}>RDV Totaux</div>
          </div>
        </div>

        <div style={styles.statItem}>
          <div style={{ ...styles.iconCircle, background: '#FFFBEB', color: '#D97706' }}>
            <FiClock size={16} />
          </div>
          <div>
            <div style={styles.statValue}>{enAttente}</div>
            <div style={styles.statLabel}>En Attente</div>
          </div>
        </div>

        <div style={styles.infoPill}>
          <FiInfo size={14} />
          <span>Mise à jour en temps réel</span>
        </div>
      </div>

      {/* 2. La Grille Unifiée */}
      <div style={styles.gridContainer}>
        <UnifiedManagerGrid 
          {...props}
          type="rdv"
          data={allAppointments}
        />
      </div>

      {/* 3. Footer de légende */}
      <div style={styles.footer}>
        <div style={styles.legend}>
          <span style={styles.legendItem}><span style={{...styles.dot, background: '#10B981'}}></span> Terminé</span>
          <span style={styles.legendItem}><span style={{...styles.dot, background: '#F59E0B'}}></span> En Attente</span>
          <span style={styles.legendItem}><span style={{...styles.dot, background: '#3B82F6'}}></span> Confirmé</span>
          <span style={styles.legendItem}><span style={{...styles.dot, background: '#EF4444'}}></span> Annulé</span>
        </div>
      </div>
    </div>
  );
};

// --- STYLES ---
const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    gap: '20px',
  },
  miniStatsBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '30px',
    background: '#F8FAFC',
    padding: '15px 25px',
    borderRadius: '20px',
    border: '1px solid #F1F5F9'
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  iconCircle: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  statValue: {
    fontSize: '16px',
    fontWeight: '900',
    color: '#0F172A',
    lineHeight: '1'
  },
  statLabel: {
    fontSize: '10px',
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    marginTop: '2px'
  },
  infoPill: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '11px',
    color: '#94A3B8',
    background: 'white',
    padding: '6px 12px',
    borderRadius: '10px',
    border: '1px solid #E2E8F0'
  },
  gridContainer: {
    flex: 1,
    minHeight: 0 // Crucial pour le scroll interne
  },
  footer: {
    paddingTop: '15px',
    borderTop: '1px solid #F1F5F9',
    display: 'flex',
    justifyContent: 'flex-end'
  },
  legend: {
    display: 'flex',
    gap: '20px'
  },
  legendItem: {
    fontSize: '10px',
    fontWeight: '700',
    color: '#94A3B8',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    textTransform: 'uppercase'
  },
  dot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%'
  }
};

export default ListRdvManage;