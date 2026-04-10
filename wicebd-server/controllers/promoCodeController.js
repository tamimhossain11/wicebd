const db = require('../db');

/* ── Public: validate a promo code ── */
exports.validateCode = async (req, res) => {
  const { code, competitionType } = req.body;
  if (!code || !competitionType) {
    return res.status(400).json({ valid: false, message: 'Code and competition type are required' });
  }

  try {
    const [rows] = await db.query(
      `SELECT discount_percentage FROM promo_codes
       WHERE code = ? AND is_active = 1
         AND (competition_type = ? OR competition_type = 'all')
       LIMIT 1`,
      [code.toUpperCase().trim(), competitionType]
    );

    if (!rows.length) {
      return res.json({ valid: false, message: 'Invalid or expired promo code' });
    }

    return res.json({ valid: true, discountPercentage: rows[0].discount_percentage });
  } catch (err) {
    console.error('Promo validate error:', err);
    return res.status(500).json({ valid: false, message: 'Server error' });
  }
};

/* ── Admin: list all promo codes ── */
exports.list = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM promo_codes ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error('Promo list error:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

/* ── Admin: create a promo code ── */
exports.create = async (req, res) => {
  const { code, discount_percentage, competition_type } = req.body;
  if (!code || !discount_percentage || !competition_type) {
    return res.status(400).json({ error: 'code, discount_percentage, and competition_type are required' });
  }
  if (discount_percentage < 1 || discount_percentage > 100) {
    return res.status(400).json({ error: 'discount_percentage must be between 1 and 100' });
  }

  try {
    const upperCode = code.toUpperCase().trim();
    await db.query(
      `INSERT INTO promo_codes (code, discount_percentage, competition_type, created_by)
       VALUES (?, ?, ?, ?)`,
      [upperCode, discount_percentage, competition_type, req.user?.email || 'admin']
    );
    res.json({ success: true, code: upperCode });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Promo code already exists' });
    }
    console.error('Promo create error:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

/* ── Admin: toggle active status ── */
exports.toggle = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query(
      'UPDATE promo_codes SET is_active = NOT is_active WHERE id = ?',
      [id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Promo toggle error:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

/* ── Admin: delete a promo code ── */
exports.remove = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM promo_codes WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Promo delete error:', err);
    res.status(500).json({ error: 'Database error' });
  }
};
