/**
 * Admin user management (super_admin only) + attendance/QR scanning
 */
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db');
const authenticateAdmin = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

/* ══ ADMIN USER MANAGEMENT ══════════════════════════════════════════ */

/* List all admin accounts */
router.get('/admins', authenticateAdmin, requireRole('super_admin'), async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, username, email, role, is_active, created_at FROM admins ORDER BY id ASC'
    );
    res.json({ success: true, admins: rows });
  } catch (e) {
    res.status(500).json({ success: false, message: 'DB error' });
  }
});

/* Create a new admin account */
router.post('/admins', authenticateAdmin, requireRole('super_admin'), async (req, res) => {
  const { username, email, password, role } = req.body;
  const VALID_ROLES = ['super_admin', 'data_extractor', 'ca_cl_manager'];
  if (!username || !password) return res.status(400).json({ success: false, message: 'username and password required' });
  if (!VALID_ROLES.includes(role)) return res.status(400).json({ success: false, message: 'Invalid role' });

  try {
    const hash = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO admins (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username.trim().toLowerCase(), email || null, hash, role]
    );
    res.json({ success: true, message: 'Admin created' });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') return res.status(409).json({ success: false, message: 'Username already exists' });
    res.status(500).json({ success: false, message: 'DB error: ' + e.message });
  }
});

/* Reset admin password */
router.patch('/admins/:id/reset-password', authenticateAdmin, requireRole('super_admin'), async (req, res) => {
  const { password } = req.body;
  if (!password || password.length < 6) return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
  try {
    const hash = await bcrypt.hash(password, 10);
    await db.query('UPDATE admins SET password = ? WHERE id = ?', [hash, req.params.id]);
    res.json({ success: true, message: 'Password updated' });
  } catch (e) {
    res.status(500).json({ success: false, message: 'DB error' });
  }
});

/* Toggle admin is_active */
router.patch('/admins/:id/toggle', authenticateAdmin, requireRole('super_admin'), async (req, res) => {
  const { id } = req.params;
  if (parseInt(id) === req.admin.id) return res.status(400).json({ success: false, message: 'Cannot deactivate yourself' });
  try {
    await db.query('UPDATE admins SET is_active = NOT is_active WHERE id = ?', [id]);
    const [[row]] = await db.query('SELECT is_active FROM admins WHERE id = ?', [id]);
    res.json({ success: true, is_active: !!row.is_active });
  } catch (e) {
    res.status(500).json({ success: false, message: 'DB error' });
  }
});

