const { createPayment, executePayment } = require('../utils/bkash');
const db = require('../db');

const initiatePayment = async (req, res) => {
  console.log("🚀 initiatePayment called with:", req.body); 
  const { paymentID, formData } = req.body;

  if (!paymentID) {
    return res.status(400).json({ error: 'Missing payment ID' });
  }

  try {
    const result = await createPayment(620, paymentID); // your existing call
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
  const { paymentID } = req.body;

  try {
    // 1. Execute payment with bKash
    const result = await executePayment(paymentID);
    
    // 2. Validate payment status
    if (result.transactionStatus !== 'Completed' && result.statusCode !== '2029') {
      return res.status(400).json({ 
        success: false,
        message: 'Payment not completed' 
      });
    }

    // 3. Check for existing registration
    const [existing] = await db.query(
      'SELECT id FROM registrations WHERE paymentID = ?', 
      [paymentID]
    );

    if (existing.length > 0) {
      return res.json({ 
        success: true,
        message: 'Payment already processed' 
      });
    }

    // 4. Get temp registration data
    const [tempData] = await db.query(
      'SELECT * FROM temp_registrations WHERE bkash_payment_id = ?',
      [paymentID]
    );

    if (tempData.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Original registration data not found'
      });
    }

    const registration = tempData[0];

    // 5. Insert into final table
    await db.query(
      `INSERT INTO registrations (
        competitionCategory, 
        projectSubcategory, categories, crRefrence,
        leader, institution, leaderPhone, leaderWhatsApp,
        leaderEmail, tshirtSizeLeader, member2, institution2,
        tshirtSize2, member3, institution3, tshirtSize3,
        projectTitle, projectCategory, participatedBefore,
        previousCompetition, socialMedia, infoSource, paymentID
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        registration.competitionCategory, registration.projectSubcategory,
        registration.categories, registration.crRefrence, registration.leader,
        registration.institution, registration.leaderPhone, registration.leaderWhatsApp,
        registration.leaderEmail, registration.tshirtSizeLeader, registration.member2,
        registration.institution2, registration.tshirtSize2, registration.member3,
        registration.institution3, registration.tshirtSize3, registration.projectTitle,
        registration.projectCategory, registration.participatedBefore,
        registration.previousCompetition, registration.socialMedia, 
        registration.infoSource, paymentID
      ]
    );

    // 6. Cleanup temp data (fire-and-forget)
    db.query(
      'DELETE FROM temp_registrations WHERE bkash_payment_id = ?',
      [paymentID]
    ).catch(err => {
      console.error('Temp data cleanup failed:', err);
    });

    return res.json({
      success: true,
      message: 'Registration completed successfully',
      paymentID,
      trxID: result.trxID
    });

  } catch (error) {
    console.error('Payment confirmation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Payment processing failed',
      error: error.message
    });
  }
};
module.exports = { initiatePayment, confirmPayment };
