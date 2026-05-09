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
   Includes per-judge breakdown fields + overall judge_count per team.
*/
router.get('/teams', authenticateJudge, async (req, res) => {
  try {
    const { judge_type, subcategory, id: judgeId } = req.judge;
    let rows = [];

    if (judge_type === 'wall_magazine') {
      [rows] = await db.query(`
        SELECT paymentID AS registration_id,
               COALESCE(NULLIF(projectTitle,''), leader) AS team_name,
               leader AS leader_name, institution,
               CASE WHEN categories IN ('Primary School','Elementary') THEN 'Elementary' ELSE categories END AS education_category,
               projectTitle AS project_title,
               leaderEmail AS email, leaderPhone AS phone,
               'wall_magazine' AS competition_type,
               member2, member3, member4, member5, member6
        FROM registrations
        WHERE competitionCategory = 'Megazine'
        ORDER BY education_category, leader
      `);
    } else {
      // Check for explicit project assignments for this judge
      const [assignedRows] = await db.query(
        'SELECT registration_id FROM judge_project_assignments WHERE judge_id = ?',
        [judgeId]
      );

      if (assignedRows.length > 0) {
        const regIds = assignedRows.map(r => r.registration_id);
        [rows] = await db.query(`
          SELECT r.paymentID AS registration_id,
                 COALESCE(NULLIF(r.projectTitle,''), r.leader) AS team_name,
                 r.leader AS leader_name, r.institution,
                 CASE WHEN r.categories IN ('Primary School','Elementary') THEN 'Elementary' ELSE r.categories END AS education_category,
                 r.projectSubcategory AS subcategory,
                 r.projectTitle AS project_title, r.leaderEmail AS email, r.leaderPhone AS phone,
                 'project' AS competition_type,
                 r.member2, r.member3, r.member4, r.member5, r.member6
          FROM registrations r
          WHERE r.id IN (?)
          ORDER BY r.projectSubcategory, r.categories, r.leader
        `, [regIds]);
      } else {
        // Fallback: show all projects in judge's subcategory
        [rows] = await db.query(`
          SELECT paymentID AS registration_id,
                 COALESCE(NULLIF(projectTitle,''), leader) AS team_name,
                 leader AS leader_name, institution,
                 CASE WHEN categories IN ('Primary School','Elementary') THEN 'Elementary' ELSE categories END AS education_category,
                 projectSubcategory AS subcategory,
                 projectTitle AS project_title, leaderEmail AS email, leaderPhone AS phone,
                 'project' AS competition_type,
                 member2, member3, member4, member5, member6
          FROM registrations
          WHERE competitionCategory != 'Megazine' AND projectSubcategory = ?
          ORDER BY education_category, leader
        `, [subcategory]);
      }
    }

    if (rows.length === 0) {
      return res.json({ success: true, grouped: {} });
    }

    const registrationIds = rows.map(r => r.registration_id);
    const competitionType = judge_type === 'wall_magazine' ? 'wall_magazine' : 'project';

    // Fetch this judge's existing marks
    const [myMarks] = await db.query(
      'SELECT registration_id, marks, urgency, visibility, relevance, presentation, notes FROM judge_marks WHERE judge_id = ? AND competition_type = ?',
      [judgeId, competitionType]
    );
    const myMarksMap = {};
    myMarks.forEach(m => { myMarksMap[m.registration_id] = m; });

    // Fetch total judge count per team (across all judges)
    const [judgeCounts] = await db.query(
      `SELECT registration_id, COUNT(DISTINCT judge_id) AS judge_count
       FROM judge_marks WHERE registration_id IN (?) AND competition_type = ?
       GROUP BY registration_id`,
      [registrationIds, competitionType]
    );
    const judgeCountMap = {};
    judgeCounts.forEach(jc => { judgeCountMap[jc.registration_id] = jc.judge_count; });

    // Group by education_category
    const grouped = {};
    rows.forEach(team => {
      const cat = team.education_category || 'Unknown';
      if (!grouped[cat]) grouped[cat] = [];
      const myRow = myMarksMap[team.registration_id];
      grouped[cat].push({
        ...team,
        my_marks:        myRow?.marks        ?? null,
        my_urgency:      myRow?.urgency      ?? null,
        my_visibility:   myRow?.visibility   ?? null,
        my_relevance:    myRow?.relevance    ?? null,
        my_presentation: myRow?.presentation ?? null,
        my_notes:        myRow?.notes        ?? null,
        judge_count:     judgeCountMap[team.registration_id] || 0,
      });
    });

    res.json({ success: true, grouped });
  } catch (e) {
    res.status(500).json({ success: false, message: 'DB error: ' + e.message });
  }
});

/* ── POST /api/judge/marks ─────────────────────────────────────────── */
router.post('/marks', authenticateJudge, async (req, res) => {
  const { registration_id, urgency, visibility, relevance, presentation, notes, competition_type } = req.body;

  if (!registration_id)
    return res.status(400).json({ success: false, message: 'registration_id required' });

  const u = Number(urgency);
  const v = Number(visibility);
  const r = Number(relevance);
  const p = Number(presentation);

  if (isNaN(u) || u < 0 || u > 30)
    return res.status(400).json({ success: false, message: 'urgency must be between 0 and 30' });
  if (isNaN(v) || v < 0 || v > 20)
    return res.status(400).json({ success: false, message: 'visibility must be between 0 and 20' });
  if (isNaN(r) || r < 0 || r > 30)
    return res.status(400).json({ success: false, message: 'relevance must be between 0 and 30' });
  if (isNaN(p) || p < 0 || p > 20)
    return res.status(400).json({ success: false, message: 'presentation must be between 0 and 20' });

  const total = u + v + r + p;
  const type = competition_type || (req.judge.judge_type === 'wall_magazine' ? 'wall_magazine' : 'project');

  try {
    await db.query(`
      INSERT INTO judge_marks (judge_id, registration_id, competition_type, urgency, visibility, relevance, presentation, marks, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        urgency = VALUES(urgency),
        visibility = VALUES(visibility),
        relevance = VALUES(relevance),
        presentation = VALUES(presentation),
        marks = VALUES(marks),
        notes = VALUES(notes),
        updated_at = NOW()
    `, [req.judge.id, registration_id, type, u, v, r, p, total, notes || null]);

    res.json({ success: true, message: 'Marks saved', total });
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
