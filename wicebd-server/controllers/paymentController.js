const { initiatePayment: paystationInitiate, getTransactionStatus } = require('../utils/paystation');
const db = require('../db');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Configure Hostinger email transporter (singleton)
const emailTransporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.HOSTINGER_EMAIL_USER,
    pass: process.env.HOSTINGER_EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  },
  pool: true,
  maxConnections: 5,
  rateLimit: 5
});

const initiatePayment = async (req, res) => {
  console.log('🚀 initiatePayment called with:', req.body);
  const { paymentID } = req.body;

  if (!paymentID) {
    return res.status(400).json({ error: 'Missing payment ID' });
  }

  try {
    // 1. Get temp registration data
    const [tempData] = await db.query(
      'SELECT competitionCategory, leader, leaderPhone, leaderEmail, member4, member5 FROM temp_registrations WHERE paymentID = ?',
      [paymentID]
    );

    if (tempData.length === 0) {
      return res.status(404).json({ error: 'Registration data not found' });
    }

    const registration = tempData[0];

    // 2. Determine amount based on competition category + extra members (300 BDT each beyond member3)
    const cat = registration.competitionCategory.toLowerCase();
    const baseAmount = cat === 'megazine' ? 10 : cat === 'olympiad' ? 5 : 20;
    const extraMembers = (registration.member4 ? 1 : 0) + (registration.member5 ? 1 : 0);
    const extraCharge = cat === 'megazine' ? 120 : 300;
    const amount = baseAmount + (extraMembers * extraCharge);
    console.log(`💰 Amount: ${baseAmount} base + ${extraMembers} extra member(s) × 300 = ${amount} BDT`);

    // 3. Generate unique numeric invoice number
    const invoiceNumber = `${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // 4. Determine callback URL from frontend base
    const frontendBase = process.env.FRONTEND_BASE_URL.split(',')[0].trim();

    // 5. Initiate PayStation payment
    const result = await paystationInitiate({
      invoiceNumber,
      amount,
      custName: registration.leader,
      custPhone: registration.leaderPhone,
      custEmail: registration.leaderEmail,
      callbackUrl: `${frontendBase}/callback`,
      reference: paymentID,
      checkoutItems: registration.competitionCategory,
    });

    if (result.status_code !== '200') {
      console.error('❌ PayStation initiation failed:', result);
      return res.status(400).json({ error: result.message || 'Payment initiation failed' });
    }

    // 6. Store invoice_number in temp_registrations (reusing bkash_payment_id column)
    await db.query(
      'UPDATE temp_registrations SET bkash_payment_id = ? WHERE paymentID = ?',
      [invoiceNumber, paymentID]
    );

    console.log(`📝 PayStation payment initiated. Invoice: ${invoiceNumber}`);
    res.json({ payment_url: result.payment_url, invoice_number: invoiceNumber });
  } catch (error) {
    console.error('❌ Error in initiatePayment:', error.message);
    res.status(500).json({ error: 'Failed to initiate payment' });
  }
};

const confirmPayment = async (req, res) => {
  const { invoice_number, trx_id, status } = req.body;

  console.log('🔔 confirmPayment called:', { invoice_number, trx_id, status });

  if (!invoice_number) {
    return res.status(400).json({ success: false, message: 'Missing invoice number' });
  }

  if (status !== 'Successful') {
    return res.status(400).json({ success: false, message: 'Payment not successful' });
  }

  try {
    // 1. Verify with PayStation transaction-status API
    const statusResult = await getTransactionStatus(invoice_number);
    console.log('🔍 PayStation status result:', JSON.stringify(statusResult));

    const statusCode = String(statusResult?.status_code ?? '');
    const trxStatus = (statusResult?.data?.trx_status || '').toLowerCase();

    if (statusCode !== '200' || (trxStatus !== 'success' && trxStatus !== 'successful')) {
      console.error('❌ PayStation verification failed:', statusResult);
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    const verifiedTrxId = statusResult.data.trx_id || trx_id;

    // 2. Get temp registration by invoice_number (stored in bkash_payment_id column)
    const [tempData] = await db.query(
      'SELECT * FROM temp_registrations WHERE bkash_payment_id = ?',
      [invoice_number]
    );

    if (tempData.length === 0) {
      return res.status(404).json({ success: false, message: 'Original registration data not found' });
    }

    const registration = tempData[0];
    const category = registration.competitionCategory?.toLowerCase();

    // 3. Check for duplicate registration
    if (category === 'olympiad') {
      const [existing] = await db.query(
        'SELECT id FROM olympiad_registrations WHERE email = ?',
        [registration.leaderEmail]
      );
      if (existing.length > 0) {
        return res.json({ success: true, message: 'Payment already processed' });
      }
    } else {
      const [existing] = await db.query(
        'SELECT id FROM registrations WHERE paymentID = ?',
        [invoice_number]
      );
      if (existing.length > 0) {
        return res.json({ success: true, message: 'Payment already processed' });
      }
    }

    // 4. Insert into the appropriate final table
    if (category === 'olympiad') {
      const { v4: uuidv4 } = require('uuid');
      const registrationId = `OLY-${uuidv4().substring(0, 8).toUpperCase()}`;

      // Verify user_id exists
      let verified_user_id = null;
      if (registration.user_id) {
        const [userRow] = await db.query('SELECT id FROM users WHERE id = ?', [registration.user_id]);
        if (userRow.length > 0) verified_user_id = registration.user_id;
      }

      await db.query(
        `INSERT INTO olympiad_registrations (
          registration_id, user_id, full_name, email, phone,
          address, institution, cr_reference, ca_code, club_code, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          registrationId, verified_user_id, registration.leader,
          registration.leaderEmail, registration.leaderPhone,
          registration.projectTitle,  // address stored here
          registration.institution, registration.crRefrence || '',
          registration.ca_code || null, registration.club_code || null,
          'registered'
        ]
      );

      sendOlympiadConfirmationEmail(registration, { trxID: verifiedTrxId, invoiceNumber: invoice_number, registrationId });
    } else {
      await db.query(
        `INSERT INTO registrations (
          user_id,
          competitionCategory,
          projectSubcategory, categories, crReference,
          leader, institution, leaderPhone, leaderWhatsApp,
          leaderEmail, tshirtSizeLeader,
          member2, institution2, tshirtSize2,
          member3, institution3, tshirtSize3,
          member4, institution4, tshirtSize4,
          member5, institution5, tshirtSize5,
          projectTitle, projectCategory, participatedBefore,
          previousCompetition, socialMedia, infoSource, paymentID, bkashTrxId
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          registration.user_id || null,
          registration.competitionCategory, registration.projectSubcategory,
          registration.categories, registration.crRefrence, registration.leader,
          registration.institution, registration.leaderPhone, registration.leaderWhatsApp,
          registration.leaderEmail, registration.tshirtSizeLeader,
          registration.member2 || null, registration.institution2 || null, registration.tshirtSize2 || null,
          registration.member3 || null, registration.institution3 || null, registration.tshirtSize3 || null,
          registration.member4 || null, registration.institution4 || null, registration.tshirtSize4 || null,
          registration.member5 || null, registration.institution5 || null, registration.tshirtSize5 || null,
          registration.projectTitle, registration.projectCategory, registration.participatedBefore,
          registration.previousCompetition, registration.socialMedia,
          registration.infoSource, invoice_number, verifiedTrxId
        ]
      );

      sendConfirmationEmail(registration, { trxID: verifiedTrxId, invoiceNumber: invoice_number });
    }

    // 6. Cleanup temp data (fire-and-forget)
    db.query(
      'DELETE FROM temp_registrations WHERE bkash_payment_id = ?',
      [invoice_number]
    ).catch(err => {
      console.error('Temp data cleanup failed:', err);
    });

    return res.json({
      success: true,
      message: 'Registration completed successfully',
      invoice_number,
      trx_id: verifiedTrxId
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
    const amount = registration.competitionCategory.toLowerCase() === 'megazine' ? 200 : 620;

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
                <td style="padding: 8px; border-bottom: 1px solid #ddd; width: 30%;"><strong>Invoice Number:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${paymentDetails.invoiceNumber}</td>
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
              ${registration.member4 ? `<li>${registration.member4}</li>` : ''}
              ${registration.member5 ? `<li>${registration.member5}</li>` : ''}
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
        `- Invoice Number: ${paymentDetails.invoiceNumber}\n` +
        `- Transaction ID: ${paymentDetails.trxID}\n` +
        `- Amount: ${amount} BDT\n` +
        `- Status: Completed\n\n` +
        `Team Information:\n` +
        `- Project Title: ${registration.projectTitle}\n` +
        `- Team Members:\n` +
        `  • ${registration.leader} (Leader)\n` +
        `${registration.member2 ? `  • ${registration.member2}\n` : ''}` +
        `${registration.member3 ? `  • ${registration.member3}\n` : ''}` +
        `${registration.member4 ? `  • ${registration.member4}\n` : ''}` +
        `${registration.member5 ? `  • ${registration.member5}\n` : ''}\n` +
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

const sendOlympiadConfirmationEmail = async (registration, paymentDetails) => {
  try {
    const mailOptions = {
      from: '"WICE Olympiad" <contact@wicebd.com>',
      to: registration.leaderEmail,
      subject: 'WICE Olympiad Registration Confirmed',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #8b0000; padding: 20px; color: white; text-align: center;">
            <h2 style="margin: 0;">WICE Olympiad Registration Confirmation</h2>
          </div>
          <div style="padding: 25px; background: #f9f9f9;">
            <p>Dear ${registration.leader},</p>
            <p>Your payment was successful and your Olympiad registration is confirmed.</p>
            <div style="background: white; border-left: 4px solid #8b0000; padding: 15px; margin: 20px 0;">
              <h3 style="color: #8b0000; margin-top: 0;">Payment Details</h3>
              <p><strong>Registration ID:</strong> ${paymentDetails.registrationId}</p>
              <p><strong>Invoice Number:</strong> ${paymentDetails.invoiceNumber}</p>
              <p><strong>Transaction ID:</strong> ${paymentDetails.trxID}</p>
              <p><strong>Amount:</strong> 50 BDT</p>
              <p><strong>Status:</strong> Completed</p>
            </div>
            <p>We will contact you soon with further details about the competition schedule.</p>
            <p>For any questions, please contact <a href="mailto:contact@wicebd.com">contact@wicebd.com</a></p>
          </div>
          <div style="background: #eee; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            <p>WICE Bangladesh &copy; ${new Date().getFullYear()}</p>
          </div>
        </div>
      `
    };
    await emailTransporter.sendMail(mailOptions);
    console.log(`✅ Olympiad confirmation email sent to ${registration.leaderEmail}`);
  } catch (error) {
    console.error('❌ Failed to send Olympiad confirmation email:', error);
  }
};

module.exports = { initiatePayment, confirmPayment };
