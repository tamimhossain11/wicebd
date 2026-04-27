const db     = require('../db');
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');
const { uploadBuffer } = require('../utils/gcsStorage');

const VERIFY_BASE = `${process.env.BACKEND_API_URL || 'https://api.wicebd.com'}/api/id-card/verify`;

/* ─────────────────────────────────────────────────────────────
   Helper — generate a card_uid, create QR, persist to id_cards
   ───────────────────────────────────────────────────────────── */
async function issueCard ({ userId, registrationType, registrationId, memberSlot, name, email, title, guestName = null, guestPosition = null }) {
  const prefix  = registrationType === 'olympiad'     ? 'OLY'
                : registrationType === 'wall-magazine' ? 'MAG'
                : registrationType === 'guest'         ? 'GST'
                : 'PRJ';
  const slotTag = memberSlot ? `-M${memberSlot}` : '';
  const cardUid = `WICE-${prefix}-${uuidv4().slice(0, 8).toUpperCase()}${slotTag}`;
  const verifyUrl = `${VERIFY_BASE}/${cardUid}`;

  let imageUrl = null;
  try {
    const qrBuffer = await QRCode.toBuffer(verifyUrl, {
      type: 'png', errorCorrectionLevel: 'H', margin: 2, width: 400,
    });
    imageUrl = await uploadBuffer(qrBuffer, `id-cards/${cardUid}.png`, 'image/png');
  } catch (gcsErr) {
    console.error('GCS upload failed for ID card, falling back to data URL:', gcsErr.message);
  }

  await db.query(
    `INSERT INTO id_cards
       (user_id, registration_type, registration_id, member_slot, card_uid, qr_data, image_url, guest_name, guest_position)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [userId, registrationType, registrationId, memberSlot ?? null, cardUid, verifyUrl, imageUrl, guestName, guestPosition]
  );

  const qrImage = imageUrl || await QRCode.toDataURL(verifyUrl);
  return {
    card_uid: cardUid, qr_data: verifyUrl, image_url: imageUrl,
    qrImage, registration_type: registrationType, registration_id: registrationId,
    member_slot: memberSlot ?? null, generated_at: new Date(),
    name, title, email, guest_name: guestName, guest_position: guestPosition,
  };
}

/* ─────────────────────────────────────────────────────────────
   GET /api/id-card/my-cards
   Returns all registrations the logged-in user owns, each with
   their card status and (for project/mag regs) team member list.
   ───────────────────────────────────────────────────────────── */
const getMyCards = async (req, res) => {
  const userId = req.user.id;
  try {
    const [regRows] = await db.query(
      `SELECT paymentID, competitionCategory, projectTitle,
              leader, leaderEmail, leaderPhone,
              member2, institution2,
              member3, institution3,
              member4, institution4,
              member5, institution5,
              member6, institution6,
              created_at
       FROM registrations WHERE user_id = ? ORDER BY created_at DESC`,
      [userId]
    );
    const [olympiadRows] = await db.query(
      `SELECT registration_id, full_name, email, institution, created_at
       FROM olympiad_registrations WHERE user_id = ? ORDER BY created_at DESC`,
      [userId]
    );

    // Fetch all id_cards for this user (includes member_slot)
    const [cards] = await db.query(
      `SELECT registration_type, registration_id, member_slot,
              card_uid, qr_data, image_url, generated_at
       FROM id_cards WHERE user_id = ?`,
      [userId]
    );

    // Index: "type:reg_id:slot" → card  (slot null → "null")
    const cardMap = {};
    cards.forEach(c => {
      const slotKey = c.member_slot ?? 'null';
      cardMap[`${c.registration_type}:${c.registration_id}:${slotKey}`] = c;
    });

    // Fetch saved team-member profiles for all payment IDs
    const paymentIds = regRows.map(r => r.paymentID);
    let memberProfiles = [];
    if (paymentIds.length) {
      [memberProfiles] = await db.query(
        `SELECT payment_id, member_slot, name, institution, profile_completed
         FROM team_member_profiles WHERE payment_id IN (?)`,
        [paymentIds]
      );
    }

    // Index: "paymentId:slot" → profile
    const profileMap = {};
    memberProfiles.forEach(p => { profileMap[`${p.payment_id}:${p.member_slot}`] = p; });

    const registrations = [];

    regRows.forEach(r => {
      const type  = r.competitionCategory === 'Megazine' ? 'wall-magazine' : 'project';
      const slots = [
        { slot: null, name: r.leader,   institution: r.institution,  email: r.leaderEmail },
        r.member2 ? { slot: 2, name: r.member2, institution: r.institution2 } : null,
        r.member3 ? { slot: 3, name: r.member3, institution: r.institution3 } : null,
        r.member4 ? { slot: 4, name: r.member4, institution: r.institution4 } : null,
        r.member5 ? { slot: 5, name: r.member5, institution: r.institution5 } : null,
        r.member6 ? { slot: 6, name: r.member6, institution: r.institution6 } : null,
      ].filter(Boolean);

      const memberCards = slots.map(s => {
        const slotKey = s.slot ?? 'null';
        const card = cardMap[`${type}:${r.paymentID}:${slotKey}`] || null;
        const profile = s.slot ? (profileMap[`${r.paymentID}:${s.slot}`] || null) : null;
        return {
          slot: s.slot,
          name: s.name,
          institution: s.institution || '',
          email: s.email || '',
          profile_completed: s.slot === null ? true : (profile?.profile_completed === 1),
          card,
        };
      });

      registrations.push({
        type,
        reg_id:        r.paymentID,
        label:         type === 'wall-magazine' ? 'Wall Magazine' : 'Project Competition',
        title:         r.projectTitle || '',
        registered_at: r.created_at,
        members:       memberCards,  // first entry is always the leader (slot=null)
      });
    });

    olympiadRows.forEach(r => {
      const card = cardMap[`olympiad:${r.registration_id}:null`] || null;
      registrations.push({
        type:          'olympiad',
        reg_id:        r.registration_id,
        label:         'Science Olympiad',
        title:         r.institution || '',
        registered_at: r.created_at,
        members: [{
          slot: null,
          name:  r.full_name,
          institution: r.institution,
          email: r.email,
          profile_completed: true,  // olympiad is individual
          card,
        }],
      });
    });

    res.json({ success: true, registrations });
  } catch (err) {
    console.error('getMyCards error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch ID cards' });
  }
};

/* ─────────────────────────────────────────────────────────────
   GET /api/id-card/member-profile/:paymentId/:slot
   ───────────────────────────────────────────────────────────── */
const getMemberProfile = async (req, res) => {
  const userId = req.user.id;
  const { paymentId, slot } = req.params;
  try {
    // Verify the registration belongs to this user
    const [[reg]] = await db.query(
      'SELECT paymentID FROM registrations WHERE paymentID = ? AND user_id = ?',
      [paymentId, userId]
    );
    if (!reg) return res.status(403).json({ success: false, message: 'Not authorised' });

    const [[profile]] = await db.query(
      'SELECT * FROM team_member_profiles WHERE payment_id = ? AND member_slot = ?',
      [paymentId, slot]
    );
    res.json({ success: true, profile: profile || null });
  } catch (err) {
    console.error('getMemberProfile error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch member profile' });
  }
};

/* ─────────────────────────────────────────────────────────────
   POST /api/id-card/member-profile
   Body: { payment_id, member_slot, ...fields }
   ───────────────────────────────────────────────────────────── */
const saveMemberProfile = async (req, res) => {
  const userId = req.user.id;
  const {
    payment_id, member_slot,
    father_name, father_occupation, mother_name, mother_occupation,
    guardian_phone, address, date_of_birth, gender, class_grade,
  } = req.body;

  if (!payment_id || !member_slot) {
    return res.status(400).json({ success: false, message: 'payment_id and member_slot are required' });
  }

  try {
    // Verify the registration belongs to this user
    const [[reg]] = await db.query(
      'SELECT paymentID FROM registrations WHERE paymentID = ? AND user_id = ?',
      [payment_id, userId]
    );
    if (!reg) return res.status(403).json({ success: false, message: 'Not authorised' });

    const n = v => (v === undefined || v === '' ? null : v);

    await db.query(`
      INSERT INTO team_member_profiles
        (payment_id, member_slot, father_name, father_occupation, mother_name, mother_occupation,
         guardian_phone, address, date_of_birth, gender, class_grade, profile_completed)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
      ON DUPLICATE KEY UPDATE
        father_name        = VALUES(father_name),
        father_occupation  = VALUES(father_occupation),
        mother_name        = VALUES(mother_name),
        mother_occupation  = VALUES(mother_occupation),
        guardian_phone     = VALUES(guardian_phone),
        address            = VALUES(address),
        date_of_birth      = VALUES(date_of_birth),
        gender             = VALUES(gender),
        class_grade        = VALUES(class_grade),
        profile_completed  = 1,
        updated_at         = NOW()
    `, [
      payment_id, member_slot,
      n(father_name), n(father_occupation), n(mother_name), n(mother_occupation),
      n(guardian_phone), n(address), n(date_of_birth) || null, n(gender), n(class_grade),
    ]);

    res.json({ success: true });
  } catch (err) {
    console.error('saveMemberProfile error:', err);
    res.status(500).json({ success: false, message: 'Failed to save member profile' });
  }
};

/* ─────────────────────────────────────────────────────────────
   POST /api/id-card/generate
   Body: { registration_type, registration_id, member_slot? }
   member_slot is omitted/null for the leader's own card
   ───────────────────────────────────────────────────────────── */
const generateCard = async (req, res) => {
  const userId = req.user.id;
  const { registration_type, registration_id, member_slot = null } = req.body;

  if (!registration_type || !registration_id) {
    return res.status(400).json({ success: false, message: 'registration_type and registration_id are required' });
  }

  try {
    // Return existing card if already generated
    const [existing] = await db.query(
      `SELECT * FROM id_cards
       WHERE user_id = ? AND registration_type = ? AND registration_id = ?
         AND (member_slot <=> ?)`,
      [userId, registration_type, registration_id, member_slot]
    );
    if (existing.length > 0) {
      const card = existing[0];
      const qrImage = card.image_url || await QRCode.toDataURL(`${VERIFY_BASE}/${card.card_uid}`);
      return res.json({ success: true, card: { ...card, qrImage } });
    }

    let name = '', title = '', email = '';

    if (registration_type === 'olympiad') {
      const [[reg]] = await db.query(
        'SELECT full_name, email, institution FROM olympiad_registrations WHERE registration_id = ? AND user_id = ?',
        [registration_id, userId]
      );
      if (!reg) return res.status(403).json({ success: false, message: 'Registration not found' });
      name = reg.full_name; email = reg.email; title = reg.institution;

    } else if (member_slot) {
      // Team member card — verify registration belongs to user
      const [[reg]] = await db.query(
        `SELECT member${member_slot} AS mname, institution${member_slot} AS minst, projectTitle
         FROM registrations WHERE paymentID = ? AND user_id = ?`,
        [registration_id, userId]
      );
      if (!reg || !reg.mname) {
        return res.status(403).json({ success: false, message: 'Member slot not found on this registration' });
      }
      // Check member profile is complete
      const [[prof]] = await db.query(
        'SELECT profile_completed FROM team_member_profiles WHERE payment_id = ? AND member_slot = ?',
        [registration_id, member_slot]
      );
      if (!prof || !prof.profile_completed) {
        return res.status(400).json({ success: false, message: 'Complete member family info first' });
      }
      name  = reg.mname;
      title = reg.projectTitle || '';
      email = '';

    } else {
      // Leader's own card
      const [[reg]] = await db.query(
        'SELECT leader, leaderEmail, projectTitle FROM registrations WHERE paymentID = ? AND user_id = ?',
        [registration_id, userId]
      );
      if (!reg) return res.status(403).json({ success: false, message: 'Registration not found' });
      name = reg.leader; email = reg.leaderEmail; title = reg.projectTitle || '';
    }

    const card = await issueCard({
      userId, registrationType: registration_type, registrationId: registration_id,
      memberSlot: member_slot, name, email, title,
    });

    res.json({ success: true, card });
  } catch (err) {
    console.error('generateCard error:', err);
    res.status(500).json({ success: false, message: 'Failed to generate ID card' });
  }
};

/* ─────────────────────────────────────────────────────────────
   GET /api/id-card/verify/:cardUid  — admin-only QR scan
   ───────────────────────────────────────────────────────────── */
const verifyCard = async (req, res) => {
  const { cardUid } = req.params;
  try {
    const [rows] = await db.query(`
      SELECT ic.card_uid, ic.registration_type, ic.registration_id,
             ic.member_slot, ic.generated_at, ic.guest_name, ic.guest_position,
             u.id AS user_id,
             COALESCE(u.name, ic.guest_name) AS user_name,
             u.email AS user_email
      FROM id_cards ic
      LEFT JOIN users u ON ic.user_id = u.id
      WHERE ic.card_uid = ?
    `, [cardUid]);

    if (!rows.length) return res.status(404).json({ success: false, message: 'ID card not found' });

    const card = rows[0];
    let detail = {};

    if (card.registration_type === 'guest') {
      detail = {
        full_name:      card.guest_name,
        guest_position: card.guest_position,
        registration_id: card.card_uid,
      };

    } else if (card.registration_type === 'olympiad') {
      const [[reg]] = await db.query(
        `SELECT full_name, institution, class_grade, phone, email, registration_id
         FROM olympiad_registrations WHERE registration_id = ?`,
        [card.registration_id]
      );
      detail = reg || {};

    } else if (card.member_slot) {
      // Team member card
      const [[reg]] = await db.query(
        `SELECT member${card.member_slot} AS full_name,
                institution${card.member_slot} AS institution,
                projectTitle, competitionCategory, paymentID
         FROM registrations WHERE paymentID = ?`,
        [card.registration_id]
      );
      const [[prof]] = await db.query(
        `SELECT father_name, father_occupation, mother_name, mother_occupation,
                guardian_phone, address, date_of_birth, gender, class_grade
         FROM team_member_profiles WHERE payment_id = ? AND member_slot = ?`,
        [card.registration_id, card.member_slot]
      );
      detail = { ...(reg || {}), ...(prof || {}) };

    } else {
      const [[reg]] = await db.query(
        `SELECT leader, institution, leaderEmail, leaderPhone,
                projectTitle, competitionCategory, paymentID
         FROM registrations WHERE paymentID = ?`,
        [card.registration_id]
      );
      detail = reg || {};
    }

    const [attRows] = await db.query('SELECT * FROM attendance WHERE card_uid = ?', [cardUid]);

    res.json({ success: true, data: { ...card, detail, attendance: attRows[0] || null } });
  } catch (err) {
    console.error('verifyCard error:', err);
    res.status(500).json({ success: false, message: 'Verification failed' });
  }
};

/* ─────────────────────────────────────────────────────────────
   DELETE /api/id-card/delete — admin only
   ───────────────────────────────────────────────────────────── */
const deleteCard = async (req, res) => {
  const userId = req.user.id;
  const { registration_type, registration_id, member_slot = null } = req.body;
  if (!registration_type || !registration_id) {
    return res.status(400).json({ success: false, message: 'registration_type and registration_id required' });
  }
  try {
    const [existing] = await db.query(
      `SELECT * FROM id_cards
       WHERE user_id = ? AND registration_type = ? AND registration_id = ?
         AND (member_slot <=> ?)`,
      [userId, registration_type, registration_id, member_slot]
    );
    if (!existing.length) return res.status(404).json({ success: false, message: 'Card not found' });

    const card = existing[0];
    if (card.image_url) {
      const { deleteFile } = require('../utils/gcsStorage');
      await deleteFile(card.image_url).catch(() => {});
    }

    await db.query(
      `DELETE FROM id_cards
       WHERE user_id = ? AND registration_type = ? AND registration_id = ?
         AND (member_slot <=> ?)`,
      [userId, registration_type, registration_id, member_slot]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('deleteCard error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete card' });
  }
};

/* ─────────────────────────────────────────────────────────────
   POST /api/id-card/admin/generate-guest
   Admin generates a guest ID card (CA, volunteer, district leader, etc.)
   Body: { guest_name, guest_position }
   ───────────────────────────────────────────────────────────── */
const adminGenerateGuestCard = async (req, res) => {
  const { guest_name, guest_position } = req.body;
  if (!guest_name || !guest_position) {
    return res.status(400).json({ success: false, message: 'guest_name and guest_position are required' });
  }

  try {
    const guestRegId = `GST-${uuidv4().slice(0, 8).toUpperCase()}`;

    const card = await issueCard({
      userId: null,
      registrationType: 'guest',
      registrationId: guestRegId,
      memberSlot: null,
      name: guest_name,
      email: '',
      title: guest_position,
      guestName: guest_name,
      guestPosition: guest_position,
    });

    res.json({ success: true, card });
  } catch (err) {
    console.error('adminGenerateGuestCard error:', err);
    res.status(500).json({ success: false, message: 'Failed to generate guest ID card' });
  }
};

/* ─────────────────────────────────────────────────────────────
   POST /api/id-card/admin/generate-olympiad
   Admin generates an olympiad ID card on behalf of a participant.
   Body: { registration_id }
   ───────────────────────────────────────────────────────────── */
const adminGenerateOlympiadCard = async (req, res) => {
  const { registration_id } = req.body;
  if (!registration_id) {
    return res.status(400).json({ success: false, message: 'registration_id is required' });
  }

  try {
    const [[reg]] = await db.query(
      'SELECT registration_id, user_id, full_name, email, institution FROM olympiad_registrations WHERE registration_id = ?',
      [registration_id]
    );
    if (!reg) return res.status(404).json({ success: false, message: 'Olympiad registration not found' });

    // Return existing card if already generated
    const [existing] = await db.query(
      `SELECT * FROM id_cards WHERE registration_type = 'olympiad' AND registration_id = ? AND member_slot IS NULL`,
      [registration_id]
    );
    if (existing.length > 0) {
      const card = existing[0];
      const qrImage = card.image_url || await QRCode.toDataURL(`${VERIFY_BASE}/${card.card_uid}`);
      return res.json({ success: true, already_existed: true, card: { ...card, qrImage, name: reg.full_name, email: reg.email } });
    }

    const card = await issueCard({
      userId: reg.user_id || null,
      registrationType: 'olympiad',
      registrationId: registration_id,
      memberSlot: null,
      name: reg.full_name,
      email: reg.email,
      title: reg.institution,
    });

    res.json({ success: true, already_existed: false, card });
  } catch (err) {
    console.error('adminGenerateOlympiadCard error:', err);
    res.status(500).json({ success: false, message: 'Failed to generate guest ID card' });
  }
};

module.exports = { getMyCards, generateCard, verifyCard, deleteCard, getMemberProfile, saveMemberProfile, adminGenerateOlympiadCard, adminGenerateGuestCard };
