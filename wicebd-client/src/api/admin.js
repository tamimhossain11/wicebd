import api from './index';

export const adminApi = {
  // Admin user management
  createAdmin: (adminData) => api.post('/admin/users', adminData),
  getAdmins: () => api.get('/admin/users'),
  updateAdmin: (id, updates) => api.put(`/admin/users/${id}`, updates),
  deleteAdmin: (id) => api.delete(`/admin/users/${id}`),

  // System configuration
  updateSettings: (settings) => api.put('/admin/settings', settings),
  getSystemStats: () => api.get('/admin/stats')
};