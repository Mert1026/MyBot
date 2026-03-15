import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Home.css'; // Reusing landing page styles for consistency

import photo2 from '../assets/photo_2.jpg';
import photo3 from '../assets/photo_3.jpg';
import photo4 from '../assets/photo_4.jpg';

const Courses = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0); // Ensure page loads at the top
  }, []);

  return (
    <div className="home-wrapper" style={{ paddingTop: '80px' }}>
      
      {/* Active Courses Header Container */}
      <section className="events-section" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingTop: '40px' }}>
         <div className="trainings-container" style={{ flexGrow: 1 }}>
            
            <motion.div 
               className="section-header"
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
            >
               <h2 className="section-title">
                  {t('trainings.title').replace('<span>', '').replace('</span>', '')} 
                  <span style={{ color: '#b8e600' }}> {t('trainings.title').includes('Активни') ? 'Курсове' : 'Courses'}</span>
               </h2>
               <p style={{ color: '#94a3b8', fontSize: '1.2rem', marginTop: '1rem', maxWidth: '600px', margin: '1rem auto' }}>
                 Explore our robotics and programming curriculums designed to craft the innovators of tomorrow.
               </p>
            </motion.div>

            <div className="courses-grid" style={{ marginTop: '3rem' }}>
               <motion.div className="course-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <div className="course-image" style={{ height: '280px' }}>
                     <img src={photo2} alt="Course 1" />
                  </div>
                  <div className="course-content">
                     <h3>{t('trainings.course1')}</h3>
                     <p>{t('trainings.course1Desc')}</p>
                     <button className="base-btn outline-btn w-full mt-2" style={{ marginTop: '1.5rem', width: '100%' }} onClick={() => navigate('/apply')}>
                        {t('hero.apply') || 'Apply Now'}
                     </button>
                  </div>
               </motion.div>

               <motion.div className="course-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                  <div className="course-image" style={{ height: '280px' }}>
                     <img src={photo3} alt="Course 2" />
                  </div>
                  <div className="course-content">
                     <h3>{t('trainings.course2')}</h3>
                     <p>{t('trainings.course2Desc')}</p>
                     <button className="base-btn outline-btn w-full mt-2" style={{ marginTop: '1.5rem', width: '100%' }} onClick={() => navigate('/apply')}>
                        {t('hero.apply') || 'Apply Now'}
                     </button>
                  </div>
               </motion.div>

               <motion.div className="course-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                  <div className="course-image" style={{ height: '280px' }}>
                     <img src={photo4} alt="Course 3" />
                  </div>
                  <div className="course-content">
                     <h3>{t('trainings.course3')}</h3>
                     <p>{t('trainings.course3Desc')}</p>
                     <button className="base-btn outline-btn w-full mt-2" style={{ marginTop: '1.5rem', width: '100%' }} onClick={() => navigate('/apply')}>
                        {t('hero.apply') || 'Apply Now'}
                     </button>
                  </div>
               </motion.div>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '4rem' }}>
               <button className="glow-btn" onClick={() => navigate('/')}>
                  Back to Home
               </button>
            </div>
         </div>
      </section>
    </div>
  );
};

export default Courses;
