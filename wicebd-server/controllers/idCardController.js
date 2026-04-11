const db = require('../db');
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');
const { uploadBuffer } = require('../utils/gcsStorage');

const BACKEND_URL = process.env.BACKEND_URL || process.env.FRONTEND_BASE_URL?.split(',')[0]?.trim() || 'https://wicebd.com';
const VERIFY_BASE  = `${process.env.BACKEND_API_URL || 'https://api.wicebd.com'}/api/id-card/verify`;

// GET /api/id-card/my-cards  — returns all registrations with their card status
const getMyCards = async (req, res) => {
  const userId = req.user.id;
  try {
    const [regRows] = await db.query(
      `SELECT paymentID, competitionCategory, projectTitle, leader, leaderEmail, created_at
       FROM registrations WHERE user_id = ? ORDER BY created_at DESC`,
      [userId]
    );
    const [olympiadRows] = await db.query(
      `SELECT registration_id, full_name, email, institution, created_at
       FROM olympiad_registrations WHERE user_id = ? ORDER BY created_at DESC`,
      [userId]
    );
    const [cards] = await db.query(
      'SELECT registration_type, registration_id, card_uid, generated_at FROM id_cards WHERE user_id = ?',
      [userId]
    );

    // Index cards by "type:reg_id"
    const cardMap = {};
    cards.forEach(c => { cardMap[`${c.registration_type}:${c.registration_id}`] = c; });

    const registrations = [];

    regRows.forEach(r => {
      const type = r.competitionCategory === 'Megazine' ? 'wall-magazine' : 'project';
      registrations.push({
        type,
        reg_id:       r.paymentID,
        label:        type === 'wall-magazine' ? 'Wall Magazine' : 'Project Competition',
        name:         r.leader,
        title:        r.projectTitle || '',
        email:        r.leaderEmail,
        registered_at: r.created_at,
        card:         cardMap[`${type}:${r.paymentID}`] || null,
      });
    });

    olympiadRows.forEach(r => {
      registrations.push({
        type:          'olympiad',
        reg_id:        r.registration_id,
        label:         'Science Olympiad',
        name:          r.full_name,
        title:         r.institution || '',
        email:         r.email,
        registered_at: r.created_at,
        card:          cardMap[`olympiad:${r.registration_id}`] || null,
      });
    });

    res.json({ success: true, registrations });
  } catch (err) {
    console.error('getMyCards error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch ID cards' });
  }
};

// POST /api/id-card/generate  — { registration_type, registration_id }
const generateCard = async (req, res) => {
  const userId = req.user.id;
  const { registration_type, registration_id } = req.body;

  if (!registration_type || !registration_id) {
    return res.status(400).json({ success: false, message: 'registration_type and registration_id are required' });
  }

  try {
    // Return existing card if already generated
    const [existing] = await db.query(
      'SELECT * FROM id_cards WHERE user_id = ? AND registration_type = ? AND registration_id = ?',
      [userId, registration_type, registration_id]
    );
    if (existing.length > 0) {
      const card = existing[0];
      // Use stored GCS URL if available, else regenerate data URL as fallback
      const qrImage = card.image_url || await QRCode.toDataURL(`${VERIFY_BASE}/${card.card_uid}`);
      return res.json({ success: true, card: { ...card, qrImage } });
    }

    // Verify the registration belongs to this user & get display info
    let name = '', title = '', email = '';
    if (registration_type === 'olympiad') {
      const [[reg]] = await db.query(
        'SELECT full_name, email, institution FROM olympiad_registrations WHERE registration_id = ? AND user_id = ?',
        [registration_id, userId]
      );
      if (!reg) return res.status(403).json({ success: false, message: 'Registration not found' });
      name = reg.full_name; email = reg.email; title = reg.institution;
    } else {
      const [[reg]] = await db.query(
        'SELECT leader, leaderEmail, projectTitle FROM registrations WHERE paymentID = ? AND user_id = ?',
        [registration_id, userId]
      );
      if (!reg) return res.status(403).json({ success: false, message: 'Registration not found' });
      name = reg.leader; email = reg.leaderEmail; title = reg.projectTitle || '';
    }

    const prefix  = registration_type === 'olympiad' ? 'OLY' : registration_type === 'wall-magazine' ? 'MAG' : 'PRJ';
    const cardUid = `WICE-${prefix}-${uuidv4().slice(0, 8).toUpperCase()}`;
    const verifyUrl = `${VERIFY_BASE}/${cardUid}`;

    // Generate QR as PNG buffer and upload to GCS
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
      'INSERT INTO id_cards (user_id, registration_type, registration_id, card_uid, qr_data, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, registration_type, registration_id, cardUid, verifyUrl, imageUrl]
    );

    // Return GCS URL if available, else generate data URL on the fly
    const qrImage = imageUrl || await QRCode.toDataURL(verifyUrl);

    res.json({
      success: true,
      card: {
        card_uid: cardUid,
        qr_data: verifyUrl,
        image_url: imageUrl,
        qrImage,
        registration_type,
        registration_id,
        generated_at: new Date(),
        name, title, email,
      },
    });
  } catch (err) {
    console.error('generateCard error:', err);
    res.status(500).json({ success: false, message: 'Failed to generate ID card' });
  }
};

// GET /api/id-card/verify/:cardUid  — public, for QR scan
const verifyCard = async (req, res) => {
  const { cardUid } = req.params;
  try {
    const [rows] = await db.query(`
      SELECT ic.card_uid, ic.registration_type, ic.registration_id, ic.generated_at,
             u.name, u.email
      FROM id_cards ic
      JOIN users u ON ic.user_id = u.id
      WHERE ic.card_uid = ?
    `, [cardUid]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'ID card not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('verifyCard error:', err);
    res.status(500).json({ success: false, message: 'Verification failed' });
  }
};

module.exports = { getMyCards, generateCard, verifyCard };
