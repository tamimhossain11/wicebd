import api from './index';

export const participantsApi = {
  // Get all project/magazine participants (admin only)
  getAll: () => api.get('/api/admin/participants'),

  // Get all olympiad participants (admin only)
  getOlympiadParticipants: () => api.get('/api/olympiad/getolympiad'),

  // Get participant by ID
  getById: (id) => api.get(`/api/participants/${id}`),

  // Search participants
  search: (query) => api.get('/participants/search', { params: { q: query } }),

  // Export project/magazine data
  exportToCSV: () => api.get('/api/admin/participants/export', {
    responseType: 'blob'
  }),

  // Export olympiad data
  exportOlympiadToCSV: () => api.get('/api/olympiad/olympiad/export', {
    responseType: 'blob'
  })
};