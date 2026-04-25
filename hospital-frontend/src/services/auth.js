import api from './api';

export const login = async (credentials) => {
  try {
    // Dans un vrai projet, FastAPI renvoie un token JWT
    // const response = await api.post('/token', credentials);
    // const { access_token } = response.data;
    
    // Simulation pour le moment :
    const fakeToken = "hospital_token_123";
    localStorage.setItem('token', fakeToken);
    localStorage.setItem('user', JSON.stringify({ name: 'Dr. Dupont', role: 'medecin' }));
    
    return true;
  } catch (error) {
    console.error("Erreur d'authentification", error);
    return false;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};