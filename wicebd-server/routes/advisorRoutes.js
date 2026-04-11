const express = require('express');
const router = express.Router();
const multer = require('multer');
const db = require('../db');
const authenticateAdmin = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const { uploadBuffer, deleteFile } = require('../utils/gcsStorage');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = /^image\/(jpeg|jpg|png|gif|webp)$/.test(file.mimetype);
    cb(ok ? null : new Error('Only image files allowed'), ok);
  },
});

/* ── Public: get visible advisors ── */
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, name, title, institution, category, image_url, sort_order FROM advisors WHERE is_visible = 1 ORDER BY sort_order ASC, id ASC'
    );
    res.json({ success: true, advisors: rows });
  } catch (e) {
    res.status(500).json({ success: false, message: 'DB error' });
  }
});

/* ── Admin: get all (including hidden) ── */
router.get('/admin', authenticateAdmin, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM advisors ORDER BY sort_order ASC, id ASC');
    res.json({ success: true, advisors: rows });
  } catch (e) {
    res.status(500).json({ success: false, message: 'DB error' });
  }
});

/* ── Admin: create ── */
router.post('/', authenticateAdmin, requireRole('super_admin'), upload.single('image'), async (req, res) => {
  const { name, title, institution, category, sort_order } = req.body;
  if (!name) return res.status(400).json({ success: false, message: 'Name is required' });

  let image_url = req.body.image_url || null;
  if (req.file) {
    const dest = `advisors/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
    image_url = await uploadBuffer(req.file.buffer, dest, req.file.mimetype);
  }

  try {
    const [result] = await db.query(
      'INSERT INTO advisors (name, title, institution, category, image_url, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
      [name, title || null, institution || null, category || 'Academic', image_url, parseInt(sort_order) || 0]
    );
    const [rows] = await db.query('SELECT * FROM advisors WHERE id = ?', [result.insertId]);
    res.json({ success: true, advisor: rows[0] });
  } catch (e) {
    res.status(500).json({ success: false, message: 'DB error: ' + e.message });
  }
});

/* ── Admin: update ── */
router.put('/:id', authenticateAdmin, requireRole('super_admin'), upload.single('image'), async (req, res) => {
  const { name, title, institution, category, sort_order, is_visible } = req.body;
  try {
    const [[existing]] = await db.query('SELECT * FROM advisors WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ success: false, message: 'Not found' });

    let image_url = existing.image_url;
    if (req.file) {
      // Delete old image from GCS
      if (existing.image_url) await deleteFile(existing.image_url).catch(() => {});
      const dest = `advisors/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
      image_url = await uploadBuffer(req.file.buffer, dest, req.file.mimetype);
    } else if (req.body.remove_image === 'true') {
      if (existing.image_url) await deleteFile(existing.image_url).catch(() => {});
      image_url = null;
    }

    await db.query(
      'UPDATE advisors SET name=?, title=?, institution=?, category=?, image_url=?, sort_order=?, is_visible=? WHERE id=?',
      [
        name || existing.name,
        title ?? existing.title,
        institution ?? existing.institution,
        category || existing.category,
        image_url,
        parseInt(sort_order) || existing.sort_order,
        is_visible !== undefined ? (is_visible === 'true' || is_visible === true ? 1 : 0) : existing.is_visible,
        req.params.id,
      ]
    );
    const [rows] = await db.query('SELECT * FROM advisors WHERE id = ?', [req.params.id]);
    res.json({ success: true, advisor: rows[0] });
  } catch (e) {
    res.status(500).json({ success: false, message: 'DB error: ' + e.message });
  }
});

/* ── Admin: delete ── */
router.delete('/:id', authenticateAdmin, requireRole('super_admin'), async (req, res) => {
  try {
    const [[row]] = await db.query('SELECT image_url FROM advisors WHERE id = ?', [req.params.id]);
    if (row?.image_url) await deleteFile(row.image_url).catch(() => {});
    await db.query('DELETE FROM advisors WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, message: 'DB error' });
  }
});

module.exports = router;
