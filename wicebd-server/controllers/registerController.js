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
    member6, institution6, tshirtSize6,
    projectTitle, projectCategory, participatedBefore, previousCompetition,
    socialMedia, infoSource, ca_code, club_code, promo_code
  } = data;

  const sql = `
  INSERT INTO temp_registrations (
    paymentID, user_id, competitionCategory, projectSubcategory, categories, crReference,
    leader, institution, leaderPhone, leaderWhatsApp, leaderEmail, tshirtSizeLeader,
    member2, institution2, tshirtSize2, member3, institution3, tshirtSize3,
    member4, institution4, tshirtSize4, member5, institution5, tshirtSize5,
    member6, institution6, tshirtSize6,
    projectTitle, projectCategory, participatedBefore, previousCompetition,
    socialMedia, infoSource, ca_code, club_code, promo_code
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

const n = v => (v === undefined ? null : v || null);

const values = [
  paymentID, user_id, n(competitionCategory), n(projectSubcategory), n(categories), crReference,
  n(leader), n(institution), n(leaderPhone), n(leaderWhatsApp), n(leaderEmail), n(tshirtSizeLeader),
  n(member2), n(institution2), n(tshirtSize2),
  n(member3), n(institution3), n(tshirtSize3),
  n(member4), n(institution4), n(tshirtSize4),
  n(member5), n(institution5), n(tshirtSize5),
  n(member6), n(institution6), n(tshirtSize6),
  n(projectTitle), n(projectCategory), n(participatedBefore), n(previousCompetition),
  n(socialMedia), n(infoSource), n(ca_code), n(club_code), n(promo_code)
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
