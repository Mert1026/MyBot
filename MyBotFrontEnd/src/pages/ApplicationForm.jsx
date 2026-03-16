import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import ReCAPTCHA from 'react-google-recaptcha';
import api from '../utils/api';
import Footer from '../components/Footer';
import PublicNavbar from '../components/PublicNavbar';
import FallingBlocks from '../components/FallingBlocks';
import './Home.css';

const ApplicationForm = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const recaptchaRef = useRef(null);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [formData, setFormData] = useState({
    parentFirstName: '',
    parentLastName: '',
    phoneNumber: '',
    email: '',
    location: '',
    kids: [{ firstName: '', lastName: '', age: '' }]
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleKidChange = (index, e) => {
    const { name, value } = e.target;
    const newKids = [...formData.kids];
    newKids[index][name] = name === 'age' ? parseInt(value) || '' : value;
    setFormData(prev => ({ ...prev, kids: newKids }));
  };

  const addKid = () => {
    setFormData(prev => ({
      ...prev,
      kids: [...prev.kids, { firstName: '', lastName: '', age: '' }]
    }));
  };

  const removeKid = (index) => {
    setFormData(prev => ({
      ...prev,
      kids: prev.kids.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captchaToken) {
      toast.error(t('apply.captchaRequired') || 'Please verify you are not a robot.');
      return;
    }
    setLoading(true);
    
    try {
      const res = await api.post('/ApplicationForms/create', formData);
      if (res.data.success) {
        toast.success(t('apply.success') || 'Application submitted successfully! We will contact you soon.');
        setFormData({ parentFirstName: '', parentLastName: '', phoneNumber: '', email: '', location: '', kids: [{ firstName: '', lastName: '', age: '' }] });
        setCaptchaToken(null);
        if (recaptchaRef.current) recaptchaRef.current.reset();
        setTimeout(() => navigate('/'), 2000);
      }
    } catch (error) {
       toast.error(error.response?.data?.message || 'Failed to submit application. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '0.75rem', borderRadius: '12px',
    border: '2px solid #e0e0e0', background: '#ffffff', color: '#2d3436',
    fontFamily: "'Baloo 2', cursive", fontSize: '0.95rem',
    transition: 'border-color 0.2s',
  };

  const labelStyle = {
    display: 'block', color: '#636e72', marginBottom: '0.5rem',
    fontSize: '0.9rem', fontWeight: 600,
  };

  return (
    <div className="home-wrapper">
      <PublicNavbar />
      
      <div style={{ paddingTop: '120px', paddingBottom: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      
      <FallingBlocks count={18} section="apply" />

      <div className="contact-card fade-in" style={{
         background: '#ffffff',
         border: '3px solid #f0f0f0',
         padding: '3rem',
         borderRadius: '24px',
         maxWidth: '600px',
         width: '90%',
         boxShadow: '0 20px 60px rgba(77, 150, 255, 0.1)',
         position: 'relative',
         zIndex: 10,
      }}>
         {/* Rainbow top bar */}
         <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', borderRadius: '24px 24px 0 0', background: 'linear-gradient(90deg, var(--color-secondary), #FFD93D, #6BCB77, #4D96FF, #FF8FD8)' }}></div>

         <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
            <div className="home-lang-toggle">
              <button onClick={() => changeLanguage('en')} className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`}>EN</button>
              <button onClick={() => changeLanguage('bg')} className={`lang-btn ${i18n.language === 'bg' ? 'active' : ''}`}>BG</button>
            </div>
         </div>

         <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '2rem' }} dangerouslySetInnerHTML={{ __html: t('apply.title') || 'Apply <span>Now</span>' }}>
         </h2>
         <p style={{ textAlign: 'center', color: '#636e72', marginBottom: '2.5rem' }}>
           {t('apply.desc') || 'Join the future of education. Leave your details and our team will reach out to schedule an introduction!'}
         </p>

         <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="grid-2">
               <div className="form-group" style={{ marginBottom: 0 }}>
                 <label style={labelStyle}>{t('apply.parentFName') || 'Parent First Name'}</label>
                 <input 
                   required type="text" name="parentFirstName" value={formData.parentFirstName} onChange={handleChange}
                   style={inputStyle} 
                   onFocus={e => e.target.style.borderColor = '#4D96FF'}
                   onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                 />
               </div>
               <div className="form-group" style={{ marginBottom: 0 }}>
                 <label style={labelStyle}>{t('apply.parentLName') || 'Parent Last Name'}</label>
                 <input 
                   required type="text" name="parentLastName" value={formData.parentLastName} onChange={handleChange}
                   style={inputStyle}
                   onFocus={e => e.target.style.borderColor = '#4D96FF'}
                   onBlur={e => e.target.style.borderColor = '#e0e0e0'}
                 />
               </div>
            </div>

             <div className="form-group" style={{ marginBottom: 0 }}>
               <label style={labelStyle}>{t('apply.email') || 'Email Address'}</label>
               <input 
                 required type="email" name="email" value={formData.email} onChange={handleChange}
                 style={inputStyle}
                 onFocus={e => e.target.style.borderColor = '#6BCB77'}
                 onBlur={e => e.target.style.borderColor = '#e0e0e0'}
               />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
               <label style={labelStyle}>{t('apply.phone') || 'Phone Number'}</label>
               <input 
                 required type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange}
                 style={inputStyle}
                   onFocus={e => e.target.style.borderColor = 'var(--color-secondary)'}
                 onBlur={e => e.target.style.borderColor = '#e0e0e0'}
               />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
               <label style={labelStyle}>{t('apply.city') || 'Preferred City'}</label>
               <select 
                 required name="location" value={formData.location} onChange={handleChange}
                 style={inputStyle}
                 onFocus={e => e.target.style.borderColor = '#FF8FD8'}
                 onBlur={e => e.target.style.borderColor = '#e0e0e0'}
               >
                 <option value="" disabled>Select a City...</option>
                 <option value="Габрово">Габрово</option>
                 <option value="Велико Търново">Велико Търново</option>
                 <option value="Варна">Варна</option>
               </select>
            </div>

            <div style={{ marginTop: '1rem', borderTop: '2px dashed #f0f0f0', paddingTop: '1rem' }}>
               <h3 style={{ color: '#2d3436', marginBottom: '1rem', fontWeight: 700 }}>{t('apply.childInfo') || 'Child Information'}</h3>
               {formData.kids.map((kid, index) => (
                 <div key={index} style={{ marginBottom: '1.5rem', padding: '1rem', background: '#FFF9E6', borderRadius: '16px', border: '2px solid #FFD93D' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                       <span style={{ color: 'var(--color-secondary)', fontWeight: 'bold' }}>{t('apply.child') || 'Child'} #{index + 1}</span>
                       {formData.kids.length > 1 && (
                         <button type="button" onClick={() => removeKid(index)} style={{ background: 'transparent', border: 'none', color: 'var(--color-secondary)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 700 }}>
                           ✕ {t('apply.remove') || 'Remove'}
                         </button>
                       )}
                    </div>
                    <div className="grid-2" style={{ marginBottom: '1rem' }}>
                       <div>
                         <label style={{ ...labelStyle, fontSize: '0.8rem' }}>{t('apply.kidFName') || 'First Name'}</label>
                         <input required type="text" name="firstName" value={kid.firstName} onChange={(e) => handleKidChange(index, e)} style={inputStyle} />
                       </div>
                       <div>
                         <label style={{ ...labelStyle, fontSize: '0.8rem' }}>{t('apply.kidLName') || 'Last Name'}</label>
                         <input required type="text" name="lastName" value={kid.lastName} onChange={(e) => handleKidChange(index, e)} style={inputStyle} />
                       </div>
                    </div>
                    <div>
                       <label style={{ ...labelStyle, fontSize: '0.8rem' }}>{t('apply.age') || 'Age'}</label>
                       <input required type="number" name="age" min="4" max="18" value={kid.age} onChange={(e) => handleKidChange(index, e)} style={inputStyle} />
                    </div>
                 </div>
               ))}
               <button type="button" onClick={addKid} className="base-btn outline-btn" style={{ width: '100%', padding: '0.75rem', borderStyle: 'dashed', borderColor: '#4D96FF', color: '#4D96FF', borderRadius: '16px', fontFamily: "'Baloo 2', cursive" }}>
                 + {t('apply.addKid') || 'Add Another Child'}
               </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                onChange={(token) => setCaptchaToken(token)}
                onExpired={() => setCaptchaToken(null)}
                theme="light"
              />
            </div>

            <button type="submit" disabled={loading || !captchaToken} className="hero-btn-primary" style={{ marginTop: '1.5rem', width: '100%', fontSize: '1rem', padding: '1rem', borderRadius: '16px', opacity: (!captchaToken || loading) ? 0.5 : 1, cursor: (!captchaToken || loading) ? 'not-allowed' : 'pointer' }}>
               {loading ? (t('apply.submitting') || 'Submitting...') : (t('apply.submit') || 'Submit Application')}
            </button>
         </form>
         
         <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button className="base-btn" onClick={() => navigate('/')} style={{ border: 'none', color: '#4D96FF', fontWeight: 700, background: 'transparent', cursor: 'pointer', fontFamily: "'Baloo 2', cursive" }}>
               {t('apply.back') || 'Back to Home'}
            </button>
         </div>
      </div>
      </div> {/* Closing the flexGrow div */}
      <Footer />
    </div>
  );
}

export default ApplicationForm;
