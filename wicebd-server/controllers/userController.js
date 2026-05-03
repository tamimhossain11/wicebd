const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const nodemailer = require('nodemailer');
const db = require('../db');
require('dotenv').config();

// Email transporter (reuse Hostinger SMTP)
const emailTransporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.HOSTINGER_EMAIL_USER,
    pass: process.env.HOSTINGER_EMAIL_PASSWORD,
  },
  tls: { rejectUnauthorized: false },
});

const sendWelcomeEmail = async (name, email) => {
  try {
    const frontendUrl = process.env.FRONTEND_BASE_URL || 'https://www.wicebd.com';
    await emailTransporter.sendMail({
      from: '"WICE Registration Team" <contact@wicebd.com>',
      to: email,
      subject: 'Welcome to WICE Bangladesh — Account Created!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0f0f1a; padding: 24px 20px; text-align: center;">
            <img src="${frontendUrl}/images/logo-2.png" alt="WICE Bangladesh" style="height: 50px; object-fit: contain;" />
          </div>
          <div style="background: #fff; padding: 32px 28px;">
            <h2 style="color: #0f0f1a; margin-top: 0;">Welcome, ${name}!</h2>
            <p style="color: #444; line-height: 1.7;">
              Your WICE Bangladesh account has been successfully created. You can now log in to your dashboard and register for our competitions.
            </p>
            <h3 style="color: #e94560;">Available Competitions</h3>
            <ul style="color: #444; line-height: 2;">
              <li><strong>Project Competition</strong> — Team projects in Technology, Science &amp; Social Innovation</li>
              <li><strong>Science Olympiad</strong> — Individual olympiad for school &amp; college students</li>
              <li><strong>Robo Sumo</strong> — Team robot-building &amp; programming tournament</li>
            </ul>
            <div style="margin: 28px 0; text-align: center;">
              <a href="${frontendUrl}/dashboard"
                style="background: #e94560; color: #fff; padding: 14px 32px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 15px;">
                Go to My Dashboard
              </a>
            </div>
            <p style="color: #666; font-size: 13px;">
              If you did not create this account, please ignore this email or contact us at
              <a href="mailto:contact@wicebd.com" style="color: #e94560;">contact@wicebd.com</a>.
            </p>
          </div>
          <div style="background: #f5f5f5; padding: 14px; text-align: center; font-size: 12px; color: #999;">
            <p>WICE Bangladesh &copy; ${new Date().getFullYear()} &nbsp;|&nbsp;
              <a href="${frontendUrl}" style="color: #e94560;">www.wicebd.com</a>
            </p>
          </div>
        </div>
      `,
    });
    console.log(`✅ Welcome email sent to ${email}`);
  } catch (err) {
    console.error('❌ Failed to send welcome email:', err.message);
    // Non-fatal — don't throw
  }
};

// Helper: generate a user JWT
const signUserToken = (user) => {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: 'user', avatar: user.avatar },
    process.env.USER_JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// ─── Sign Up ──────────────────────────────────────────────────────────────────
const signUp = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
  }

  try {
    // Check existing user
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email.toLowerCase()]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      'INSERT INTO users (name, email, password, provider) VALUES (?, ?, ?, ?)',
      [name.trim(), email.toLowerCase(), hashedPassword, 'local']
    );

    const user = { id: result.insertId, name: name.trim(), email: email.toLowerCase(), avatar: null };
    const token = signUserToken(user);

    // Fire-and-forget welcome email
    sendWelcomeEmail(user.name, user.email);

    res.status(201).json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar }
    });
  } catch (error) {
    console.error('SignUp error:', error);
    res.status(500).json({ success: false, message: 'Server error during sign up' });
  }
};

// ─── Sign In ──────────────────────────────────────────────────────────────────
const signIn = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const user = rows[0];

    if (user.provider !== 'local' || !user.password) {
      return res.status(401).json({
        success: false,
        message: `This account was created with ${user.provider}. Please sign in using that provider.`
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = signUserToken(user);

    res.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar }
    });
  } catch (error) {
    console.error('SignIn error:', error);
    res.status(500).json({ success: false, message: 'Server error during sign in' });
  }
};

// ─── Google OAuth ─────────────────────────────────────────────────────────────
const googleAuth = async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ success: false, message: 'Google credential is required' });
  }

  try {
    // Verify token with Google's tokeninfo endpoint
    const { data: googleUser } = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`
    );

    if (!googleUser.email) {
      return res.status(401).json({ success: false, message: 'Invalid Google token' });
    }

    const { sub: googleId, email, name, picture: avatar } = googleUser;

    // Find or create user
    let [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);

    let user;
    if (rows.length > 0) {
      user = rows[0];
      // Update google_id if not set
      if (!user.google_id) {
        await db.query('UPDATE users SET google_id = ?, avatar = ?, provider = ? WHERE id = ?', [
          googleId, avatar, 'google', user.id
        ]);
        user.google_id = googleId;
        user.avatar = avatar;
      }
    } else {
      const [result] = await db.query(
        'INSERT INTO users (name, email, google_id, avatar, provider, is_verified) VALUES (?, ?, ?, ?, ?, ?)',
        [name, email.toLowerCase(), googleId, avatar, 'google', 1]
      );
      user = { id: result.insertId, name, email: email.toLowerCase(), avatar };
    }

    const token = signUserToken(user);

    res.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar }
    });
  } catch (error) {
    console.error('Google auth error:', error.response?.data || error.message);
    res.status(401).json({ success: false, message: 'Google authentication failed' });
  }
};

