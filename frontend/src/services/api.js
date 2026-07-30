// frontend/src/services/api.js
// Axios instance — handles all HTTP requests from frontend → backend

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor ──────────────────────────────────────────
// Attach JWT/Firebase token to every request automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bs_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor ─────────────────────────────────────────
// If token is expired (401) → clear it and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('bs_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
