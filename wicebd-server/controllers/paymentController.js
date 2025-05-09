const { createPayment, executePayment } = require('../utils/bkash');
const db = require('../db');

const initiatePayment = async (req, res) => {
  console.log("🚀 initiatePayment called with:", req.body); 
  const { paymentID, formData } = req.body;

  if (!paymentID) {
    return res.status(400).json({ error: 'Missing payment ID' });
  }

  try {
    const result = await createPayment(1, paymentID); // your existing call
    const bkashPaymentID = result.paymentID;

    await db.query(
      `UPDATE temp_registrations SET bkash_payment_id = ? WHERE paymentID = ?`,
      [bkashPaymentID, paymentID]
    );    


    console.log(`📝 Updated registration with bKash paymentID: ${bkashPaymentID}`);
    res.json(result);
  } catch (error) {
    console.error('❌ Error in initiatePayment:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to initiate payment' });
  }
};



const confirmPayment = async (req, res) => {
  const { paymentID } = req.body; // bKash paymentID (e.g., TR00...)

  try {
    // Step 0: Execute payment with bKash API
    const result = await executePayment(paymentID);

    if (
      result.transactionStatus !== 'Completed' &&
      result.statusCode !== '2029' // '2029' = already completed (duplicate execution)
    ) {
      return res.status(400).json({ error: 'Payment not completed yet' });
    }

    // Step 1: Check if already in `registrations` table
    const checkSql = 'SELECT * FROM registrations WHERE paymentID = ?';
    db.query(checkSql, [paymentID], (checkErr, existingRows) => {
      if (checkErr) {
        console.error('🔴 DB error while checking registration:', checkErr);
        return res.status(500).json({ error: 'Database error during check' });
      }

      if (existingRows.length > 0) {
        console.log(`✅ Payment already processed for paymentID: ${paymentID}`);
        return res.json({ success: true, message: 'Payment already processed' });
      }

      // Step 2: Get data from temp_registrations using bKash paymentID
      const fetchSql = 'SELECT * FROM temp_registrations WHERE bkash_payment_id = ?';
      db.query(fetchSql, [paymentID], (fetchErr, rows) => {
        if (fetchErr) {
          console.error('🔴 Error fetching temp data:', fetchErr);
          return res.status(500).json({ error: 'Error fetching temp data' });
        }

        if (rows.length === 0) {
          console.warn(`❗ No temp data found for paymentID: ${paymentID}`);
          return res.status(404).json({ error: 'No data found to confirm' });
        }

        const data = rows[0];

        // Step 3: Move to final `registrations` table
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

        const values = [
          data.participantCategory, data.country, data.competitionCategory, data.projectSubcategory, data.categories, data.crRefrence,
          data.leader, data.institution, data.leaderPhone, data.leaderWhatsApp, data.leaderEmail, data.tshirtSizeLeader,
          data.member2, data.institution2, data.tshirtSize2,
          data.member3, data.institution3, data.tshirtSize3,
          data.projectTitle, data.projectCategory, data.participatedBefore, data.previousCompetition,
          data.socialMedia, data.infoSource, paymentID
        ];

        db.query(insertSql, values, (insertErr) => {
          if (insertErr) {
            console.error('❌ Error inserting into registrations:', insertErr);
            return res.status(500).json({ error: 'Failed to insert registration' });
          }

          // Step 4: Clean up temp data
          db.query(
            'DELETE FROM temp_registrations WHERE bkash_payment_id = ?',
            [paymentID],
            (deleteErr) => {
              if (deleteErr) {
                console.warn('⚠️ Warning: Failed to delete temp data:', deleteErr);
              }

              console.log(`✅ Payment confirmed and registered: ${paymentID}`);
              return res.json({ success: true, message: 'Registration completed' });
            }
          );
        });
      });
    });
  } catch (err) {
    console.error('❌ Payment execution failed:', err.response?.data || err.message);
    return res.status(500).json({ error: 'Payment confirmation failed' });
  }
};


module.exports = { initiatePayment, confirmPayment };
