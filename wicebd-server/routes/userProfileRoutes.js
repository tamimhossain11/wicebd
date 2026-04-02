const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/userAuth');
const { saveProfile, getProfile, getMyRegistrations, generateIdCard } = require('../controllers/userProfileController');

router.get('/', authenticateUser, getProfile);
router.post('/', authenticateUser, saveProfile);
router.get('/my-registrations', authenticateUser, getMyRegistrations);
router.post('/generate-id-card', authenticateUser, generateIdCard);

module.exports = router;
