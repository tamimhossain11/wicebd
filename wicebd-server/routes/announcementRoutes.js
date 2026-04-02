const express = require('express');
const router = express.Router();
const authenticateAdmin = require('../middleware/auth');
const authenticateUser = require('../middleware/userAuth');
const {
  createAnnouncement,
  getAllAnnouncements,
  deleteAnnouncement,
  getPublishedAnnouncements,
} = require('../controllers/announcementController');

// Admin routes
router.post('/', authenticateAdmin, createAnnouncement);
router.get('/admin', authenticateAdmin, getAllAnnouncements);
router.delete('/:id', authenticateAdmin, deleteAnnouncement);

// Public / user route
router.get('/', getPublishedAnnouncements);

module.exports = router;
