const db = require('../db');
const { v4: uuidv4 } = require('uuid');
const { initiatePayment: paystationInitiate } = require('../utils/paystation');
require('dotenv').config();

const registerMicromouse = async (req, res) => {
  const {
    team_name, institution,
    leader_name, leader_phone, leader_email, leader_size,
    member1_name, member1_phone, member1_size,
    member2_name, member2_phone, member2_size,
    member3_name, member3_phone, member3_size,
    member4_name, member4_phone, member4_size,
    bot_name, prior_experience,
  } = req.body;
  const user_id = req.user?.id || null;

  if (!team_name || !institution || !leader_name || !leader_phone || !leader_email) {
    return res.status(400).json({ success: false, message: 'All required team leader fields must be provided' });
  }
  if (!prior_experience) {
    return res.status(400).json({ success: false, message: 'prior_experience (yes/no) is required' });
  }

  const registration_id = `MCM-${uuidv4().substr(0, 8).toUpperCase()}`;

  try {
    const [existing] = await db.query(
      'SELECT id FROM micromouse_registrations WHERE leader_email = ?',
      [leader_email]
    );
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'This email is already registered for Micromouse Maze-Solving' });
    }

    await db.query(
      `INSERT INTO micromouse_registrations
        (registration_id, user_id, team_name, institution,
         leader_name, leader_phone, leader_email, leader_size,
         member1_name, member1_phone, member1_size,
         member2_name, member2_phone, member2_size,
         bot_name, prior_experience, amount)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 888.00)`,
      [
        registration_id, user_id, team_name, institution,
        leader_name, leader_phone, leader_email, leader_size || null,
        member1_name || null, member1_phone || null, member1_size || null,
        member2_name || null, member2_phone || null, member2_size || null,
        bot_name || null, prior_experience,
      ]
    );

    res.json({ success: true, registration_id, message: 'Micromouse Maze-Solving registration successful' });
  } catch (error) {
    console.error('Micromouse registration error:', error);
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
};

const getAllMicromouse = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM micromouse_registrations ORDER BY created_at DESC'
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch registrations' });
  }
};

const exportMicromouseCSV = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM micromouse_registrations ORDER BY created_at DESC');
    if (!rows.length) return res.status(404).json({ success: false, message: 'No data' });

    const headers = Object.keys(rows[0]).join(',');
    const csv = [headers, ...rows.map(r =>
      Object.values(r).map(v => `"${v !== null ? String(v).replace(/"/g, '""') : ''}"`).join(',')
    )].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=micromouse.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Export failed' });
  }
};

const initiateMicromousePayment = async (req, res) => {
  const { registration_id } = req.body;
  const user_id = req.user?.id || null;
  if (!registration_id) return res.status(400).json({ success: false, message: 'registration_id required' });

  try {
    const [[reg]] = await db.query(
      'SELECT * FROM micromouse_registrations WHERE registration_id = ? AND user_id = ?',
      [registration_id, user_id]
    );
    if (!reg) return res.status(404).json({ success: false, message: 'Registration not found' });
    if (reg.payment_status === 'paid') return res.json({ success: true, already_paid: true });

    const invoiceNumber = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const frontendBase = (process.env.FRONTEND_BASE_URL || 'https://wicebd.com').split(',')[0].trim();

    const result = await paystationInitiate({
      invoiceNumber,
      amount: 888,
      custName:  reg.leader_name,
      custPhone: reg.leader_phone,
      custEmail: reg.leader_email,
      callbackUrl: `${frontendBase}/callback`,
      reference: registration_id,
      checkoutItems: 'Micromouse',
    });

    if (result.status_code !== '200') {
      return res.status(400).json({ success: false, message: result.message || 'Payment initiation failed' });
    }

    await db.query(
      'UPDATE micromouse_registrations SET payment_id = ? WHERE registration_id = ?',
      [invoiceNumber, registration_id]
    );

    res.json({ success: true, payment_url: result.payment_url, invoice_number: invoiceNumber });
  } catch (err) {
    console.error('Micromouse payment initiation error:', err);
    res.status(500).json({ success: false, message: 'Failed to initiate payment' });
  }
};

module.exports = { registerMicromouse, initiateMicromousePayment, getAllMicromouse, exportMicromouseCSV };
