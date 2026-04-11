const express = require('express');
const router = express.Router();
const authenticateUser  = require('../middleware/userAuth');
const authenticateAdmin = require('../middleware/auth');
const requireRole       = require('../middleware/requireRole');
const { getMyCards, generateCard, verifyCard, deleteCard } = require('../controllers/idCardController');

// User: list all registrations + card status
router.get('/my-cards', authenticateUser, getMyCards);

// User: generate a card for a specific registration (one-time only — existing card is returned as-is)
router.post('/generate', authenticateUser, generateCard);

// Admin-only: delete a card (super_admin use only — not exposed to users)
router.delete('/delete', authenticateAdmin, requireRole('super_admin'), deleteCard);

// QR scan: restricted to super_admin — all others receive 403
router.get('/verify/:cardUid', authenticateAdmin, requireRole('super_admin'), verifyCard);

module.exports = router;
