const express = require('express');
const router = express.Router();
const authenticateAdmin = require('../middleware/auth');
const { getAnalytics } = require('../controllers/analyticsController');

router.get('/', authenticateAdmin, getAnalytics);

module.exports = router;
