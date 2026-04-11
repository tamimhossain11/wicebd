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
    const baseAmount = cat === 'megazine' ? 20 : cat === 'olympiad' ? 10 : 300;
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

/* ─── Shared email base layout ─────────────────────────────────────── */
const emailBase = (bodyHtml) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>WICEBD 2025</title>
</head>
<body style="margin:0;padding:0;background:#0d0006;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0006;padding:32px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

      <!-- HEADER -->
      <tr>
        <td style="background:linear-gradient(135deg,#1a0008 0%,#2a000f 100%);border-radius:20px 20px 0 0;padding:36px 40px 28px;text-align:center;border-bottom:3px solid #800020;">
          <img src="https://www.wicebd.com/images/logo.png" alt="WICEBD" width="120" style="max-width:120px;margin-bottom:16px;display:block;margin-left:auto;margin-right:auto;" />
          <div style="font-size:11px;letter-spacing:0.22em;font-weight:700;color:#800020;text-transform:uppercase;margin-bottom:6px;">World Invention Competition &amp; Exhibition</div>
          <h1 style="color:#ffffff;font-size:22px;font-weight:800;margin:0;letter-spacing:-0.3px;">Bangladesh 2025</h1>
        </td>
      </tr>

      <!-- BODY -->
      <tr>
        <td style="background:#100008;padding:36px 40px;">
          ${bodyHtml}
        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td style="background:#0a0004;border-radius:0 0 20px 20px;padding:24px 40px;text-align:center;border-top:1px solid rgba(128,0,32,0.25);">
          <p style="color:rgba(255,255,255,0.35);font-size:12px;margin:0 0 8px;">
            &copy; ${new Date().getFullYear()} WICE Bangladesh &bull; All rights reserved
          </p>
          <a href="https://www.wicebd.com" style="color:#800020;font-size:12px;text-decoration:none;font-weight:600;">www.wicebd.com</a>
          &nbsp;&bull;&nbsp;
          <a href="mailto:contact@wicebd.com" style="color:#800020;font-size:12px;text-decoration:none;">contact@wicebd.com</a>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;

/* ─── Reusable email sub-components ──────────────────────────────── */
const infoRow = (label, value, last = false) => `
  <tr>
    <td style="padding:12px 16px;font-size:13px;color:rgba(255,255,255,0.5);width:42%;border-bottom:${last ? 'none' : '1px solid rgba(255,255,255,0.07)'};">${label}</td>
    <td style="padding:12px 16px;font-size:13px;color:#fff;font-weight:600;border-bottom:${last ? 'none' : '1px solid rgba(255,255,255,0.07)'};">${value || '—'}</td>
  </tr>`;

const memberRow = (name, role, extra = false) => `
  <div style="display:flex;align-items:center;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
    <div style="width:32px;height:32px;border-radius:50%;background:${extra ? 'rgba(16,185,129,0.15)' : 'rgba(128,0,32,0.2)'};border:1px solid ${extra ? 'rgba(16,185,129,0.3)' : 'rgba(128,0,32,0.35)'};display:inline-flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:${extra ? '#10b981' : '#c0002a'};margin-right:12px;flex-shrink:0;">${role === 'Leader' ? 'L' : role}</div>
    <div>
      <div style="color:#fff;font-size:14px;font-weight:600;">${name}</div>
      ${role ? `<div style="color:rgba(255,255,255,0.4);font-size:11px;margin-top:2px;">${role}${extra ? ' · Extra member' : ''}</div>` : ''}
    </div>
  </div>`;

const sectionTitle = (text) => `
  <div style="display:flex;align-items:center;gap:10px;margin:28px 0 14px;">
    <div style="width:3px;height:16px;border-radius:2px;background:#800020;display:inline-block;"></div>
    <span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.14em;color:rgba(255,255,255,0.4);">${text}</span>
  </div>`;

const statusBadge = `<span style="display:inline-block;padding:5px 14px;border-radius:50px;background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.3);color:#10b981;font-size:12px;font-weight:700;">&#10003; Payment Confirmed</span>`;

const gatewayBadge = `<span style="display:inline-block;padding:5px 14px;border-radius:50px;background:rgba(6,182,212,0.12);border:1px solid rgba(6,182,212,0.3);color:#06b6d4;font-size:12px;font-weight:700;">PayStation</span>`;

