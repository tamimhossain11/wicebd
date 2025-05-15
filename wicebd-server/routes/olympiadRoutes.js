const express = require('express');
const router = express.Router();
const olympiadController = require('../controllers/olympiadController');

// POST /api/olympiad/register
router.post('/register', olympiadController.registerParticipant);

module.exports = router;