import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  headers: { 'Content-Type': 'application/json' },
});

// Auth interceptor – inject token from localStorage on each request
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('cph_user');
  if (stored) {
    const { token } = JSON.parse(stored);
    if (token) config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default api;
