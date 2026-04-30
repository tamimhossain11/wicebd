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
      'INSERT INTO admins (username, email, password, role, is_active) VALUES (?, ?, ?, ?, 1)',
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
             ic.user_id, ic.generated_at, ic.guest_name, ic.guest_position,
             ic.certificate_collected, ic.certificate_collected_at,
             COALESCE(u.name, ic.guest_name) AS user_name,
             u.email AS user_email
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
    if (card.registration_type === 'guest') {
      participant_name = card.guest_name || '';
    } else if (card.registration_type === 'olympiad') {
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

/* Helper: resolve participant name from card */
async function resolveParticipantName(card) {
  if (card.registration_type === 'guest') return card.guest_name || '';
  if (card.registration_type === 'olympiad') {
    const [[reg]] = await db.query('SELECT full_name FROM olympiad_registrations WHERE registration_id = ?', [card.registration_id]);
    return reg?.full_name || '';
  }
  const [[reg]] = await db.query('SELECT leader FROM registrations WHERE paymentID = ?', [card.registration_id]);
  return reg?.leader || '';
}

/* Mark lunch claimed — no check-in required, upserts attendance row */
router.post('/attendance/:cardUid/lunch', authenticateAdmin, async (req, res) => {
  const { cardUid } = req.params;
  try {
    const [[card]] = await db.query('SELECT * FROM id_cards WHERE card_uid = ?', [cardUid]);
    if (!card) return res.status(404).json({ success: false, message: 'Card not found' });
    if (card.registration_type === 'olympiad') {
      return res.status(400).json({ success: false, message: 'Olympiad participants are not eligible for lunch' });
    }

    const [existing] = await db.query('SELECT * FROM attendance WHERE card_uid = ?', [cardUid]);
    if (existing.length && existing[0].lunch_claimed_at) {
      return res.json({ success: true, already: true, attendance: existing[0] });
    }

    const participant_name = await resolveParticipantName(card);
    await db.query(`
      INSERT INTO attendance (card_uid, user_id, registration_type, registration_id, participant_name, lunch_claimed_at, lunch_claimed_by)
      VALUES (?, ?, ?, ?, ?, NOW(), ?)
      ON DUPLICATE KEY UPDATE lunch_claimed_at = COALESCE(lunch_claimed_at, NOW()), lunch_claimed_by = COALESCE(lunch_claimed_by, ?)
    `, [cardUid, card.user_id, card.registration_type, card.registration_id, participant_name, req.admin.id, req.admin.id]);

    const [[att]] = await db.query('SELECT * FROM attendance WHERE card_uid = ?', [cardUid]);
    res.json({ success: true, already: false, attendance: att });
  } catch (e) {
    res.status(500).json({ success: false, message: 'DB error: ' + e.message });
  }
});

/* Mark coffee claimed — no check-in required, upserts attendance row */
router.post('/attendance/:cardUid/coffee', authenticateAdmin, async (req, res) => {
  const { cardUid } = req.params;
  try {
    const [[card]] = await db.query('SELECT * FROM id_cards WHERE card_uid = ?', [cardUid]);
    if (!card) return res.status(404).json({ success: false, message: 'Card not found' });

    const [existing] = await db.query('SELECT * FROM attendance WHERE card_uid = ?', [cardUid]);
    if (existing.length && existing[0].coffee_claimed_at) {
      return res.json({ success: true, already: true, attendance: existing[0] });
    }

    const participant_name = await resolveParticipantName(card);
    await db.query(`
      INSERT INTO attendance (card_uid, user_id, registration_type, registration_id, participant_name, coffee_claimed_at, coffee_claimed_by)
      VALUES (?, ?, ?, ?, ?, NOW(), ?)
      ON DUPLICATE KEY UPDATE coffee_claimed_at = COALESCE(coffee_claimed_at, NOW()), coffee_claimed_by = COALESCE(coffee_claimed_by, ?)
    `, [cardUid, card.user_id, card.registration_type, card.registration_id, participant_name, req.admin.id, req.admin.id]);

    const [[att]] = await db.query('SELECT * FROM attendance WHERE card_uid = ?', [cardUid]);
    res.json({ success: true, already: false, attendance: att });
  } catch (e) {
    res.status(500).json({ success: false, message: 'DB error: ' + e.message });
  }
});

/* Mark certificate collected — project and wall-magazine only */
router.post('/attendance/:cardUid/certificate', authenticateAdmin, async (req, res) => {
  const { cardUid } = req.params;
  try {
    const [[card]] = await db.query('SELECT * FROM id_cards WHERE card_uid = ?', [cardUid]);
    if (!card) return res.status(404).json({ success: false, message: 'Card not found' });
    if (card.registration_type === 'olympiad' || card.registration_type === 'guest') {
      return res.status(400).json({ success: false, message: 'Certificate collection is only for project and wall magazine participants' });
    }
    if (card.certificate_collected) {
      return res.json({ success: true, already: true, certificate_collected: true, certificate_collected_at: card.certificate_collected_at });
    }
    await db.query(
      'UPDATE id_cards SET certificate_collected = 1, certificate_collected_at = NOW(), certificate_collected_by = ? WHERE card_uid = ?',
      [req.admin.id, cardUid]
    );
    const [[updated]] = await db.query('SELECT certificate_collected, certificate_collected_at FROM id_cards WHERE card_uid = ?', [cardUid]);
    res.json({ success: true, already: false, certificate_collected: true, certificate_collected_at: updated.certificate_collected_at });
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
             lc.username AS lunch_by_name,
             cc.username AS coffee_by_name
      FROM attendance a
      LEFT JOIN admins ci ON a.checked_in_by   = ci.id
      LEFT JOIN admins lc ON a.lunch_claimed_by = lc.id
      LEFT JOIN admins cc ON a.coffee_claimed_by = cc.id
      ORDER BY a.checked_in_at DESC
    `);
    res.json({ success: true, attendance: rows });
  } catch (e) {
    res.status(500).json({ success: false, message: 'DB error' });
  }
});

/* ══ JUDGE MANAGEMENT ═══════════════════════════════════════════════ */

router.get('/judges', authenticateAdmin, requireRole('super_admin'), async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, name, username, email, judge_type, subcategory, is_active, created_at FROM judges ORDER BY id DESC'
    );
    res.json({ success: true, judges: rows });
  } catch (e) {
    res.status(500).json({ success: false, message: 'DB error' });
  }
});

router.post('/judges', authenticateAdmin, requireRole('super_admin'), async (req, res) => {
  const { name, username, password, email, judge_type, subcategory } = req.body;
  const VALID_TYPES = ['project', 'wall_magazine'];
  if (!name || !username || !password || !judge_type)
    return res.status(400).json({ success: false, message: 'name, username, password, judge_type required' });
  if (!VALID_TYPES.includes(judge_type))
    return res.status(400).json({ success: false, message: 'Invalid judge_type' });
  if (judge_type === 'project' && !subcategory)
    return res.status(400).json({ success: false, message: 'subcategory required for project judges' });

  try {
    const hash = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO judges (name, username, password, email, judge_type, subcategory, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name.trim(), username.trim().toLowerCase(), hash, email || null, judge_type, subcategory || null, req.admin.id]
    );
    res.json({ success: true, message: 'Judge created' });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ success: false, message: 'Username already exists' });
    res.status(500).json({ success: false, message: 'DB error: ' + e.message });
  }
});

router.patch('/judges/:id/reset-password', authenticateAdmin, requireRole('super_admin'), async (req, res) => {
  const { password } = req.body;
  if (!password || password.length < 6)
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
  try {
    const hash = await bcrypt.hash(password, 10);
    await db.query('UPDATE judges SET password = ? WHERE id = ?', [hash, req.params.id]);
    res.json({ success: true, message: 'Password updated' });
  } catch (e) {
    res.status(500).json({ success: false, message: 'DB error' });
  }
});

router.patch('/judges/:id/toggle', authenticateAdmin, requireRole('super_admin'), async (req, res) => {
  try {
    await db.query('UPDATE judges SET is_active = NOT is_active WHERE id = ?', [req.params.id]);
    const [[row]] = await db.query('SELECT is_active FROM judges WHERE id = ?', [req.params.id]);
    res.json({ success: true, is_active: !!row.is_active });
  } catch (e) {
    res.status(500).json({ success: false, message: 'DB error' });
  }
});

router.delete('/judges/:id', authenticateAdmin, requireRole('super_admin'), async (req, res) => {
  try {
    await db.query('DELETE FROM judges WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, message: 'DB error' });
  }
});

/* ══ STUCK PAYMENT RECOVERY ═════════════════════════════════════════
   POST /api/admin-manage/recover-stuck-payments
   Finds temp_registrations with a verified PayStation payment but no
   final registration. Inserts missing records and cleans up temp data.
   super_admin only. Pass { commit: true } to apply; default is dry-run.
*/
router.post('/recover-stuck-payments', authenticateAdmin, requireRole('super_admin'), async (req, res) => {
  const { commit = false } = req.body;
  const { v4: uuidv4 } = require('uuid');
  const { getTransactionStatus } = require('../utils/paystation');

  try {
    // Find stuck: have invoice number, but no final registration
    const [stuck] = await db.query(`
      SELECT t.*
      FROM temp_registrations t
      WHERE t.bkash_payment_id IS NOT NULL
        AND NOT EXISTS (
          SELECT 1 FROM registrations r WHERE r.paymentID = t.bkash_payment_id
        )
        AND NOT EXISTS (
          SELECT 1 FROM olympiad_registrations o
          WHERE o.email = t.leaderEmail
            AND t.competitionCategory = 'Olympiad'
        )
    `);

    if (stuck.length === 0) {
      return res.json({ success: true, message: 'No stuck registrations found.', results: [] });
    }

    const results = [];

    for (const reg of stuck) {
      const invoice = reg.bkash_payment_id;
      const cat = (reg.competitionCategory || '').toLowerCase();
      const entry = { invoice, category: reg.competitionCategory, leader: reg.leader, email: reg.leaderEmail, action: null };

      // Verify with PayStation (works from Cloud Run)
      let statusResult;
      try { statusResult = await getTransactionStatus(invoice); } catch (e) {
        entry.action = `paystation_error: ${e.message}`;
        results.push(entry);
        continue;
      }

      const trxStatus = (statusResult?.data?.trx_status || '').toLowerCase();
      const verified  = statusResult?.status_code === '200' &&
                        (trxStatus === 'successful' || trxStatus === 'success');

      if (!verified) {
        entry.action = `not_verified (paystation: ${trxStatus || statusResult?.message})`;
        results.push(entry);
        continue;
      }

      const verifiedTrxId = statusResult.data.trx_id;
      const amount = parseFloat(statusResult.data.request_amount || 0);
      entry.trxId = verifiedTrxId;
      entry.amount = amount;

      if (!commit) {
        entry.action = `would_insert (trxId=${verifiedTrxId}, amount=${amount})`;
        results.push(entry);
        continue;
      }

      try {
        if (cat === 'olympiad') {
          const [existOly] = await db.query('SELECT id FROM olympiad_registrations WHERE email = ?', [reg.leaderEmail]);
          if (existOly.length > 0) { entry.action = 'already_exists'; results.push(entry); continue; }

          let verified_user_id = null;
          if (reg.user_id) {
            const [ur] = await db.query('SELECT id FROM users WHERE id = ?', [reg.user_id]);
            if (ur.length > 0) verified_user_id = reg.user_id;
          }
          const registrationId = `OLY-${uuidv4().substring(0, 8).toUpperCase()}`;
          await db.query(
            `INSERT INTO olympiad_registrations
              (registration_id, user_id, full_name, email, phone, address, institution, cr_reference, ca_code, club_code, promo_code, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [registrationId, verified_user_id, reg.leader, reg.leaderEmail, reg.leaderPhone,
             reg.projectTitle, reg.institution, reg.crReference || '',
             reg.ca_code || null, reg.club_code || null, reg.promo_code || null, 'registered']
          );
          entry.registrationId = registrationId;
        } else {
          const [existReg] = await db.query('SELECT id FROM registrations WHERE paymentID = ?', [invoice]);
          if (existReg.length > 0) { entry.action = 'already_exists'; results.push(entry); continue; }

          await db.query(
            `INSERT INTO registrations
              (user_id, paymentID, bkashTrxId, amount, competitionCategory, projectSubcategory,
               categories, crReference, leader, institution, leaderPhone, leaderWhatsApp,
               leaderEmail, tshirtSizeLeader,
               member2, institution2, tshirtSize2, member3, institution3, tshirtSize3,
               member4, institution4, tshirtSize4, member5, institution5, tshirtSize5,
               projectTitle, projectCategory, participatedBefore, previousCompetition,
               socialMedia, infoSource, ca_code, club_code, promo_code)
             VALUES (?,?,?,?,?,?, ?,?,?,?,?,?, ?,?, ?,?,?,?,?,?, ?,?,?,?,?,?, ?,?,?,?,?,?,?,?,?)`,
            [reg.user_id || null, invoice, verifiedTrxId, amount, reg.competitionCategory, reg.projectSubcategory,
             reg.categories, reg.crReference, reg.leader, reg.institution, reg.leaderPhone, reg.leaderWhatsApp,
             reg.leaderEmail, reg.tshirtSizeLeader,
             reg.member2 || null, reg.institution2 || null, reg.tshirtSize2 || null,
             reg.member3 || null, reg.institution3 || null, reg.tshirtSize3 || null,
             reg.member4 || null, reg.institution4 || null, reg.tshirtSize4 || null,
             reg.member5 || null, reg.institution5 || null, reg.tshirtSize5 || null,
             reg.projectTitle, reg.projectCategory, reg.participatedBefore, reg.previousCompetition,
             reg.socialMedia, reg.infoSource, reg.ca_code || null, reg.club_code || null, reg.promo_code || null]
          );
        }

        await db.query('DELETE FROM temp_registrations WHERE bkash_payment_id = ?', [invoice]);
        entry.action = 'inserted_and_cleaned';
      } catch (insertErr) {
        entry.action = `insert_error: ${insertErr.message}`;
      }

      results.push(entry);
    }

    res.json({ success: true, commit, total_stuck: stuck.length, results });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

module.exports = router;
