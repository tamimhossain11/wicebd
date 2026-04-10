const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/userAuth');
const { getMyPass, verifyPass } = require('../controllers/eventPassController');

// User: get or create their event pass
router.get('/my-pass', authenticateUser, getMyPass);

// Public: verify a pass by ID (for QR scan)
router.get('/verify/:passId', verifyPass);

module.exports = router;
