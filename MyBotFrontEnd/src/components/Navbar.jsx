import React from 'react';
import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, Users, User, LogOut, Home, ClipboardList } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { t, i18n } = useTranslation();

  if (!user) return null; // Don't show navbar if not logged in

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <BookOpen size={24} className="navbar-logo-icon" />
          <span className="navbar-title">MyBot Admin</span>
        </div>
        
        <div className="navbar-links">
          <NavLink to="/dashboard" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            <Home size={18} /> {t('nav.dashboard')}
          </NavLink>
          <NavLink to="/groups" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            <Users size={18} /> {t('nav.groups')}
          </NavLink>
          <NavLink to="/members" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            <User size={18} /> {t('nav.members')}
          </NavLink>
          <NavLink to="/parents" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            <Users size={18} /> {t('nav.parents')}
          </NavLink>
          <NavLink to="/applications" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            <ClipboardList size={18} /> {t('nav.applications')}
          </NavLink>
        </div>

        <div className="navbar-user">
          <div className="nav-lang-toggle">
            <button onClick={() => i18n.changeLanguage('en')} className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`}>EN</button>
            <button onClick={() => i18n.changeLanguage('bg')} className={`lang-btn ${i18n.language === 'bg' ? 'active' : ''}`}>BG</button>
          </div>
          <span className="user-name">{user.displayName} ({user.role})</span>
          <button onClick={logout} className="btn-logout">
            <LogOut size={18} /> {t('nav.logout')}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
