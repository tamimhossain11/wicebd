const express = require('express');
const router = express.Router();
const olympiadController = require('../controllers/olympiadController');

// POST /api/olympiad/register
router.post('/register', olympiadController.registerParticipant);


// Olympiad admin routes
router.get('/getolympiad',olympiadController.getOlympiadParticipants);
router.get('/olympiad/export',olympiadController.exportOlympiadToCSV);

module.exports = router;