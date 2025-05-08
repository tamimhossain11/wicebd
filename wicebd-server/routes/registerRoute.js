const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

router.post('/temp-save', async (req, res) => {
  const sessionID = req.sessionID;
  const registrationData = req.body;

  console.log('📥 TEMP-SAVE hit');
  console.log('Session ID:', sessionID);
  console.log('Saving data:', registrationData);

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    // Save sessionID + stringified JSON data
    const query = `
      INSERT INTO temp_registrations (session_id, data)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE data = VALUES(data)
    `;

    await connection.execute(query, [sessionID, JSON.stringify(registrationData)]);
    await connection.end();

    res.status(200).json({ message: 'Temp registration saved to DB' });
  } catch (err) {
    console.error('❌ Error saving temp registration:', err.message);
    res.status(500).json({ error: 'Failed to save temp registration' });
  }
});

module.exports = router;
