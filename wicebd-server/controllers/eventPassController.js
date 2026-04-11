const db = require('../db');
const { v4: uuidv4 } = require('uuid');

// GET /api/event-pass/my-pass  — returns (or creates) the user's event pass
const getMyPass = async (req, res) => {
  const userId = req.user.id;

  try {
    // Check existing
    const [existing] = await db.query(
      'SELECT ep.*, u.name, u.email FROM event_passes ep JOIN users u ON ep.user_id = u.id WHERE ep.user_id = ?',
      [userId]
    );

    if (existing.length > 0) {
      return res.json({ success: true, pass: existing[0] });
    }

    // Verify the user has a paid registration (project, wall-magazine, or olympiad)
    const [[{ regCount }]] = await db.query(
      'SELECT COUNT(*) AS regCount FROM registrations WHERE user_id = ?', [userId]
    );
    const [[{ olympiadCount }]] = await db.query(
      'SELECT COUNT(*) AS olympiadCount FROM olympiad_registrations WHERE user_id = ?', [userId]
    );

    if (regCount === 0 && olympiadCount === 0) {
      return res.status(403).json({
        success: false,
        not_registered: true,
        message: 'You must be registered in a WICE competition (Project, Wall Magazine, or Science Olympiad) to get an event pass.',
      });
    }

    // Issue new pass
    const passId = `WICE-${uuidv4().substr(0, 8).toUpperCase()}`;
    await db.query(
      'INSERT INTO event_passes (user_id, pass_id) VALUES (?, ?)',
      [userId, passId]
    );

    const [newPass] = await db.query(
      'SELECT ep.*, u.name, u.email FROM event_passes ep JOIN users u ON ep.user_id = u.id WHERE ep.user_id = ?',
      [userId]
    );

    res.json({ success: true, pass: newPass[0] });
  } catch (error) {
    console.error('Event pass error:', error);
    res.status(500).json({ success: false, message: 'Failed to get event pass' });
  }
};

// GET /api/event-pass/verify/:passId  — admin verification endpoint
const verifyPass = async (req, res) => {
  const { passId } = req.params;

  try {
    const [rows] = await db.query(`
      SELECT ep.pass_id, ep.issued_at, ep.is_valid,
             u.id as user_id, u.name, u.email, u.provider,
             up.institution, up.gender, up.address
      FROM event_passes ep
      JOIN users u ON ep.user_id = u.id
      LEFT JOIN user_profiles up ON up.user_id = u.id
      WHERE ep.pass_id = ?
    `, [passId]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Pass not found' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Verify pass error:', error);
    res.status(500).json({ success: false, message: 'Verification failed' });
  }
};

module.exports = { getMyPass, verifyPass };
