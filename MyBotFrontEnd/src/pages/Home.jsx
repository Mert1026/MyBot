import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import './Home.css';
import logo from '../assets/logo.png';
import photo1 from '../assets/photo_1.jpg';
import photo2 from '../assets/photo_2.jpg';
import photo3 from '../assets/photo_3.jpg';
import photo4 from '../assets/photo_4.jpg';

const Home = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
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
    { name: t('nav.about'), href: '#about' },
    { name: t('nav.trainings'), href: '#trainings' },
    { name: t('nav.events'), href: '#events' },
    { name: t('nav.locationsContacts'), href: '#locations' }
  ];

  return (
    <div className="home-wrapper">
      {/* Front-end Navbar */}
      <motion.nav 
        className={`home-nav ${isScrolled ? 'scrolled' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="home-nav-container">
          <div className="home-logo" onClick={() => window.scrollTo(0,0)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src={logo} alt="MyBot Logo" style={{ height: '50px', width: 'auto' }} />
            <span style={{ fontWeight: 'bold', fontSize: '1.2rem', letterSpacing: '1px' }}>MyBot</span>
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

      {/* Hero Section */}
      <section className="hero-section">
          <div className="hero-container">
            <motion.div 
              className="hero-content"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="hero-title">
                {t('hero.title').split('\n\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i === 0 && <br />}
                  </React.Fragment>
                ))}
              </h1>
              <p className="hero-subtitle">{t('hero.tagline')}</p>
              
              <div className="hero-cta-group" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button className="hero-btn-primary" onClick={() => navigate('/apply')}>
                  {t('hero.apply') || 'Apply Now'}
                </button>
                <button className="hero-btn-outline" onClick={() => window.location.href='#trainings'}>
                  {t('nav.trainings')}
                </button>
              </div>
            </motion.div>
            
            <motion.div 
              className="hero-image-box"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
               <img src={photo1} alt="Hero Tech Board" className="hero-img-box" />
            </motion.div>
         </div>
      </section>

      <section id="about" className="about-section">
         <div className="about-container">
            <motion.div 
               className="section-header"
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
            >
               <img src={logo} alt="MyBot Mascot" style={{ height: '60px', marginBottom: '1rem', filter: 'drop-shadow(0 0 10px rgba(184, 230, 0, 0.3))' }} />
               <h2 className="section-title" dangerouslySetInnerHTML={{ __html: t('about.title') }}></h2>
            </motion.div>

            <div className="about-features">
               <motion.div 
                 className="feature-card"
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: 0.1 }}
               >
                 <div className="feature-icon-wrapper">
                    <svg className="w-8 h-8" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18.5A2.493 2.493 0 0 1 7.51 20H7.5a2.468 2.468 0 0 1-2.4-3.154 2.98 2.98 0 0 1-.85-5.274 2.468 2.468 0 0 1 .92-3.182 2.477 2.477 0 0 1 1.876-3.344 2.5 2.5 0 0 1 3.41-1.856A2.5 2.5 0 0 1 12 5.5m0 13v-13m0 13a2.493 2.493 0 0 0 4.49 1.5h.01a2.468 2.468 0 0 0 2.403-3.154 2.98 2.98 0 0 0 .847-5.274 2.468 2.468 0 0 0-.921-3.182 2.477 2.477 0 0 0-1.875-3.344A2.5 2.5 0 0 0 14.5 3 2.5 2.5 0 0 0 12 5.5m-8 5a2.5 2.5 0 0 1 3.48-2.3m-.28 8.551a3 3 0 0 1-2.953-5.185M20 10.5a2.5 2.5 0 0 0-3.481-2.3m.28 8.551a3 3 0 0 0 2.954-5.185"/>
                    </svg>
                 </div>
                 <h3>{t('about.missionTitle')}</h3>
                 <p>{t('about.missionDesc')}</p>
               </motion.div>

               <motion.div 
                 className="feature-card"
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: 0.2 }}
               >
                 <div className="feature-icon-wrapper">
                    <svg className="w-8 h-8" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.5713 5h7v9h-7m-6.00001-4-3 4.5m3-4.5v5m0-5h3.00001m0 0h5m-5 0v5m-3.00001 0h3.00001m-3.00001 0v5m3.00001-5v5m6-6 2.5 6m-3-6-2.5 6m-3-14.5c0 .82843-.67158 1.5-1.50001 1.5-.82843 0-1.5-.67157-1.5-1.5s.67157-1.5 1.5-1.5 1.50001.67157 1.50001 1.5Z"/>
                    </svg>
                 </div>
                 <h3>{t('about.feature1Title')}</h3>
                 <p>{t('about.feature1Desc')}</p>
               </motion.div>

               <motion.div 
                 className="feature-card"
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: 0.3 }}
               >
                 <div className="feature-icon-wrapper">
                    <svg className="w-8 h-8" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24">
                       <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m10.051 8.102-3.778.322-1.994 1.994a.94.94 0 0 0 .533 1.6l2.698.316m8.39 1.617-.322 3.78-1.994 1.994a.94.94 0 0 1-1.595-.533l-.4-2.652m8.166-11.174a1.366 1.366 0 0 0-1.12-1.12c-1.616-.279-4.906-.623-6.38.853-1.671 1.672-5.211 8.015-6.31 10.023a.932.932 0 0 0 .162 1.111l.828.835.833.832a.932.932 0 0 0 1.111.163c2.008-1.102 8.35-4.642 10.021-6.312 1.475-1.478 1.133-4.77.855-6.385Zm-2.961 3.722a1.88 1.88 0 1 1-3.76 0 1.88 1.88 0 0 1 3.76 0Z"/>
                    </svg>
                 </div>
                 <h3>{t('about.feature2Title')}</h3>
                 <p>{t('about.feature2Desc')}</p>
               </motion.div>
            </div>
         </div>
      </section>

      {/* Trainings Section */}
      <section id="trainings" className="trainings-section">
         <div className="trainings-container">
            <motion.div 
               className="section-header"
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
            >
               <h2 className="section-title" dangerouslySetInnerHTML={{ __html: t('trainings.title') }}></h2>
            </motion.div>

            <div className="courses-grid">
               <motion.div className="course-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <div className="course-image">
                     <img src={photo2} alt="Course 1" />
                  </div>
                  <div className="course-content">
                     <h3>{t('trainings.course1')}</h3>
                     <p>{t('trainings.course1Desc')}</p>
                  </div>
               </motion.div>

               <motion.div className="course-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                  <div className="course-image">
                     <img src={photo3} alt="Course 2" />
                  </div>
                  <div className="course-content">
                     <h3>{t('trainings.course2')}</h3>
                     <p>{t('trainings.course2Desc')}</p>
                  </div>
               </motion.div>

               <motion.div className="course-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                  <div className="course-image">
                     <img src={photo4} alt="Course 3" />
                  </div>
                  <div className="course-content">
                     <h3>{t('trainings.course3')}</h3>
                     <p>{t('trainings.course3Desc')}</p>
                  </div>
               </motion.div>
            </div>
         </div>
      </section>
      
      {/* Events Section */}
      <section id="events" className="events-section">
         <div className="events-container">
            <motion.div 
               className="section-header"
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
            >
               <h2 className="section-title" dangerouslySetInnerHTML={{ __html: t('events.title') }}></h2>
            </motion.div>

            <div className="events-list">
               <motion.div className="event-item" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                  <div className="event-date">
                     <span className="month">MAY</span>
                     <span className="day">15</span>
                  </div>
                  <div className="event-details">
                     <h3>{t('events.event1')}</h3>
                  </div>
               </motion.div>

               <motion.div className="event-item" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                  <div className="event-date">
                     <span className="month">JUN</span>
                     <span className="day">02</span>
                  </div>
                  <div className="event-details">
                     <h3>{t('events.event2')}</h3>
                  </div>
               </motion.div>

               <motion.div className="event-item" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                  <div className="event-date">
                     <span className="month">JUL</span>
                     <span className="day">20</span>
                  </div>
                  <div className="event-details">
                     <h3>{t('events.event3')}</h3>
                  </div>
               </motion.div>
            </div>
            
            <motion.div 
               initial={{ opacity: 0, scale: 0.5 }} 
               whileInView={{ opacity: 1, scale: 1 }} 
               viewport={{ once: true }}
               style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}
            >
               <img src={logo} alt="Robot Mascot" style={{ height: '100px', opacity: 0.8, filter: 'drop-shadow(0 0 20px rgba(184, 230, 0, 0.4))' }} />
            </motion.div>
         </div>
      </section>

      {/* Locations Section */}
      <section id="locations" className="contact-section">
         <div className="contact-container">
            <motion.div 
               className="section-header"
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
            >
               <h2 className="section-title" dangerouslySetInnerHTML={{ __html: t('locations.title') }}></h2>
            </motion.div>

            <div className="contact-grid">
               <motion.div className="location-card" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
                  <h3>{t('locations.sofia')}</h3>
                  <p>{t('locations.sofiaAddr')}</p>
                  <div className="contact-phone">
                     <a href="tel:+359898424031">+359 89 842 4031</a>
                     <a href="tel:+359888991931">+359 88 899 1931</a>
                  </div>
               </motion.div>
               <motion.div className="location-card" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                  <h3>{t('locations.plovdiv')}</h3>
                  <p>{t('locations.plovdivAddr')}</p>
                  <div className="contact-phone">
                     <a href="tel:+359898424031">+359 89 842 4031</a>
                     <a href="tel:+359888991931">+359 88 899 1931</a>
                  </div>
               </motion.div>
               <motion.div className="location-card" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                  <h3>{t('locations.varna')}</h3>
                  <p>{t('locations.varnaAddr')}</p>
                  <div className="contact-phone">
                     <a href="tel:+359898424031">+359 89 842 4031</a>
                     <a href="tel:+359888991931">+359 88 899 1931</a>
                  </div>
               </motion.div>
            </div>
         </div>
      </section>
    </div>
  );
};

export default Home;
