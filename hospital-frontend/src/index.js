import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './styles/index.css';
import App from './App'; 

/**
 * ✅ CORRECTIF ANTI-CLIGNOTEMENT (ResizeObserver)
 * Ce script intercepte les notifications de redimensionnement non délivrées
 * avant qu'elles ne déclenchent l'overlay d'erreur de Webpack.
 */
const debounce = (callback, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => callback(...args), delay);
  };
};

const suppressResizeObserverError = () => {
  const originalError = console.error;
  console.error = (...args) => {
    if (args[0]?.includes?.('ResizeObserver loop completed with undelivered notifications')) {
      return;
    }
    originalError.apply(console, args);
  };

  window.addEventListener('error', e => {
    if (e.message.includes('ResizeObserver loop completed with undelivered notifications')) {
      // Masquer l'overlay d'erreur de développement si présent
      const overlay = document.getElementById('webpack-dev-server-client-overlay');
      if (overlay) overlay.style.display = 'none';
      
      // Empêcher la propagation pour stopper le clignotement
      e.stopImmediatePropagation();
    }
  });
};

// Exécution du correctif
suppressResizeObserverError();

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);