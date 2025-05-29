// routes/qr.js
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db');

router.post('/verify-qr', async (req, res) => {
  const { qrData } = req.body;
  
  try {
    // Parse QR code data
    const qrParts = {};
    qrData.split('|').forEach(part => {
      const [key, value] = part.split(':');
      qrParts[key] = value;
    });

    // Verify QR code
    const verification = await db.query(
      `SELECT * FROM qr_verification 
       WHERE registration_id = ? AND member_type = ? AND verification_hash = ? AND is_used = FALSE`,
      [qrParts.registrationId, qrParts.memberType, qrParts.token]
    );

    if (!verification.length) {
      return res.status(400).json({ error: "Invalid or expired QR code" });
    }

    // Fetch registration data
    const registration = await db.query(
      `SELECT 
        id, projectTitle, institution, 
        leader, leaderPhone, leaderEmail,
        member2, institution2, 
        member3, institution3
       FROM registrations WHERE id = ?`,
      [qrParts.registrationId]
    );

    if (!registration.length) {
      return res.status(404).json({ error: "Registration not found" });
    }

    // Prepare response
    const response = {
      registrationId: registration[0].id,
      projectTitle: registration[0].projectTitle,
      institution: registration[0].institution,
      leader: registration[0].leader,
      leaderPhone: registration[0].leaderPhone,
      leaderEmail: registration[0].leaderEmail
    };

    // Add member-specific data if not leader
    if (qrParts.memberType === 'member2') {
      response.memberName = registration[0].member2;
      response.memberInstitution = registration[0].institution2;
    } 
    else if (qrParts.memberType === 'member3') {
      response.memberName = registration[0].member3;
      response.memberInstitution = registration[0].institution3;
    }

    // Mark QR as used
    await db.query(
      'UPDATE qr_verification SET is_used = TRUE WHERE id = ?',
      [verification[0].id]
    );

    res.json(response);

  } catch (error) {
    console.error('QR verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;