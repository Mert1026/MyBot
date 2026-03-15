import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { NavLink } from 'react-router-dom';
import { Users, User, ClipboardList } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();

  return (
    <div className="fade-in">
      <h1>{t('nav.dashboard') || 'Dashboard'}</h1>
      <div className="card">
        <h2>{t('dashboard.welcome', { name: user?.displayName }) || `Welcome, ${user?.displayName}`}</h2>
        <p>{t('dashboard.successLogin') || 'You have successfully logged into the MyBot Administration Portal.'}</p>
        <p>{t('dashboard.role', { role: user?.role }) || `Your current role is: ${user?.role}`}</p>
      </div>

      <div className="grid-3" style={{ marginTop: '2rem' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
           <Users size={48} color="var(--color-primary)" />
           <h3>{t('dashboard.manageGroups') || 'Manage Groups'}</h3>
           <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>{t('dashboard.manageGroupsDesc') || 'View, create, and assign students to their respective classrooms and groups.'}</p>
           <NavLink to="/groups" className="btn btn-primary" style={{ marginTop: 'auto' }}>{t('dashboard.goGroups') || 'Go to Groups'}</NavLink>
        </div>
        
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
           <User size={48} color="var(--color-secondary)" />
           <h3>{t('dashboard.manageMembers') || 'Manage Members'}</h3>
           <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>{t('dashboard.manageMembersDesc') || 'Track student records, birth dates, and parent contacts.'}</p>
           <NavLink to="/members" className="btn btn-secondary" style={{ marginTop: 'auto' }}>{t('dashboard.goMembers') || 'Go to Members'}</NavLink>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
           <ClipboardList size={48} color="#166534" />
           <h3>{t('dashboard.forms') || 'Application Forms'}</h3>
           <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>{t('dashboard.formsDesc') || 'Review pending applications from parents registering new members.'}</p>
           <NavLink to="/applications" className="btn btn-outline" style={{ marginTop: 'auto' }}>{t('dashboard.goForms') || 'Go to Applications'}</NavLink>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
