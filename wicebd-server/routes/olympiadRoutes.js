const express = require('express');
const router = express.Router();
const olympiadController = require('../controllers/olympiadController');
const optionalUserAuth = require('../middleware/optionalUserAuth');

// POST /api/olympiad/start — save to temp, returns paymentID for PayStation flow
router.post('/start', optionalUserAuth, olympiadController.startOlympiadRegistration);

// POST /api/olympiad/register (kept for legacy/admin use)
router.post('/register', optionalUserAuth, olympiadController.registerParticipant);


// Olympiad admin routes
router.get('/getolympiad',olympiadController.getOlympiadParticipants);
router.get('/olympiad/export',olympiadController.exportOlympiadToCSV);

module.exports = router;