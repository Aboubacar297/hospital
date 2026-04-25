import React, { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../services/api'; 
import ModalManager from '../components/modals/ModalManager';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar'; 
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, ReferenceLine, PieChart, Pie, Cell, Legend
} from 'recharts';
import { FiGrid, FiBarChart2, FiPieChart, FiUsers } from 'react-icons/fi';

const Home = () => {
  const [patients, setPatients] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);
  const [factures, setFactures] = useState([]); 
  const [staff, setStaff] = useState([]); 
  const [auditLogs, setAuditLogs] = useState([]); 
  const [systemLogs, setSystemLogs] = useState([]); 
  const [predictions, setPredictions] = useState({ historique_7_jours: [], prediction_lendemain: 0 }); 
  const [activeModal, setActiveModal] = useState(null); 
  const [formData, setFormData] = useState({});

  const user = useMemo(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : { role: 'STAFF' };
    } catch { return { role: 'STAFF' }; }
  }, []);

  const isAdmin = user.role === 'ADMIN';
  const isMedecin = user.role === 'MEDECIN' || isAdmin;

  const fetchData = useCallback(async () => {
    try {
      const [resP, resR, resF, resIA, resU, resA, resS] = await Promise.all([
        api.get('/patients/'), 
        api.get('/rendezvous/'), 
        api.get('/factures/').catch(() => ({ data: [] })),
        api.get('/ia/predictions/').catch(() => ({ data: null })),
        api.get('/users/').catch(() => ({ data: [] })),
        api.get('/audit/').catch(() => ({ data: [] })),
        api.get('/system-logs/').catch(() => ({ data: [] })) 
      ]);
      
      setPatients(resP.data || []);
      setAllAppointments(resR.data || []);
      setFactures(resF.data || []);
      setStaff(resU.data || []); 
      setAuditLogs(resA.data || []);
      setSystemLogs(resS.data || []); 
      if (resIA?.data) setPredictions(resIA.data);
    } catch (err) { 
      console.error("Sync Error:", err); 
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const aiChartData = useMemo(() => {
    const hist = predictions?.historique_7_jours || [0,0,0,0,0,0,0];
    const lastHistValue = hist[hist.length - 1];
    const formattedHist = hist.map((v, i) => ({ day: `J-${6-i}`, historique: v, prevision: null }));
    return [...formattedHist, { day: 'DEMAIN', historique: lastHistValue, prevision: predictions?.prediction_lendemain || 0 }];
  }, [predictions]);

  const stats = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0]; 
    const rdvToday = (allAppointments || []).filter(r => r.date?.substring(0, 10) === todayStr);
    return { 
      admis: (patients || []).length, 
      rdvTotal: rdvToday.length, 
      rdvAttente: rdvToday.filter(r => ['EN_ATTENTE', 'CONFIRME'].includes(r.statut?.toUpperCase())).length 
    };
  }, [allAppointments, patients]);

  const genderData = useMemo(() => {
    const counts = (patients || []).reduce((acc, p) => {
      const g = p.sexe?.toUpperCase().startsWith('M') ? 'HOMMES' : 'FEMMES';
      acc[g] = (acc[g] || 0) + 1;
      return acc;
    }, { HOMMES: 0, FEMMES: 0 });
    return [{ name: 'HOMMES', value: counts.HOMMES }, { name: 'FEMMES', value: counts.FEMMES }];
  }, [patients]);

  const statusPieData = useMemo(() => {
    const counts = (allAppointments || []).reduce((acc, curr) => {
      const s = curr.statut?.toUpperCase().replace('_', ' ') || 'AUTRE';
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
  }, [allAppointments]);

  const COLORS = ['#0F172A', '#3B82F6', '#60A5FA', '#94A3B8', '#E2E8F0'];
  const GENDER_COLORS = ['#3B82F6', '#EC4899'];

  return (
    <div className="app-container">
      <Sidebar isAdmin={isAdmin} isMedecin={isMedecin} user={user} setActiveModal={setActiveModal} />
      <main className="app-main">
        {/* ✅ FIX : Ajout des props manquantes */}
        <Navbar setActiveModal={setActiveModal} setFormData={setFormData} onLogout={() => { localStorage.clear(); window.location.reload(); }} />
        <div className="workspace">
          <div className="kpi-strip">
            <div className="unit-label"><FiGrid className="icon-main" /> <span>UNIT MONITOR / <strong>ANALYTICS ENGINE</strong></span></div>
            <div className="kpi-wrapper">
                <ModernStat label="Patients" value={stats.admis} sub="+2.4%" />
                <div className="v-divider"></div>
                <ModernStat label="Flux du Jour" value={stats.rdvTotal} sub="TOTAL RDV" />
                <div className="v-divider"></div>
                <ModernStat label="En Attente" value={stats.rdvAttente} highlight sub="FILES ACTIVES" />
                <div className="v-divider"></div>
                <ModernStat label="Prévu (IA)" value={predictions?.prediction_lendemain} highlight sub="FORECAST" />
            </div>
          </div>
          <div className="data-grid">
            <div className="panel main-chart">
              <div className="panel-header"><div className="panel-title"><FiBarChart2 /> FLUX & PRÉVISIONS IA</div><div className="status-badge">PRÉDICTIF v2.0</div></div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={aiChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorHist" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0F172A" stopOpacity={0.1}/><stop offset="95%" stopColor="#0F172A" stopOpacity={0}/></linearGradient>
                      <linearGradient id="colorPrev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/><stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748B'}} />
                    <YAxis hide />
                    <Tooltip content={<ProTooltip />} />
                    <Area type="monotone" dataKey="historique" stroke="#0F172A" strokeWidth={3} fill="url(#colorHist)" connectNulls={true} />
                    <Area type="monotone" dataKey="prevision" stroke="#3B82F6" strokeWidth={3} strokeDasharray="5 5" fill="url(#colorPrev)" connectNulls={true} />
                    <ReferenceLine x="DEMAIN" stroke="#3B82F6" strokeDasharray="3 3" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="panel gender-donut">
               <div className="panel-header"><div className="panel-title"><FiUsers /> DÉMOGRAPHIE</div></div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart><Pie data={genderData} innerRadius="60%" outerRadius="80%" paddingAngle={8} stroke="none" dataKey="value">{genderData.map((entry, index) => <Cell key={`cell-${index}`} fill={GENDER_COLORS[index]} />)}</Pie><Tooltip /><Legend verticalAlign="bottom" height={36} iconType="rect" wrapperStyle={{fontSize: '9px', fontWeight: '800'}} /></PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="panel status-donut">
               <div className="panel-header"><div className="panel-title"><FiPieChart /> STATUTS RDV</div></div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart><Pie data={statusPieData} innerRadius="65%" outerRadius="85%" paddingAngle={5} stroke="none" dataKey="value">{statusPieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}</Pie><Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{fontSize: '8px', fontWeight: '800'}} /></PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </main>
      <ModalManager activeModal={activeModal} setActiveModal={setActiveModal} user={user} formData={formData} setFormData={setFormData} fetchData={fetchData} patients={patients} allAppointments={allAppointments} staff={staff} auditLogs={auditLogs} factures={factures} systemLogs={systemLogs} />
      <style>{`.app-container { display: flex; background: #FFFFFF; height: 100vh; width: 100vw; overflow: hidden; font-family: 'Inter', sans-serif; } .app-main { flex: 1; padding-left: 95px; display: flex; flex-direction: column; } .workspace { flex: 1; padding: 85px 30px 20px 30px; display: flex; flex-direction: column; gap: 20px; overflow: hidden; } .kpi-strip { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #F1F5F9; padding-bottom: 15px; } .kpi-wrapper { display: flex; gap: 30px; align-items: center; } .v-divider { width: 1px; height: 20px; background: #F1F5F9; } .data-grid { flex: 1; display: grid; grid-template-columns: 2fr 1fr; grid-template-rows: 1fr 1fr; grid-template-areas: "main side1" "main side2"; gap: 20px; min-height: 0; } .main-chart { grid-area: main; } .gender-donut { grid-area: side1; } .status-donut { grid-area: side2; } .panel { background: #FFFFFF; border: 1px solid #F1F5F9; border-radius: 4px; padding: 20px; display: flex; flex-direction: column; overflow: hidden; } .panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; } .panel-title { font-size: 9px; font-weight: 800; display: flex; align-items: center; gap: 10px; color: #0F172A; text-transform: uppercase; } .status-badge { font-size: 8px; font-weight: 900; background: #F8FAFC; border: 1px solid #E2E8F0; padding: 4px 8px; border-radius: 4px; color: #3B82F6; } .chart-wrapper { flex: 1; min-height: 0; }`}</style>
    </div>
  );
};

const ModernStat = ({ label, value, sub, highlight }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
    <div style={{ fontSize: '8px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>{label}</div>
    <div style={{ fontSize: '22px', fontWeight: 900, color: highlight ? '#3B82F6' : '#0F172A', lineHeight: 1 }}>{value || 0}</div>
    <div style={{ fontSize: '9px', fontWeight: 600, color: '#64748B' }}>{sub}</div>
  </div>
);

const ProTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const isPrevision = payload[0].payload.day === 'DEMAIN';
    return (
      <div style={{ background: '#0F172A', padding: '10px 15px', borderRadius: '4px', color: '#FFF' }}>
        <p style={{ margin: 0, fontSize: '10px', opacity: 0.6 }}>{payload[0].payload.day} {isPrevision && "(IA)"}</p>
        <p style={{ margin: 0, fontSize: '13px', fontWeight: 900, color: isPrevision ? '#3B82F6' : '#FFF' }}>{payload[0].value || payload[1]?.value} PATIENTS</p>
      </div>
    );
  }
  return null;
};

export default Home;