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

// Export participants with parent/guardian info for leader and all members
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
        r.projectTitle,
        r.projectCategory,
        r.bkashTrxId,
        r.amount,
        r.ca_code,
        r.club_code,
        r.promo_code,
        r.created_at AS registeredAt,

        -- Leader (parent info from user_profiles via user_id)
        r.leader              AS leader_name,
        r.institution         AS leader_institution,
        r.leaderPhone         AS leader_phone,
        r.leaderEmail         AS leader_email,
        r.tshirtSizeLeader    AS leader_tshirt,
        lp.father_name        AS leader_father_name,
        lp.father_occupation  AS leader_father_occupation,
        lp.mother_name        AS leader_mother_name,
        lp.mother_occupation  AS leader_mother_occupation,
        lp.guardian_phone     AS leader_guardian_phone,
        lp.date_of_birth      AS leader_dob,
        lp.gender             AS leader_gender,
        lp.address            AS leader_address,

        -- Member 2 (parent info from team_member_profiles)
        r.member2             AS member2_name,
        r.institution2        AS member2_institution,
        r.tshirtSize2         AS member2_tshirt,
        mp2.father_name       AS member2_father_name,
        mp2.father_occupation AS member2_father_occupation,
        mp2.mother_name       AS member2_mother_name,
        mp2.mother_occupation AS member2_mother_occupation,
        mp2.guardian_phone    AS member2_guardian_phone,
        mp2.date_of_birth     AS member2_dob,
        mp2.gender            AS member2_gender,
        mp2.address           AS member2_address,

        -- Member 3
        r.member3             AS member3_name,
        r.institution3        AS member3_institution,
        r.tshirtSize3         AS member3_tshirt,
        mp3.father_name       AS member3_father_name,
        mp3.father_occupation AS member3_father_occupation,
        mp3.mother_name       AS member3_mother_name,
        mp3.mother_occupation AS member3_mother_occupation,
        mp3.guardian_phone    AS member3_guardian_phone,
        mp3.date_of_birth     AS member3_dob,
        mp3.gender            AS member3_gender,
        mp3.address           AS member3_address,

        -- Member 4
        r.member4             AS member4_name,
        r.institution4        AS member4_institution,
        r.tshirtSize4         AS member4_tshirt,
        mp4.father_name       AS member4_father_name,
        mp4.father_occupation AS member4_father_occupation,
        mp4.mother_name       AS member4_mother_name,
        mp4.mother_occupation AS member4_mother_occupation,
        mp4.guardian_phone    AS member4_guardian_phone,
        mp4.date_of_birth     AS member4_dob,
        mp4.gender            AS member4_gender,
        mp4.address           AS member4_address,

        -- Member 5
        r.member5             AS member5_name,
        r.institution5        AS member5_institution,
        r.tshirtSize5         AS member5_tshirt,
        mp5.father_name       AS member5_father_name,
        mp5.father_occupation AS member5_father_occupation,
        mp5.mother_name       AS member5_mother_name,
        mp5.mother_occupation AS member5_mother_occupation,
        mp5.guardian_phone    AS member5_guardian_phone,
        mp5.date_of_birth     AS member5_dob,
        mp5.gender            AS member5_gender,
        mp5.address           AS member5_address,

        -- Member 6
        r.member6             AS member6_name,
        r.institution6        AS member6_institution,
        r.tshirtSize6         AS member6_tshirt,
        mp6.father_name       AS member6_father_name,
        mp6.father_occupation AS member6_father_occupation,
        mp6.mother_name       AS member6_mother_name,
        mp6.mother_occupation AS member6_mother_occupation,
        mp6.guardian_phone    AS member6_guardian_phone,
        mp6.date_of_birth     AS member6_dob,
        mp6.gender            AS member6_gender,
        mp6.address           AS member6_address

      FROM registrations r

      -- Leader parent info: registrations → users → user_profiles
      LEFT JOIN users         lu  ON r.user_id = lu.id
      LEFT JOIN user_profiles lp  ON lu.id = lp.user_id

      -- Members 2-6 parent info: team_member_profiles (collected at ID card generation)
      LEFT JOIN team_member_profiles mp2 ON mp2.payment_id = r.paymentID AND mp2.member_slot = 2
      LEFT JOIN team_member_profiles mp3 ON mp3.payment_id = r.paymentID AND mp3.member_slot = 3
      LEFT JOIN team_member_profiles mp4 ON mp4.payment_id = r.paymentID AND mp4.member_slot = 4
      LEFT JOIN team_member_profiles mp5 ON mp5.payment_id = r.paymentID AND mp5.member_slot = 5
      LEFT JOIN team_member_profiles mp6 ON mp6.payment_id = r.paymentID AND mp6.member_slot = 6

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