import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import './Home.css';

import photo1 from '../assets/photo_1.jpg';
import photo2 from '../assets/photo_2.jpg';
import photo3 from '../assets/photo_3.jpg';
import photo4 from '../assets/photo_4.jpg';
import photo5 from '../assets/photo_5.jpg';

const courseImages = [photo2, photo3, photo4, photo5, photo1];

const Courses = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchGroups = async () => {
      try {
        const res = await api.get('/Groups/all');
        if (res.data.success) {
          setGroups(res.data.data?.filter(g => !g.isDeleted) || []);
        }
      } catch (err) {
        console.error('Failed to load groups');
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  return (
    <div className="home-wrapper" style={{ paddingTop: '80px' }}>
      <section className="trainings-section" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingTop: '40px' }}>
         <div className="trainings-container" style={{ flexGrow: 1 }}>
            
            <motion.div 
               className="section-header"
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
            >
               <h2 className="section-title" dangerouslySetInnerHTML={{ __html: t('trainings.allCourses') || 'All <span>Courses</span>' }}></h2>
               <p style={{ color: '#94a3b8', fontSize: '1.2rem', marginTop: '1rem', maxWidth: '600px', margin: '1rem auto' }}>
                 {t('trainings.allCoursesSubtitle') || 'Browse all available groups and courses'}
               </p>
            </motion.div>

            {loading ? (
              <p style={{ textAlign: 'center', color: '#94a3b8' }}>{t('common.loading')}</p>
            ) : groups.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#94a3b8' }}>{t('common.noData')}</p>
            ) : (
              <div className="courses-grid" style={{ marginTop: '3rem' }}>
                {groups.map((group, idx) => (
                  <motion.div 
                    className="course-card" 
                    key={group.id}
                    initial={{ opacity: 0, y: 30 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true }}
                    transition={{ delay: (idx % 3) * 0.1 }}
                  >
                    <div className="course-image" style={{ height: '280px' }}>
                       <img src={group.imageLink || courseImages[idx % courseImages.length]} alt={group.name} />
                    </div>
                    <div className="course-content">
                       <h3>{group.name}</h3>
                       <p>{group.description || t('common.noData')}</p>
                       <div style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: '#64748b' }}>
                         <p>📅 {group.dayOfWeek || 'N/A'} · ⏰ {group.startAsHour || '?'} - {group.endAsHour || '?'}</p>
                         <p>📍 {group.location || 'N/A'} · 👶 {group.minAge}-{group.maxAge} yrs · 👥 Max {group.maxMembers}</p>
                       </div>
                       <button 
                         className="base-btn outline-btn w-full mt-2" 
                         style={{ marginTop: '1.5rem', width: '100%' }} 
                         onClick={() => navigate('/apply')}
                       >
                         {t('hero.apply') || 'Apply Now'}
                       </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            
            <div style={{ textAlign: 'center', marginTop: '4rem', marginBottom: '2rem' }}>
               <button className="show-more-btn" onClick={() => navigate('/')}>
                 ← {t('nav.home') || 'Back to Home'}
               </button>
            </div>
         </div>
      </section>
    </div>
  );
};

export default Courses;
