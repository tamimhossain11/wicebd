import api from './index';

export const paymentsApi = {
  // Initiate payment
  initiate: (paymentData) => api.post('/payment/initiate', paymentData),

  // Confirm payment
  confirm: (paymentId) => api.post('/payment/confirm', { paymentID: paymentId }),

  // Get payment status
  getStatus: (paymentId) => api.get(`/payment/status/${paymentId}`),

  // Admin payment management
  refund: (paymentId) => api.post('/admin/payments/refund', { paymentId })
};