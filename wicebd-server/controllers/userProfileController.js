const db = require('../db');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

// Save / update family + personal info
const saveProfile = async (req, res) => {
  const user_id = req.user.id;
  const {
    father_name, father_occupation, mother_name, mother_occupation,
    guardian_phone, address, date_of_birth, gender, institution, class_grade,
  } = req.body;

  try {
    const [existing] = await db.query('SELECT id FROM user_profiles WHERE user_id = ?', [user_id]);

    if (existing.length > 0) {
      await db.query(
        `UPDATE user_profiles SET
          father_name=?, father_occupation=?, mother_name=?, mother_occupation=?,
          guardian_phone=?, address=?, date_of_birth=?, gender=?,
          institution=?, class_grade=?, profile_completed=1
         WHERE user_id=?`,
        [father_name, father_occupation, mother_name, mother_occupation,
         guardian_phone, address, date_of_birth || null, gender,
         institution, class_grade, user_id]
      );
    } else {
      await db.query(
        `INSERT INTO user_profiles
          (user_id, father_name, father_occupation, mother_name, mother_occupation,
           guardian_phone, address, date_of_birth, gender, institution, class_grade, profile_completed)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        [user_id, father_name, father_occupation, mother_name, mother_occupation,
         guardian_phone, address, date_of_birth || null, gender, institution, class_grade]
      );
    }

    res.json({ success: true, message: 'Profile saved' });
  } catch (error) {
    console.error('Save profile error:', error);
    res.status(500).json({ success: false, message: 'Failed to save profile' });
  }
};

// Get user profile
const getProfile = async (req, res) => {
  const user_id = req.user.id;
  try {
    const [rows] = await db.query(
      `SELECT u.id, u.name, u.email, u.avatar, u.provider, u.created_at,
              p.father_name, p.father_occupation, p.mother_name, p.mother_occupation,
              p.guardian_phone, p.address, p.date_of_birth, p.gender,
              p.institution, p.class_grade, p.profile_completed
       FROM users u
       LEFT JOIN user_profiles p ON p.user_id = u.id
       WHERE u.id = ?`,
      [user_id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
};

// Get user's registrations (all categories)
const getMyRegistrations = async (req, res) => {
  const user_id = req.user.id;
  try {
    const [project] = await db.query(
      `SELECT id, paymentID, competitionCategory, projectTitle, leader, leaderEmail, bkashTrxId, amount, created_at
       FROM registrations WHERE user_id = ? ORDER BY created_at DESC`, [user_id]
    );
    const [olympiad] = await db.query(
      `SELECT id, registration_id, full_name, email, institution, status, created_at
       FROM olympiad_registrations WHERE user_id = ? ORDER BY created_at DESC`, [user_id]
    );
    const [roboSoccer] = await db.query(
      `SELECT id, registration_id, team_name, institution, leader_name, status, created_at
       FROM robo_soccer_registrations WHERE user_id = ? ORDER BY created_at DESC`, [user_id]
    );

    res.json({ success: true, project, olympiad, roboSoccer });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch registrations' });
  }
};

// Generate QR ID card
const generateIdCard = async (req, res) => {
  const user_id = req.user.id;
  const { registration_type, registration_id } = req.body;

  if (!registration_type || !registration_id) {
    return res.status(400).json({ success: false, message: 'registration_type and registration_id required' });
  }

  try {
    // Check if card already exists
    const [existing] = await db.query(
      'SELECT * FROM id_cards WHERE user_id = ? AND registration_type = ? AND registration_id = ?',
      [user_id, registration_type, registration_id]
    );
    if (existing.length > 0) {
      return res.json({ success: true, card: existing[0] });
    }

    // Get user info
    const [[user]] = await db.query('SELECT name, email FROM users WHERE id = ?', [user_id]);

    const card_uid = `WICE-${registration_type.toUpperCase().substring(0,3)}-${uuidv4().substring(0,8).toUpperCase()}`;
    const qr_data = JSON.stringify({
      uid: card_uid,
      name: user.name,
      email: user.email,
      type: registration_type,
      reg_id: registration_id,
      event: 'WICE Bangladesh',
    });

    await db.query(
      `INSERT INTO id_cards (user_id, registration_type, registration_id, card_uid, qr_data)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, registration_type, registration_id, card_uid, qr_data]
    );

    const qrImage = await QRCode.toDataURL(qr_data);

    res.json({
      success: true,
      card: { card_uid, qr_data, qrImage, name: user.name, registration_type, registration_id },
    });
  } catch (error) {
    console.error('ID card error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate ID card' });
  }
};

module.exports = { saveProfile, getProfile, getMyRegistrations, generateIdCard };
