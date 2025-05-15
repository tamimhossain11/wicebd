const db = require('../db');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');

// Configure email transporter (shared with other forms)
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

const registerParticipant = async (req, res) => {
  const { 
    fullName, 
    email, 
    phone, 
    address, 
    institution, 
    crReference = '' 
  } = req.body;

  // Basic validation
  if (!fullName || !email || !phone || !address || !institution) {
    return res.status(400).json({ 
      success: false,
      message: 'All required fields must be provided' 
    });
  }

  // Generate unique registration ID
  const registrationId = `OLY-${uuidv4().substr(0, 8).toUpperCase()}`;

  try {
    // Check if email already registered
    const [existing] = await db.query(
      'SELECT id FROM olympiad_registrations WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'This email is already registered'
      });
    }

    // Insert into database
    await db.query(
      `INSERT INTO olympiad_registrations (
        registration_id,
        full_name,
        email,
        phone,
        address,
        institution,
        cr_reference,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        registrationId,
        fullName,
        email,
        phone,
        address,
        institution,
        crReference,
        'registered' // initial status
      ]
    );

    // Send confirmation email
    await sendConfirmationEmail({
      fullName,
      email,
      registrationId
    });

    res.json({
      success: true,
      message: 'Registration successful',
      registrationId
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process registration',
      error: error.message
    });
  }
};

const sendConfirmationEmail = async ({ fullName, email, registrationId }) => {
  try {
    const mailOptions = {
      from: `"WICE Olympiad" <${process.env.HOSTINGER_EMAIL_USER}>`,
      to: email,
      subject: 'WICE Olympiad Registration Confirmation',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="background: #8b0000; padding: 20px; color: white; text-align: center;">
            <h2 style="margin: 0;">WICE Olympiad Registration</h2>
          </div>
          
          <div style="padding: 25px; background: #f9f9f9;">
            <p>Dear ${fullName},</p>
            <p>Thank you for registering for the WICE Olympiad competition.</p>
            
            <div style="background: white; border-left: 4px solid #8b0000; padding: 15px; margin: 20px 0;">
              <h3 style="color: #8b0000; margin-top: 0;">Registration Details</h3>
              <p><strong>Registration ID:</strong> ${registrationId}</p>
              <p><strong>Status:</strong> Registered</p>
            </div>
            
            <p>We will contact you soon with further details about the competition schedule.</p>
            
            <p>For any questions, please contact <a href="mailto:olympiad@wicebd.com">olympiad@wicebd.com</a></p>
          </div>
          
          <div style="background: #eee; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            <p>WICE Olympiad &copy; ${new Date().getFullYear()}</p>
          </div>
        </div>
      `
    };

    await emailTransporter.sendMail(mailOptions);
    console.log(`Confirmation email sent to ${email}`);
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
    // Don't fail the registration if email fails
  }
};

module.exports = {
  registerParticipant
};