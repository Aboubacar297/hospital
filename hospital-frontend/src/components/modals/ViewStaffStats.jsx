import React, { useMemo, useState, useRef } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';
import { FiSearch, FiDownload, FiDollarSign, FiActivity, FiTarget } from 'react-icons/fi';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ViewStaffStats = ({ allAppointments, medecins }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const reportRef = useRef();

  const statsData = useMemo(() => {
    // 1. Performance Staff (Top 4 pour gagner de la place)
    const performance = (medecins || [])
      .filter(m => (m.nom_utilisateur || m.nom || "").toLowerCase().includes(searchTerm.toLowerCase()))
      .map(m => ({
        name: (m.nom_utilisateur || m.nom).substring(0, 8),
        consultations: (allAppointments || []).filter(r => r.medecin_id === m.id && r.statut === 'TERMINE').length,
      })).sort((a, b) => b.consultations - a.consultations).slice(0, 4);

    // 2. Revenus (7j)
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dailyTotal = (allAppointments || [])
        .filter(r => r.date === dateStr && r.paiement_statut === 'PAYE')
        .reduce((sum, r) => sum + (parseFloat(r.montant) || 0), 0);
      return { date: dateStr.substring(8), montant: dailyTotal }; // Juste le jour (DD)
    }).reverse();

    // 3. IA : Régression
    const n = last7Days.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    last7Days.forEach((day, i) => {
      sumX += i; sumY += day.montant;
      sumXY += i * day.montant; sumX2 += i * i;
    });
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    const monthlyForecast = Math.max(0, (slope * (n + 15) + intercept) * 30);

    return { performance, revenueEvolution: last7Days, totalCA: last7Days.reduce((s, d) => s + d.montant, 0), forecast: { value: monthlyForecast, trend: slope >= 0 ? 'HAUSSIÈRE' : 'BAISSIÈRE' } };
  }, [allAppointments, medecins, searchTerm]);

  const exportPDF = async () => {
    const canvas = await html2canvas(reportRef.current, { scale: 2 });
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, 190, 0);
    pdf.save("Rapport.pdf");
  };

  return (
    <div style={{ height: '65vh', display: 'flex', flexDirection: 'column', gap: '8px', overflow: 'hidden', padding: '5px' }}>
      {/* Barre d'outils ultra-fine */}
      <div style={{ display: 'flex', gap: '10px', height: '35px' }}>
        <div style={searchWrapper}>
          <FiSearch color="#94a3b8" size={12} />
          <input style={searchInput} placeholder="Médecin..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <button onClick={exportPDF} style={exportBtn}><FiDownload size={12}/> PDF</button>
      </div>

      <div ref={reportRef} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {/* Grille de graphes côte à côte */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div style={chartContainer}>
            <span style={chartTitle}><FiActivity /> ACTES</span>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={statsData.performance}>
                <XAxis dataKey="name" tick={{fontSize: 8}} axisLine={false} tickLine={false} />
                <Bar dataKey="consultations" fill="#6366f1" radius={[3, 3, 0, 0]} barSize={15} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={chartContainer}>
            <span style={chartTitle}><FiDollarSign /> CA (7J)</span>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={statsData.revenueEvolution}>
                <XAxis dataKey="date" tick={{fontSize: 8}} axisLine={false} tickLine={false} />
                <Area type="monotone" dataKey="montant" stroke="#10b981" fill="#10b98120" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* BANNIÈRE FINANCIÈRE UNIQUE (Tout sur une ligne) */}
        <div style={financeBanner}>
          <div style={inlineBlock}>
            <span style={microLabel}>HEBDO:</span>
            <span style={midAmount}>{statsData.totalCA.toLocaleString()} DH</span>
          </div>
          <div style={{ height: '20px', width: '1px', background: '#ffffff30' }}></div>
          <div style={inlineBlock}>
            <span style={microLabel}>ESTIM. (30J):</span>
            <span style={midAmount}>≈ {Math.round(statsData.forecast.value).toLocaleString()} DH</span>
          </div>
          <div style={badgeStyle(statsData.forecast.trend)}>
            {statsData.forecast.trend === 'HAUSSIÈRE' ? '↑' : '↓'}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- STYLES ULTRA-DENSES ---
const searchWrapper = { flex: 1, display: 'flex', alignItems: 'center', gap: '5px', background: '#f1f5f9', padding: '0 10px', borderRadius: '8px' };
const searchInput = { border: 'none', background: 'transparent', height: '100%', width: '100%', outline: 'none', fontSize: '12px' };
const exportBtn = { display: 'flex', alignItems: 'center', gap: '5px', padding: '0 12px', borderRadius: '8px', border: 'none', background: '#4f46e5', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '11px' };
const chartContainer = { background: '#f8fafc', padding: '8px', borderRadius: '12px', border: '1px solid #e2e8f0' };
const chartTitle = { fontSize: '9px', display: 'flex', alignItems: 'center', gap: '4px', color: '#475569', fontWeight: '900', marginBottom: '5px' };
const financeBanner = { padding: '10px 15px', background: '#1e293b', borderRadius: '12px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const inlineBlock = { display: 'flex', alignItems: 'baseline', gap: '8px' };
const microLabel = { fontSize: '8px', opacity: 0.6, fontWeight: 'bold' };
const midAmount = { fontSize: '16px', fontWeight: '900' };
const badgeStyle = (trend) => ({ 
  background: trend === 'HAUSSIÈRE' ? '#10b981' : '#f43f5e', 
  width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold' 
});

export default ViewStaffStats;