/* ─── Project / Wall Magazine confirmation email ─────────────────── */
const sendConfirmationEmail = async (registration, paymentDetails) => {
  try {
    const cat = (registration.competitionCategory || '').toLowerCase();
    const isWallMag = cat === 'megazine';
    const categoryLabel = isWallMag ? 'Wall Magazine' : 'Project';
    const baseAmount = isWallMag ? 10 : 20;
    const extraMembers = (registration.member4 ? 1 : 0) + (registration.member5 ? 1 : 0);
    const extraCharge = isWallMag ? 120 : 300;
    const totalAmount = baseAmount + (extraMembers * extraCharge);

    const members = [
      registration.leader     ? memberRow(registration.leader,  'Leader') : '',
      registration.member2    ? memberRow(registration.member2, '2') : '',
      registration.member3    ? memberRow(registration.member3, '3') : '',
      registration.member4    ? memberRow(registration.member4, '4', true) : '',
      registration.member5    ? memberRow(registration.member5, '5', true) : '',
    ].join('');

    const body = `
      <!-- Greeting -->
      <p style="color:rgba(255,255,255,0.55);font-size:14px;margin:0 0 4px;">Dear</p>
      <h2 style="color:#fff;font-size:20px;font-weight:800;margin:0 0 6px;">${registration.leader}</h2>
      <p style="color:rgba(255,255,255,0.5);font-size:14px;margin:0 0 24px;line-height:1.7;">
        Your <strong style="color:#fff;">${categoryLabel}</strong> registration for <strong style="color:#fff;">WICEBD 2025</strong> is confirmed and your payment has been processed successfully.
      </p>

      <!-- Status badges -->
      <div style="margin-bottom:28px;">${statusBadge}&nbsp;&nbsp;${gatewayBadge}</div>

      <!-- Payment details -->
      ${sectionTitle('Payment Details')}
      <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;overflow:hidden;">
        ${infoRow('Invoice Number', paymentDetails.invoiceNumber)}
        ${infoRow('Transaction ID', paymentDetails.trxID)}
        ${infoRow('Amount Paid', `৳${totalAmount.toLocaleString()} BDT`)}
        ${infoRow('Payment Method', 'bKash via PayStation')}
        ${infoRow('Status', '&#10003; Completed', true)}
      </table>

      <!-- Registration details -->
      ${sectionTitle('Registration Details')}
      <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;overflow:hidden;">
        ${infoRow('Category', categoryLabel)}
        ${infoRow(isWallMag ? 'Magazine Title' : 'Project Title', registration.projectTitle)}
        ${!isWallMag && registration.projectSubcategory ? infoRow('Subcategory', registration.projectSubcategory) : ''}
        ${registration.categories ? infoRow('Education Level', registration.categories) : ''}
        ${infoRow('Institution', registration.institution)}
        ${infoRow('Email', registration.leaderEmail)}
        ${infoRow('Phone', registration.leaderPhone, true)}
      </table>

      <!-- Team members -->
      ${sectionTitle('Team Members')}
      <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:16px 20px;">
        ${members}
      </div>

      <!-- Next steps -->
      ${sectionTitle('What Happens Next')}
      <div style="background:rgba(128,0,32,0.08);border:1px solid rgba(128,0,32,0.2);border-radius:12px;padding:20px 24px;">
        ${['Save this email as proof of your registration.', 'Join our official participants\' group — invite link coming soon.', 'Monitor wicebd.com for competition schedule and updates.'].map((t, i) => `
          <div style="display:flex;gap:14px;align-items:flex-start;padding:8px 0;${i < 2 ? 'border-bottom:1px solid rgba(255,255,255,0.06);' : ''}">
            <span style="width:24px;height:24px;border-radius:50%;background:rgba(128,0,32,0.3);border:1px solid rgba(128,0,32,0.5);color:#c0002a;font-size:11px;font-weight:800;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;">${i + 1}</span>
            <span style="color:rgba(255,255,255,0.6);font-size:13px;line-height:1.6;padding-top:3px;">${t}</span>
          </div>`).join('')}
      </div>

      <p style="color:rgba(255,255,255,0.35);font-size:13px;margin:24px 0 0;line-height:1.7;">
        Questions? Email us at <a href="mailto:contact@wicebd.com" style="color:#c0002a;text-decoration:none;font-weight:600;">contact@wicebd.com</a>
      </p>`;

    await emailTransporter.sendMail({
      from: `"WICEBD 2025" <contact@wicebd.com>`,
      to: registration.leaderEmail,
      subject: `Registration Confirmed — WICEBD 2025 ${categoryLabel} · ${registration.projectTitle}`,
      html: emailBase(body),
      text: `WICEBD 2025 ${categoryLabel} Registration Confirmed\n\nDear ${registration.leader},\n\nYour registration is confirmed.\n\nInvoice: ${paymentDetails.invoiceNumber}\nTransaction ID: ${paymentDetails.trxID}\nAmount: ৳${totalAmount} BDT\nStatus: Completed\n\nProject: ${registration.projectTitle}\nInstitution: ${registration.institution}\n\nFor questions: contact@wicebd.com\nwww.wicebd.com`,
    });
    console.log(`✅ ${categoryLabel} confirmation email sent to ${registration.leaderEmail}`);
  } catch (error) {
    console.error('❌ Failed to send confirmation email:', error);
  }
};

