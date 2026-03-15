import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './Login.css';

const Login = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error(t('auth.fillFields') || 'Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      toast.success(t('auth.loginSuccess') || 'Login successful');
      navigate('/');
    } else {
      toast.error(result.message || t('auth.loginFailed') || 'Failed to login');
    }
  };

  if (loading) return null;

  return (
    <div className="login-container">
      <div className="login-card fade-in">
        <div className="login-header">
          <BookOpen size={48} className="login-icon" />
          <h1 className="login-title">{t('auth.signInTitle')}</h1>
          <p className="login-subtitle">{t('auth.signInSubtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label" htmlFor="email">{t('auth.email')}</label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="admin@school.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">{t('auth.password')}</label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary login-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? t('auth.signingIn') : t('auth.signInBtn')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
