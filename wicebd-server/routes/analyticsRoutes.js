const express = require('express');
const router = express.Router();
const authenticateAdmin = require('../middleware/auth');
const { getAnalytics, getParticipantStats } = require('../controllers/analyticsController');

router.get('/', authenticateAdmin, getAnalytics);
router.get('/participants', authenticateAdmin, getParticipantStats);

module.exports = router;
