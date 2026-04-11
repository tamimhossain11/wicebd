const express = require('express');
const { startRegistration } = require('../controllers/registerController');
const optionalUserAuth = require('../middleware/optionalUserAuth');
const router = express.Router();

// Add console log inside the route handler
router.post('/start', optionalUserAuth, (req, res, next) => {
  console.log('✅ /api/registration/start route hit');
  next();
}, startRegistration);

module.exports = router;
