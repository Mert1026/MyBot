import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { formatDateForView } from '../utils/dateUtils';
import { Plus, Edit, Trash2, X, CheckCircle, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Applications = () => {
  const { t } = useTranslation();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentForm, setCurrentForm] = useState(null);
  const [allMembers, setAllMembers] = useState([]);

  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [formToApprove, setFormToApprove] = useState(null);
  const [paymentStartDate, setPaymentStartDate] = useState(new Date().toISOString().split('T')[0]);

  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [infoForm, setInfoForm] = useState(null);

  const fetchForms = async () => {
    try {
      setLoading(true);
      const res = await api.get('/ApplicationForms/all');
      if (res.data.success) {
        setForms(res.data.data?.filter(f => !f.isDeleted) || []);
      }
    } catch (error) {
      toast.error(t('Failed to fetch data'));
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await api.get('/Members/all');
      if (res.data.success) {
        setAllMembers(res.data.data?.filter(m => !m.isDeleted) || []);
      }
    } catch (error) {
      console.error('Failed to fetch members for info modal');
    }
  };

  useEffect(() => {
    fetchForms();
    fetchMembers();
  }, []);

  const openModal = (form = null) => {
    setCurrentForm(form ? { ...form } : {
        parentFirstName: '', parentLastName: '', phoneNumber: '', email: '', location: ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCurrentForm(null);
    setIsModalOpen(false);
  };

  const openApproveModal = (form) => {
    setFormToApprove(form);
    setPaymentStartDate(new Date().toISOString().split('T')[0]);
    setIsApproveModalOpen(true);
  };

  const closeApproveModal = () => {
    setFormToApprove(null);
    setIsApproveModalOpen(false);
  };

  const openInfoModal = (form) => {
    setInfoForm(form);
    setIsInfoModalOpen(true);
  };

  const handleApprove = async (e) => {
      e.preventDefault();
      try {
          const res = await api.post('/ApplicationForms/approve', {
              applicationFormId: formToApprove.id,
              paymentStartDate: new Date(paymentStartDate).toISOString()
          });
          if (res.data.success) {
              toast.success('Application approved successfully!');
              closeApproveModal();
              fetchForms();
          }
      } catch(err) {
          toast.error(err.response?.data?.message || 'Failed to approve application');
      }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentForm.id) {
        const res = await api.post(`/ApplicationForms/update?id=${currentForm.id}`, currentForm);
        if (res.data.success) toast.success('Application form updated successfully');
      } else {
        const res = await api.post('/ApplicationForms/create', currentForm);
        if (res.data.success) toast.success('Application form created successfully');
      }
      closeModal();
      fetchForms();
    } catch (error) {
       toast.error(error.response?.data?.message || 'Action failed');
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm(t('common.deleteConfirm'))) return;
    try {
      const res = await api.delete(`/ApplicationForms/softDelete?id=${id}`);
      if (res.data.success) {
          toast.success('Form deleted');
          fetchForms();
      }
    } catch (error) {
      toast.error('Failed to delete form');
    }
  };

  return (
    <div className="fade-in">
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <h1>{t('applications.title') || 'Application Forms'}</h1>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <Plus size={16} /> {t('applications.addForm') || 'Add Application Form'}
        </button>
      </div>

      <div className="card">
        {loading ? (
          <p>{t('common.loading')}</p>
        ) : forms.length === 0 ? (
          <p>{t('common.noData')}</p>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>{t('common.formId')}</th>
                  <th>{t('applications.parentName')}</th>
                  <th>{t('applications.contact')}</th>
                  <th>{t('applications.location')}</th>
                  <th>{t('applications.status')}</th>
                  <th>{t('applications.date')}</th>
                  <th>{t('applications.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {forms.map((form) => (
                  <tr key={form.id} style={{ backgroundColor: form.isApproved ? '#dcfce7' : '#fee2e2' }}>
                    <td><span style={{fontFamily:'monospace', fontSize:'0.75rem'}} title={form.id}>{form.id.substring(0,8)}...</span></td>
                    <td><strong>{form.parentFirstName} {form.parentLastName}</strong></td>
                    <td>
                        <div style={{fontSize:'0.875rem'}}>
                            <div>{form.email}</div>
                            <div style={{color:'var(--color-text-secondary)'}}>{form.phoneNumber}</div>
                        </div>
                    </td>
                    <td>{form.location}</td>
                    <td>
                        <span className={form.isApproved ? 'badge badge-success' : 'badge badge-danger'}>
                            {form.isApproved ? t('applications.approved') : t('applications.pending')}
                        </span>
                    </td>
                    <td>{formatDateForView(form.createdAt)}</td>
                    <td>
                      <div className="flex-end">
                        {!form.isApproved && (
                          <button className="btn btn-success" style={{ padding: '0.25rem 0.5rem', marginRight: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }} onClick={() => openApproveModal(form)}>
                            <CheckCircle size={14} /> {t('applications.approve')}
                          </button>
                        )}
                        <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem' }} onClick={() => openInfoModal(form)} title={t('common.info')}>
                          <Info size={14} />
                        </button>
                        <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem' }} onClick={() => openModal(form)} title={t('common.edit')}>
                          <Edit size={14} />
                        </button>
                        <button className="btn btn-danger" style={{ padding: '0.25rem 0.5rem' }} onClick={() => handleDelete(form.id)} title={t('common.delete')}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Info Modal */}
      {isInfoModalOpen && infoForm && (
        <div className="modal-overlay">
          <div className="modal-content fade-in text-left" style={{maxWidth: '600px'}}>
            <div className="flex-between" style={{ marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Info size={24} color="var(--primary-color)" /> {t('applications.formInfo')}
                </h2>
                <button onClick={() => setIsInfoModalOpen(false)} className="btn-outline" style={{ border:'none', background:'transparent', cursor:'pointer' }}><X size={20}/></button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#475569' }}>{t('applications.parentDetails')}</h3>
                    <p><strong>{t('common.name')}:</strong> {infoForm.parentFirstName} {infoForm.parentLastName}</p>
                    <p><strong>{t('auth.email')}:</strong> <a href={`mailto:${infoForm.email}`}>{infoForm.email}</a></p>
                    <p><strong>{t('parents.phone')}:</strong> {infoForm.phoneNumber}</p>
                    <p><strong>{t('applications.location')}:</strong> {infoForm.location}</p>
                    <p><strong>{t('applications.date')}:</strong> {formatDateForView(infoForm.createdAt)}</p>
                </div>
                <div>
                    {(() => {
                        const formKids = allMembers.filter(m => m.applicationFormId === infoForm.id);
                        return (
                            <>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#475569' }}>{t('applications.kidsMembers')} ({formKids.length})</h3>
                                {formKids.length > 0 ? (
                                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                                        {formKids.map((kid) => (
                                            <li key={kid.id} style={{ padding: '0.5rem', backgroundColor: '#f8fafc', borderRadius: '4px', marginBottom: '0.5rem', border: '1px solid #e2e8f0' }}>
                                                <strong>{kid.firstName} {kid.lastName}</strong><br/>
                                                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{t('common.age')}: {kid.age} · </span>
                                                <span className={kid.status ? 'badge badge-success' : 'badge badge-danger'} style={{ fontSize: '0.7rem' }}>
                                                    {kid.status ? t('common.active') : t('common.inactive')}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p style={{ color: '#64748b' }}>{t('applications.noKids')}</p>
                                )}
                            </>
                        );
                    })()}
                </div>
            </div>
            <div className="flex-end">
                <button type="button" className="btn btn-outline" onClick={() => setIsInfoModalOpen(false)}>{t('common.close')}</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Create Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content fade-in text-left">
            <div className="flex-between" style={{ marginBottom: '1rem' }}>
                <h2>{currentForm?.id ? t('applications.editForm') : t('applications.createForm')}</h2>
                <button onClick={closeModal} className="btn-outline" style={{ border:'none', background:'transparent', cursor:'pointer' }}><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">{t('applications.parentFirstName')}</label>
                    <input required type="text" name="parentFirstName" className="form-input" value={currentForm.parentFirstName} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('applications.parentLastName')}</label>
                    <input required type="text" name="parentLastName" className="form-input" value={currentForm.parentLastName} onChange={handleChange} />
                  </div>
              </div>
              <div className="grid-2">
                 <div className="form-group">
                    <label className="form-label">{t('auth.email')}</label>
                    <input required type="email" name="email" className="form-input" value={currentForm.email} onChange={handleChange} />
                 </div>
                 <div className="form-group">
                    <label className="form-label">{t('apply.phone')}</label>
                    <input required type="text" name="phoneNumber" className="form-input" value={currentForm.phoneNumber} onChange={handleChange} />
                 </div>
              </div>
              <div className="form-group">
                  <label className="form-label">{t('applications.locationRequest')}</label>
                  <input required type="text" name="location" className="form-input" value={currentForm.location} onChange={handleChange} />
              </div>
              <div className="flex-end" style={{ marginTop: '2rem' }}>
                 <button type="button" className="btn btn-outline" onClick={closeModal}>{t('common.cancel')}</button>
                 <button type="submit" className="btn btn-primary">{currentForm?.id ? t('common.save') : t('applications.createSubmit')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isApproveModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content fade-in text-left" style={{maxWidth: '400px'}}>
            <div className="flex-between" style={{ marginBottom: '1rem' }}>
                <h2>{t('applications.approveTitle')}</h2>
                <button onClick={closeApproveModal} className="btn-outline" style={{ border:'none', background:'transparent', cursor:'pointer' }}><X size={20}/></button>
            </div>
            <p style={{marginBottom: '1rem'}}>{t('applications.approveDesc')}</p>
            <form onSubmit={handleApprove}>
               <div className="form-group">
                  <label className="form-label">{t('applications.paymentStartDate')}</label>
                  <input 
                    required 
                    type="date" 
                    className="form-input" 
                    value={paymentStartDate} 
                    onChange={(e) => setPaymentStartDate(e.target.value)} 
                  />
              </div>
              <div className="flex-end" style={{ marginTop: '1.5rem' }}>
                 <button type="button" className="btn btn-outline" onClick={closeApproveModal}>{t('common.cancel')}</button>
                 <button type="submit" className="btn btn-success">{t('applications.confirmApproval')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;
