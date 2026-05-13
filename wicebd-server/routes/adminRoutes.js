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

// Print-friendly HTML view of project participants with parent info (optional ?subcategory= filter)
router.get('/participants/print', authenticateAdmin, async (req, res) => {
  try {
    const subcat = req.query.subcategory || null;
    const [rows] = await db.query(`
      SELECT
        r.id, r.competitionCategory, r.projectSubcategory, r.categories,
        r.projectTitle, r.projectCategory, r.crReference,
        r.bkashTrxId, r.amount, r.paymentID,
        r.ca_code, r.club_code, r.promo_code,
        r.participatedBefore, r.infoSource, r.created_at,

        r.leader,   r.institution,   r.leaderPhone, r.leaderWhatsApp, r.leaderEmail, r.tshirtSizeLeader,
        lp.father_name        AS l_father_name,
        lp.father_occupation  AS l_father_occ,
        lp.mother_name        AS l_mother_name,
        lp.mother_occupation  AS l_mother_occ,
        lp.guardian_phone     AS l_guardian_phone,
        lp.date_of_birth      AS l_dob,
        lp.gender             AS l_gender,
        lp.address            AS l_address,

        r.member2, r.institution2, r.tshirtSize2,
        mp2.father_name       AS m2_father_name,
        mp2.father_occupation AS m2_father_occ,
        mp2.mother_name       AS m2_mother_name,
        mp2.mother_occupation AS m2_mother_occ,
        mp2.guardian_phone    AS m2_guardian_phone,
        mp2.date_of_birth     AS m2_dob,
        mp2.gender            AS m2_gender,
        mp2.address           AS m2_address,

        r.member3, r.institution3, r.tshirtSize3,
        mp3.father_name       AS m3_father_name,
        mp3.father_occupation AS m3_father_occ,
        mp3.mother_name       AS m3_mother_name,
        mp3.mother_occupation AS m3_mother_occ,
        mp3.guardian_phone    AS m3_guardian_phone,
        mp3.date_of_birth     AS m3_dob,
        mp3.gender            AS m3_gender,
        mp3.address           AS m3_address,

        r.member4, r.institution4, r.tshirtSize4,
        mp4.father_name       AS m4_father_name,
        mp4.father_occupation AS m4_father_occ,
        mp4.mother_name       AS m4_mother_name,
        mp4.mother_occupation AS m4_mother_occ,
        mp4.guardian_phone    AS m4_guardian_phone,
        mp4.date_of_birth     AS m4_dob,
        mp4.gender            AS m4_gender,
        mp4.address           AS m4_address,

        r.member5, r.institution5, r.tshirtSize5,
        mp5.father_name       AS m5_father_name,
        mp5.father_occupation AS m5_father_occ,
        mp5.mother_name       AS m5_mother_name,
        mp5.mother_occupation AS m5_mother_occ,
        mp5.guardian_phone    AS m5_guardian_phone,
        mp5.date_of_birth     AS m5_dob,
        mp5.gender            AS m5_gender,
        mp5.address           AS m5_address,

        r.member6, r.institution6, r.tshirtSize6,
        mp6.father_name       AS m6_father_name,
        mp6.father_occupation AS m6_father_occ,
        mp6.mother_name       AS m6_mother_name,
        mp6.mother_occupation AS m6_mother_occ,
        mp6.guardian_phone    AS m6_guardian_phone,
        mp6.date_of_birth     AS m6_dob,
        mp6.gender            AS m6_gender,
        mp6.address           AS m6_address

      FROM registrations r
      LEFT JOIN users               lu  ON r.user_id = lu.id
      LEFT JOIN user_profiles       lp  ON lu.id = lp.user_id
      LEFT JOIN team_member_profiles mp2 ON mp2.payment_id = r.paymentID AND mp2.member_slot = 2
      LEFT JOIN team_member_profiles mp3 ON mp3.payment_id = r.paymentID AND mp3.member_slot = 3
      LEFT JOIN team_member_profiles mp4 ON mp4.payment_id = r.paymentID AND mp4.member_slot = 4
      LEFT JOIN team_member_profiles mp5 ON mp5.payment_id = r.paymentID AND mp5.member_slot = 5
      LEFT JOIN team_member_profiles mp6 ON mp6.payment_id = r.paymentID AND mp6.member_slot = 6

      WHERE r.competitionCategory != 'Megazine'
        ${subcat ? 'AND r.projectSubcategory = ?' : ''}
      ORDER BY r.projectSubcategory ASC, r.created_at ASC
    `, subcat ? [subcat] : []);

    // Fetch all judge marks for project registrations
    const [markRows] = await db.query(`
      SELECT jm.registration_id, jm.urgency, jm.visibility, jm.relevance, jm.presentation, jm.marks,
             j.name AS judge_name
      FROM judge_marks jm
      JOIN judges j ON j.id = jm.judge_id
      WHERE jm.competition_type = 'project'
      ORDER BY jm.registration_id, j.name
    `);
    const marksMap = {};
    markRows.forEach(m => {
      if (!marksMap[m.registration_id]) marksMap[m.registration_id] = [];
      marksMap[m.registration_id].push(m);
    });

    const esc = v => (v == null ? '' : String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'));
    const val = v => esc(v) || '—';

    const parentBlock = (prefix, r) => {
      const fatherName = r[`${prefix}_father_name`];
      const motherName = r[`${prefix}_mother_name`];
      const dob        = r[`${prefix}_dob`];
      const gender     = r[`${prefix}_gender`];
      const phone      = r[`${prefix}_guardian_phone`];
      const address    = r[`${prefix}_address`];
      if (!fatherName && !motherName && !phone && !address) return '';
      const dobStr = dob ? new Date(dob).toLocaleDateString('en-GB') : '—';
      return `<div class="parent-block">
        <div class="parent-row">
          ${fatherName ? `<span><b>Father:</b> ${esc(fatherName)}${r[`${prefix}_father_occ`] ? ` <em>(${esc(r[`${prefix}_father_occ`])})</em>` : ''}</span>` : ''}
          ${motherName ? `<span><b>Mother:</b> ${esc(motherName)}${r[`${prefix}_mother_occ`] ? ` <em>(${esc(r[`${prefix}_mother_occ`])})</em>` : ''}</span>` : ''}
          ${phone ? `<span><b>Guardian Phone:</b> ${esc(phone)}</span>` : ''}
          ${gender ? `<span><b>Gender:</b> ${esc(gender)}</span>` : ''}
          ${dob ? `<span><b>DOB:</b> ${dobStr}</span>` : ''}
        </div>
        ${address ? `<div class="parent-address"><b>Address:</b> ${esc(address)}</div>` : ''}
      </div>`;
    };

    const memberSection = (r) => {
      const members = [
        { name: r.leader,  inst: r.institution,  size: r.tshirtSizeLeader, role: 'Leader',   prefix: 'l'  },
        { name: r.member2, inst: r.institution2, size: r.tshirtSize2,       role: 'Member 2', prefix: 'm2' },
        { name: r.member3, inst: r.institution3, size: r.tshirtSize3,       role: 'Member 3', prefix: 'm3' },
        { name: r.member4, inst: r.institution4, size: r.tshirtSize4,       role: 'Member 4', prefix: 'm4' },
        { name: r.member5, inst: r.institution5, size: r.tshirtSize5,       role: 'Member 5', prefix: 'm5' },
        { name: r.member6, inst: r.institution6, size: r.tshirtSize6,       role: 'Member 6', prefix: 'm6' },
      ].filter(m => m.name);

      return members.map(m => `
        <div class="member-block">
          <div class="member-header">
            <span class="member-role">${esc(m.role)}</span>
            <span class="member-name">${esc(m.name)}</span>
            <span class="member-inst">${esc(m.inst)}</span>
            ${m.size ? `<span class="member-tshirt">T-Shirt: ${esc(m.size)}</span>` : ''}
          </div>
          ${parentBlock(m.prefix, r)}
        </div>`).join('');
    };

    const marksSection = (paymentID) => {
      const entries = marksMap[paymentID] || [];
      if (entries.length === 0) return `<div class="marks-none">No marks recorded yet</div>`;
      const total = entries.reduce((s, e) => s + (e.marks || 0), 0);
      const avg   = (total / entries.length).toFixed(1);
      const trs = entries.map(e => `
        <tr>
          <td class="judge-name-cell">${esc(e.judge_name)}</td>
          <td class="score-cell">${e.urgency  ?? '—'}</td>
          <td class="score-cell">${e.visibility ?? '—'}</td>
          <td class="score-cell">${e.relevance ?? '—'}</td>
          <td class="score-cell">${e.presentation ?? '—'}</td>
          <td class="total-cell">${e.marks ?? '—'}</td>
        </tr>`).join('');
      return `<div class="marks-section">
        <div class="marks-header">
          <span class="marks-title">Judge Scores</span>
          <span class="marks-summary">${entries.length} judge${entries.length > 1 ? 's' : ''} &nbsp;·&nbsp; Avg: <strong>${avg}</strong> &nbsp;·&nbsp; Sum: <strong>${total}</strong></span>
        </div>
        <table class="marks-table">
          <thead><tr>
            <th>Judge</th>
            <th>Urgency<br><small>/30</small></th>
            <th>Visibility<br><small>/20</small></th>
            <th>Relevance<br><small>/30</small></th>
            <th>Presentation<br><small>/20</small></th>
            <th>Total<br><small>/100</small></th>
          </tr></thead>
          <tbody>${trs}</tbody>
        </table>
      </div>`;
    };

    const cards = rows.map((r, i) => `
      <div class="card">
        <div class="card-header">
          <span class="serial">#${i + 1}</span>
          <span class="project-title">${esc(r.projectTitle) || esc(r.leader)}</span>
          <span class="badge">${esc(r.projectSubcategory || '')}</span>
          <span class="edu-badge">${esc(r.categories || '')}</span>
        </div>
        <div class="meta-row">
          <span><b>Invoice:</b> ${val(r.paymentID)}</span>
          <span><b>Txn:</b> ${val(r.bkashTrxId)}</span>
          <span><b>Amount:</b> ৳${val(r.amount)}</span>
          ${r.projectCategory ? `<span><b>Category:</b> ${esc(r.projectCategory)}</span>` : ''}
          ${r.ca_code   ? `<span><b>CA:</b> ${esc(r.ca_code)}</span>` : ''}
          ${r.club_code ? `<span><b>Club:</b> ${esc(r.club_code)}</span>` : ''}
          ${r.crReference ? `<span><b>CR Ref:</b> ${esc(r.crReference)}</span>` : ''}
          <span><b>Registered:</b> ${new Date(r.created_at).toLocaleDateString('en-GB')}</span>
        </div>
        <div class="contact-row">
          <span><b>Phone:</b> ${val(r.leaderPhone)}</span>
          ${r.leaderWhatsApp ? `<span><b>WhatsApp:</b> ${esc(r.leaderWhatsApp)}</span>` : ''}
          <span><b>Email:</b> ${val(r.leaderEmail)}</span>
        </div>
        ${marksSection(r.paymentID)}
        <div class="members-section">
          ${memberSection(r)}
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

    .card { border: 1px solid #bbb; border-radius: 4px; margin-bottom: 16px; padding: 10px 12px; page-break-inside: avoid; }
    .card-header { display: flex; align-items: baseline; gap: 10px; margin-bottom: 5px; flex-wrap: wrap; }
    .serial { font-weight: 700; font-size: 13px; color: #800020; min-width: 28px; }
    .project-title { font-weight: 700; font-size: 13px; flex: 1; }
    .badge { font-size: 10px; background: #f0e0e4; color: #800020; padding: 2px 8px; border-radius: 20px; white-space: nowrap; }
    .edu-badge { font-size: 10px; background: #e8f0fe; color: #1a56db; padding: 2px 8px; border-radius: 20px; white-space: nowrap; }

    .meta-row { display: flex; flex-wrap: wrap; gap: 4px 16px; font-size: 10px; color: #444; margin-bottom: 5px; }
    .contact-row { display: flex; flex-wrap: wrap; gap: 4px 16px; font-size: 10px; color: #444; margin-bottom: 8px; }

    .marks-section { border: 1px solid #d4a800; border-radius: 3px; margin-bottom: 8px; overflow: hidden; }
    .marks-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; background: #fffbea; padding: 5px 10px; border-bottom: 1px solid #d4a800; }
    .marks-title { font-weight: 700; font-size: 11px; color: #7a5800; }
    .marks-summary { font-size: 10px; color: #555; }
    .marks-summary strong { color: #800020; }
    .marks-table { width: 100%; border-collapse: collapse; }
    .marks-table th { background: #fff8dc; color: #7a5800; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; padding: 4px 8px; text-align: center; border-bottom: 1px solid #e8d080; }
    .marks-table th:first-child { text-align: left; }
    .marks-table td { padding: 4px 8px; border-bottom: 1px solid #f5f0dc; font-size: 11px; }
    .marks-table tr:last-child td { border-bottom: none; }
    .marks-table tr:nth-child(even) td { background: #fffdf5; }
    .judge-name-cell { font-weight: 600; color: #333; }
    .score-cell { text-align: center; color: #555; }
    .total-cell { text-align: center; font-weight: 700; color: #800020; font-size: 12px; }
    .marks-none { font-size: 10px; color: #aaa; font-style: italic; padding: 4px 0 6px; }

    .members-section { display: flex; flex-direction: column; gap: 6px; margin-top: 4px; }

    .member-block { border: 1px solid #e0e0e0; border-radius: 3px; overflow: hidden; }
    .member-header {
      display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap;
      background: #800020; color: #fff; padding: 4px 8px;
    }
    .member-role  { font-weight: 700; font-size: 10px; min-width: 52px; opacity: 0.85; }
    .member-name  { font-weight: 700; font-size: 12px; flex: 1; }
    .member-inst  { font-size: 10px; opacity: 0.8; }
    .member-tshirt{ font-size: 10px; opacity: 0.7; }

    .parent-block { padding: 5px 8px; background: #faf6f7; }
    .parent-row   { display: flex; flex-wrap: wrap; gap: 3px 18px; font-size: 10px; color: #333; margin-bottom: 2px; }
    .parent-row em { color: #666; font-style: italic; }
    .parent-address { font-size: 10px; color: #555; }

    .no-print { text-align: center; margin-bottom: 16px; }
    .print-btn { padding: 8px 24px; background: #800020; color: #fff; border: none; border-radius: 4px; font-size: 13px; cursor: pointer; }
    @media print {
      .no-print { display: none; }
      body { padding: 0; }
      .card { margin-bottom: 10px; }
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

// Print-friendly HTML view of national round results grouped by category and education level
router.get('/national-round/print', authenticateAdmin, async (req, res) => {
  try {
    const [projectRows] = await db.query(`
      SELECT r.paymentID AS registration_id,
             COALESCE(NULLIF(r.projectTitle,''), r.leader) AS team_name,
             r.leader AS leader_name, r.institution,
             r.projectSubcategory AS subcategory,
             CASE WHEN r.categories IN ('Primary School','Elementary') THEN 'Elementary' ELSE r.categories END AS education_category,
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
             CASE WHEN r.categories IN ('Primary School','Elementary') THEN 'Elementary' ELSE r.categories END AS education_category,
             ROUND(COALESCE(AVG(jm.marks), 0), 2) AS avg_marks,
             COUNT(DISTINCT jm.judge_id) AS judge_count
      FROM registrations r
      LEFT JOIN judge_marks jm ON jm.registration_id = r.paymentID AND jm.competition_type = 'wall_magazine'
      WHERE r.competitionCategory = 'Megazine'
      GROUP BY r.paymentID
      ORDER BY avg_marks DESC
    `);

    const esc = v => (v == null ? '—' : String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'));

    // Group project rows: subcategory → education_category → sorted rows
    const CAT_ORDER = ['Elementary', 'High School', 'college', 'University'];
    const CAT_LABEL = { Elementary: 'Elementary', 'High School': 'High School', college: 'College', University: 'University' };
    const SUBCAT_ORDER = [
      'IT and Robotics',
      'Environmental Science',
      'Innovative Social Science',
      'Applied Physics and Engineering',
      'Applied Life Science',
    ];
    const SUBCAT_COLORS = {
      'IT and Robotics':                '#1565c0',
      'Environmental Science':          '#1a6632',
      'Innovative Social Science':      '#6a1b9a',
      'Applied Physics and Engineering':'#b45309',
      'Applied Life Science':           '#00695c',
    };

    const grouped = {};
    projectRows.forEach(r => {
      const sub = r.subcategory || 'Other';
      const cat = r.education_category || 'Other';
      if (!grouped[sub]) grouped[sub] = {};
      if (!grouped[sub][cat]) grouped[sub][cat] = [];
      grouped[sub][cat].push(r);
    });

    const rankBadge = (ri) => {
      if (ri === 0) return `<span class="medal gold">1st</span>`;
      if (ri === 1) return `<span class="medal silver">2nd</span>`;
      if (ri === 2) return `<span class="medal bronze">3rd</span>`;
      return `<span class="rank">${ri + 1}</span>`;
    };

    const buildTable = (rows, showEduCol = false) => {
      const headerExtra = showEduCol ? '<th>Level</th>' : '';
      const rowsHtml = rows.map((r, ri) => {
        const medal = ri < 3;
        const rowClass = ri === 0 ? 'gold-row' : ri === 1 ? 'silver-row' : ri === 2 ? 'bronze-row' : '';
        const eduCell = showEduCol ? `<td>${esc(CAT_LABEL[r.education_category] || r.education_category || '—')}</td>` : '';
        return `<tr class="${rowClass}">
          <td class="rank-cell">${rankBadge(ri)}</td>
          <td class="team-name">${esc(r.team_name)}</td>
          <td>${esc(r.institution)}</td>
          <td>${esc(r.leader_name)}</td>
          ${eduCell}
          <td class="score ${medal ? 'score-medal' : ''}">${parseFloat(r.avg_marks).toFixed(1)}</td>
          <td class="jcount">${r.judge_count}</td>
        </tr>`;
      }).join('');
      return `<table class="results-table">
        <thead><tr><th>Rank</th><th>Team / Project</th><th>Institution</th><th>Leader</th>${headerExtra}<th>Avg Score</th><th>Judges</th></tr></thead>
        <tbody>${rowsHtml}</tbody>
      </table>`;
    };

    // Project sections
    const subcatOrder = [...SUBCAT_ORDER, ...Object.keys(grouped).filter(k => !SUBCAT_ORDER.includes(k))];
    const projectSections = subcatOrder.filter(sub => grouped[sub]).map(sub => {
      const color = SUBCAT_COLORS[sub] || '#444';
      const catGroups = grouped[sub];
      const catBlocks = CAT_ORDER.filter(cat => catGroups[cat]).map(cat => {
        const rows = catGroups[cat];
        return `<div class="cat-block">
          <div class="cat-label">${esc(CAT_LABEL[cat] || cat)}</div>
          ${buildTable(rows, false)}
        </div>`;
      }).join('');
      return `<div class="subcat-section" style="--sc-color:${color}">
        <div class="subcat-header">${esc(sub)}</div>
        ${catBlocks}
      </div>`;
    }).join('');

    // Wall magazine section (flat, sorted by avg_marks desc already)
    const wallSection = wallRows.length === 0 ? '' : `
      <div class="subcat-section" style="--sc-color:#1a6632">
        <div class="subcat-header">Wall Magazine</div>
        <div class="cat-block">
          ${buildTable(wallRows, true)}
        </div>
      </div>`;

    const totalProjectTeams = projectRows.length;
    const totalWallTeams = wallRows.length;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>WICEBD 2026 — National Round Results</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; font-size: 11px; color: #111; background: #fff; padding: 16px; }
    h1 { font-size: 18px; text-align: center; margin-bottom: 3px; }
    .subtitle { text-align: center; font-size: 11px; color: #555; margin-bottom: 20px; }
    .subcat-section { margin-bottom: 22px; }
    .subcat-header {
      background: var(--sc-color); color: #fff;
      padding: 8px 14px; font-size: 13px; font-weight: 700;
      border-radius: 4px 4px 0 0; letter-spacing: 0.02em;
    }
    .cat-block { border: 1px solid #ccc; border-top: none; margin-bottom: 0; }
    .cat-label {
      background: #f5f5f5; color: #555; font-size: 10px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.07em;
      padding: 5px 14px; border-bottom: 1px solid #ddd;
    }
    .results-table { width: 100%; border-collapse: collapse; }
    .results-table th {
      background: rgba(0,0,0,0.04); color: #666; font-size: 10px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.06em;
      padding: 5px 10px; text-align: left; border-bottom: 1px solid #ddd;
    }
    .results-table td { padding: 6px 10px; border-bottom: 1px solid #f0f0f0; vertical-align: middle; }
    .results-table tr:last-child td { border-bottom: none; }
    .gold-row   td { background: #fffde7; }
    .silver-row td { background: #fafafa; }
    .bronze-row td { background: #fff8f0; }
    .medal { display: inline-block; padding: 2px 8px; border-radius: 20px; font-size: 10px; font-weight: 900; }
    .gold   { background: #FFD700; color: #7a5800; }
    .silver { background: #C0C0C0; color: #444; }
    .bronze { background: #CD7F32; color: #fff; }
    .rank { color: #aaa; font-size: 11px; }
    .rank-cell { width: 52px; text-align: center; }
    .team-name { font-weight: 700; font-size: 12px; max-width: 220px; }
    .score { text-align: center; font-size: 12px; font-weight: 600; color: #555; }
    .score-medal { font-size: 14px; font-weight: 900; color: #222; }
    .jcount { text-align: center; color: #aaa; font-size: 10px; }
    .no-print { text-align: center; margin-bottom: 16px; }
    .print-btn { padding: 8px 24px; background: #37474f; color: #fff; border: none; border-radius: 4px; font-size: 13px; cursor: pointer; }
    @media print {
      .no-print { display: none; }
      body { padding: 0; }
      .subcat-section { margin-bottom: 14px; page-break-inside: avoid; }
      .cat-block { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="no-print">
    <button class="print-btn" onclick="window.print()">🖨️ Print</button>
  </div>
  <h1>WICEBD 2026 — National Round Results</h1>
  <p class="subtitle">
    Project Teams: ${totalProjectTeams} &nbsp;·&nbsp;
    Wall Magazine: ${totalWallTeams} &nbsp;·&nbsp;
    Generated: ${new Date().toLocaleString('en-GB')}
  </p>
  ${projectSections}
  ${wallSection}
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (error) {
    console.error('National round print view failed:', error);
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