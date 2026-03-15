import axios from 'axios';

// Base API URL - uses environment variable in production, defaults to localhost for dev
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8085/api';

/**
 * Axios instance configured with base URL and JSON content type.
 * Includes request interceptor to automatically attach JWT token
 * from localStorage to every outgoing request.
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach JWT token to Authorization header if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 errors by redirecting to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
