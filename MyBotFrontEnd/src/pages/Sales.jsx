import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import PublicNavbar from '../components/PublicNavbar';
import Footer from '../components/Footer';
import './Sales.css';

import robolinkLogo from '../assets/Robolink_assets/robolink_logo.png';
import droneVideo from '../assets/Robolink_assets/drone_video.mp4';
import drone1 from '../assets/Robolink_assets/drone_1.webp';
import drone2 from '../assets/Robolink_assets/drone_2.webp';
import drone3 from '../assets/Robolink_assets/drone_3.webp';
import drone4 from '../assets/Robolink_assets/drone_4.webp';

const Sales = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    question: ''
  });
  const [formStatus, setFormStatus] = useState('');
  const [fullscreenMedia, setFullscreenMedia] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const openMedia = (mediaSrc, type) => {
    setFullscreenMedia({ src: mediaSrc, type });
  };

  const closeMedia = () => {
    setFullscreenMedia(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('submitting');

    // Web3Forms integration
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          access_key: '55c790bf-8f7b-4605-939b-3980c981dce0',
          subject: 'New CoDrone EDU Question',
          from_name: 'CoDrone EDU Shop',
          Name: formData.name,
          Email: formData.email,
          Product: 'CoDrone EDU',
          Question: formData.question
        })
      });

      const result = await response.json();
      if (result.success) {
        setFormStatus('success');
        setFormData({ name: '', email: '', question: '' });
      } else {
        setFormStatus('error');
      }
    } catch (error) {
      setFormStatus('error');
    }
  };

  return (
    <div className="sales-wrapper">
      <AnimatePresence>
        {fullscreenMedia && (
          <motion.div 
            className="fullscreen-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMedia}
          >
            <button className="close-modal-btn" onClick={closeMedia}>&times;</button>
            <div className="fullscreen-content" onClick={(e) => e.stopPropagation()}>
              {fullscreenMedia.type === 'video' ? (
                <video src={fullscreenMedia.src} autoPlay controls className="expanded-media" />
              ) : (
                <img src={fullscreenMedia.src} alt="Expanded" className="expanded-media" />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <PublicNavbar />

      <section className="sales-hero">
        <div className="sales-hero-bg"></div>
        <div className="sales-container">
          <motion.div
            className="sales-header"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img src={robolinkLogo} alt="Robolink Logo" style={{ height: '100px', width: 'auto', maxWidth: '100%', objectFit: 'contain', marginBottom: '1rem' }} />
            <h1 className="sales-title">{t('sales.title')}</h1>
            <p className="sales-subtitle">{t('sales.subtitle')}</p>
          </motion.div>
        </div>
      </section>

      <section className="sales-content-section">
        <div className="sales-container">
          {!selectedProduct ? (
            <div className="products-list-view">
              <motion.div 
                className="product-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                onClick={() => setSelectedProduct('codrone-edu')}
              >
                <img src={drone1} alt="CoDrone EDU" className="product-card-img" />
                <div className="product-card-info">
                  <h3>{t('sales.title')}</h3>
                  <p>{t('sales.subtitle')}</p>
                  <button className="view-product-btn">{t('sales.detailsBtn')}</button>
                </div>
              </motion.div>
            </div>
          ) : (
            <div className="product-details-view">
              <button className="back-to-shop-btn" onClick={() => setSelectedProduct(null)}>
                &larr; {t('nav.sales')}
              </button>
              <div className="sales-grid">
            <motion.div
              className="sales-media"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="main-media" onClick={() => openMedia(droneVideo, 'video')} style={{ cursor: 'pointer', position: 'relative' }}>
                <video src={droneVideo} autoPlay loop muted playsInline className="drone-video" style={{ pointerEvents: 'none' }}></video>
                <div className="expand-hint">
                  <svg className="w-6 h-6" fill="none" stroke="white" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
                </div>
              </div>
              <div className="image-gallery">
                <img src={drone1} alt="CoDrone EDU 1" onClick={() => openMedia(drone1, 'image')} style={{ cursor: 'pointer' }} />
                <img src={drone2} alt="CoDrone EDU 2" onClick={() => openMedia(drone2, 'image')} style={{ cursor: 'pointer' }} />
                <img src={drone3} alt="CoDrone EDU 3" onClick={() => openMedia(drone3, 'image')} style={{ cursor: 'pointer' }} />
                <img src={drone4} alt="CoDrone EDU 4" onClick={() => openMedia(drone4, 'image')} style={{ cursor: 'pointer' }} />
              </div>
            </motion.div>

            <motion.div
              className="sales-details"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="product-info">
                <h2>{t('sales.title')}</h2>
                <p className="product-desc">{t('sales.desc')}</p>
                <ul className="product-features">
                  <li><svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> {t('sales.feature1')}</li>
                  <li><svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> {t('sales.feature2')}</li>
                  <li><svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> {t('sales.feature3')}</li>
                  <li><svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> {t('sales.feature4')}</li>
                </ul>

                <div className="product-included">
                  <h3 style={{ marginTop: '2rem', marginBottom: '1rem', fontSize: '1.2rem', color: '#1e293b' }}>
                    {t('sales.includedTitle')}
                  </h3>
                  <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <li>{t('sales.includedItem1')}</li>
                    <li>{t('sales.includedItem2')}</li>
                    <li>{t('sales.includedItem3')}</li>
                    <li>{t('sales.includedItem4')}</li>
                    <li>{t('sales.includedItem5')}</li>
                    <li>{t('sales.includedItem6')}</li>
                    <li>{t('sales.includedItem7')}</li>
                    <li>{t('sales.includedItem8')}</li>
                    <li>{t('sales.includedItem9')}</li>
                    <li>{t('sales.includedItem10')}</li>
                    <li>{t('sales.includedItem11')}</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="sales-form-wrapper"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="purchase-form-card">
                <h3>{t('sales.formTitle')}</h3>
                <form onSubmit={handleSubmit} className="purchase-form">
                  <div className="form-group">
                    <label>{t('sales.formName')}</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="form-input" />
                  </div>
                  <div className="form-group">
                    <label>{t('sales.formEmail')}</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="form-input" />
                  </div>
                  <div className="form-group">
                    <label>{t('sales.formQuestion')}</label>
                    <textarea name="question" rows="4" value={formData.question} onChange={handleChange} required className="form-input" style={{ resize: 'vertical' }}></textarea>
                  </div>

                  <button type="submit" className="submit-btn" disabled={formStatus === 'submitting'}>
                    {formStatus === 'submitting' ? '...' : t('sales.submitQuestion')}
                  </button>

                  {formStatus === 'success' && <div className="form-success">{t('sales.questionSuccess')}</div>}
                  {formStatus === 'error' && <div className="form-error">{t('sales.questionError')}</div>}
                </form>
              </div>
            </motion.div>
          </div>
          </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Sales;
