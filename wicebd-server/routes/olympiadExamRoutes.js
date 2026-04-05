const express = require('express');
const router = express.Router();
const authenticateAdmin = require('../middleware/auth');
const authenticateUser = require('../middleware/userAuth');
const {
  getQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  getSession,
  openSession,
  closeSession,
  getSubmissions,
  getSubmissionDetail,
  getPortalStatus,
  getExamPortal,
  submitExam,
} = require('../controllers/olympiadExamController');

// ── Public ───────────────────────────────────────────────────────────────────
router.get('/portal/status', getPortalStatus);

// ── Admin (JWT admin token required) ─────────────────────────────────────────
router.get('/admin/questions', authenticateAdmin, getQuestions);
router.post('/admin/questions', authenticateAdmin, addQuestion);
router.put('/admin/questions/:id', authenticateAdmin, updateQuestion);
router.delete('/admin/questions/:id', authenticateAdmin, deleteQuestion);

router.get('/admin/session', authenticateAdmin, getSession);
router.post('/admin/session/open', authenticateAdmin, openSession);
router.post('/admin/session/close', authenticateAdmin, closeSession);

router.get('/admin/submissions', authenticateAdmin, getSubmissions);
router.get('/admin/submissions/:id', authenticateAdmin, getSubmissionDetail);

// ── User (JWT user token required) ───────────────────────────────────────────
router.get('/portal', authenticateUser, getExamPortal);
router.post('/submit', authenticateUser, submitExam);

module.exports = router;
