const express = require('express');
const router = express.Router();
const authenticateAdmin = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const authenticateUser = require('../middleware/userAuth');
const {
  createAnnouncement,
  getAllAnnouncements,
  deleteAnnouncement,
  getPublishedAnnouncements,
} = require('../controllers/announcementController');

// Admin routes
router.post('/', authenticateAdmin, requireRole('super_admin'), createAnnouncement);
router.get('/admin', authenticateAdmin, getAllAnnouncements);
router.delete('/:id', authenticateAdmin, requireRole('super_admin'), deleteAnnouncement);

// Public / user route
router.get('/', getPublishedAnnouncements);

module.exports = router;
