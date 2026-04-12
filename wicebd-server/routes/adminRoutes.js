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
      `"${String(field).replace(/"/g, '""')}"`
    ).join(',')
  );
  return [headers, ...rows].join('\n');
}

module.exports = router;