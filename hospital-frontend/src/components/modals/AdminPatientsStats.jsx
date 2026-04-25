import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const AdminPatientsStats = ({ patients }) => {
  // Grouper les patients par date de création/admission
  const statsByDate = patients.reduce((acc, p) => {
    const date = new Date(p.created_at || Date.now()).toLocaleDateString('fr-FR');
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const data = Object.keys(statsByDate).map(date => ({
    date,
    nombre: statsByDate[date]
  })).slice(-10); // 10 derniers jours actifs

  return (
    <div style={{ background: '#1e293b', padding: '25px', borderRadius: '24px', color: 'white' }}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '18px' }}>Fréquentation Quotidienne</h3>
      <div style={{ height: '250px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="rgba(255,255,255,0.1)" vertical={false} />
            <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{background: '#0f172a', border: 'none', borderRadius: '10px', color: '#fff'}} />
            <Line type="monotone" dataKey="nombre" stroke="#10b981" strokeWidth={4} dot={{ r: 6, fill: '#10b981' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminPatientsStats;