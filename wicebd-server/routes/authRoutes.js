const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
require('dotenv').config();

// Admin Login Endpoint
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ 
      success: false,
      message: 'Username and password are required' 
    });
  }

  try {
    // 1. Find admin (case-sensitive query)
    const [admin] = await db.query(
      'SELECT id, username, password FROM admins WHERE username = ?', 
      [username.trim().toLowerCase()] // Normalize username
    );

    if (!admin || admin.length === 0) {
      console.log('Admin not found:', username); // Debug log
      return res.status(401).json({ 
        success: false,
        message: 'Invalid username or password' // Generic message
      });
    }

    const adminData = admin[0];

    // 2. Verify password
    const isMatch = await bcrypt.compare(password, adminData.password);
    console.log('Password match:', isMatch); // Debug log
    
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid username or password' // Generic message
      });
    }

    // 3. Create JWT token
    const token = jwt.sign(
      {
        id: adminData.id,
        username: adminData.username,
        role: 'admin'
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      success: true,
      token,
      admin: {
        id: adminData.id,
        username: adminData.username
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during login' 
    });
  }
});

module.exports = router;