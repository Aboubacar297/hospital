import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiUser, FiShield, FiSearch, FiChevronDown, FiX } from 'react-icons/fi'; 
import './Navbar.css';

const Navbar = ({ onLogout, setActiveModal, setFormData }) => { 
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState({ nom_utilisateur: 'Utilisateur', role: 'Staff' });
  
  // ✅ LOGIQUE DE RECHERCHE
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr);
        setUser(parsed);
      } catch (e) { console.error("Erreur JSON", e); }
    }
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    if (onLogout) onLogout();
    navigate('/login');
  };

  // ✅ DÉCLENCHEMENT DE LA RECHERCHE
  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchTerm.trim() !== '') {
      // Option A : Ouvrir la liste des patients avec le filtre
      if (setActiveModal) {
        setFormData({ searchFilter: searchTerm }); // On passe le terme au formulaire
        setActiveModal('list_patients_dme');
        setSearchTerm(''); // On vide la barre après recherche
      }
    }
  };

  return (
    <nav className={`navbar-premium ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-wrapper">
        <div className="nav-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <div className="brand-icon-container">
            <FiShield className="brand-icon" />
            <div className="pulse-ring"></div>
          </div>
          <div className="brand-titles">
            <h1>AI CURA</h1>
            <span className="brand-tagline">Intelligence Médicale</span>
          </div>
        </div>

        <div className="nav-tools">
          <div className="search-container-premium">
            <FiSearch className="search-inside-icon" />
            <input 
              type="text" 
              placeholder="Rechercher un patient (Entrée)..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchSubmit}
            />
            {searchTerm && (
              <FiX 
                className="search-clear-icon" 
                onClick={() => setSearchTerm('')} 
                style={{ cursor: 'pointer', marginLeft: '-25px', color: '#94a3b8' }}
              />
            )}
          </div>
        </div>

        <div className="nav-user-area">
          <div className="user-profile-container" onMouseEnter={() => setShowDropdown(true)} onMouseLeave={() => setShowDropdown(false)}>
            <div className={`user-profile-trigger ${showDropdown ? 'active' : ''}`}>
              <div className="avatar-frame">{user.nom_utilisateur?.charAt(0).toUpperCase()}</div>
              <div className="user-info-minimal">
                <span className="u-name">{user.nom_utilisateur}</span>
                <span className="u-role">{user.role}</span>
              </div>
              <FiChevronDown className="u-arrow" />
            </div>

            {showDropdown && (
              <div className="premium-dropdown">
                <button className="d-item" onClick={() => navigate('/profil')}><FiUser className="item-icon" /> Profil</button>
                <div className="d-divider"></div>
                <button className="d-item logout-premium" onClick={handleLogout}><FiLogOut className="item-icon" /> Déconnexion</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;