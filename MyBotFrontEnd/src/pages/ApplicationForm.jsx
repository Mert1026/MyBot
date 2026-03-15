import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import './Home.css';

const ApplicationForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    
    try {
      const res = await api.post('/ApplicationForms/create', formData);
      if (res.data.success) {
        toast.success(t('apply.success') || 'Application submitted successfully! We will contact you soon.');
        setFormData({ parentFirstName: '', parentLastName: '', phoneNumber: '', email: '', location: '', kids: [{ firstName: '', lastName: '', age: '' }] });
        setTimeout(() => navigate('/'), 2000);
      }
    } catch (error) {
       toast.error(error.response?.data?.message || 'Failed to submit application. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '80px', paddingBottom: '80px' }}>
      
      <div className="contact-card fade-in" style={{
         background: 'rgba(255, 255, 255, 0.03)',
         border: '1px solid rgba(255, 255, 255, 0.08)',
         padding: '3rem',
         borderRadius: '16px',
         maxWidth: '600px',
         width: '90%',
         boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
         backdropFilter: 'blur(10px)'
      }}>
         <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '2rem' }} dangerouslySetInnerHTML={{ __html: t('apply.title') || 'Apply <span>Now</span>' }}>
         </h2>
         <p style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '2.5rem' }}>
           {t('apply.desc') || 'Join the future of education. Leave your details and our team will reach out to schedule an introduction!'}
         </p>

         <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="grid-2">
               <div className="form-group" style={{ marginBottom: 0 }}>
                 <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem', fontSize: '0.9rem' }}>{t('apply.parentFName') || 'Parent First Name'}</label>
                 <input 
                   required type="text" name="parentFirstName" value={formData.parentFirstName} onChange={handleChange}
                   style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.5)', color: '#fff' }} 
                 />
               </div>
               <div className="form-group" style={{ marginBottom: 0 }}>
                 <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem', fontSize: '0.9rem' }}>{t('apply.parentLName') || 'Parent Last Name'}</label>
                 <input 
                   required type="text" name="parentLastName" value={formData.parentLastName} onChange={handleChange}
                   style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.5)', color: '#fff' }} 
                 />
               </div>
            </div>

             <div className="form-group" style={{ marginBottom: 0 }}>
               <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem', fontSize: '0.9rem' }}>{t('apply.email') || 'Email Address'}</label>
               <input 
                 required type="email" name="email" value={formData.email} onChange={handleChange}
                 style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.5)', color: '#fff' }} 
               />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
               <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem', fontSize: '0.9rem' }}>{t('apply.phone') || 'Phone Number'}</label>
               <input 
                 required type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange}
                 style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.5)', color: '#fff' }} 
               />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
               <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem', fontSize: '0.9rem' }}>{t('apply.city') || 'Preferred City'}</label>
               <select 
                 required name="location" value={formData.location} onChange={handleChange}
                 style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.5)', color: '#fff' }}
               >
                 <option value="" disabled>Select a City...</option>
                 <option value="Sofia">Sofia</option>
                 <option value="Plovdiv">Plovdiv</option>
                 <option value="Varna">Varna</option>
                 <option value="Remote">Remote / Online</option>
               </select>
            </div>

            <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
               <h3 style={{ color: '#fff', marginBottom: '1rem' }}>{t('apply.childInfo') || 'Child Information'}</h3>
               {formData.kids.map((kid, index) => (
                 <div key={index} style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                       <span style={{ color: '#b8e600', fontWeight: 'bold' }}>{t('apply.child') || 'Child'} #{index + 1}</span>
                       {formData.kids.length > 1 && (
                         <button type="button" onClick={() => removeKid(index)} style={{ background: 'transparent', border: 'none', color: '#ff4444', cursor: 'pointer', fontSize: '0.9rem' }}>
                           ✕ {t('apply.remove') || 'Remove'}
                         </button>
                       )}
                    </div>
                    <div className="grid-2" style={{ marginBottom: '1rem' }}>
                       <div>
                         <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem', fontSize: '0.8rem' }}>{t('apply.kidFName') || 'First Name'}</label>
                         <input required type="text" name="firstName" value={kid.firstName} onChange={(e) => handleKidChange(index, e)} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff' }} />
                       </div>
                       <div>
                         <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem', fontSize: '0.8rem' }}>{t('apply.kidLName') || 'Last Name'}</label>
                         <input required type="text" name="lastName" value={kid.lastName} onChange={(e) => handleKidChange(index, e)} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff' }} />
                       </div>
                    </div>
                    <div>
                       <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem', fontSize: '0.8rem' }}>{t('apply.age') || 'Age'}</label>
                       <input required type="number" name="age" min="4" max="18" value={kid.age} onChange={(e) => handleKidChange(index, e)} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff' }} />
                    </div>
                 </div>
               ))}
               <button type="button" onClick={addKid} className="base-btn outline-btn" style={{ width: '100%', padding: '0.75rem', borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.3)' }}>
                 + {t('apply.addKid') || 'Add Another Child'}
               </button>
            </div>

            <button type="submit" disabled={loading} className="glow-btn" style={{ marginTop: '1.5rem', width: '100%' }}>
               {loading ? (t('apply.submitting') || 'Submitting...') : (t('apply.submit') || 'Submit Application')}
            </button>
         </form>
         
         <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button className="base-btn outline-btn" onClick={() => navigate('/')} style={{ border: 'none', color: '#94a3b8' }}>
               {t('apply.back') || 'Back to Home'}
            </button>
         </div>
      </div>
      
    </div>
  );
}

export default ApplicationForm;
