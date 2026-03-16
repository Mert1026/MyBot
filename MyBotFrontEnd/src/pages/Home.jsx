import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import Footer from '../components/Footer';
import PublicNavbar from '../components/PublicNavbar';
import FallingBlocks from '../components/FallingBlocks';
import './Home.css';
import logo from '../assets/logo.png';
import photo1 from '../assets/photo_1.jpg';
import photo2 from '../assets/photo_2.jpg';
import photo3 from '../assets/photo_3.jpg';
import photo4 from '../assets/photo_4.jpg';
import photo5 from '../assets/photo_5.jpg';

const courseImages = [photo2, photo3, photo4, photo5, photo1];

const Home = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await api.get('/Groups/all');
        if (res.data.success) {
          setGroups(res.data.data?.filter(g => !g.isDeleted) || []);
        }
      } catch (err) {
        console.error('Failed to load groups for home page');
      }
    };
    fetchGroups();
  }, []);

  const displayedGroups = groups.slice(0, 3);

  return (
    <div className="home-wrapper">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="hero-section">
          <FallingBlocks count={16} section="hero" />
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
         <FallingBlocks count={12} section="about" />
         <div className="about-container">
            <motion.div 
               className="section-header"
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
            >
               <img src={logo} alt="MyBot Mascot" style={{ height: '60px', marginBottom: '1rem', filter: 'drop-shadow(0 0 10px rgba(33, 150, 243, 0.3))' }} />
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

      {/* Trainings Section - Shows last 3 groups from DB */}
      <section id="trainings" className="trainings-section">
         <FallingBlocks count={10} section="trainings" />
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
               {displayedGroups.length > 0 ? (
                 displayedGroups.map((group, idx) => (
                   <motion.div 
                     className="course-card" 
                     key={group.id}
                     initial={{ opacity: 0, y: 30 }} 
                     whileInView={{ opacity: 1, y: 0 }} 
                     viewport={{ once: true }}
                     transition={{ delay: idx * 0.1 }}
                   >
                     <div className="course-image">
                        <img src={group.imageLink || courseImages[idx % courseImages.length]} alt={group.name} />
                     </div>
                     <div className="course-content">
                        <h3>{group.name}</h3>
                        <p>{group.description || t('common.noData')}</p>
                         <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: '#636e72' }}>
                           {group.dayOfWeek && `${group.dayOfWeek}`}{group.startAsHour && ` · ${group.startAsHour} - ${group.endAsHour}`}{group.location && ` · ${group.location}`}
                        </p>
                     </div>
                   </motion.div>
                 ))
               ) : (
                 <>
                   <motion.div className="course-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                     <div className="course-image"><img src={photo2} alt="Course 1" /></div>
                     <div className="course-content">
                        <h3>{t('trainings.course1')}</h3>
                        <p>{t('trainings.course1Desc')}</p>
                     </div>
                   </motion.div>
                   <motion.div className="course-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                     <div className="course-image"><img src={photo3} alt="Course 2" /></div>
                     <div className="course-content">
                        <h3>{t('trainings.course2')}</h3>
                        <p>{t('trainings.course2Desc')}</p>
                     </div>
                   </motion.div>
                   <motion.div className="course-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                     <div className="course-image"><img src={photo4} alt="Course 3" /></div>
                     <div className="course-content">
                        <h3>{t('trainings.course3')}</h3>
                        <p>{t('trainings.course3Desc')}</p>
                     </div>
                   </motion.div>
                 </>
               )}
            </div>

            {groups.length > 3 && (
              <div style={{ textAlign: 'center' }}>
                <button className="show-more-btn" onClick={() => navigate('/courses')}>
                  {t('trainings.showMore') || 'Show More'}
                </button>
              </div>
            )}
         </div>
      </section>

      {/* Locations Section */}
      <section id="locations" className="contact-section">
         <FallingBlocks count={10} section="locations" />
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
                  <h3>{t('locations.gabrovo')}</h3>
                  <p>{t('locations.gabrovoAddr')}</p>
                  <div className="contact-phone">
                     <a href="tel:+359898424031">+359 898 424 031</a>
                     <a href="tel:+359888991931">+359 888 991 931</a>
                  </div>
               </motion.div>
               <motion.div className="location-card" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                  <h3>{t('locations.vt')}</h3>
                  <p>{t('locations.vtAddr')}</p>
                  <div className="contact-phone">
                     <a href="tel:+359898424031">+359 898 424 031</a>
                     <a href="tel:+359888991931">+359 888 991 931</a>
                  </div>
               </motion.div>
               <motion.div className="location-card" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                  <h3>{t('locations.varna')}</h3>
                  <p>{t('locations.varnaAddr')}</p>
                  <div className="contact-phone">
                     <a href="tel:+359898424031">+359 898 424 031</a>
                     <a href="tel:+359888991931">+359 888 991 931</a>
                  </div>
               </motion.div>
            </div>
         </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
