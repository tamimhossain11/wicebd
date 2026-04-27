const express = require('express');
const router  = express.Router();
const authenticateUser  = require('../middleware/userAuth');
const authenticateAdmin = require('../middleware/auth');
const requireRole       = require('../middleware/requireRole');
const {
  getMyCards, generateCard, verifyCard, deleteCard,
  getMemberProfile, saveMemberProfile, adminGenerateOlympiadCard, adminGenerateGuestCard, adminListGuestCards,
} = require('../controllers/idCardController');

// User: list all registrations + card status (includes team members)
router.get('/my-cards', authenticateUser, getMyCards);

// User: generate a card for a specific registration or team member slot
router.post('/generate', authenticateUser, generateCard);

// User: get / save family info for a specific team member slot
router.get('/member-profile/:paymentId/:slot', authenticateUser, getMemberProfile);
router.post('/member-profile', authenticateUser, saveMemberProfile);

// Admin: list all generated guest ID cards
router.get('/admin/guests', authenticateAdmin, requireRole('super_admin'), adminListGuestCards);

// Admin: generate guest ID card (CA, volunteer, district leader, general guest)
router.post('/admin/generate-guest', authenticateAdmin, requireRole('super_admin'), adminGenerateGuestCard);

// Admin: generate olympiad ID card on behalf of participant
router.post('/admin/generate-olympiad', authenticateAdmin, requireRole('super_admin'), adminGenerateOlympiadCard);

// Admin-only: delete a card
router.delete('/delete', authenticateAdmin, requireRole('super_admin'), deleteCard);

// Admin-only QR scan
router.get('/verify/:cardUid', authenticateAdmin, requireRole('super_admin'), verifyCard);

module.exports = router;
