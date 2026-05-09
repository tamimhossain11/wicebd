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

// Export wall magazine registrations with parent/guardian info
router.get('/wall-magazine/export', authenticateAdmin, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        r.id,
        r.paymentID,
        r.categories        AS edu_level,
        r.projectTitle      AS magazine_title,
        r.bkashTrxId,
        r.amount,
        r.ca_code,
        r.club_code,
        r.promo_code,
        r.created_at        AS registeredAt,

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

        -- Member 2
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
        mp5.address           AS member5_address

      FROM registrations r

      -- Leader parent info: registrations → users → user_profiles
      LEFT JOIN users         lu  ON r.user_id = lu.id
      LEFT JOIN user_profiles lp  ON lu.id = lp.user_id

      -- Members 2-5 parent info: team_member_profiles (collected at ID card generation)
      LEFT JOIN team_member_profiles mp2 ON mp2.payment_id = r.paymentID AND mp2.member_slot = 2
      LEFT JOIN team_member_profiles mp3 ON mp3.payment_id = r.paymentID AND mp3.member_slot = 3
      LEFT JOIN team_member_profiles mp4 ON mp4.payment_id = r.paymentID AND mp4.member_slot = 4
      LEFT JOIN team_member_profiles mp5 ON mp5.payment_id = r.paymentID AND mp5.member_slot = 5

      WHERE r.competitionCategory = 'Megazine'
      ORDER BY r.created_at DESC
    `);

    if (rows.length === 0) {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=wall_magazine.csv');
      return res.send('No data found');
    }

    const csv = convertToCSV(rows);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=wall_magazine.csv');
    res.send(csv);
  } catch (error) {
    console.error('Wall magazine export failed:', error);
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

// Print-friendly HTML view of project participants (optional ?subcategory= filter)
router.get('/participants/print', authenticateAdmin, async (req, res) => {
  try {
    const subcat = req.query.subcategory || null;
    const [rows] = await db.query(`
      SELECT
        r.id,
        r.competitionCategory,
        r.projectSubcategory,
        r.categories,
        r.projectTitle,
        r.projectCategory,
        r.crReference,
        r.leader,        r.institution,     r.leaderPhone, r.leaderEmail, r.tshirtSizeLeader,
        r.member2,       r.institution2,    r.tshirtSize2,
        r.member3,       r.institution3,    r.tshirtSize3,
        r.member4,       r.institution4,    r.tshirtSize4,
        r.member5,       r.institution5,    r.tshirtSize5,
        r.member6,       r.institution6,    r.tshirtSize6,
        r.bkashTrxId,    r.amount,          r.paymentID,
        r.ca_code,       r.club_code,       r.promo_code,
        r.participatedBefore, r.infoSource,
        r.created_at
      FROM registrations r
      WHERE r.competitionCategory != 'Megazine'
        ${subcat ? 'AND r.projectSubcategory = ?' : ''}
      ORDER BY r.projectSubcategory ASC, r.created_at ASC
    `, subcat ? [subcat] : []);

    const esc = v => (v == null ? '—' : String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'));

    const memberRows = (r) => {
      const members = [
        { n: 1, name: r.leader,  inst: r.institution,  size: r.tshirtSizeLeader, role: 'Leader' },
        { n: 2, name: r.member2, inst: r.institution2, size: r.tshirtSize2,       role: 'Member 2' },
        { n: 3, name: r.member3, inst: r.institution3, size: r.tshirtSize3,       role: 'Member 3' },
        { n: 4, name: r.member4, inst: r.institution4, size: r.tshirtSize4,       role: 'Member 4' },
        { n: 5, name: r.member5, inst: r.institution5, size: r.tshirtSize5,       role: 'Member 5' },
        { n: 6, name: r.member6, inst: r.institution6, size: r.tshirtSize6,       role: 'Member 6' },
      ].filter(m => m.name);
      return members.map(m => `
        <tr class="member-row">
          <td>${esc(m.role)}</td>
          <td>${esc(m.name)}</td>
          <td>${esc(m.inst)}</td>
          <td>${esc(m.size)}</td>
        </tr>`).join('');
    };

    const cards = rows.map((r, i) => `
      <div class="card">
        <div class="card-header">
          <span class="serial">#${i + 1}</span>
          <span class="project-title">${esc(r.projectTitle)}</span>
          <span class="badge">${esc(r.competitionCategory)} · ${esc(r.projectSubcategory || r.categories || '')}</span>
        </div>
        <div class="meta-row">
          <span><b>Invoice:</b> ${esc(r.paymentID)}</span>
          <span><b>Txn:</b> ${esc(r.bkashTrxId)}</span>
          <span><b>Amount:</b> ৳${esc(r.amount)}</span>
          <span><b>Category:</b> ${esc(r.projectCategory)}</span>
          ${r.ca_code   ? `<span><b>CA:</b> ${esc(r.ca_code)}</span>` : ''}
          ${r.club_code ? `<span><b>Club:</b> ${esc(r.club_code)}</span>` : ''}
          ${r.crReference ? `<span><b>CR Ref:</b> ${esc(r.crReference)}</span>` : ''}
          <span><b>Registered:</b> ${new Date(r.created_at).toLocaleDateString('en-GB')}</span>
        </div>
        <table class="member-table">
          <thead>
            <tr><th>Role</th><th>Name</th><th>Institution</th><th>T-Shirt</th></tr>
          </thead>
          <tbody>
            ${memberRows(r)}
          </tbody>
        </table>
        <div class="contact-row">
          <span><b>Phone:</b> ${esc(r.leaderPhone)}</span>
          <span><b>WhatsApp:</b> ${esc(r.leaderWhatsApp)}</span>
          <span><b>Email:</b> ${esc(r.leaderEmail)}</span>
        </div>
      </div>`).join('');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>WICEBD 2026 — Project Participants${subcat ? ` · ${subcat}` : ''} (${rows.length})</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; font-size: 11px; color: #111; background: #fff; padding: 16px; }
    h1 { font-size: 16px; text-align: center; margin-bottom: 4px; }
    .subtitle { text-align: center; font-size: 11px; color: #555; margin-bottom: 16px; }
    .card { border: 1px solid #bbb; border-radius: 4px; margin-bottom: 12px; padding: 10px 12px; page-break-inside: avoid; }
    .card-header { display: flex; align-items: baseline; gap: 10px; margin-bottom: 6px; flex-wrap: wrap; }
    .serial { font-weight: 700; font-size: 13px; color: #800020; min-width: 28px; }
    .project-title { font-weight: 700; font-size: 13px; flex: 1; }
    .badge { font-size: 10px; background: #f0e0e4; color: #800020; padding: 2px 8px; border-radius: 20px; white-space: nowrap; }
    .meta-row { display: flex; flex-wrap: wrap; gap: 6px 18px; font-size: 10px; color: #444; margin-bottom: 8px; }
    .member-table { width: 100%; border-collapse: collapse; margin-bottom: 6px; }
    .member-table th { background: #800020; color: #fff; font-size: 10px; padding: 3px 6px; text-align: left; }
    .member-table td { padding: 3px 6px; border-bottom: 1px solid #eee; font-size: 11px; }
    .member-row:nth-child(even) td { background: #faf6f7; }
    .contact-row { display: flex; flex-wrap: wrap; gap: 6px 18px; font-size: 10px; color: #444; margin-top: 4px; }
    .no-print { text-align: center; margin-bottom: 16px; }
    .print-btn { padding: 8px 24px; background: #800020; color: #fff; border: none; border-radius: 4px; font-size: 13px; cursor: pointer; }
    @media print {
      .no-print { display: none; }
      body { padding: 0; }
      .card { margin-bottom: 8px; }
    }
  </style>
</head>
<body>
  <div class="no-print">
    <button class="print-btn" onclick="window.print()">🖨️ Print</button>
  </div>
  <h1>WICEBD 2026 — Project Participants${subcat ? ` · ${subcat}` : ''}</h1>
  <p class="subtitle">Total: ${rows.length} registrations &nbsp;·&nbsp; Generated: ${new Date().toLocaleString('en-GB')}</p>
  ${cards}
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (error) {
    console.error('Print view failed:', error);
    res.status(500).json({ error: 'Failed to generate print view' });
  }
});

// Print-friendly HTML view of wall magazine participants
router.get('/wall-magazine/print', authenticateAdmin, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        r.id,
        r.projectTitle,
        r.crReference,
        r.leader,        r.institution,     r.leaderPhone, r.leaderEmail, r.tshirtSizeLeader,
        r.member2,       r.institution2,    r.tshirtSize2,
        r.member3,       r.institution3,    r.tshirtSize3,
        r.member4,       r.institution4,    r.tshirtSize4,
        r.member5,       r.institution5,    r.tshirtSize5,
        r.bkashTrxId,    r.amount,          r.paymentID,
        r.ca_code,       r.club_code,       r.promo_code,
        r.created_at
      FROM registrations r
      WHERE r.competitionCategory = 'Megazine'
      ORDER BY r.created_at ASC
    `);

    const esc = v => (v == null ? '—' : String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'));

    const memberRows = (r) => {
      const members = [
        { name: r.leader,  inst: r.institution,  size: r.tshirtSizeLeader, role: 'Leader'   },
        { name: r.member2, inst: r.institution2, size: r.tshirtSize2,       role: 'Member 2' },
        { name: r.member3, inst: r.institution3, size: r.tshirtSize3,       role: 'Member 3' },
        { name: r.member4, inst: r.institution4, size: r.tshirtSize4,       role: 'Member 4' },
        { name: r.member5, inst: r.institution5, size: r.tshirtSize5,       role: 'Member 5' },
      ].filter(m => m.name);
      return members.map(m => `
        <tr class="member-row">
          <td>${esc(m.role)}</td>
          <td>${esc(m.name)}</td>
          <td>${esc(m.inst)}</td>
          <td>${esc(m.size)}</td>
        </tr>`).join('');
    };

    const cards = rows.map((r, i) => `
      <div class="card">
        <div class="card-header">
          <span class="serial">#${i + 1}</span>
          <span class="project-title">${esc(r.projectTitle)}</span>
          <span class="badge">Wall Magazine</span>
        </div>
        <div class="meta-row">
          <span><b>Invoice:</b> ${esc(r.paymentID)}</span>
          <span><b>Txn:</b> ${esc(r.bkashTrxId)}</span>
          <span><b>Amount:</b> ৳${esc(r.amount)}</span>
          ${r.ca_code    ? `<span><b>CA:</b> ${esc(r.ca_code)}</span>` : ''}
          ${r.club_code  ? `<span><b>Club:</b> ${esc(r.club_code)}</span>` : ''}
          ${r.crReference ? `<span><b>CR Ref:</b> ${esc(r.crReference)}</span>` : ''}
          <span><b>Registered:</b> ${new Date(r.created_at).toLocaleDateString('en-GB')}</span>
        </div>
        <table class="member-table">
          <thead>
            <tr><th>Role</th><th>Name</th><th>Institution</th><th>T-Shirt</th></tr>
          </thead>
          <tbody>
            ${memberRows(r)}
          </tbody>
        </table>
        <div class="contact-row">
          <span><b>Phone:</b> ${esc(r.leaderPhone)}</span>
          <span><b>Email:</b> ${esc(r.leaderEmail)}</span>
        </div>
      </div>`).join('');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>WICEBD 2026 — Wall Magazine Participants (${rows.length})</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; font-size: 11px; color: #111; background: #fff; padding: 16px; }
    h1 { font-size: 16px; text-align: center; margin-bottom: 4px; }
    .subtitle { text-align: center; font-size: 11px; color: #555; margin-bottom: 16px; }
    .card { border: 1px solid #bbb; border-radius: 4px; margin-bottom: 12px; padding: 10px 12px; page-break-inside: avoid; }
    .card-header { display: flex; align-items: baseline; gap: 10px; margin-bottom: 6px; flex-wrap: wrap; }
    .serial { font-weight: 700; font-size: 13px; color: #1a6632; min-width: 28px; }
    .project-title { font-weight: 700; font-size: 13px; flex: 1; }
    .badge { font-size: 10px; background: #e0f0e4; color: #1a6632; padding: 2px 8px; border-radius: 20px; white-space: nowrap; }
    .meta-row { display: flex; flex-wrap: wrap; gap: 6px 18px; font-size: 10px; color: #444; margin-bottom: 8px; }
    .member-table { width: 100%; border-collapse: collapse; margin-bottom: 6px; }
    .member-table th { background: #1a6632; color: #fff; font-size: 10px; padding: 3px 6px; text-align: left; }
    .member-table td { padding: 3px 6px; border-bottom: 1px solid #eee; font-size: 11px; }
    .member-row:nth-child(even) td { background: #f4faf6; }
    .contact-row { display: flex; flex-wrap: wrap; gap: 6px 18px; font-size: 10px; color: #444; margin-top: 4px; }
    .no-print { text-align: center; margin-bottom: 16px; }
    .print-btn { padding: 8px 24px; background: #1a6632; color: #fff; border: none; border-radius: 4px; font-size: 13px; cursor: pointer; }
    @media print {
      .no-print { display: none; }
      body { padding: 0; }
      .card { margin-bottom: 8px; }
    }
  </style>
</head>
<body>
  <div class="no-print">
    <button class="print-btn" onclick="window.print()">🖨️ Print</button>
  </div>
  <h1>WICEBD 2026 — Wall Magazine Participants</h1>
  <p class="subtitle">Total: ${rows.length} registrations &nbsp;·&nbsp; Generated: ${new Date().toLocaleString('en-GB')}</p>
  ${cards}
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (error) {
    console.error('Wall magazine print view failed:', error);
    res.status(500).json({ error: 'Failed to generate print view' });
  }
});

// Print-friendly HTML view of olympiad participants
router.get('/olympiad/print', authenticateAdmin, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        id, registration_id, full_name, email, phone,
        institution, class_grade, district, address,
        cr_reference, ca_code, club_code, status, created_at
      FROM olympiad_registrations
      ORDER BY created_at ASC
    `);

    const esc = v => (v == null ? '—' : String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'));

    const cards = rows.map((r, i) => `
      <div class="card">
        <div class="card-header">
          <span class="serial">#${i + 1}</span>
          <span class="participant-name">${esc(r.full_name)}</span>
          <span class="badge">Science Olympiad</span>
        </div>
        <div class="info-grid">
          <div class="info-item"><span class="label">Reg ID</span><span class="value">${esc(r.registration_id)}</span></div>
          <div class="info-item"><span class="label">Institution</span><span class="value">${esc(r.institution)}</span></div>
          <div class="info-item"><span class="label">Class/Grade</span><span class="value">${esc(r.class_grade)}</span></div>
          <div class="info-item"><span class="label">District</span><span class="value">${esc(r.district)}</span></div>
          <div class="info-item"><span class="label">Phone</span><span class="value">${esc(r.phone)}</span></div>
          <div class="info-item"><span class="label">Email</span><span class="value">${esc(r.email)}</span></div>
          ${r.cr_reference ? `<div class="info-item"><span class="label">CR Ref</span><span class="value">${esc(r.cr_reference)}</span></div>` : ''}
          ${r.ca_code ? `<div class="info-item"><span class="label">CA Code</span><span class="value">${esc(r.ca_code)}</span></div>` : ''}
          ${r.club_code ? `<div class="info-item"><span class="label">Club</span><span class="value">${esc(r.club_code)}</span></div>` : ''}
          <div class="info-item"><span class="label">Status</span><span class="value status-${esc(r.status)}">${esc(r.status)}</span></div>
          <div class="info-item"><span class="label">Registered</span><span class="value">${new Date(r.created_at).toLocaleDateString('en-GB')}</span></div>
        </div>
        ${r.address ? `<div class="address-row"><b>Address:</b> ${esc(r.address)}</div>` : ''}
      </div>`).join('');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>WICEBD 2026 — Science Olympiad Participants (${rows.length})</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; font-size: 11px; color: #111; background: #fff; padding: 16px; }
    h1 { font-size: 16px; text-align: center; margin-bottom: 4px; }
    .subtitle { text-align: center; font-size: 11px; color: #555; margin-bottom: 16px; }
    .card { border: 1px solid #bbb; border-radius: 4px; margin-bottom: 12px; padding: 10px 12px; page-break-inside: avoid; }
    .card-header { display: flex; align-items: baseline; gap: 10px; margin-bottom: 8px; flex-wrap: wrap; }
    .serial { font-weight: 700; font-size: 13px; color: #1565c0; min-width: 28px; }
    .participant-name { font-weight: 700; font-size: 14px; flex: 1; }
    .badge { font-size: 10px; background: #e3eaf7; color: #1565c0; padding: 2px 8px; border-radius: 20px; white-space: nowrap; }
    .info-grid { display: flex; flex-wrap: wrap; gap: 4px 0; }
    .info-item { width: 33.33%; display: flex; gap: 4px; font-size: 10px; padding: 2px 0; }
    .label { color: #777; min-width: 64px; font-weight: 600; }
    .value { color: #111; }
    .status-confirmed { color: #1a6632; font-weight: 700; }
    .status-pending { color: #b45309; font-weight: 700; }
    .address-row { font-size: 10px; color: #555; margin-top: 6px; }
    .no-print { text-align: center; margin-bottom: 16px; }
    .print-btn { padding: 8px 24px; background: #1565c0; color: #fff; border: none; border-radius: 4px; font-size: 13px; cursor: pointer; }
    @media print {
      .no-print { display: none; }
      body { padding: 0; }
      .card { margin-bottom: 8px; }
    }
  </style>
</head>
<body>
  <div class="no-print">
    <button class="print-btn" onclick="window.print()">🖨️ Print</button>
  </div>
  <h1>WICEBD 2026 — Science Olympiad Participants</h1>
  <p class="subtitle">Total: ${rows.length} registrations &nbsp;·&nbsp; Generated: ${new Date().toLocaleString('en-GB')}</p>
  ${cards}
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (error) {
    console.error('Olympiad print view failed:', error);
    res.status(500).json({ error: 'Failed to generate print view' });
  }
});

// Print-friendly HTML credential sheet for all judges
router.get('/judges/print', authenticateAdmin, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT name, username, judge_type, subcategory, education_level, display_password, is_active
      FROM judges
      ORDER BY subcategory, education_level, name
    `);

    const esc = v => (v == null ? '—' : String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'));

    // Group by subcategory → education_level
    const grouped = {};
    for (const j of rows) {
      const cat = j.subcategory || (j.judge_type === 'wall_magazine' ? 'Wall Magazine' : 'Unassigned');
      const lvl = j.education_level || 'All Category';
      if (!grouped[cat]) grouped[cat] = {};
      if (!grouped[cat][lvl]) grouped[cat][lvl] = [];
      grouped[cat][lvl].push(j);
    }

    const categoryColors = {
      'IT and Robotics':                '#1565c0',
      'Environmental Science':          '#1a6632',
      'Innovative Social Science':      '#6a1b9a',
      'Applied Physics and Engineering':'#b45309',
      'Applied Life Science':           '#00695c',
    };

    const sections = Object.entries(grouped).map(([cat, levels]) => {
      const color = categoryColors[cat] || '#444';
      const levelBlocks = Object.entries(levels).map(([lvl, judges]) => `
        <div class="level-block">
          <div class="level-label">${esc(lvl)}</div>
          <table class="judge-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Username</th>
                <th>Password</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${judges.map((j, i) => `
              <tr>
                <td class="seq">${i + 1}</td>
                <td class="judge-name">${esc(j.name)}</td>
                <td class="username">${esc(j.username)}</td>
                <td class="password">${esc(j.display_password)}</td>
                <td class="${j.is_active ? 'active' : 'inactive'}">${j.is_active ? 'Active' : 'Inactive'}</td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>`).join('');

      return `
      <div class="category-section" style="--cat-color:${color}">
        <div class="category-header">${esc(cat)}</div>
        ${levelBlocks}
      </div>`;
    }).join('');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>WICEBD 2026 — Judge Credentials (${rows.length})</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; font-size: 11px; color: #111; background: #fff; padding: 16px; }
    h1 { font-size: 17px; text-align: center; margin-bottom: 3px; }
    .subtitle { text-align: center; font-size: 11px; color: #555; margin-bottom: 20px; }
    .category-section { margin-bottom: 20px; page-break-inside: avoid; }
    .category-header {
      background: var(--cat-color); color: #fff;
      padding: 7px 14px; font-size: 13px; font-weight: 700;
      border-radius: 4px 4px 0 0; letter-spacing: 0.02em;
    }
    .level-block { border: 1px solid #ddd; border-top: none; }
    .level-label {
      background: #f5f5f5; color: #444;
      font-size: 10px; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.08em; padding: 4px 14px;
      border-bottom: 1px solid #ddd;
    }
    .judge-table { width: 100%; border-collapse: collapse; }
    .judge-table th {
      background: rgba(0,0,0,0.04); color: #555;
      font-size: 10px; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.06em; padding: 5px 10px; text-align: left;
      border-bottom: 1px solid #ddd;
    }
    .judge-table td { padding: 6px 10px; border-bottom: 1px solid #f0f0f0; vertical-align: middle; }
    .judge-table tr:last-child td { border-bottom: none; }
    .judge-table tr:nth-child(even) td { background: #fafafa; }
    .seq { color: #999; font-size: 10px; width: 28px; }
    .judge-name { font-weight: 700; font-size: 12px; }
    .username { font-family: monospace; font-size: 11px; color: #1565c0; }
    .password { font-family: monospace; font-size: 11px; color: #c62828; font-weight: 700; }
    .active { color: #1a6632; font-weight: 700; font-size: 10px; }
    .inactive { color: #b45309; font-weight: 700; font-size: 10px; }
    .no-print { text-align: center; margin-bottom: 16px; }
    .print-btn { padding: 8px 24px; background: #37474f; color: #fff; border: none; border-radius: 4px; font-size: 13px; cursor: pointer; }
    .warning { background: #fff8e1; border: 1px solid #f9a825; border-radius: 4px; padding: 8px 14px; font-size: 11px; color: #7a5800; margin-bottom: 16px; text-align: center; }
    @media print {
      .no-print { display: none; }
      body { padding: 4px; }
      .category-section { margin-bottom: 14px; }
    }
  </style>
</head>
<body>
  <div class="no-print">
    <button class="print-btn" onclick="window.print()">🖨️ Print</button>
  </div>
  <h1>WICEBD 2026 — Judge Credentials &amp; Category Assignments</h1>
  <p class="subtitle">Total Judges: ${rows.length} &nbsp;·&nbsp; Generated: ${new Date().toLocaleString('en-GB')}</p>
  <p class="warning no-print">⚠️ Confidential — contains login credentials. Do not share publicly.</p>
  ${sections}
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (error) {
    console.error('Judges print view failed:', error);
    res.status(500).json({ error: 'Failed to generate print view' });
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