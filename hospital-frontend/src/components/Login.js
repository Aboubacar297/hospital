import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiLock, FiLogIn, FiActivity } from 'react-icons/fi';
import api from '../services/api';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // --- FORMAT OAUTH2 (x-www-form-urlencoded) ---
    const params = new URLSearchParams();
    params.append('username', credentials.username); 
    params.append('password', credentials.password);

    try {
      // 1. Tentative de connexion
      const response = await api.post('/users/login', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      // 2. Extraction des données
      const { access_token, user } = response.data;

      // ✅ 3. SÉCURITÉ & NORMALISATION
      // On s'assure que l'objet user existe et que son rôle est en MAJUSCULES
      if (user && user.role) {
        const normalizedUser = {
          ...user,
          role: String(user.role).toUpperCase().trim()
        };

        // Stockage persistant
        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(normalizedUser));
        localStorage.setItem('isAuthenticated', 'true');
        
        // 4. Notification du parent et redirection
        onLogin(); 
        navigate('/', { replace: true }); 
      } else {
        throw new Error("Données utilisateur (rôle) manquantes dans la réponse du serveur.");
      }

    } catch (err) {
      console.error("Détails de l'erreur:", err.response?.data || err.message);
      
      let errorMsg = 'Identifiants ou mot de passe invalides.';
      
      if (err.response?.status === 401) {
        errorMsg = "Nom d'utilisateur ou mot de passe incorrect.";
      } else if (err.response?.status === 422) {
        errorMsg = "Erreur de format de données (422).";
      } else if (err.message.includes("rôle")) {
        errorMsg = "Erreur système : Rôle non défini pour ce compte.";
      }

      setError(errorMsg);
      setLoading(false);
    }
  };

  // --- DESIGN SYSTEM (Inchangé pour garder votre interface) ---
  const colors = { primary: '#4f46e5', bg: '#f8fafc', white: '#ffffff', text: '#111827', muted: '#6b7280', danger: '#ef4444' };
  const styles = {
    pageWrapper: { minHeight: '100vh', background: colors.bg, display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: "'Inter', sans-serif", padding: '20px' },
    card: { background: colors.white, width: '100%', maxWidth: '420px', padding: '48px', borderRadius: '32px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)', textAlign: 'center' },
    brand: { fontSize: '28px', fontWeight: '900', color: colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '8px' },
    subtitle: { color: colors.muted, fontSize: '14px', fontWeight: '600', marginBottom: '32px' },
    inputGroup: { textAlign: 'left', marginBottom: '20px' },
    label: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '700', color: colors.text, marginBottom: '8px' },
    input: { width: '100%', padding: '16px 20px', borderRadius: '16px', border: '1.5px solid #f1f5f9', background: '#f8fafc', outline: 'none', fontSize: '15px', boxSizing: 'border-box' },
    button: { width: '100%', background: colors.primary, color: 'white', padding: '18px', borderRadius: '18px', border: 'none', fontSize: '16px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)', transition: '0.2s' },
    error: { background: '#fef2f2', color: colors.danger, padding: '12px', borderRadius: '12px', fontSize: '13px', fontWeight: '600', marginBottom: '20px', border: '1px solid #fee2e2' }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.card}>
        <div style={styles.brand}><FiActivity size={36} /> AI CURA</div>
        <div style={styles.subtitle}>Portail Hospitalier Sécurisé</div>
        
        {error && <div style={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}><FiUser /> Identifiant Staff</label>
            <input style={styles.input} type="text" name="username" placeholder="ex: a.alaoui" value={credentials.username} onChange={handleChange} required />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}><FiLock /> Mot de passe</label>
            <input style={styles.input} type="password" name="password" placeholder="••••••••" value={credentials.password} onChange={handleChange} required />
          </div>
          
          <button type="submit" style={{...styles.button, opacity: loading ? 0.7 : 1}} disabled={loading}>
            {loading ? 'Vérification...' : <><FiLogIn /> Se connecter</>}
          </button>
        </form>
        
        <p style={{ marginTop: '32px', fontSize: '11px', color: colors.muted, fontWeight: '600', textTransform: 'uppercase' }}>
          Système de Gestion AI v2.6.0
        </p>
      </div>
    </div>
  );
};

export default Login;