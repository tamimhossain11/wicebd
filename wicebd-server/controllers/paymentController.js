const { createPayment, executePayment } = require('../utils/bkash');
const db = require('../db');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Configure Hostinger email transporter (singleton)
const emailTransporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com', // Updated to Hostinger's SMTP server
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.HOSTINGER_EMAIL_USER, // contact@wicebd.com
    pass: process.env.HOSTINGER_EMAIL_PASSWORD
  },
  tls: {
    // Only add this if you get certificate errors
    rejectUnauthorized: false
  },
  pool: true, // Enable connection pooling
  maxConnections: 5,
  rateLimit: 5 // Max 5 emails per second
});

const initiatePayment = async (req, res) => {
  console.log("🚀 initiatePayment called with:", req.body); 
  const { paymentID } = req.body;

  if (!paymentID) {
    return res.status(400).json({ error: 'Missing payment ID' });
  }

  try {
    // 1. Get the temp registration data to check competition category
    const [tempData] = await db.query(
      'SELECT competitionCategory FROM temp_registrations WHERE paymentID = ?',
      [paymentID]
    );

    if (tempData.length === 0) {
      return res.status(404).json({ error: 'Registration data not found' });
    }

    const registration = tempData[0];
    
    // 2. Determine amount based on competition category
    const amount = registration.competitionCategory.toLowerCase() === 'megazine' ? 200 : 620;

    // 3. Create payment with dynamic amount
    const result = await createPayment(amount, paymentID);
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
        previousCompetition, socialMedia, infoSource, paymentID, transactionId, paymentStatus
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        registration.competitionCategory, registration.projectSubcategory,
        registration.categories, registration.crRefrence, registration.leader,
        registration.institution, registration.leaderPhone, registration.leaderWhatsApp,
        registration.leaderEmail, registration.tshirtSizeLeader, registration.member2,
        registration.institution2, registration.tshirtSize2, registration.member3,
        registration.institution3, registration.tshirtSize3, registration.projectTitle,
        registration.projectCategory, registration.participatedBefore,
        registration.previousCompetition, registration.socialMedia, 
        registration.infoSource, paymentID, result.trxID, 'Completed'
      ]
    );

    // 6. Send confirmation email (async - don't await)
    sendConfirmationEmail(registration, {
      trxID: result.trxID,
      paymentID: paymentID
    });

    // 7. Cleanup temp data (fire-and-forget)
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

const sendConfirmationEmail = async (registration, paymentDetails) => {
  try {
    const amount = registration.competitionCategory.toLowerCase() === 'magazine' ? 200 : 620;

    const mailOptions = {
      from: '"WICE Registration Team" <contact@wicebd.com>',
      to: registration.leaderEmail,
      subject: `Registration Confirmed - ${registration.projectTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0066cc; padding: 20px; color: white;">
            <h1 style="margin: 0;">WICE Registration Confirmation</h1>
          </div>
          
          <div style="padding: 20px;">
            <p>Dear ${registration.leader},</p>
            <p>Thank you for registering for WICE ${registration.competitionCategory} competition.</p>
            
            <h3 style="color: #0066cc;">Payment Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd; width: 30%;"><strong>Payment ID:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${paymentDetails.paymentID}</td>
              </tr>
              <tr>
               <td style="padding: 8px; border-bottom: 1px solid #ddd; width: 30%;"><strong>Transaction ID:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${paymentDetails.trxID}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Amount:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${amount} BDT</td>
              </tr>
              <tr>
                <td style="padding: 8px;"><strong>Status:</strong></td>
                <td style="padding: 8px;">Completed</td>
              </tr>
            </table>
            
            <h3 style="color: #0066cc; margin-top: 20px;">Team Information</h3>
            <p><strong>Project Title:</strong> ${registration.projectTitle}</p>
            <p><strong>Team Members:</strong></p>
            <ul>
              <li>${registration.leader} (Leader)</li>
              ${registration.member2 ? `<li>${registration.member2}</li>` : ''}
              ${registration.member3 ? `<li>${registration.member3}</li>` : ''}
            </ul>
            
            <div style="background: #f5f5f5; padding: 15px; margin: 20px 0; border-left: 4px solid #0066cc;">
              <h4 style="margin-top: 0;">Next Steps</h4>
              <ol>
                <li>Save this confirmation email</li>
                <li>Join our official participants group</li>
                <li>Check our website for schedule updates</li>
              </ol>
            </div>
            
            <p>For any questions, please contact <a href="mailto:contact@wicebd.com">contact@wicebd.com</a></p>
          </div>
          
          <div style="background: #f5f5f5; padding: 15px; text-align: center; font-size: 12px;">
            <p>WICE Bangladesh &copy; ${new Date().getFullYear()}</p>
            <p><a href="https://www.wicebd.com" style="color: #0066cc;">www.wicebd.com</a></p>
          </div>
        </div>
      `,
      text: `WICE Registration Confirmation\n\n` +
        `Dear ${registration.leader},\n\n` +
        `Thank you for registering for WICE ${registration.competitionCategory} competition.\n\n` +
        `Payment Details:\n` +
        `- Transaction ID: ${registration.trxID}\n` +
        `- Amount: ${amount} BDT\n` +
        `- Status: Completed\n\n` +
        `Team Information:\n` +
        `- Project Title: ${registration.projectTitle}\n` +
        `- Team Members:\n` +
        `  • ${registration.leader} (Leader)\n` +
        `${registration.member2 ? `  • ${registration.member2}\n` : ''}` +
        `${registration.member3 ? `  • ${registration.member3}\n` : ''}\n` +
        `Next Steps:\n` +
        `1. Save this confirmation email\n` +
        `2. Join our official participants group\n` +
        `3. Check our website for schedule updates\n\n` +
        `For questions: contact@wicebd.com\n\n` +
        `WICE Bangladesh\n` +
        `www.wicebd.com`
    };

    await emailTransporter.sendMail(mailOptions);
    console.log(`✅ Confirmation email sent to ${registration.leaderEmail}`);
  } catch (error) {
    console.error('❌ Failed to send confirmation email:', error);
  }
};


module.exports = { initiatePayment, confirmPayment };