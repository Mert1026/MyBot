import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { formatDateForView } from '../utils/dateUtils';
import { Plus, Edit, Trash2, X, Users, Info } from 'lucide-react';
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

  // Info Modal State
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [infoGroup, setInfoGroup] = useState(null);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const res = await api.get('/Groups/all');
      if (res.data.success) {
        setGroups(res.data.data?.filter(g => !g.isDeleted) || []);
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
        setAllMembers(res.data.data?.filter(m => !m.isDeleted) || []);
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
        name: '', description: '', startAsHour: '10:00', endAsHour: '12:00', 
        userId: '', imageLink: '', maxMembers: 0, minAge: 0, maxAge: 0, location: '', dayOfWeek: 'Monday'
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCurrentGroup(null);
    setIsModalOpen(false);
  };

  const openInfoModal = (group) => {
    setInfoGroup(group);
    setIsInfoModalOpen(true);
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

  const getDayName = (dayStr) => {
    return dayStr || '-';
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
                  <th>Day</th>
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
                      {group.description || '-'}
                    </td>
                    <td>{getDayName(group.dayOfWeek)}</td>
                    <td>{group.startAsHour} - {group.endAsHour}</td>
                    <td>{group.minAge} to {group.maxAge} yrs</td>
                    <td>
                        {(() => {
                           const mappedCount = allMembers.filter(m => m.groupId === group.id).length;
                           return `${mappedCount}/${group.maxMembers}`;
                        })()}
                    </td>
                    <td>{group.location}</td>
                    <td>{formatDateForView(group.createdAt)}</td>
                    <td>
                      <div className="flex-end">
                        <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem' }} onClick={() => setViewMembersGroup(group)} title="View Members">
                          <Users size={14} /> {t('groups.viewMembers') || 'Members'}
                        </button>
                        <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem' }} onClick={() => openInfoModal(group)} title="Info">
                          <Info size={14} />
                        </button>
                        <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem' }} onClick={() => openModal(group)} title="Edit">
                          <Edit size={14} /> 
                        </button>
                        <button className="btn btn-danger" style={{ padding: '0.25rem 0.5rem' }} onClick={() => handleDelete(group.name)} title="Delete">
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
      {isInfoModalOpen && infoGroup && (
        <div className="modal-overlay">
          <div className="modal-content fade-in text-left" style={{maxWidth: '600px'}}>
            <div className="flex-between" style={{ marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Info size={24} color="var(--primary-color)" /> Group Information
                </h2>
                <button onClick={() => setIsInfoModalOpen(false)} className="btn-outline" style={{ border:'none', background:'transparent', cursor:'pointer' }}><X size={20}/></button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#475569' }}>Overview</h3>
                    <p><strong>Name:</strong> {infoGroup.name}</p>
                    <p><strong>Location:</strong> {infoGroup.location}</p>
                    <p><strong>Description:</strong> {infoGroup.description || 'No description provided.'}</p>
                    <p><strong>Teacher ID:</strong> <span style={{fontSize: '0.8rem', fontFamily: 'monospace'}}>{infoGroup.userId}</span></p>
                    <p><strong>Created:</strong> {formatDateForView(infoGroup.createdAt)}</p>
                </div>
                <div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#475569' }}>Schedule & Requirements</h3>
                    <p><strong>Day:</strong> {getDayName(infoGroup.dayOfWeek)}</p>
                    <p><strong>Time:</strong> {infoGroup.startAsHour} - {infoGroup.endAsHour}</p>
                    <p><strong>Age Range:</strong> {infoGroup.minAge} to {infoGroup.maxAge} years</p>
                    <p><strong>Capacity:</strong> {allMembers.filter(m => m.groupId === infoGroup.id).length} / {infoGroup.maxMembers} members</p>
                </div>
            </div>
            <div className="flex-end">
                <button type="button" className="btn btn-outline" onClick={() => setIsInfoModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

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
                    <select name="location" className="form-select" value={currentGroup.location} onChange={handleChange}>
                       <option value="">Select a Location...</option>
                       <option value="Габрово">Габрово</option>
                       <option value="Велико Търново">Велико Търново</option>
                       <option value="Варна">Варна</option>
                    </select>
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
              <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                 <div className="form-group">
                     <label className="form-label">Day of Week</label>
                    <select name="dayOfWeek" className="form-select" value={currentGroup.dayOfWeek} onChange={handleChange}>
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                        <option value="Sunday">Sunday</option>
                    </select>
                 </div>
                 <div className="form-group">
                    <label className="form-label">Start Time</label>
                    <input type="time" name="startAsHour" className="form-input" value={currentGroup.startAsHour} onChange={handleChange} />
                 </div>
                 <div className="form-group">
                    <label className="form-label">End Time</label>
                    <input type="time" name="endAsHour" className="form-input" value={currentGroup.endAsHour} onChange={handleChange} />
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
