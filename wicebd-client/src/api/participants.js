import api from './index';

export const participantsApi = {
  // Get all participants (admin only)
  getAll: () => api.get('/api/admin/participants'),

  // Get participant by ID
  getById: (id) => api.get(`/api/participants/${id}`),

  // Search participants
  search: (query) => api.get('/participants/search', { params: { q: query } }),

  // Export data
  exportToCSV: () => api.get('/admin/participants/export', {
    responseType: 'blob' // For file downloads
  })
};