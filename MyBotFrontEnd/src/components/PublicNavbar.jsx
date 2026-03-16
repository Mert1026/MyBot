import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import logo from '../assets/logo.png';
import '../pages/Home.css';

const PublicNavbar = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const navLinks = [
    { name: t('nav.about'), href: '/#about' },
    { name: t('nav.trainings'), href: '/#trainings' },
    { name: t('nav.locationsContacts'), href: '/#locations' }
  ];

  const handleLogoClick = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  return (
    <motion.nav 
      className={`home-nav ${isScrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="home-nav-container">
        <div className="home-logo" onClick={handleLogoClick} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src={logo} alt="MyBot Logo" style={{ height: '50px', width: 'auto' }} />
          <span style={{ fontWeight: 'bold', fontSize: '1.2rem', letterSpacing: '1px', color: '#2d3436' }}>MyBot</span>
        </div>

        {/* Desktop Menu */}
        <div className="home-nav-links desktop-only">
          {navLinks.map((link, idx) => (
            <a key={idx} href={link.href} className="home-nav-link">
              {link.name}
            </a>
          ))}
        </div>

        <div className="home-nav-actions desktop-only">
           <div className="home-lang-toggle">
              <button onClick={() => changeLanguage('en')} className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`}>EN</button>
              <button onClick={() => changeLanguage('bg')} className={`lang-btn ${i18n.language === 'bg' ? 'active' : ''}`}>BG</button>
           </div>
           
           {user ? (
              <button className="base-btn outline-btn" onClick={() => navigate('/dashboard')} style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                {t('nav.dashboard')}
              </button>
           ) : (
              <button className="base-btn outline-btn" onClick={() => navigate('/login')}>
                Admin
              </button>
           )}
        </div>

        {/* Mobile Toggle */}
        <div className="mobile-toggle mobile-only" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
           {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="mobile-menu mobile-only"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="mobile-nav-links">
              {navLinks.map((link, idx) => (
                <a key={idx} href={link.href} onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">
                  {link.name}
                </a>
              ))}
              <div className="mobile-nav-actions">
                <div className="home-lang-toggle" style={{ justifyContent: 'center', marginBottom: '1rem' }}>
                  <button onClick={() => changeLanguage('en')} className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`}>EN</button>
                  <button onClick={() => changeLanguage('bg')} className={`lang-btn ${i18n.language === 'bg' ? 'active' : ''}`}>BG</button>
                </div>
                {user ? (
                  <button className="base-btn outline-btn w-full mt-2" onClick={() => navigate('/dashboard')} style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                    {t('nav.dashboard')}
                  </button>
                ) : (
                  <button className="base-btn outline-btn w-full mt-2" onClick={() => navigate('/login')}>
                    Admin Portal
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default PublicNavbar;
