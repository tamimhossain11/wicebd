const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateAdmin = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

/* ── Code generator ── */
async function generateCACode(name) {
  const firstName = name.trim().split(/\s+/)[0];
  const [[{ cnt }]] = await db.query('SELECT COUNT(*) AS cnt FROM campus_ambassadors');
  const seq = String(Number(cnt) + 1).padStart(3, '0');
  return `CA-${firstName}-${seq}`;
}

/* ── PUBLIC: search for search-and-select on registration forms ── */
router.get('/search', async (req, res) => {
  try {
    const q = `%${(req.query.q || '').trim()}%`;
    const [rows] = await db.query(
      `SELECT id, name, institution_name, code
       FROM campus_ambassadors
       WHERE code LIKE ? OR name LIKE ? OR institution_name LIKE ?
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
      'SELECT * FROM campus_ambassadors ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: 'DB error' });
  }
});

/* ── ADMIN: stats (registrations per CA per competition type) ── */
router.get('/stats', authenticateAdmin, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        ca.id, ca.code, ca.name, ca.institution_name,
        COALESCE(proj.cnt, 0)                                         AS project_count,
        COALESCE(mag.cnt,  0)                                         AS magazine_count,
        COALESCE(oly.cnt,  0)                                         AS olympiad_count,
        COALESCE(proj.cnt, 0) + COALESCE(mag.cnt, 0) + COALESCE(oly.cnt, 0) AS total
      FROM campus_ambassadors ca
      LEFT JOIN (SELECT ca_code, COUNT(*) AS cnt FROM registrations        WHERE competitionCategory != 'Megazine' AND ca_code IS NOT NULL GROUP BY ca_code) proj ON proj.ca_code = ca.code
      LEFT JOIN (SELECT ca_code, COUNT(*) AS cnt FROM registrations        WHERE competitionCategory = 'Megazine' AND ca_code IS NOT NULL GROUP BY ca_code) mag  ON mag.ca_code  = ca.code
      LEFT JOIN (SELECT ca_code, COUNT(*) AS cnt FROM olympiad_registrations WHERE ca_code IS NOT NULL GROUP BY ca_code)                                       oly  ON oly.ca_code  = ca.code
      ORDER BY total DESC
    `);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: 'DB error' });
  }
});

/* ── ADMIN: add single ── */
router.post('/', authenticateAdmin, requireRole('super_admin', 'ca_cl_manager'), async (req, res) => {
  const { name, institution_name, institution_address } = req.body;
  if (!name || !institution_name || !institution_address) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  try {
    const code = await generateCACode(name);
    await db.execute(
      'INSERT INTO campus_ambassadors (name, institution_name, institution_address, code) VALUES (?, ?, ?, ?)',
      [name.trim(), institution_name.trim(), institution_address.trim(), code]
    );
    res.json({ success: true, code });
  } catch (e) {
    res.status(500).json({ error: 'DB error: ' + e.message });
  }
});

/* ── ADMIN: bulk add (JSON array from client-side CSV parse) ── */
router.post('/bulk', authenticateAdmin, requireRole('super_admin', 'ca_cl_manager'), async (req, res) => {
  const { entries } = req.body;
  if (!Array.isArray(entries) || entries.length === 0) {
    return res.status(400).json({ error: 'entries must be a non-empty array' });
  }
  const inserted = [];
  const errors = [];
  for (const entry of entries) {
    const { name, institution_name, institution_address } = entry;
    if (!name || !institution_name || !institution_address) {
      errors.push({ entry, reason: 'Missing required fields' });
      continue;
    }
    try {
      const code = await generateCACode(name);
      await db.execute(
        'INSERT INTO campus_ambassadors (name, institution_name, institution_address, code) VALUES (?, ?, ?, ?)',
        [name.trim(), institution_name.trim(), institution_address.trim(), code]
      );
      inserted.push({ name, code });
    } catch (e) {
      errors.push({ entry, reason: e.message });
    }
  }
  res.json({ inserted: inserted.length, codes: inserted, errors });
});

/* ── ADMIN: delete ── */
router.delete('/:id', authenticateAdmin, requireRole('super_admin', 'ca_cl_manager'), async (req, res) => {
  try {
    await db.execute('DELETE FROM campus_ambassadors WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'DB error' });
  }
});

module.exports = router;
