const express = require('express');
const router = express.Router();
const { initiatePayment, executePayment } = require('../controllers/paymentController');

console.log('Inside paymentRoutes file');

router.post('/initiate', (req, res, next) => {
  console.log('POST /api/payment/initiate hit');
  next();
}, initiatePayment);

router.get('/execute', (req, res, next) => {
  console.log('GET /api/payment/execute hit');
  next();
}, executePayment);

module.exports = router;
