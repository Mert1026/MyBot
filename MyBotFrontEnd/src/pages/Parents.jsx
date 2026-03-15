import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { formatDateForView, formatDateForInput } from '../utils/dateUtils';
import { Plus, Edit, Trash2, X, DollarSign } from 'lucide-react';
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

  // Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentParent, setPaymentParent] = useState(null);
  const [paymentType, setPaymentType] = useState('full'); // 'full' or 'partial'
  const [paymentQuantity, setPaymentQuantity] = useState(1); // months or lessons
  const [calculatedTotal, setCalculatedTotal] = useState(0);

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
            firstName: '', lastName: '', email: '', phoneNumber: '', givenPrice: 0, totalPaid: 0,
            payedUntil: '', joinTime: '', applicationFormId: ''
        });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCurrentParent(null);
    setIsModalOpen(false);
  };

  // --- Payment Logic ---
  const openPaymentModal = (parent) => {
      setPaymentParent(parent);
      setPaymentType('full');
      setPaymentQuantity(1);
      setIsPaymentModalOpen(true);
  };

  const closePaymentModal = () => {
      setPaymentParent(null);
      setIsPaymentModalOpen(false);
  };

  // Calculate payment whenever inputs change
  useEffect(() => {
      if (!paymentParent || !allMembers) return;
      
      const activeKids = allMembers.filter(m => m.parentId === paymentParent.id && m.status === true).length;
      const kidsCount = activeKids > 0 ? activeKids : 1; // Default to 1 if no kids found for safety

      let total = 0;
      if (paymentType === 'full') {
          // Rule: 160 BGN for 1st child, sibling discount 20 BGN (so 140 BGN for siblings)
          const firstChildPrice = 160;
          const siblingPrice = 140;
          const pricePerMonth = firstChildPrice + (kidsCount - 1) * siblingPrice;
          total = pricePerMonth * paymentQuantity;
      } else {
          // Rule: 45 BGN per lesson (no sibling discount mentioned for single visits in prompt, using flat rate)
          const pricePerLesson = 45;
          total = pricePerLesson * kidsCount * paymentQuantity;
      }
      setCalculatedTotal(total);
  }, [paymentParent, paymentType, paymentQuantity, allMembers]);

  const handleRecordPayment = async (e) => {
      e.preventDefault();
      try {
          // Calculate new PayedUntil date
          let newDate = new Date(paymentParent.payedUntil);
          if (isNaN(newDate.getTime())) newDate = new Date(); // fallback if invalid

          if (paymentType === 'full') {
              newDate.setMonth(newDate.getMonth() + Number(paymentQuantity));
          } else {
              // For partial, we don't advance the month by a full calendar month.
              // We'll just add days proportionally or leave it to admin to manually adjust later if needed.
              // Assuming 'partial' usually means covering the current ongoing month.
              // Let's just advance it by the number of weeks (lessons) for simplicity, or 7 days per lesson
              newDate.setDate(newDate.getDate() + (Number(paymentQuantity) * 7)); 
          }

          const payload = {
              parentId: paymentParent.id,
              amountPaid: calculatedTotal,
              monthsAdded: paymentType === 'full' ? Number(paymentQuantity) : 0,
              newPayedUntil: newDate.toISOString()
          };

          const res = await api.post('/Parents/recordPayment', payload);
          if (res.data.success) {
              toast.success('Payment recorded successfully');
              closePaymentModal();
              fetchParents();
          }
      } catch (err) {
          toast.error(err.response?.data?.message || 'Failed to record payment');
      }
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

  const isOverdue = (payedUntilDate) => {
      if (!payedUntilDate) return false;
      return new Date(payedUntilDate) < new Date();
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
                  <th>Total Paid (BGN)</th>
                  <th>{t('parents.paidUntil') || 'Payed Until'}</th>
                  <th>Join Time</th>
                  <th>Application Form</th>
                  <th>{t('parents.actions') || 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {parents.map((parent) => (
                  <tr key={parent.id} className={isOverdue(parent.payedUntil) ? 'row-overdue' : ''} style={isOverdue(parent.payedUntil) ? { backgroundColor: '#fee2e2' } : {}}>
                    <td><strong>{parent.firstName} {parent.lastName}</strong></td>
                    <td>
                        <div style={{fontSize:'0.875rem'}}>
                            <div>{parent.email}</div>
                            <div style={{color:'var(--color-text-secondary)'}}>{parent.phoneNumber}</div>
                        </div>
                    </td>
                    <td>{parent.totalPaid?.toFixed(2) || '0.00'} лв.</td>
                    <td>
                      <span style={{ color: isOverdue(parent.payedUntil) ? '#dc2626' : 'inherit', fontWeight: isOverdue(parent.payedUntil) ? 'bold' : 'normal' }}>
                         {formatDateForView(parent.payedUntil)}
                      </span>
                    </td>
                    <td>{formatDateForView(parent.joinTime)}</td>
                    <td>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }} title={parent.applicationFormId}>
                            {parent.applicationFormId ? parent.applicationFormId.substring(0,8)+'...' : 'N/A'}
                        </div>
                    </td>
                    <td>
                      <div className="flex-end">
                        <button className="btn btn-success" style={{ padding: '0.25rem 0.5rem', marginRight: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }} onClick={() => openPaymentModal(parent)}>
                          <DollarSign size={14} /> Pay
                        </button>
                        <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem' }} onClick={() => setViewKidsParent(parent)}>
                          <span style={{ fontSize: '14px', marginRight: '4px' }}>👨‍👩‍👧‍👦</span> {t('parents.viewKids') || 'Kids'}
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

      {/* Existing Edit/Create Modal */}
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
                  <label className="form-label">Given Price (Legacy)</label>
                  <input type="number" step="0.01" name="givenPrice" className="form-input" value={currentParent.givenPrice} onChange={handleChange} />
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

      {/* Payment Modal */}
      {isPaymentModalOpen && paymentParent && (
        <div className="modal-overlay">
          <div className="modal-content fade-in text-left" style={{maxWidth: '450px'}}>
            <div className="flex-between" style={{ marginBottom: '1rem' }}>
                <h2>Record Payment</h2>
                <button onClick={closePaymentModal} className="btn-outline" style={{ border:'none', background:'transparent', cursor:'pointer' }}><X size={20}/></button>
            </div>
            <form onSubmit={handleRecordPayment}>
               <div className="form-group">
                   <label className="form-label">Payment Package</label>
                   <select 
                       className="form-select" 
                       value={paymentType} 
                       onChange={(e) => setPaymentType(e.target.value)}
                   >
                       <option value="full">Monthly Fee (160 лв + sibling discount)</option>
                       <option value="partial">Single/Partial Lessons (45 лв / lesson)</option>
                   </select>
               </div>
               
               <div className="form-group">
                   <label className="form-label">{paymentType === 'full' ? 'Number of Months' : 'Number of Lessons (per child)'}</label>
                   <input 
                       type="number" 
                       min="1" 
                       className="form-input" 
                       value={paymentQuantity} 
                       onChange={(e) => setPaymentQuantity(e.target.value)} 
                   />
               </div>

               <div style={{ padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '0.5rem', margin: '1rem 0' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                       <span>Kids Enrolled:</span>
                       <strong>{allMembers.filter(m => m.parentId === paymentParent.id && m.status === true).length} active</strong>
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 'bold' }}>
                       <span>Estimated Total:</span>
                       <span>{calculatedTotal} лв.</span>
                   </div>
               </div>

               <div className="flex-end" style={{ marginTop: '1.5rem' }}>
                 <button type="button" className="btn btn-outline" onClick={closePaymentModal}>Cancel</button>
                 <button type="submit" className="btn btn-success">Confirm Payment</button>
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
