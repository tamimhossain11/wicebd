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
      SELECT nrs.registration_id, nrs.competition_type, nrs.subcategory,
             nrs.education_category, nrs.position, nrs.total_marks, nrs.selected_at,
             r.leader AS team_name, r.institution, r.projectTitle AS project_title,
             r.projectSubcategory, r.categories
      FROM national_round_selections nrs
      LEFT JOIN registrations r ON r.paymentID = nrs.registration_id
      ORDER BY nrs.competition_type, nrs.subcategory, nrs.education_category,
               FIELD(nrs.position,'gold','silver','bronze')
    `);
    res.json({ success: true, selections: rows });
  } catch (e) {
    res.status(500).json({ success: false, message: 'DB error: ' + e.message });
  }
});

/* ── GET /api/national-round/marks-summary  (super_admin) ─────────────
   Returns aggregated marks per team (sum across all judges) grouped by
   subcategory and education category — used to preview before publishing.
*/
router.get('/marks-summary', authenticateAdmin, requireRole('super_admin'), async (req, res) => {
  try {
    const [projectRows] = await db.query(`
      SELECT r.paymentID AS registration_id, r.leader AS team_name, r.institution,
             r.projectSubcategory AS subcategory, r.categories AS education_category,
             r.projectTitle AS project_title, 'project' AS competition_type,
             COALESCE(SUM(jm.marks), 0) AS total_marks,
             COUNT(jm.id) AS judge_count
      FROM registrations r
      LEFT JOIN judge_marks jm ON jm.registration_id = r.paymentID AND jm.competition_type = 'project'
      WHERE r.competitionCategory = 'Project'
      GROUP BY r.paymentID
      ORDER BY r.projectSubcategory, r.categories, total_marks DESC
    `);

    const [wallRows] = await db.query(`
      SELECT r.paymentID AS registration_id, r.leader AS team_name, r.institution,
             'Wall Magazine' AS subcategory, r.categories AS education_category,
             r.projectTitle AS project_title, 'wall_magazine' AS competition_type,
             COALESCE(SUM(jm.marks), 0) AS total_marks,
             COUNT(jm.id) AS judge_count
      FROM registrations r
      LEFT JOIN judge_marks jm ON jm.registration_id = r.paymentID AND jm.competition_type = 'wall_magazine'
      WHERE r.competitionCategory = 'Megazine'
      GROUP BY r.paymentID
      ORDER BY r.categories, total_marks DESC
    `);

    res.json({ success: true, project: projectRows, wall_magazine: wallRows });
  } catch (e) {
    res.status(500).json({ success: false, message: 'DB error: ' + e.message });
  }
});

/* ── POST /api/national-round/compute  (super_admin) ──────────────────
   Computes top-3 per (subcategory, education_category) group from judge
   marks and writes them to national_round_selections.
   Pass { confirm: true } to persist; default is dry-run preview.
*/
router.post('/compute', authenticateAdmin, requireRole('super_admin'), async (req, res) => {
  const { confirm = false } = req.body;
  try {
    const [projectRows] = await db.query(`
      SELECT r.paymentID AS registration_id, r.leader AS team_name, r.institution,
             r.projectSubcategory AS subcategory, r.categories AS education_category,
             r.projectTitle AS project_title, 'project' AS competition_type,
             COALESCE(SUM(jm.marks), 0) AS total_marks
      FROM registrations r
      LEFT JOIN judge_marks jm ON jm.registration_id = r.paymentID AND jm.competition_type = 'project'
      WHERE r.competitionCategory = 'Project'
      GROUP BY r.paymentID
      ORDER BY r.projectSubcategory, r.categories, total_marks DESC
    `);

    const [wallRows] = await db.query(`
      SELECT r.paymentID AS registration_id, r.leader AS team_name, r.institution,
             'Wall Magazine' AS subcategory, r.categories AS education_category,
             r.projectTitle AS project_title, 'wall_magazine' AS competition_type,
             COALESCE(SUM(jm.marks), 0) AS total_marks
      FROM registrations r
      LEFT JOIN judge_marks jm ON jm.registration_id = r.paymentID AND jm.competition_type = 'wall_magazine'
      WHERE r.competitionCategory = 'Megazine'
      GROUP BY r.paymentID
      ORDER BY r.categories, total_marks DESC
    `);

    const POSITIONS = ['gold', 'silver', 'bronze'];
    const winners = [];

    const pickTop3 = (rows) => {
      const groups = {};
      rows.forEach(row => {
        const key = `${row.subcategory}||${row.education_category}`;
        if (!groups[key]) groups[key] = [];
        groups[key].push(row);
      });
      Object.values(groups).forEach(group => {
        group.slice(0, 3).forEach((team, idx) => {
          winners.push({ ...team, position: POSITIONS[idx] });
        });
      });
    };

    pickTop3(projectRows);
    pickTop3(wallRows);

    if (!confirm) {
      return res.json({ success: true, preview: true, winners });
    }

    // Clear old selections and insert new
    await db.query('DELETE FROM national_round_selections');
    for (const w of winners) {
      await db.query(`
        INSERT INTO national_round_selections
          (registration_id, competition_type, subcategory, education_category, position, total_marks, selected_by)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [w.registration_id, w.competition_type, w.subcategory, w.education_category, w.position, w.total_marks, req.admin.id]);
    }

    res.json({ success: true, preview: false, winners, count: winners.length });
  } catch (e) {
    res.status(500).json({ success: false, message: 'DB error: ' + e.message });
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
      'SELECT position, total_marks, subcategory, education_category FROM national_round_selections WHERE registration_id = ?',
      [req.params.paymentId]
    );
    if (!row) return res.json({ success: true, result: null });
    res.json({ success: true, result: row });
  } catch (e) {
    res.status(500).json({ success: false, message: 'DB error' });
  }
});

module.exports = router;
