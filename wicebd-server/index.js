require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const paymentRoutes = require('./routes/paymentRoute');
const registrationRoutes = require('./routes/registerRoute');
const olympiadRoutes = require('./routes/olympiadRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const userAuthRoutes = require('./routes/userAuthRoutes');
const userProfileRoutes = require('./routes/userProfileRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const roboSoccerRoutes = require('./routes/roboSoccerRoutes');
const qr = require('./routes/qr');

// CORS — raw middleware, runs before everything
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_BASE_URL,
].filter(Boolean);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Parse JSON
app.use(express.json());

// Add console log middleware to track hits
app.use('/api/payment', (req, res, next) => {
  console.log('🛣️ Base /api/payment route accessed');
  next();
});

app.use('/api/registration', registrationRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/olympiad', olympiadRoutes);

//admin routes
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/qr', qr);

// User auth routes
app.use('/api/user-auth', userAuthRoutes);
app.use('/api/user-profile', userProfileRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/robo-soccer', roboSoccerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
