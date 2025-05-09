const { createPayment, executePayment } = require('../utils/bkash');
const db = require('../db');

const initiatePayment = async (req, res) => {
  console.log("🚀 initiatePayment called with:", req.body); 
  const { paymentID, formData } = req.body;

  if (!paymentID) {
    return res.status(400).json({ error: 'Missing payment ID' });
  }

  try {
    const result = await createPayment(1, paymentID); // Pass amount & paymentID
    res.json(result); // Result will contain bKash payment URL or details
  } catch (error) {
    console.error('❌ Error in initiatePayment:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to initiate payment' });
  }
};


const confirmPayment = async (req, res) => {
  const { paymentID } = req.body;

  try {
    const result = await executePayment(paymentID);

    if (result.transactionStatus === 'Completed') {
      const fetchSql = `SELECT * FROM temp_registrations WHERE paymentID = ?`;
      db.query(fetchSql, [paymentID], (err, rows) => {
        if (err || rows.length === 0) {
          return res.status(404).json({ error: 'No temp data found' });
        }

        const data = rows[0];

        const insertSql = `
          INSERT INTO registrations (
            participantCategory, country, competitionCategory, projectSubcategory, categories, crRefrence,
            leader, institution, leaderPhone, leaderWhatsApp, leaderEmail, tshirtSizeLeader,
            member2, institution2, tshirtSize2,
            member3, institution3, tshirtSize3,
            projectTitle, projectCategory, participatedBefore, previousCompetition,
            socialMedia, infoSource, paymentID
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(insertSql, [
          data.participantCategory, data.country, data.competitionCategory, data.projectSubcategory, data.categories, data.crRefrence,
          data.leader, data.institution, data.leaderPhone, data.leaderWhatsApp, data.leaderEmail, data.tshirtSizeLeader,
          data.member2, data.institution2, data.tshirtSize2,
          data.member3, data.institution3, data.tshirtSize3,
          data.projectTitle, data.projectCategory, data.participatedBefore, data.previousCompetition,
          data.socialMedia, data.infoSource, paymentID
        ], (err2) => {
          if (err2) {
            console.error('Final insert error:', err2);
            return res.status(500).json({ error: 'Failed to save final registration' });
          }

          // Clean up
          db.query(`DELETE FROM temp_registrations WHERE paymentID = ?`, [paymentID]);
          res.json({ success: true, message: 'Registration completed' });
        });
      });
    } else {
      res.status(400).json({ error: 'Payment not completed' });
    }
  } catch (err) {
    console.error('Execution error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Payment confirmation failed' });
  }
};


module.exports = { initiatePayment, confirmPayment };
