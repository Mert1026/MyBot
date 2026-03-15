import axios from 'axios';
import i18n from '../i18n';

const api = axios.create({
  baseURL: 'http://localhost:5206/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// We add a response interceptor to handle translations globally and 401s if a refresh token flow is needed later.
api.interceptors.response.use(
  (response) => {
    if (response.data && response.data.message) {
      response.data.message = i18n.t(response.data.message);
    }
    return response;
  },
  async (error) => {
    if (error.response?.data?.message) {
      error.response.data.message = i18n.t(error.response.data.message);
    }
    // If the error is 401, we might want to try refreshing the token.
    // For now, if no automated refresh is provided from the endpoints easily without more payload context, we just log out.
    if (error.response?.status === 401) {
        // Simple logout on 401:
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
