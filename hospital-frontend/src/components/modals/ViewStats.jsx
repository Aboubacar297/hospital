import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { FiUsers, FiActivity, FiDollarSign, FiTrendingUp } from 'react-icons/fi';

const ViewStats = ({ patients, factures, consultations }) => {
  // --- LOGIQUE DE DONNÉES ---
  const totalRecettes = factures.reduce((acc, f) => acc + (parseFloat(f.montant) || 0), 0);
  
  // Données pour le graphique des revenus (7 derniers jours)
  const revenueData = factures.slice(-7).map(f => ({
    name: new Date(f.date).toLocaleDateString('fr-FR', { weekday: 'short' }),
    montant: parseFloat(f.montant)
  }));

  // Données pour le Camembert (Sexe des patients)
  const mCount = patients.filter(p => p.sexe === 'M').length;
  const fCount = patients.filter(p => p.sexe === 'F').length;
  const pieData = [
    { name: 'Hommes', value: mCount },
    { name: 'Femmes', value: fCount },
  ];
  const COLORS = ['#4f46e5', '#ec4899'];

  const styles = {
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' },
    card: { background: 'white', padding: '20px', borderRadius: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' },
    chartCard: { background: 'white', padding: '25px', borderRadius: '24px', border: '1px solid #f1f5f9', height: '350px' },
    icon: (bg) => ({ background: bg, color: 'white', padding: '12px', borderRadius: '15px', display: 'flex', marginBottom: '10px', width: 'fit-content' })
  };

  return (
    <div style={{ padding: '10px' }}>
      {/* --- CARTES DE SCORE --- */}
      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.icon('#4f46e5')}><FiUsers size={20}/></div>
          <small style={{color: '#64748b', fontWeight: 'bold'}}>PATIENTS</small>
          <h2 style={{margin: 0}}>{patients.length}</h2>
        </div>
        <div style={styles.card}>
          <div style={styles.icon('#10b981')}><FiActivity size={20}/></div>
          <small style={{color: '#64748b', fontWeight: 'bold'}}>CONSULTATIONS</small>
          <h2 style={{margin: 0}}>{consultations.length}</h2>
        </div>
        <div style={styles.card}>
          <div style={styles.icon('#f59e0b')}><FiDollarSign size={20}/></div>
          <small style={{color: '#64748b', fontWeight: 'bold'}}>CA TOTAL</small>
          <h2 style={{margin: 0}}>{totalRecettes.toLocaleString()} dh</h2>
        </div>
      </div>

      {/* --- GRAPHIQUES --- */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <div style={styles.chartCard}>
          <h3 style={{fontSize: '16px', marginBottom: '20px'}}>Flux des Revenus (7 derniers jours)</h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)'}} />
              <Bar dataKey="montant" fill="#6366f1" radius={[10, 10, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={styles.chartCard}>
          <h3 style={{fontSize: '16px', marginBottom: '20px'}}>Démographie</h3>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ViewStats;