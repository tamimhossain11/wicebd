import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000',
});

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  // Don't override if the caller already set Authorization explicitly
  if (!config.headers.Authorization) {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('userToken') || localStorage.getItem('judgeToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle token expiration — redirect to appropriate login page
      if (localStorage.getItem('adminToken')) {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
      } else if (localStorage.getItem('judgeToken')) {
        localStorage.removeItem('judgeToken');
        window.location.href = '/sign-in';
      } else if (localStorage.getItem('userToken')) {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        window.location.href = '/sign-in';
      }
    }
    return Promise.reject(error);
  }
);

export default api;