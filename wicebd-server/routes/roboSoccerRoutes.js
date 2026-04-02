const express = require('express');
const router = express.Router();
const authenticateAdmin = require('../middleware/auth');
const authenticateUser = require('../middleware/userAuth');
const { registerRoboSoccer, getAllRoboSoccer, exportRoboSoccerCSV } = require('../controllers/roboSoccerController');

router.post('/register', authenticateUser, registerRoboSoccer);
router.get('/all', authenticateAdmin, getAllRoboSoccer);
router.get('/export', authenticateAdmin, exportRoboSoccerCSV);

module.exports = router;
