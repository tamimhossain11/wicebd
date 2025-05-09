const express = require('express');
const { initiatePayment, confirmPayment } = require('../controllers/paymentController');
const router = express.Router();

// Add base route logging
router.use((req, res, next) => {
  console.log(`🔍 Received request to /api/payment${req.path}`);
  next();
});

router.post('/initiate', (req, res, next) => {
  console.log('✅ /api/payment/initiate route hit');
  next(); // Move to controller
}, initiatePayment);

router.post('/confirm', (req, res, next) => {
  console.log('✅ /api/payment/confirm route hit');
  next();
}, confirmPayment);

module.exports = router;
