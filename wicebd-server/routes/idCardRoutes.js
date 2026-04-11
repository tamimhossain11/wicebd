const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/userAuth');
const { getMyCards, generateCard, verifyCard } = require('../controllers/idCardController');

// User: list all registrations + card status
router.get('/my-cards', authenticateUser, getMyCards);

// User: generate a card for a specific registration
router.post('/generate', authenticateUser, generateCard);

// Public: verify a card by UID (QR scan)
router.get('/verify/:cardUid', verifyCard);

module.exports = router;