/* Delete admin account */
router.delete('/admins/:id', authenticateAdmin, requireRole('super_admin'), async (req, res) => {
  const { id } = req.params;
  if (parseInt(id) === req.admin.id) return res.status(400).json({ success: false, message: 'Cannot delete yourself' });
  try {
    await db.query('DELETE FROM admins WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, message: 'DB error' });
  }
});

/* ══ PLATFORM USER RESTRICTION ════════════════════════════════════════ */

/* Reset portal user password */
router.patch('/users/:id/reset-password', authenticateAdmin, requireRole('super_admin'), async (req, res) => {
  const { password } = req.body;
  if (!password || password.length < 6) return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
  try {
    const hash = await bcrypt.hash(password, 10);
    await db.query("UPDATE users SET password = ?, provider = 'local' WHERE id = ?", [hash, req.params.id]);
    res.json({ success: true, message: 'Password updated' });
  } catch (e) {
    res.status(500).json({ success: false, message: 'DB error' });
  }
});

/* Toggle platform user active/inactive */
router.patch('/users/:id/toggle', authenticateAdmin, requireRole('super_admin'), async (req, res) => {
  try {
    await db.query('UPDATE users SET is_active = NOT is_active WHERE id = ?', [req.params.id]);
    const [[row]] = await db.query('SELECT is_active FROM users WHERE id = ?', [req.params.id]);
    res.json({ success: true, is_active: !!row.is_active });
  } catch (e) {
    res.status(500).json({ success: false, message: 'DB error' });
  }
});

/* ══ ATTENDANCE / QR SCANNING ══════════════════════════════════════════ */

/* Scan a QR card_uid — returns participant info + attendance status */
router.get('/attendance/:cardUid', authenticateAdmin, async (req, res) => {
  const { cardUid } = req.params;
  try {
    /* Get ID card + user + registration detail */
    const [cardRows] = await db.query(`
      SELECT ic.card_uid, ic.registration_type, ic.registration_id,
             ic.user_id, ic.generated_at,
             u.name AS user_name, u.email AS user_email
      FROM id_cards ic
      LEFT JOIN users u ON ic.user_id = u.id
      WHERE ic.card_uid = ?
    `, [cardUid]);

    if (!cardRows.length) return res.status(404).json({ success: false, message: 'Card not found' });
    const card = cardRows[0];

    /* Get attendance record (may not exist yet) */
    const [attRows] = await db.query('SELECT * FROM attendance WHERE card_uid = ?', [cardUid]);
    const att = attRows[0] || null;

    res.json({ success: true, card, attendance: att });
  } catch (e) {
    res.status(500).json({ success: false, message: 'DB error: ' + e.message });
  }
});

/* Check-in a participant */
router.post('/attendance/:cardUid/checkin', authenticateAdmin, async (req, res) => {
  const { cardUid } = req.params;
  try {
    /* Ensure card exists */
    const [[card]] = await db.query('SELECT * FROM id_cards WHERE card_uid = ?', [cardUid]);
    if (!card) return res.status(404).json({ success: false, message: 'Card not found' });

    /* Get name for display */
    let participant_name = '';
    if (card.registration_type === 'olympiad') {
      const [[reg]] = await db.query('SELECT full_name FROM olympiad_registrations WHERE registration_id = ?', [card.registration_id]);
      participant_name = reg?.full_name || '';
    } else {
      const [[reg]] = await db.query('SELECT leader FROM registrations WHERE paymentID = ?', [card.registration_id]);
      participant_name = reg?.leader || '';
    }

    /* Upsert attendance (set check-in if not already done) */
    const [existing] = await db.query('SELECT * FROM attendance WHERE card_uid = ?', [cardUid]);
    if (existing.length > 0 && existing[0].checked_in_at) {
      return res.json({ success: true, already: true, attendance: existing[0] });
    }

    await db.query(`
      INSERT INTO attendance (card_uid, user_id, registration_type, registration_id, participant_name, checked_in_at, checked_in_by)
      VALUES (?, ?, ?, ?, ?, NOW(), ?)
      ON DUPLICATE KEY UPDATE checked_in_at = COALESCE(checked_in_at, NOW()), checked_in_by = COALESCE(checked_in_by, ?)
    `, [cardUid, card.user_id, card.registration_type, card.registration_id, participant_name, req.admin.id, req.admin.id]);

    const [[att]] = await db.query('SELECT * FROM attendance WHERE card_uid = ?', [cardUid]);
    res.json({ success: true, already: false, attendance: att });
  } catch (e) {
    res.status(500).json({ success: false, message: 'DB error: ' + e.message });
  }
});

/* Mark lunch claimed */
router.post('/attendance/:cardUid/lunch', authenticateAdmin, async (req, res) => {
  const { cardUid } = req.params;
  try {
    // Olympiad participants are not eligible for lunch
    const [[card]] = await db.query('SELECT registration_type FROM id_cards WHERE card_uid = ?', [cardUid]);
    if (card?.registration_type === 'olympiad') {
      return res.status(400).json({ success: false, message: 'Olympiad participants are not eligible for lunch' });
    }

    const [existing] = await db.query('SELECT * FROM attendance WHERE card_uid = ?', [cardUid]);
    if (!existing.length) return res.status(400).json({ success: false, message: 'Not checked in yet' });
    if (existing[0].lunch_claimed_at) {
      return res.json({ success: true, already: true, attendance: existing[0] });
    }
    await db.query(
      'UPDATE attendance SET lunch_claimed_at = NOW(), lunch_claimed_by = ? WHERE card_uid = ?',
      [req.admin.id, cardUid]
    );
    const [[att]] = await db.query('SELECT * FROM attendance WHERE card_uid = ?', [cardUid]);
    res.json({ success: true, already: false, attendance: att });
  } catch (e) {
    res.status(500).json({ success: false, message: 'DB error: ' + e.message });
  }
});

/* List all attendance records */
router.get('/attendance', authenticateAdmin, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT a.*,
             ci.username AS checked_in_by_name,
             lc.username AS lunch_by_name
      FROM attendance a
      LEFT JOIN admins ci ON a.checked_in_by  = ci.id
      LEFT JOIN admins lc ON a.lunch_claimed_by = lc.id
      ORDER BY a.checked_in_at DESC
    `);
    res.json({ success: true, attendance: rows });
  } catch (e) {
    res.status(500).json({ success: false, message: 'DB error' });
  }
});

module.exports = router;
