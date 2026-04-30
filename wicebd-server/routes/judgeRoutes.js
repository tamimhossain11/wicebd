const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const authenticateJudge = require('../middleware/judgeAuth');

/* ── POST /api/judge/login ─────────────────────────────────────────── */
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ success: false, message: 'Username and password required' });

  try {
    const [[judge]] = await db.query(
      'SELECT * FROM judges WHERE username = ? AND is_active = 1',
      [username.trim().toLowerCase()]
    );
    if (!judge) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, judge.password);
    if (!match) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = jwt.sign(
      {
        id: judge.id, name: judge.name, username: judge.username,
        role: 'judge', judge_type: judge.judge_type, subcategory: judge.subcategory,
      },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    res.json({
      success: true, token,
      judge: {
        id: judge.id, name: judge.name, username: judge.username,
        judge_type: judge.judge_type, subcategory: judge.subcategory,
      },
    });
  } catch (e) {
    res.status(500).json({ success: false, message: 'DB error: ' + e.message });
  }
});

/* ── GET /api/judge/me ─────────────────────────────────────────────── */
router.get('/me', authenticateJudge, async (req, res) => {
  try {
    const [[judge]] = await db.query(
      'SELECT id, name, username, judge_type, subcategory FROM judges WHERE id = ?',
      [req.judge.id]
    );
    if (!judge) return res.status(404).json({ success: false, message: 'Judge not found' });
    res.json({ success: true, judge });
  } catch (e) {
    res.status(500).json({ success: false, message: 'DB error' });
  }
});

/* ── GET /api/judge/teams ──────────────────────────────────────────────
   Returns teams for this judge grouped by education category.
   Project judge → sees teams in their subcategory
   Wall magazine judge → sees all wall magazine registrations
*/
router.get('/teams', authenticateJudge, async (req, res) => {
  try {
    const { judge_type, subcategory, id: judgeId } = req.judge;
    let rows = [];

    if (judge_type === 'wall_magazine') {
      [rows] = await db.query(`
        SELECT paymentID AS registration_id, leader AS team_name, institution,
               categories AS education_category, projectTitle AS project_title,
               leaderEmail AS email, leaderPhone AS phone,
               'wall_magazine' AS competition_type,
               member2, member3, member4, member5, member6
        FROM registrations
        WHERE competitionCategory = 'Megazine'
        ORDER BY categories, leader
      `);
    } else {
      [rows] = await db.query(`
        SELECT paymentID AS registration_id, leader AS team_name, institution,
               categories AS education_category, projectSubcategory AS subcategory,
               projectTitle AS project_title, leaderEmail AS email, leaderPhone AS phone,
               'project' AS competition_type,
               member2, member3, member4, member5, member6
        FROM registrations
        WHERE competitionCategory = 'Project' AND projectSubcategory = ?
        ORDER BY categories, leader
      `, [subcategory]);
    }

    // Attach existing marks
    const [marks] = await db.query(
      'SELECT registration_id, marks, notes FROM judge_marks WHERE judge_id = ?',
      [judgeId]
    );
    const marksMap = {};
    marks.forEach(m => { marksMap[m.registration_id] = m; });

    // Group by education_category
    const grouped = {};
    rows.forEach(team => {
      const cat = team.education_category || 'Unknown';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push({
        ...team,
        my_marks: marksMap[team.registration_id]?.marks ?? null,
        my_notes: marksMap[team.registration_id]?.notes ?? null,
      });
    });

    res.json({ success: true, grouped });
  } catch (e) {
    res.status(500).json({ success: false, message: 'DB error: ' + e.message });
  }
});

/* ── POST /api/judge/marks ─────────────────────────────────────────── */
router.post('/marks', authenticateJudge, async (req, res) => {
  const { registration_id, marks, notes, competition_type } = req.body;
  if (!registration_id || marks === undefined || marks === null)
    return res.status(400).json({ success: false, message: 'registration_id and marks required' });
  if (marks < 0 || marks > 100)
    return res.status(400).json({ success: false, message: 'Marks must be between 0 and 100' });

  const type = competition_type || (req.judge.judge_type === 'wall_magazine' ? 'wall_magazine' : 'project');

  try {
    await db.query(`
      INSERT INTO judge_marks (judge_id, registration_id, competition_type, marks, notes)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE marks = VALUES(marks), notes = VALUES(notes), updated_at = NOW()
    `, [req.judge.id, registration_id, type, marks, notes || null]);

    res.json({ success: true, message: 'Marks saved' });
  } catch (e) {
    res.status(500).json({ success: false, message: 'DB error: ' + e.message });
  }
});

/* ── GET /api/judge/marks ──────────────────────────────────────────── */
router.get('/marks', authenticateJudge, async (req, res) => {
  try {
    const [marks] = await db.query(
      'SELECT * FROM judge_marks WHERE judge_id = ? ORDER BY updated_at DESC',
      [req.judge.id]
    );
    res.json({ success: true, marks });
  } catch (e) {
    res.status(500).json({ success: false, message: 'DB error' });
  }
});

module.exports = router;
