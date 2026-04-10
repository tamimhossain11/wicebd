const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/promoCodeController');
const authenticateAdmin = require('../middleware/auth');

// Public
router.post('/validate', ctrl.validateCode);

// Admin-only
router.get('/', authenticateAdmin, ctrl.list);
router.post('/', authenticateAdmin, ctrl.create);
router.patch('/:id/toggle', authenticateAdmin, ctrl.toggle);
router.delete('/:id', authenticateAdmin, ctrl.remove);

module.exports = router;
