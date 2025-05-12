import api from './index';

export const authApi = {
  // Admin authentication
  adminLogin: (credentials) => api.post('/admin/login', credentials),

  // Participant registration
  register: (data) => api.post('/registration/start', data),

  // Token verification
  verifyToken: (token) => api.get('/verify-token', {
    headers: { Authorization: `Bearer ${token}` }
  }),
  
  // Password reset
  requestPasswordReset: (email) => api.post('/auth/reset-password', { email }),
  resetPassword: (token, newPassword) => api.post(`/auth/reset-password/${token}`, { newPassword })
};