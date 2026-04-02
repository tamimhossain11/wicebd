const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const db = require('../db');

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
// Checks users table first (by email), then admins table (by username).
// Returns role: 'user' | 'admin' so the frontend can redirect accordingly.
const unifiedLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email/username and password are required' });
  }

  try {
    // 1. Try user login by email
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

      const token = signUserToken(user);
      return res.json({
        success: true,
        role: 'user',
        token,
        user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar }
      });
    }

    // 2. Try admin login by username (email field used as username for admins)
    const [adminRows] = await db.query(
      'SELECT id, username, password FROM admins WHERE username = ?',
      [email.trim().toLowerCase()]
    );

    if (adminRows.length > 0) {
      const admin = adminRows[0];
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: admin.id, username: admin.username, role: 'admin' },
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

    // 3. Neither found
    return res.status(401).json({ success: false, message: 'Invalid credentials' });

  } catch (error) {
    console.error('UnifiedLogin error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

module.exports = { signUp, signIn, googleAuth, facebookAuth, getProfile, getMyRegistrations, unifiedLogin };
