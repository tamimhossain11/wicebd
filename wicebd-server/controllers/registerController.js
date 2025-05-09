const { v4: uuidv4 } = require('uuid');
const db = require('../db');

const startRegistration = async (req, res) => {
  const data = req.body;
  const paymentID = uuidv4();

  const {
    participantCategory, country, competitionCategory, projectSubcategory, categories, crRefrence,
    leader, institution, leaderPhone, leaderWhatsApp, leaderEmail, tshirtSizeLeader,
    member2, institution2, tshirtSize2, member3, institution3, tshirtSize3,
    projectTitle, projectCategory, participatedBefore, previousCompetition,
    socialMedia, infoSource
  } = data;

  const sql = `
    INSERT INTO temp_registrations (
      paymentID, participantCategory, country, competitionCategory, projectSubcategory, categories, crRefrence,
      leader, institution, leaderPhone, leaderWhatsApp, leaderEmail, tshirtSizeLeader,
      member2, institution2, tshirtSize2, member3, institution3, tshirtSize3,
      projectTitle, projectCategory, participatedBefore, previousCompetition,
      socialMedia, infoSource
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    paymentID, participantCategory, country, competitionCategory, projectSubcategory, categories, crRefrence,
    leader, institution, leaderPhone, leaderWhatsApp, leaderEmail, tshirtSizeLeader,
    member2, institution2, tshirtSize2, member3, institution3, tshirtSize3,
    projectTitle, projectCategory, participatedBefore, previousCompetition,
    socialMedia, infoSource
  ];

  try {
    console.log("📩 Inserting registration:", { paymentID });
    const [result] = await db.execute(sql, values);
    console.log("✅ Registration saved. Sending paymentID:", paymentID);
    res.json({ paymentID });
  } catch (err) {
    console.error("❌ Database insert failed:", err);
    res.status(500).json({ error: 'Database insert failed' });
  }
};

module.exports = { startRegistration };
