const { v4: uuidv4 } = require('uuid');
const db = require('../db');

const startRegistration = async (req, res) => {
  const data = req.body;
  const paymentID = uuidv4();
  const raw_user_id = req.user?.id || null;

  // Verify the user_id actually exists in the users table to avoid FK violation
  let user_id = null;
  if (raw_user_id) {
    try {
      const [userRow] = await db.query('SELECT id FROM users WHERE id = ?', [raw_user_id]);
      if (userRow.length > 0) user_id = raw_user_id;
    } catch (_) {
      // fall through with null
    }
  }

  const {
    competitionCategory, projectSubcategory, categories, crReference = null,
    leader, institution, leaderPhone, leaderWhatsApp, leaderEmail, tshirtSizeLeader,
    member2, institution2, tshirtSize2, member3, institution3, tshirtSize3,
    member4, institution4, tshirtSize4, member5, institution5, tshirtSize5,
    projectTitle, projectCategory, participatedBefore, previousCompetition,
    socialMedia, infoSource, ca_code, club_code
  } = data;

  const sql = `
  INSERT INTO temp_registrations (
    paymentID, user_id, competitionCategory, projectSubcategory, categories, crReference,
    leader, institution, leaderPhone, leaderWhatsApp, leaderEmail, tshirtSizeLeader,
    member2, institution2, tshirtSize2, member3, institution3, tshirtSize3,
    member4, institution4, tshirtSize4, member5, institution5, tshirtSize5,
    projectTitle, projectCategory, participatedBefore, previousCompetition,
    socialMedia, infoSource, ca_code, club_code
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

const values = [
  paymentID, user_id, competitionCategory, projectSubcategory, categories, crReference,
  leader, institution, leaderPhone, leaderWhatsApp, leaderEmail, tshirtSizeLeader,
  member2 || null, institution2 || null, tshirtSize2 || null,
  member3 || null, institution3 || null, tshirtSize3 || null,
  member4 || null, institution4 || null, tshirtSize4 || null,
  member5 || null, institution5 || null, tshirtSize5 || null,
  projectTitle, projectCategory, participatedBefore, previousCompetition,
  socialMedia, infoSource, ca_code || null, club_code || null
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
