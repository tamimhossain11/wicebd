const express = require('express');
const router = express.Router();
const authenticateAdmin = require('../middleware/auth');
const authenticateUser = require('../middleware/userAuth');
const { registerMicromouse, initiateMicromousePayment, getAllMicromouse, exportMicromouseCSV } = require('../controllers/micromouseController');

router.post('/register', authenticateUser, registerMicromouse);
router.post('/initiate-payment', authenticateUser, initiateMicromousePayment);
router.get('/all', authenticateAdmin, getAllMicromouse);
router.get('/export', authenticateAdmin, exportMicromouseCSV);

module.exports = router;