/* ─── Olympiad confirmation email ────────────────────────────────── */
const sendOlympiadConfirmationEmail = async (registration, paymentDetails) => {
  try {
    const body = `
      <!-- Greeting -->
      <p style="color:rgba(255,255,255,0.55);font-size:14px;margin:0 0 4px;">Dear</p>
      <h2 style="color:#fff;font-size:20px;font-weight:800;margin:0 0 6px;">${registration.leader}</h2>
      <p style="color:rgba(255,255,255,0.5);font-size:14px;margin:0 0 24px;line-height:1.7;">
        Your registration for the <strong style="color:#fff;">WICEBD 2025 Science Olympiad</strong> is confirmed. Welcome aboard!
      </p>

      <!-- Status badges -->
      <div style="margin-bottom:28px;">${statusBadge}&nbsp;&nbsp;${gatewayBadge}</div>

      <!-- Registration ID highlight -->
      <div style="background:linear-gradient(135deg,rgba(128,0,32,0.18),rgba(192,0,42,0.08));border:1px solid rgba(128,0,32,0.35);border-radius:14px;padding:20px 24px;text-align:center;margin-bottom:24px;">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.14em;color:rgba(255,255,255,0.4);margin-bottom:6px;">Your Registration ID</div>
        <div style="font-size:26px;font-weight:900;color:#fff;letter-spacing:0.05em;">${paymentDetails.registrationId}</div>
        <div style="font-size:11px;color:rgba(255,255,255,0.3);margin-top:4px;">Keep this ID for future reference</div>
      </div>

      <!-- Payment details -->
      ${sectionTitle('Payment Details')}
      <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;overflow:hidden;">
        ${infoRow('Invoice Number', paymentDetails.invoiceNumber)}
        ${infoRow('Transaction ID', paymentDetails.trxID)}
        ${infoRow('Amount Paid', '৳5 BDT')}
        ${infoRow('Payment Method', 'bKash via PayStation')}
        ${infoRow('Status', '&#10003; Completed', true)}
      </table>

      <!-- Participant details -->
      ${sectionTitle('Participant Details')}
      <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;overflow:hidden;">
        ${infoRow('Full Name', registration.leader)}
        ${infoRow('Email', registration.leaderEmail)}
        ${infoRow('Phone', registration.leaderPhone)}
        ${infoRow('Institution', registration.institution)}
        ${infoRow('Address', registration.projectTitle, true)}
      </table>

      <!-- Next steps -->
      ${sectionTitle('What Happens Next')}
      <div style="background:rgba(128,0,32,0.08);border:1px solid rgba(128,0,32,0.2);border-radius:12px;padding:20px 24px;">
        ${['Save your Registration ID — you will need it on competition day.', 'Check your email for the competition schedule and venue details.', 'Follow wicebd.com and our social media for updates and announcements.'].map((t, i) => `
          <div style="display:flex;gap:14px;align-items:flex-start;padding:8px 0;${i < 2 ? 'border-bottom:1px solid rgba(255,255,255,0.06);' : ''}">
            <span style="width:24px;height:24px;border-radius:50%;background:rgba(128,0,32,0.3);border:1px solid rgba(128,0,32,0.5);color:#c0002a;font-size:11px;font-weight:800;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;">${i + 1}</span>
            <span style="color:rgba(255,255,255,0.6);font-size:13px;line-height:1.6;padding-top:3px;">${t}</span>
          </div>`).join('')}
      </div>

      <p style="color:rgba(255,255,255,0.35);font-size:13px;margin:24px 0 0;line-height:1.7;">
        Questions? Email us at <a href="mailto:contact@wicebd.com" style="color:#c0002a;text-decoration:none;font-weight:600;">contact@wicebd.com</a>
      </p>`;

    await emailTransporter.sendMail({
      from: `"WICEBD 2025 Olympiad" <contact@wicebd.com>`,
      to: registration.leaderEmail,
      subject: `Olympiad Registration Confirmed — WICEBD 2025 · ${paymentDetails.registrationId}`,
      html: emailBase(body),
      text: `WICEBD 2025 Science Olympiad — Registration Confirmed\n\nDear ${registration.leader},\n\nYour Olympiad registration is confirmed.\n\nRegistration ID: ${paymentDetails.registrationId}\nInvoice: ${paymentDetails.invoiceNumber}\nTransaction ID: ${paymentDetails.trxID}\nAmount: ৳5 BDT\nStatus: Completed\n\nInstitution: ${registration.institution}\n\nFor questions: contact@wicebd.com\nwww.wicebd.com`,
    });
    console.log(`✅ Olympiad confirmation email sent to ${registration.leaderEmail}`);
  } catch (error) {
    console.error('❌ Failed to send Olympiad confirmation email:', error);
  }
};

module.exports = { initiatePayment, confirmPayment };
