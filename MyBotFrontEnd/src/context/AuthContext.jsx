import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        try {
            setUser(JSON.parse(userStr));
        } catch (e) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
        const res = await api.post('/Users/signin', { email, password });
        if (res.data.success) {
            localStorage.setItem('accessToken', res.data.data.accessToken);
            localStorage.setItem('refreshToken', res.data.data.refreshToken);
            localStorage.setItem('user', JSON.stringify(res.data.data.user));
            
            setUser(res.data.data.user);
            return { success: true };
        }
        return { success: false, message: 'Failed to retrieve user profile after login.' };
    } catch (error) {
        return { 
            success: false, 
            message: error.response?.data?.message || 'Login failed' 
        };
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
