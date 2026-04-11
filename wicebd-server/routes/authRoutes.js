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
      'SELECT id, username, password, role, is_active FROM admins WHERE username = ?',
      [username.trim().toLowerCase()]
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

    // 3. Check account is active
    if (!adminData.is_active) {
      return res.status(403).json({ success: false, message: 'Account is disabled' });
    }

    // 4. Create JWT token (include adminRole so middleware can enforce RBAC)
    const token = jwt.sign(
      {
        id:        adminData.id,
        username:  adminData.username,
        role:      'admin',
        adminRole: adminData.role,       // super_admin | data_extractor | ca_cl_manager
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      success: true,
      token,
      admin: {
        id:        adminData.id,
        username:  adminData.username,
        adminRole: adminData.role,
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