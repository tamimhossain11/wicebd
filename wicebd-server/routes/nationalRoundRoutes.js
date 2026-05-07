const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateAdmin = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

/* ── GET /api/national-round  (public) ────────────────────────────────
   Returns confirmed national round selections with team info
*/
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT nrs.id, nrs.registration_id, nrs.competition_type, nrs.subcategory,
             nrs.education_category, nrs.position, nrs.total_marks, nrs.judge_count,
             nrs.is_manual, nrs.selected_at,
             COALESCE(NULLIF(r.projectTitle,''), r.leader) AS team_name,
             r.leader AS leader_name, r.institution, r.projectTitle AS project_title,
             r.projectSubcategory, r.categories
      FROM national_round_selections nrs
      LEFT JOIN registrations r ON r.paymentID = nrs.registration_id
      ORDER BY nrs.competition_type, nrs.subcategory, nrs.education_category,
               FIELD(nrs.position,'gold','silver','bronze','honorable_mention')
    `);
    res.json({ success: true, selections: rows });
  } catch (e) {
    res.status(500).json({ success: false, message: 'DB error: ' + e.message });
  }
});

/* ── GET /api/national-round/marks-summary  (super_admin) ─────────────
   Returns aggregated average marks per team grouped by subcategory and
   education category — used to preview before publishing.
   Also returns per-judge breakdown for super_admin.
*/
router.get('/marks-summary', authenticateAdmin, requireRole('super_admin'), async (req, res) => {
  try {
    const [projectRows] = await db.query(`
      SELECT r.paymentID AS registration_id,
             COALESCE(NULLIF(r.projectTitle,''), r.leader) AS team_name,
             r.leader AS leader_name, r.institution,
             r.projectSubcategory AS subcategory,
             CASE WHEN r.categories IN ('Primary School','Elementary') THEN 'Elementary' ELSE r.categories END AS education_category,
             r.projectTitle AS project_title, 'project' AS competition_type,
             ROUND(COALESCE(AVG(jm.marks), 0), 2) AS avg_marks,
             COUNT(DISTINCT jm.judge_id) AS judge_count
      FROM registrations r
      LEFT JOIN judge_marks jm ON jm.registration_id = r.paymentID AND jm.competition_type = 'project'
      WHERE r.competitionCategory != 'Megazine'
      GROUP BY r.paymentID
      ORDER BY r.projectSubcategory, education_category, avg_marks DESC
    `);

    const [wallRows] = await db.query(`
      SELECT r.paymentID AS registration_id,
             COALESCE(NULLIF(r.projectTitle,''), r.leader) AS team_name,
             r.leader AS leader_name, r.institution,
             'Wall Magazine' AS subcategory,
             CASE WHEN r.categories IN ('Primary School','Elementary') THEN 'Elementary' ELSE r.categories END AS education_category,
             r.projectTitle AS project_title, 'wall_magazine' AS competition_type,
             ROUND(COALESCE(AVG(jm.marks), 0), 2) AS avg_marks,
             COUNT(DISTINCT jm.judge_id) AS judge_count
      FROM registrations r
      LEFT JOIN judge_marks jm ON jm.registration_id = r.paymentID AND jm.competition_type = 'wall_magazine'
      WHERE r.competitionCategory = 'Megazine'
      GROUP BY r.paymentID
      ORDER BY avg_marks DESC
    `);

    const [breakdownRows] = await db.query(`
      SELECT jm.id, jm.registration_id, jm.competition_type,
             j.name AS judge_name, j.username,
             jm.urgency, jm.visibility, jm.relevance, jm.presentation,
             jm.marks AS total, jm.notes, jm.updated_at,
             COALESCE(NULLIF(r.projectTitle,''), r.leader) AS team_name,
             r.institution
      FROM judge_marks jm
      JOIN judges j ON j.id = jm.judge_id
      LEFT JOIN registrations r ON r.paymentID = jm.registration_id
      ORDER BY jm.registration_id, jm.updated_at
    `);

    res.json({ success: true, project: projectRows, wall_magazine: wallRows, judge_breakdown: breakdownRows });
  } catch (e) {
    res.status(500).json({ success: false, message: 'DB error: ' + e.message });
  }
});

/* ── POST /api/national-round/compute  (super_admin) ──────────────────
   Computes qualifiers using score thresholds (avg across all judges).
   gold ≥91, silver ≥81, bronze ≥71, honorable_mention 60–70.
   Pass { confirm: true } to persist; default is dry-run preview.
*/
router.post('/compute', authenticateAdmin, requireRole('super_admin'), async (req, res) => {
  const { confirm = false } = req.body;

  const thresholdPos = (avg) => {
    if (avg >= 91) return 'gold';
    if (avg >= 81) return 'silver';
    if (avg >= 71) return 'bronze';
    if (avg >= 60) return 'honorable_mention';
    return null;
  };

  try {
    const [projectRows] = await db.query(`
      SELECT r.paymentID AS registration_id,
             COALESCE(NULLIF(r.projectTitle,''), r.leader) AS team_name,
             r.leader AS leader_name, r.institution,
             r.projectSubcategory AS subcategory,
             CASE WHEN r.categories IN ('Primary School','Elementary') THEN 'Elementary' ELSE r.categories END AS education_category,
             r.projectTitle AS project_title, 'project' AS competition_type,
             ROUND(COALESCE(AVG(jm.marks), 0), 2) AS avg_marks,
             COUNT(DISTINCT jm.judge_id) AS judge_count
      FROM registrations r
      LEFT JOIN judge_marks jm ON jm.registration_id = r.paymentID AND jm.competition_type = 'project'
      WHERE r.competitionCategory != 'Megazine'
      GROUP BY r.paymentID
      HAVING judge_count > 0
      ORDER BY r.projectSubcategory, education_category, avg_marks DESC
    `);

    const [wallRows] = await db.query(`
      SELECT r.paymentID AS registration_id,
             COALESCE(NULLIF(r.projectTitle,''), r.leader) AS team_name,
             r.leader AS leader_name, r.institution,
             'Wall Magazine' AS subcategory,
             CASE WHEN r.categories IN ('Primary School','Elementary') THEN 'Elementary' ELSE r.categories END AS education_category,
             r.projectTitle AS project_title, 'wall_magazine' AS competition_type,
             ROUND(COALESCE(AVG(jm.marks), 0), 2) AS avg_marks,
             COUNT(DISTINCT jm.judge_id) AS judge_count
      FROM registrations r
      LEFT JOIN judge_marks jm ON jm.registration_id = r.paymentID AND jm.competition_type = 'wall_magazine'
      WHERE r.competitionCategory = 'Megazine'
      GROUP BY r.paymentID
      HAVING judge_count > 0
      ORDER BY avg_marks DESC
    `);

    const winners = [];
    [...projectRows, ...wallRows].forEach(row => {
      const pos = thresholdPos(parseFloat(row.avg_marks));
      if (pos) {
        winners.push({ ...row, position: pos });
      }
    });

    if (!confirm) {
      return res.json({ success: true, preview: true, winners });
    }

    // Clear non-manual selections and insert new
    await db.query('DELETE FROM national_round_selections WHERE is_manual = 0');
    for (const w of winners) {
      await db.query(`
        INSERT INTO national_round_selections
          (registration_id, competition_type, subcategory, education_category, position, total_marks, judge_count, is_manual, selected_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?)
        ON DUPLICATE KEY UPDATE
          position = VALUES(position),
          total_marks = VALUES(total_marks),
          judge_count = VALUES(judge_count),
          is_manual = 0,
          selected_by = VALUES(selected_by)
      `, [w.registration_id, w.competition_type, w.subcategory, w.education_category, w.position, w.avg_marks, w.judge_count, req.admin.id]);
    }

    res.json({ success: true, preview: false, winners, count: winners.length });
  } catch (e) {
    res.status(500).json({ success: false, message: 'DB error: ' + e.message });
  }
});

/* ── POST /api/national-round/honorable-mention  (super_admin) ─────────
   Manually add a team as honorable mention.
   Body: { registration_id }
*/
router.post('/honorable-mention', authenticateAdmin, requireRole('super_admin'), async (req, res) => {
  const { registration_id } = req.body;
  if (!registration_id)
    return res.status(400).json({ success: false, message: 'registration_id required' });

  try {
    // Look up the registration details
    const [[reg]] = await db.query(`
      SELECT paymentID, competitionCategory, projectSubcategory,
             CASE WHEN categories IN ('Primary School','Elementary') THEN 'Elementary' ELSE categories END AS education_category
      FROM registrations WHERE paymentID = ?
    `, [registration_id]);

    if (!reg) return res.status(404).json({ success: false, message: 'Registration not found' });

    const competition_type = reg.competitionCategory === 'Megazine' ? 'wall_magazine' : 'project';
    const subcategory = competition_type === 'wall_magazine' ? 'Wall Magazine' : (reg.projectSubcategory || '');

    await db.query(`
      INSERT INTO national_round_selections
        (registration_id, competition_type, subcategory, education_category, position, total_marks, judge_count, is_manual, selected_by)
      VALUES (?, ?, ?, ?, 'honorable_mention', 0, 0, 1, ?)
      ON DUPLICATE KEY UPDATE
        position = 'honorable_mention',
        total_marks = 0,
        is_manual = 1,
        selected_by = VALUES(selected_by)
    `, [registration_id, competition_type, subcategory, reg.education_category, req.admin.id]);

    res.json({ success: true, message: 'Added as honorable mention' });
  } catch (e) {
    res.status(500).json({ success: false, message: 'DB error: ' + e.message });
  }
});

/* ── DELETE /api/national-round/honorable-mention/:regId  (super_admin) ─
   Remove a manually-added honorable mention entry.
*/
router.delete('/honorable-mention/:regId', authenticateAdmin, requireRole('super_admin'), async (req, res) => {
  try {
    await db.query(
      'DELETE FROM national_round_selections WHERE registration_id = ? AND is_manual = 1',
      [req.params.regId]
    );
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, message: 'DB error' });
  }
});

/* ── DELETE /api/national-round/:id  (super_admin) ─────────────────── */
router.delete('/:id', authenticateAdmin, requireRole('super_admin'), async (req, res) => {
  try {
    await db.query('DELETE FROM national_round_selections WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, message: 'DB error' });
  }
});

/* ── DELETE /api/national-round  (super_admin) — clear all ─────────── */
router.delete('/', authenticateAdmin, requireRole('super_admin'), async (req, res) => {
  try {
    await db.query('DELETE FROM national_round_selections');
    res.json({ success: true, message: 'All national round selections cleared' });
  } catch (e) {
    res.status(500).json({ success: false, message: 'DB error' });
  }
});

/* ── GET /api/national-round/result/:paymentId  (public) ──────────────
   Used by participant dashboard to check their own result.
*/
router.get('/result/:paymentId', async (req, res) => {
  try {
    const [[row]] = await db.query(
      'SELECT position, total_marks, subcategory, education_category, is_manual FROM national_round_selections WHERE registration_id = ?',
      [req.params.paymentId]
    );
    if (!row) return res.json({ success: true, result: null });
    res.json({ success: true, result: row });
  } catch (e) {
    res.status(500).json({ success: false, message: 'DB error' });
  }
});

module.exports = router;
