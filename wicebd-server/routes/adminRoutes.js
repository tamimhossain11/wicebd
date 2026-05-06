const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateAdmin = require('../middleware/auth');

// Get all participants
router.get('/participants', authenticateAdmin, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        id,
        competitionCategory,
        projectSubcategory,
        categories,
        crReference,
        leader,
        institution,
        leaderPhone,
        leaderWhatsApp,
        leaderEmail,
        tshirtSizeLeader,
        member2,
        institution2,
        tshirtSize2,
        member3,
        institution3,
        tshirtSize3,
        member4,
        institution4,
        tshirtSize4,
        member5,
        institution5,
        tshirtSize5,
        member6,
        institution6,
        tshirtSize6,
        projectTitle,
        projectCategory,
        participatedBefore,
        previousCompetition,
        socialMedia,
        infoSource,
        ca_code,
        club_code,
        promo_code,
        bkashTrxId,
        amount,
        paymentID,
        created_at as createdAt
      FROM registrations
      ORDER BY created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Failed to fetch participants:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Export participants to CSV
router.get('/participants/export', authenticateAdmin, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM registrations');

    // Convert to CSV
    const csv = convertToCSV(rows);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=participants.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: 'Export failed' });
  }
});

// Export participants with parent/guardian info and user details
router.get('/participants/export-full', authenticateAdmin, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        r.id,
        r.paymentID,
        r.competitionCategory,
        r.projectSubcategory,
        r.categories,
        r.crReference,
        r.leader,
        r.institution,
        r.leaderPhone,
        r.leaderWhatsApp,
        r.leaderEmail,
        r.tshirtSizeLeader,
        r.member2,
        r.institution2,
        r.tshirtSize2,
        r.member3,
        r.institution3,
        r.tshirtSize3,
        r.member4,
        r.institution4,
        r.tshirtSize4,
        r.member5,
        r.institution5,
        r.tshirtSize5,
        r.member6,
        r.institution6,
        r.tshirtSize6,
        r.projectTitle,
        r.projectCategory,
        r.participatedBefore,
        r.previousCompetition,
        r.socialMedia,
        r.infoSource,
        r.ca_code,
        r.club_code,
        r.promo_code,
        r.bkashTrxId,
        r.amount,
        r.created_at AS registeredAt,
        u.name AS accountName,
        u.email AS accountEmail,
        u.provider AS loginProvider,
        up.father_name,
        up.father_occupation,
        up.mother_name,
        up.mother_occupation,
        up.guardian_phone,
        up.address,
        up.date_of_birth,
        up.gender,
        up.class_grade,
        up.profile_completed
      FROM registrations r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN user_profiles up ON u.id = up.user_id
      ORDER BY r.created_at DESC
    `);

    if (rows.length === 0) {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=participants_full.csv');
      return res.send('No data found');
    }

    const csv = convertToCSV(rows);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=participants_full.csv');
    res.send(csv);
  } catch (error) {
    console.error('Full export failed:', error);
    res.status(500).json({ error: 'Export failed' });
  }
});

// Get all registered users
router.get('/users', authenticateAdmin, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id, name, email, provider, is_verified, created_at
      FROM users
      ORDER BY created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Failed to fetch users:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

function convertToCSV(data) {
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(obj =>
    Object.values(obj).map(field =>
      `"${(field == null ? '' : String(field)).replace(/"/g, '""')}"`
    ).join(',')
  );
  return [headers, ...rows].join('\n');
}

module.exports = router;