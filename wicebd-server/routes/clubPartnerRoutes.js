const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateAdmin = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

/* ── Code generator ── */
async function generateCLCode(clubName) {
  const firstWord = clubName.trim().split(/\s+/)[0];
  const [[{ cnt }]] = await db.query('SELECT COUNT(*) AS cnt FROM club_partners');
  const seq = String(Number(cnt) + 1).padStart(3, '0');
  return `CL-${firstWord}-${seq}`;
}

/* ── PUBLIC: search for search-and-select on registration forms ── */
router.get('/search', async (req, res) => {
  try {
    const q = `%${(req.query.q || '').trim()}%`;
    const [rows] = await db.query(
      `SELECT id, club_name, institution_name, code
       FROM club_partners
       WHERE code LIKE ? OR club_name LIKE ? OR institution_name LIKE ?
       ORDER BY code
       LIMIT 50`,
      [q, q, q]
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: 'DB error' });
  }
});

/* ── ADMIN: get all ── */
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM club_partners ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: 'DB error' });
  }
});

/* ── ADMIN: stats (registrations per club per competition type) ── */
router.get('/stats', authenticateAdmin, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        cp.id, cp.code, cp.club_name, cp.institution_name,
        COALESCE(proj.cnt, 0)                                         AS project_count,
        COALESCE(mag.cnt,  0)                                         AS magazine_count,
        COALESCE(oly.cnt,  0)                                         AS olympiad_count,
        COALESCE(proj.cnt, 0) + COALESCE(mag.cnt, 0) + COALESCE(oly.cnt, 0) AS total
      FROM club_partners cp
      LEFT JOIN (SELECT club_code, COUNT(*) AS cnt FROM registrations        WHERE competitionCategory != 'Megazine' AND club_code IS NOT NULL GROUP BY club_code) proj ON proj.club_code = cp.code
      LEFT JOIN (SELECT club_code, COUNT(*) AS cnt FROM registrations        WHERE competitionCategory = 'Megazine' AND club_code IS NOT NULL GROUP BY club_code) mag  ON mag.club_code  = cp.code
      LEFT JOIN (SELECT club_code, COUNT(*) AS cnt FROM olympiad_registrations WHERE club_code IS NOT NULL GROUP BY club_code)                                       oly  ON oly.club_code  = cp.code
      ORDER BY total DESC
    `);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: 'DB error' });
  }
});

/* ── ADMIN: add single ── */
router.post('/', authenticateAdmin, requireRole('super_admin', 'ca_cl_manager'), async (req, res) => {
  const { club_name, institution_name, institution_address } = req.body;
  if (!club_name || !institution_name || !institution_address) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  try {
    const code = await generateCLCode(club_name);
    await db.execute(
      'INSERT INTO club_partners (club_name, institution_name, institution_address, code) VALUES (?, ?, ?, ?)',
      [club_name.trim(), institution_name.trim(), institution_address.trim(), code]
    );
    res.json({ success: true, code });
  } catch (e) {
    res.status(500).json({ error: 'DB error: ' + e.message });
  }
});

/* ── ADMIN: bulk add ── */
router.post('/bulk', authenticateAdmin, requireRole('super_admin', 'ca_cl_manager'), async (req, res) => {
  const { entries } = req.body;
  if (!Array.isArray(entries) || entries.length === 0) {
    return res.status(400).json({ error: 'entries must be a non-empty array' });
  }
  const inserted = [];
  const errors = [];
  for (const entry of entries) {
    const { club_name, institution_name, institution_address } = entry;
    if (!club_name || !institution_name || !institution_address) {
      errors.push({ entry, reason: 'Missing required fields' });
      continue;
    }
    try {
      const code = await generateCLCode(club_name);
      await db.execute(
        'INSERT INTO club_partners (club_name, institution_name, institution_address, code) VALUES (?, ?, ?, ?)',
        [club_name.trim(), institution_name.trim(), institution_address.trim(), code]
      );
      inserted.push({ club_name, code });
    } catch (e) {
      errors.push({ entry, reason: e.message });
    }
  }
  res.json({ inserted: inserted.length, codes: inserted, errors });
});

/* ── ADMIN: delete ── */
router.delete('/:id', authenticateAdmin, requireRole('super_admin', 'ca_cl_manager'), async (req, res) => {
  try {
    await db.execute('DELETE FROM club_partners WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'DB error' });
  }
});

module.exports = router;
