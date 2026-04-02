const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/userAuth');
const {
  signUp,
  signIn,
  googleAuth,
  facebookAuth,
  getProfile,
  getMyRegistrations,
  unifiedLogin,
} = require('../controllers/userController');

// Public routes
router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/login', unifiedLogin);   // unified: works for both users & admins
router.post('/google', googleAuth);
router.post('/facebook', facebookAuth);

// Protected routes
router.get('/profile', authenticateUser, getProfile);
router.get('/my-registrations', authenticateUser, getMyRegistrations);

module.exports = router;
