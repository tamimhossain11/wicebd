const express = require('express');
const { startRegistration } = require('../controllers/registerController');
const router = express.Router();

// Add console log inside the route handler
router.post('/start', (req, res, next) => {
  console.log('✅ /api/registration/start route hit');  // Log when the route is hit
  next(); // Pass control to startRegistration controller
}, startRegistration);

module.exports = router;
