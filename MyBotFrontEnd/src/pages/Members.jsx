import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { formatDateForView, formatDateForInput } from '../utils/dateUtils';
import { Plus, Edit, Trash2, X, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Members = () => {
  const { t } = useTranslation();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  
  // Dropdown states
  const [groupsList, setGroupsList] = useState([]);
  const [parentsList, setParentsList] = useState([]);
  const [formsList, setFormsList] = useState([]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/Members/all');
      if (res.data.success) {
        setMembers(res.data.data || []);
      }
    } catch (error) {
      toast.error('Failed to fetch members');
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
       const [gRes, pRes, fRes] = await Promise.all([
          api.get('/Groups/all'),
          api.get('/Parents/all'),
          api.get('/ApplicationForms/all')
       ]);
       if (gRes.data.success) setGroupsList(gRes.data.data || []);
       if (pRes.data.success) setParentsList(pRes.data.data || []);
       if (fRes.data.success) setFormsList(fRes.data.data || []);
    } catch (error) {
       toast.error('Failed to load related dropdown data');
    }
  };

  useEffect(() => {
    fetchMembers();
    fetchDropdownData();
  }, []);

  const openModal = (member = null) => {
    if (member) {
       setCurrentMember({
           ...member,
           bornDate: formatDateForInput(member.bornDate),
           joinTime: formatDateForInput(member.joinTime),
           groupId: '', // Requires selection update separately or dropdown logic. Since backend doesn't return GroupId directly on Member easily, we leave empty string
           parentId: member.parentId || '',
           applicationFormId: member.applicationFormId || '',
           memberId: member.id,
       });
    } else {
        setCurrentMember({
            firstName: '', lastName: '', bornDate: '', joinTime: '', description: '',
            parentId: '', applicationFormId: '', groupId: ''
        });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCurrentMember(null);
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentMember(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Both require DateTimeOffset parseable strings. Using standard ISO.
      const payload = { ...currentMember };
      if (payload.bornDate) payload.bornDate = new Date(payload.bornDate).toISOString();
      if (payload.joinTime) payload.joinTime = new Date(payload.joinTime).toISOString();

      if (currentMember.id || currentMember.memberId) {
        const res = await api.post('/Members/update', payload);
        if (res.data.success) toast.success('Member updated successfully');
      } else {
        const res = await api.post('/Members/create', payload);
        if (res.data.success) toast.success('Member created successfully');
      }
      closeModal();
      fetchMembers();
    } catch (error) {
       toast.error(error.response?.data?.message || 'Action failed');
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm(`Are you sure you want to delete this member?`)) return;
    try {
      const res = await api.delete(`/Members/softDelete?id=${id}`);
      if (res.data.success) {
          toast.success('Member deleted');
          fetchMembers();
      }
    } catch (error) {
      toast.error('Failed to delete member');
    }
  };

  const toggleStatus = async (id, currentStatus) => {
     try {
         const res = await api.post(`/Members/statusChange?memberId=${id}&status=${!currentStatus}`);
         if (res.data.success) {
             toast.success('Status updated');
             fetchMembers();
         }
     } catch(error) {
         toast.error('Failed to update status');
     }
  };

  return (
    <div className="fade-in">
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <h1>{t('members.title') || 'Manage Members'}</h1>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <Plus size={16} /> {t('members.addMember') || 'Add New Member'}
        </button>
      </div>

      <div className="card">
        {loading ? (
          <p>Loading members...</p>
        ) : members.length === 0 ? (
          <p>No members found.</p>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>{t('members.name') || 'Name'}</th>
                  <th>{t('members.age') || 'Age'} / Status</th>
                  <th>Born Date</th>
                  <th>Join Time</th>
                  <th>Description</th>
                  <th>Parent / Form Links</th>
                  <th>{t('members.actions') || 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id}>
                    <td><strong>{member.firstName} {member.lastName}</strong></td>
                    <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {member.age} yrs
                            <span className={member.status ? 'badge badge-success' : 'badge badge-danger'}>
                              {member.status ? (t('members.active') || 'Active') : (t('members.inactive') || 'Inactive')}
                            </span>
                        </div>
                    </td>
                    <td>{formatDateForView(member.bornDate)}</td>
                    <td>{formatDateForView(member.joinTime)}</td>
                    <td style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace:'nowrap'}} title={member.description}>
                        {member.description}
                    </td>
                    <td>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                            <div>Parent: {member.parentId ? member.parentId.substring(0,8)+'...' : 'N/A'}</div>
                            <div>Form: {member.applicationFormId ? member.applicationFormId.substring(0,8)+'...' : 'N/A'}</div>
                        </div>
                    </td>
                    <td>
                      <div className="flex-end">
                        <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem' }} onClick={() => toggleStatus(member.id, member.status)} title="Toggle Status">
                          <RefreshCw size={14} />
                        </button>
                        <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem' }} onClick={() => openModal(member)}>
                          <Edit size={14} />
                        </button>
                        <button className="btn btn-danger" style={{ padding: '0.25rem 0.5rem' }} onClick={() => handleDelete(member.id)}>
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
                <h2>{currentMember?.memberId ? 'Edit Member' : 'Create Member'}</h2>
                <button onClick={closeModal} className="btn-outline" style={{ border:'none', background:'transparent', cursor:'pointer' }}><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input required type="text" name="firstName" className="form-input" value={currentMember.firstName} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input required type="text" name="lastName" className="form-input" value={currentMember.lastName} onChange={handleChange} />
                  </div>
              </div>
              <div className="grid-2">
                 <div className="form-group">
                    <label className="form-label">Born Date</label>
                    <input required type="datetime-local" name="bornDate" className="form-input" value={currentMember.bornDate} onChange={handleChange} />
                 </div>
                 <div className="form-group">
                    <label className="form-label">Join Time</label>
                    <input required type="datetime-local" name="joinTime" className="form-input" value={currentMember.joinTime} onChange={handleChange} />
                 </div>
              </div>
              <div className="form-group">
                  <label className="form-label">Parent</label>
                  <select required name="parentId" className="form-select" value={currentMember.parentId} onChange={handleChange}>
                     <option value="" disabled>Select a Parent...</option>
                     {parentsList.map(parent => (
                       <option key={parent.id} value={parent.id}>
                          {parent.firstName} {parent.lastName} ({parent.email}) - {parent.phoneNumber}
                       </option>
                     ))}
                  </select>
              </div>
              <div className="form-group">
                  <label className="form-label">Application Form</label>
                  <select required name="applicationFormId" className="form-select" value={currentMember.applicationFormId} onChange={handleChange}>
                     <option value="" disabled>Select a Form...</option>
                     {formsList.map(form => (
                       <option key={form.id} value={form.id}>
                          {form.firstName} {form.lastName} - Form #{form.id.substring(0,6)}
                       </option>
                     ))}
                  </select>
              </div>
              <div className="form-group">
                  <label className="form-label">Assigned Group</label>
                  <select required name="groupId" className="form-select" value={currentMember.groupId} onChange={handleChange}>
                     <option value="" disabled>Select a Group...</option>
                     {groupsList.map(group => (
                       <option key={group.id} value={group.id}>
                          {group.name} ({group.location})
                       </option>
                     ))}
                  </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Description / Notes</label>
                <textarea name="description" className="form-textarea" value={currentMember.description} onChange={handleChange} rows="3"></textarea>
              </div>
              <div className="flex-end" style={{ marginTop: '2rem' }}>
                 <button type="button" className="btn btn-outline" onClick={closeModal}>Cancel</button>
                 <button type="submit" className="btn btn-primary">{currentMember?.memberId ? 'Save Changes' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