// ─── Facebook OAuth ───────────────────────────────────────────────────────────
const facebookAuth = async (req, res) => {
  const { accessToken, userID } = req.body;

  if (!accessToken || !userID) {
    return res.status(400).json({ success: false, message: 'Facebook access token and userID are required' });
  }

  try {
    // Verify with Facebook Graph API
    const { data: fbUser } = await axios.get(
      `https://graph.facebook.com/${userID}?fields=id,name,email,picture&access_token=${accessToken}`
    );

    if (!fbUser.id || fbUser.id !== userID) {
      return res.status(401).json({ success: false, message: 'Invalid Facebook token' });
    }

    const { id: facebookId, name, email, picture } = fbUser;
    const avatar = picture?.data?.url || null;

    // Some FB accounts don't expose email — use a unique placeholder
    const userEmail = email ? email.toLowerCase() : `fb_${facebookId}@wicebd.local`;

    let [rows] = await db.query(
      'SELECT * FROM users WHERE facebook_id = ? OR email = ?',
      [facebookId, userEmail]
    );

    let user;
    if (rows.length > 0) {
      user = rows[0];
      if (!user.facebook_id) {
        await db.query('UPDATE users SET facebook_id = ?, avatar = ? WHERE id = ?', [
          facebookId, avatar, user.id
        ]);
        user.facebook_id = facebookId;
        user.avatar = avatar;
      }
    } else {
      const [result] = await db.query(
        'INSERT INTO users (name, email, facebook_id, avatar, provider, is_verified) VALUES (?, ?, ?, ?, ?, ?)',
        [name, userEmail, facebookId, avatar, 'facebook', 1]
      );
      user = { id: result.insertId, name, email: userEmail, avatar };
    }

    const token = signUserToken(user);

    res.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar }
    });
  } catch (error) {
    console.error('Facebook auth error:', error.response?.data || error.message);
    res.status(401).json({ success: false, message: 'Facebook authentication failed' });
  }
};

// ─── Get Profile ──────────────────────────────────────────────────────────────
const getProfile = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, name, email, avatar, provider, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user: rows[0] });
  } catch (error) {
    console.error('GetProfile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── Get User's Registrations ─────────────────────────────────────────────────
const getMyRegistrations = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, paymentID, competitionCategory, projectTitle, leader,
              leaderEmail, bkashTrxId, amount, created_at
       FROM registrations
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json({ success: true, registrations: rows });
  } catch (error) {
    console.error('GetMyRegistrations error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── Unified Login (users + admins) ───────────────────────────────────────────
// Checks admins table FIRST (by username), then users table (by email).
// Admin check must come first so that an admin whose username is an email address
// is not accidentally matched against a portal user with the same email.
const unifiedLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email/username and password are required' });
  }

  try {
    // 1. Try admin login first — match by username OR email
    const [adminRows] = await db.query(
      'SELECT id, username, password, role, is_active FROM admins WHERE username = ? OR (email IS NOT NULL AND email = ?)',
      [email.trim().toLowerCase(), email.trim().toLowerCase()]
    );

    if (adminRows.length > 0) {
      const admin = adminRows[0];
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      if (!admin.is_active) {
        return res.status(403).json({ success: false, message: 'Account is disabled. Please contact a super admin.' });
      }

      const token = jwt.sign(
        { id: admin.id, username: admin.username, role: 'admin', adminRole: admin.role },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
      );

      return res.json({
        success: true,
        role: 'admin',
        token,
        user: { id: admin.id, name: admin.username, email: admin.username }
      });
    }

    // 2. Try portal user login (by email)
    const [userRows] = await db.query('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);

    if (userRows.length > 0) {
      const user = userRows[0];

      if (user.provider !== 'local' || !user.password) {
        return res.status(401).json({
          success: false,
          message: `This account was created with ${user.provider}. Please sign in using that provider.`
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      if (user.is_active === 0) {
        return res.status(403).json({ success: false, message: 'Your account has been suspended. Please contact support.' });
      }

      const token = signUserToken(user);
      return res.json({
        success: true,
        role: 'user',
        token,
        user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar }
      });
    }

    // 3. Try judge login — match by username
    const [judgeRows] = await db.query(
      'SELECT id, name, username, password, judge_type, subcategory, is_active FROM judges WHERE username = ?',
      [email.trim().toLowerCase()]
    );

    if (judgeRows.length > 0) {
      const judge = judgeRows[0];
      const isMatch = await bcrypt.compare(password, judge.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
      if (!judge.is_active) {
        return res.status(403).json({ success: false, message: 'Judge account is disabled.' });
      }
      const token = jwt.sign(
        { id: judge.id, name: judge.name, username: judge.username, role: 'judge', judge_type: judge.judge_type, subcategory: judge.subcategory },
        process.env.JWT_SECRET,
        { expiresIn: '12h' }
      );
      return res.json({
        success: true, role: 'judge', token,
        user: { id: judge.id, name: judge.name, username: judge.username, judge_type: judge.judge_type, subcategory: judge.subcategory },
      });
    }

    // 4. Neither found
    return res.status(401).json({ success: false, message: 'Invalid credentials' });

  } catch (error) {
    console.error('UnifiedLogin error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

module.exports = { signUp, signIn, googleAuth, facebookAuth, getProfile, getMyRegistrations, unifiedLogin };
