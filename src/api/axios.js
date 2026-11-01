import axios from 'axios';

// In development, route through Vite proxy (/api) to bridge localhost:5173 to Render and avoid CORS origin rejection.
// In production (Render frontend), use the configured VITE_API_URL or default to Render backend.
const API_BASE_URL = import.meta.env.DEV
  ? '/api'
  : (import.meta.env.VITE_API_URL || 'https://medguard-d48g.onrender.com/api');

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach Bearer JWT token if user is authenticated
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('medguard_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept 401s and handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't auto-clear if checking /me on initial load
      if (!error.config.url.includes('/auth/me')) {
        console.warn('Session expired or unauthorized. Please re-authenticate.');
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
