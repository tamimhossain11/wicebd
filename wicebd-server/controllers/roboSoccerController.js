const db = require('../db');
const { v4: uuidv4 } = require('uuid');
const { initiatePayment: paystationInitiate } = require('../utils/paystation');
require('dotenv').config();

const registerRoboSoccer = async (req, res) => {
  const {
    team_name, institution,
    leader_name, leader_phone, leader_email, leader_size,
    member1_name, member1_phone, member1_size,
    member2_name, member2_phone, member2_size,
    bot_name, prior_experience, promo_code,
  } = req.body;
  const user_id = req.user?.id || null;

  if (!team_name || !institution || !leader_name || !leader_phone || !leader_email) {
    return res.status(400).json({ success: false, message: 'All required team leader fields must be provided' });
  }
  if (!prior_experience) {
    return res.status(400).json({ success: false, message: 'prior_experience (yes/no) is required' });
  }

  const registration_id = `ROBO-${uuidv4().substr(0, 8).toUpperCase()}`;

  try {
    const [existing] = await db.query(
      'SELECT id FROM robo_soccer_registrations WHERE leader_email = ?',
      [leader_email]
    );
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'This email is already registered for Robo Soccer' });
    }

    await db.query(
      `INSERT INTO robo_soccer_registrations
        (registration_id, user_id, team_name, institution,
         leader_name, leader_phone, leader_email, leader_size,
         member1_name, member1_phone, member1_size,
         member2_name, member2_phone, member2_size,
         bot_name, prior_experience, promo_code, amount)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 777.00)`,
      [
        registration_id, user_id, team_name, institution,
        leader_name, leader_phone, leader_email, leader_size || null,
        member1_name || null, member1_phone || null, member1_size || null,
        member2_name || null, member2_phone || null, member2_size || null,
        bot_name || null, prior_experience, promo_code || null,
      ]
    );

    res.json({ success: true, registration_id, message: 'Robo Soccer registration successful' });
  } catch (error) {
    console.error('Robo Soccer registration error:', error);
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
};

const getAllRoboSoccer = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM robo_soccer_registrations ORDER BY created_at DESC'
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch registrations' });
  }
};

const exportRoboSoccerCSV = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM robo_soccer_registrations ORDER BY created_at DESC');
    if (!rows.length) return res.status(404).json({ success: false, message: 'No data' });

    const headers = Object.keys(rows[0]).join(',');
    const csv = [headers, ...rows.map(r =>
      Object.values(r).map(v => `"${v !== null ? String(v).replace(/"/g, '""') : ''}"`).join(',')
    )].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=robo_soccer.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Export failed' });
  }
};

const initiateRoboSoccerPayment = async (req, res) => {
  const { registration_id } = req.body;
  const user_id = req.user?.id || null;
  if (!registration_id) return res.status(400).json({ success: false, message: 'registration_id required' });

  try {
    const [[reg]] = await db.query(
      'SELECT * FROM robo_soccer_registrations WHERE registration_id = ? AND user_id = ?',
      [registration_id, user_id]
    );
    if (!reg) return res.status(404).json({ success: false, message: 'Registration not found' });
    if (reg.payment_status === 'paid') return res.json({ success: true, already_paid: true });

    const invoiceNumber = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const frontendBase = (process.env.FRONTEND_BASE_URL || 'https://wicebd.com').split(',')[0].trim();

    let amount = 777;
    if (reg.promo_code) {
      const [promoRows] = await db.query(
        `SELECT discount_percentage FROM promo_codes
         WHERE code = ? AND is_active = 1
           AND (competition_type = 'robo_soccer' OR competition_type = 'all') LIMIT 1`,
        [reg.promo_code.toUpperCase().trim()]
      );
      if (promoRows.length > 0) {
        amount = Math.round(amount * (1 - promoRows[0].discount_percentage / 100));
      }
    }

    const result = await paystationInitiate({
      invoiceNumber,
      amount,
      custName:  reg.leader_name,
      custPhone: reg.leader_phone,
      custEmail: reg.leader_email,
      callbackUrl: `${frontendBase}/callback`,
      reference: registration_id,
      checkoutItems: 'Robo Soccer',
    });

    if (result.status_code !== '200') {
      return res.status(400).json({ success: false, message: result.message || 'Payment initiation failed' });
    }

    await db.query(
      'UPDATE robo_soccer_registrations SET payment_id = ? WHERE registration_id = ?',
      [invoiceNumber, registration_id]
    );

    res.json({ success: true, payment_url: result.payment_url, invoice_number: invoiceNumber });
  } catch (err) {
    console.error('Robo Soccer payment initiation error:', err);
    res.status(500).json({ success: false, message: 'Failed to initiate payment' });
  }
};

module.exports = { registerRoboSoccer, initiateRoboSoccerPayment, getAllRoboSoccer, exportRoboSoccerCSV };
