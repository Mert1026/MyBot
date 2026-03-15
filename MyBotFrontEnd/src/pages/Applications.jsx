import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { formatDateForView } from '../utils/dateUtils';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Applications = () => {
  const { t } = useTranslation();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentForm, setCurrentForm] = useState(null);

  const fetchForms = async () => {
    try {
      setLoading(true);
      const res = await api.get('/ApplicationForms/all');
      if (res.data.success) {
        setForms(res.data.data || []);
      }
    } catch (error) {
      toast.error('Failed to fetch application forms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
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
    if(!window.confirm(`Are you sure you want to delete this application form?`)) return;
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
          <p>Loading application forms...</p>
        ) : forms.length === 0 ? (
          <p>No application forms found.</p>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Form ID</th>
                  <th>{t('applications.parentName') || 'Parent Name'}</th>
                  <th>{t('applications.contact') || 'Contact Info'}</th>
                  <th>{t('applications.location') || 'Location'}</th>
                  <th>{t('applications.date') || 'Created At'}</th>
                  <th>{t('applications.actions') || 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {forms.map((form) => (
                  <tr key={form.id}>
                    <td><span style={{fontFamily:'monospace', fontSize:'0.75rem'}} title={form.id}>{form.id.substring(0,8)}...</span></td>
                    <td><strong>{form.parentFirstName} {form.parentLastName}</strong></td>
                    <td>
                        <div style={{fontSize:'0.875rem'}}>
                            <div>{form.email}</div>
                            <div style={{color:'var(--color-text-secondary)'}}>{form.phoneNumber}</div>
                        </div>
                    </td>
                    <td>{form.location}</td>
                    <td>{formatDateForView(form.createdAt)}</td>
                    <td>
                      <div className="flex-end">
                        <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem' }} onClick={() => openModal(form)}>
                          <Edit size={14} />
                        </button>
                        <button className="btn btn-danger" style={{ padding: '0.25rem 0.5rem' }} onClick={() => handleDelete(form.id)}>
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

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content fade-in text-left">
            <div className="flex-between" style={{ marginBottom: '1rem' }}>
                <h2>{currentForm?.id ? 'Edit Application Form' : 'Create Application Form'}</h2>
                <button onClick={closeModal} className="btn-outline" style={{ border:'none', background:'transparent', cursor:'pointer' }}><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Parent First Name</label>
                    <input required type="text" name="parentFirstName" className="form-input" value={currentForm.parentFirstName} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Parent Last Name</label>
                    <input required type="text" name="parentLastName" className="form-input" value={currentForm.parentLastName} onChange={handleChange} />
                  </div>
              </div>
              <div className="grid-2">
                 <div className="form-group">
                    <label className="form-label">Email</label>
                    <input required type="email" name="email" className="form-input" value={currentForm.email} onChange={handleChange} />
                 </div>
                 <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input required type="text" name="phoneNumber" className="form-input" value={currentForm.phoneNumber} onChange={handleChange} />
                 </div>
              </div>
              <div className="form-group">
                  <label className="form-label">Location Request</label>
                  <input required type="text" name="location" className="form-input" value={currentForm.location} onChange={handleChange} />
              </div>
              <div className="flex-end" style={{ marginTop: '2rem' }}>
                 <button type="button" className="btn btn-outline" onClick={closeModal}>Cancel</button>
                 <button type="submit" className="btn btn-primary">{currentForm?.id ? 'Save Changes' : 'Create Submit'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;
