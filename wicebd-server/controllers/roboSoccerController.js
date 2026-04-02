const db = require('../db');
const { v4: uuidv4 } = require('uuid');

const registerRoboSoccer = async (req, res) => {
  const {
    team_name, institution, leader_name, leader_email, leader_phone,
    member2, member3, member4, robot_description, category = 'standard',
  } = req.body;
  const user_id = req.user?.id || null;

  if (!team_name || !institution || !leader_name || !leader_email || !leader_phone) {
    return res.status(400).json({ success: false, message: 'All required fields must be provided' });
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
        (registration_id, user_id, team_name, institution, leader_name, leader_email,
         leader_phone, member2, member3, member4, robot_description, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [registration_id, user_id, team_name, institution, leader_name, leader_email,
       leader_phone, member2 || null, member3 || null, member4 || null,
       robot_description || null, category]
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

module.exports = { registerRoboSoccer, getAllRoboSoccer, exportRoboSoccerCSV };
