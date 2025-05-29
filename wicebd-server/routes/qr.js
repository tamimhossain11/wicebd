// routes/qr.js
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db');

router.post('/verify-qr', async (req, res) => {
  const { registrationId, memberType, token } = req.body;

  if (!registrationId || !memberType || !token) {
    return res.status(400).json({ error: "Missing registrationId, memberType, or token" });
  }

  try {
    // Verify QR code
    const [verification] = await db.query(
      `SELECT * FROM qr_verification 
       WHERE registration_id = ? AND member_type = ? AND verification_hash = ? AND is_used = FALSE`,
      [registrationId, memberType, token]
    );

    if (!verification || verification.length === 0) {
      return res.status(400).json({ error: "Invalid or expired QR code" });
    }

    // Fetch registration data
    const [registration] = await db.query(
      `SELECT 
        id, projectTitle, institution, 
        leader, leaderPhone, leaderEmail,
        member2, institution2, 
        member3, institution3
       FROM registrations WHERE id = ?`,
      [registrationId]
    );

    if (!registration || registration.length === 0) {
      return res.status(404).json({ error: "Registration not found" });
    }

    const reg = registration[0];

    // Prepare response
    const response = {
      registrationId: reg.id,
      projectTitle: reg.projectTitle,
      institution: reg.institution,
      leader: reg.leader,
      leaderPhone: reg.leaderPhone,
      leaderEmail: reg.leaderEmail
    };

    if (memberType === 'member2') {
      response.memberName = reg.member2;
      response.memberInstitution = reg.institution2;
    } else if (memberType === 'member3') {
      response.memberName = reg.member3;
      response.memberInstitution = reg.institution3;
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