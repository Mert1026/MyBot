import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { formatDateForView } from '../utils/dateUtils';
import { Plus, Edit, Trash2, X, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Groups = () => {
  const { t } = useTranslation();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMembersGroup, setViewMembersGroup] = useState(null);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [allMembers, setAllMembers] = useState([]);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const res = await api.get('/Groups/all');
      if (res.data.success) {
        setGroups(res.data.data || []);
      }
    } catch (error) {
      toast.error('Failed to fetch groups');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await api.get('/Users/by-role/teacher');
      if (res.data.success) {
        setTeachers(res.data.data || []);
      }
    } catch (error) {
       toast.error('Failed to load teachers for dropdown');
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await api.get('/Members/all');
      if (res.data.success) {
        setAllMembers(res.data.data || []);
      }
    } catch (error) {
       toast.error('Failed to load members for group view');
    }
  };

  useEffect(() => {
    fetchGroups();
    fetchTeachers();
    fetchMembers();
  }, []);

  const openModal = (group = null) => {
    setCurrentGroup(group ? { ...group } : {
        name: '', description: '', startAsHour: '', endAsHour: '', 
        userId: '', imageLink: '', maxMembers: 0, minAge: 0, maxAge: 0, location: ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCurrentGroup(null);
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentGroup(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentGroup.id) {
        const res = await api.post(`/Groups/update?name=${currentGroup.name}`, currentGroup);
        if (res.data.success) toast.success('Group updated successfully');
      } else {
        const res = await api.post('/Groups/create', currentGroup);
        if (res.data.success) toast.success('Group created successfully');
      }
      closeModal();
      fetchGroups();
    } catch (error) {
       toast.error(error.response?.data?.message || 'Action failed');
    }
  };

  const handleDelete = async (name) => {
    if(!window.confirm(`Are you sure you want to delete group ${name}?`)) return;
    try {
      const res = await api.delete(`/Groups/softDelete?name=${name}`);
      if (res.data.success) {
          toast.success('Group deleted');
          fetchGroups();
      }
    } catch (error) {
      toast.error('Failed to delete group');
    }
  };

  return (
    <div className="fade-in">
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <h1>{t('groups.title')}</h1>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <Plus size={16} /> {t('groups.addGroup')}
        </button>
      </div>

      <div className="card">
        {loading ? (
          <p>Loading groups...</p>
        ) : groups.length === 0 ? (
          <p>No groups found.</p>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>{t('groups.name') || 'Name'}</th>
                  <th>{t('groups.description') || 'Description'}</th>
                  <th>{t('groups.hours') ? t('groups.hours', { start: 'Start', end: 'End' }) : 'Hours'}</th>
                  <th>Age Range</th>
                  <th>Members</th>
                  <th>{t('groups.location') || 'Location'}</th>
                  <th>Created</th>
                  <th>{t('groups.actions') || 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {groups.map((group) => (
                  <tr key={group.id}>
                    <td><strong>{group.name}</strong></td>
                    <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}} title={group.description}>
                      {group.description || 'N/A'}
                    </td>
                    <td>{group.startAsHour} - {group.endAsHour}</td>
                    <td>{group.minAge} to {group.maxAge} yrs</td>
                    <td>
                        {(() => {
                           const mappedCount = allMembers.filter(m => m.groupId === group.id).length;
                           return `${mappedCount} / ${group.maxMembers}`;
                        })()}
                    </td>
                    <td>{group.location}</td>
                    <td>{formatDateForView(group.createdAt)}</td>
                    <td>
                      <div className="flex-end">
                        <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem' }} onClick={() => setViewMembersGroup(group)}>
                          <Users size={14} /> {t('groups.viewMembers') || 'View Members'}
                        </button>
                        <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem' }} onClick={() => openModal(group)}>
                          <Edit size={14} /> {t('groups.edit') || 'Edit'}
                        </button>
                        <button className="btn btn-danger" style={{ padding: '0.25rem 0.5rem' }} onClick={() => handleDelete(group.name)}>
                          <Trash2 size={14} /> {t('groups.delete') || 'Delete'}
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
                <h2>{currentGroup?.id ? 'Edit Group' : 'Create Group'}</h2>
                <button onClick={closeModal} className="btn-outline" style={{ border:'none', background:'transparent', cursor:'pointer' }}><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Name (Must be unique)</label>
                <input required type="text" name="name" className="form-input" value={currentGroup.name} onChange={handleChange} disabled={!!currentGroup.id} />
              </div>
              <div className="form-group">
                <label className="form-label">Teacher User ID</label>
                <select required name="userId" className="form-select" value={currentGroup.userId} onChange={handleChange}>
                  <option value="" disabled>Select a Teacher...</option>
                  {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.firstName} {teacher.lastName} ({teacher.email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid-2">
                 <div className="form-group">
                    <label className="form-label">Location</label>
                    <input type="text" name="location" className="form-input" value={currentGroup.location} onChange={handleChange} />
                 </div>
                 <div className="form-group">
                    <label className="form-label">Max Members</label>
                    <input type="number" name="maxMembers" className="form-input" value={currentGroup.maxMembers} onChange={handleChange} />
                 </div>
              </div>
              <div className="grid-2">
                 <div className="form-group">
                    <label className="form-label">Min Age</label>
                    <input type="number" name="minAge" className="form-input" value={currentGroup.minAge} onChange={handleChange} />
                 </div>
                 <div className="form-group">
                    <label className="form-label">Max Age</label>
                    <input type="number" name="maxAge" className="form-input" value={currentGroup.maxAge} onChange={handleChange} />
                 </div>
              </div>
              <div className="grid-2">
                 <div className="form-group">
                    <label className="form-label">Start Time (e.g. 08:00)</label>
                    <input type="text" name="startAsHour" className="form-input" value={currentGroup.startAsHour} onChange={handleChange} />
                 </div>
                 <div className="form-group">
                    <label className="form-label">End Time (e.g. 14:00)</label>
                    <input type="text" name="endAsHour" className="form-input" value={currentGroup.endAsHour} onChange={handleChange} />
                 </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea name="description" className="form-textarea" value={currentGroup.description} onChange={handleChange} rows="3"></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Image Link (Optional)</label>
                <input type="text" name="imageLink" className="form-input" value={currentGroup.imageLink} onChange={handleChange} />
              </div>
              <div className="flex-end" style={{ marginTop: '2rem' }}>
                 <button type="button" className="btn btn-outline" onClick={closeModal}>Cancel</button>
                 <button type="submit" className="btn btn-primary">{currentGroup?.id ? 'Save Changes' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewMembersGroup && (
        <div className="modal-overlay">
          <div className="modal-content fade-in text-left" style={{ maxWidth: '800px' }}>
            <div className="flex-between" style={{ marginBottom: '1rem' }}>
                <h2>Members in {viewMembersGroup.name}</h2>
                <button onClick={() => setViewMembersGroup(null)} className="btn-outline" style={{ border:'none', background:'transparent', cursor:'pointer' }}><X size={20}/></button>
            </div>
            {(() => {
                const groupMembers = allMembers.filter(m => m.groupId === viewMembersGroup.id) || []; 
                  
                if (groupMembers.length === 0) return <p>No members currently assigned to this group.</p>;
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
                        {groupMembers.map(member => (
                          <tr key={member.id}>
                            <td><strong>{member.firstName} {member.lastName}</strong></td>
                            <td>{member.age} yrs</td>
                            <td>
                              <span className={member.status ? 'badge badge-success' : 'badge badge-danger'}>
                                {member.status ? (t('members.active') || 'Active') : (t('members.inactive') || 'Inactive')}
                              </span>
                            </td>
                            <td>{formatDateForView(member.bornDate)}</td>
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

export default Groups;
