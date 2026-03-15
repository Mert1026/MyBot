import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { formatDateForView, formatDateForInput } from '../utils/dateUtils';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Parents = () => {
  const { t } = useTranslation();
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentParent, setCurrentParent] = useState(null);
  const [allMembers, setAllMembers] = useState([]);
  const [formsList, setFormsList] = useState([]);
  const [viewKidsParent, setViewKidsParent] = useState(null);

  const fetchParents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/Parents/all');
      if (res.data.success) {
        setParents(res.data.data || []);
      }
    } catch (error) {
      toast.error('Failed to fetch parents');
    } finally {
      setLoading(false);
    }
  };

  const fetchMembersAndForms = async () => {
    try {
      const [memRes, formRes] = await Promise.all([
          api.get('/Members/all'),
          api.get('/ApplicationForms/all')
      ]);
      if (memRes.data.success) {
        setAllMembers(memRes.data.data || []);
      }
      if (formRes.data.success) {
        setFormsList(formRes.data.data || []);
      }
    } catch (error) {
       toast.error('Failed to load related data for parent view');
    }
  };

  useEffect(() => {
    fetchParents();
    fetchMembersAndForms();
  }, []);

  const openModal = (parent = null) => {
    if (parent) {
       setCurrentParent({
           ...parent,
           payedUntil: formatDateForInput(parent.payedUntil),
           joinTime: formatDateForInput(parent.joinTime),
           parentId: parent.id,
           applicationFormId: parent.applicationFormId || ''
       });
    } else {
        setCurrentParent({
            firstName: '', lastName: '', email: '', phoneNumber: '', givenPrice: 0,
            payedUntil: '', joinTime: '', applicationFormId: ''
        });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCurrentParent(null);
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setCurrentParent(prev => ({ 
        ...prev, 
        [name]: type === 'number' ? Number(value) : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...currentParent };
      if (payload.payedUntil) payload.payedUntil = new Date(payload.payedUntil).toISOString();
      if (payload.joinTime) payload.joinTime = new Date(payload.joinTime).toISOString();

      if (currentParent.id || currentParent.parentId) {
        const res = await api.post('/Parents/update', payload);
        if (res.data.success) toast.success('Parent updated successfully');
      } else {
        const res = await api.post('/Parents/create', payload);
        if (res.data.success) toast.success('Parent created successfully');
      }
      closeModal();
      fetchParents();
    } catch (error) {
       toast.error(error.response?.data?.message || 'Action failed');
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm(`Are you sure you want to delete this parent?`)) return;
    try {
      const res = await api.delete(`/Parents/softDelete?id=${id}`);
      if (res.data.success) {
          toast.success('Parent deleted');
          fetchParents();
      }
    } catch (error) {
      toast.error('Failed to delete parent');
    }
  };

  return (
    <div className="fade-in">
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <h1>{t('parents.title') || 'Manage Parents'}</h1>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <Plus size={16} /> {t('parents.addParent') || 'Add New Parent'}
        </button>
      </div>

      <div className="card">
        {loading ? (
          <p>Loading parents...</p>
        ) : parents.length === 0 ? (
          <p>No parents found.</p>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>{t('parents.name') || 'Name'}</th>
                  <th>{t('parents.contact') || 'Contact Info'}</th>
                  <th>Given Price</th>
                  <th>{t('parents.paidUntil') || 'Payed Until'}</th>
                  <th>Join Time</th>
                  <th>Application Form</th>
                  <th>{t('parents.actions') || 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {parents.map((parent) => (
                  <tr key={parent.id}>
                    <td><strong>{parent.firstName} {parent.lastName}</strong></td>
                    <td>
                        <div style={{fontSize:'0.875rem'}}>
                            <div>{parent.email}</div>
                            <div style={{color:'var(--color-text-secondary)'}}>{parent.phoneNumber}</div>
                        </div>
                    </td>
                    <td>${parent.givenPrice?.toFixed(2)}</td>
                    <td>{formatDateForView(parent.payedUntil)}</td>
                    <td>{formatDateForView(parent.joinTime)}</td>
                    <td>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }} title={parent.applicationFormId}>
                            {parent.applicationFormId ? parent.applicationFormId.substring(0,8)+'...' : 'N/A'}
                        </div>
                    </td>
                    <td>
                      <div className="flex-end">
                        <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem' }} onClick={() => setViewKidsParent(parent)}>
                          <span style={{ fontSize: '14px', marginRight: '4px' }}>👨‍👩‍👧‍👦</span> {t('parents.viewKids') || 'View Kids'}
                        </button>
                        <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem' }} onClick={() => openModal(parent)}>
                          <Edit size={14} />
                        </button>
                        <button className="btn btn-danger" style={{ padding: '0.25rem 0.5rem' }} onClick={() => handleDelete(parent.id)}>
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
                <h2>{currentParent?.parentId ? 'Edit Parent' : 'Create Parent'}</h2>
                <button onClick={closeModal} className="btn-outline" style={{ border:'none', background:'transparent', cursor:'pointer' }}><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input required type="text" name="firstName" className="form-input" value={currentParent.firstName} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input required type="text" name="lastName" className="form-input" value={currentParent.lastName} onChange={handleChange} />
                  </div>
              </div>
              <div className="grid-2">
                 <div className="form-group">
                    <label className="form-label">Email</label>
                    <input required type="email" name="email" className="form-input" value={currentParent.email} onChange={handleChange} />
                 </div>
                 <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input required type="text" name="phoneNumber" className="form-input" value={currentParent.phoneNumber} onChange={handleChange} />
                 </div>
              </div>
              <div className="form-group">
                  <label className="form-label">Given Price</label>
                  <input required type="number" step="0.01" name="givenPrice" className="form-input" value={currentParent.givenPrice} onChange={handleChange} />
              </div>
              <div className="grid-2">
                 <div className="form-group">
                    <label className="form-label">Payed Until</label>
                    <input required type="datetime-local" name="payedUntil" className="form-input" value={currentParent.payedUntil} onChange={handleChange} />
                 </div>
                 <div className="form-group">
                    <label className="form-label">Join Time</label>
                    <input required type="datetime-local" name="joinTime" className="form-input" value={currentParent.joinTime} onChange={handleChange} />
                 </div>
              </div>
              <div className="form-group">
                  <label className="form-label">{t('parents.applicationForm') || 'Application Form'}</label>
                  <select name="applicationFormId" className="form-select" value={currentParent.applicationFormId} onChange={handleChange}>
                     <option value="">{t('parents.noForm') || 'None / Direct Registration'}</option>
                     {formsList.map(form => (
                       <option key={form.id} value={form.id}>
                          {form.parentFirstName} {form.parentLastName} - Form #{form.id.substring(0,6)}
                       </option>
                     ))}
                  </select>
              </div>
              <div className="flex-end" style={{ marginTop: '2rem' }}>
                 <button type="button" className="btn btn-outline" onClick={closeModal}>Cancel</button>
                 <button type="submit" className="btn btn-primary">{currentParent?.parentId ? 'Save Changes' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewKidsParent && (
        <div className="modal-overlay">
          <div className="modal-content fade-in text-left" style={{ maxWidth: '800px' }}>
            <div className="flex-between" style={{ marginBottom: '1rem' }}>
                <h2>Kids of {viewKidsParent.firstName} {viewKidsParent.lastName}</h2>
                <button onClick={() => setViewKidsParent(null)} className="btn-outline" style={{ border:'none', background:'transparent', cursor:'pointer' }}><X size={20}/></button>
            </div>
            {(() => {
                const parentKids = allMembers.filter(m => m.parentId === viewKidsParent.id) || []; 
                  
                if (parentKids.length === 0) return <p>No kids currently registered for this parent.</p>;
                return (
                  <div className="table-container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>{t('members.name') || 'Name'}</th>
                          <th>{t('members.age') || 'Age'}</th>
                          <th>{t('members.status') || 'Activity Status'}</th>
                          <th>Born Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parentKids.map(kid => (
                          <tr key={kid.id}>
                            <td><strong>{kid.firstName} {kid.lastName}</strong></td>
                            <td>{kid.age} yrs</td>
                            <td>
                              <span className={kid.status ? 'badge badge-success' : 'badge badge-danger'}>
                                {kid.status ? (t('members.active') || 'Active') : (t('members.inactive') || 'Inactive')}
                              </span>
                            </td>
                            <td>{formatDateForView(kid.bornDate)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Parents;
