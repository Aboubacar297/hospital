import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './components/Login';

const App = () => {
  // On utilise un état pour forcer React à rafraîchir les routes après le login
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('token') !== null
  );

  // Fonction appelée par le composant Login après succès
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <Routes>
      {/* 1. Page de Connexion */}
      <Route 
        path="/login" 
        element={!isAuthenticated ? <Login onLogin={handleLoginSuccess} /> : <Navigate to="/" replace />} 
      />

      {/* 2. Route protégée : Dashboard */}
      <Route 
        path="/" 
        element={isAuthenticated ? <Home /> : <Navigate to="/login" replace />} 
      />

      {/* 3. Sécurité : Redirection vers Login si la route n'existe pas */}
      <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
    </Routes>
  );
};

export default App;