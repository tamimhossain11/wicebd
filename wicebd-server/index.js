require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const paymentRoutes = require('./routes/paymentRoute');
const registrationRoutes = require('./routes/registerRoute');
const olympiadRoutes = require('./routes/olympiadRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const qr = require('./routes/qr');

// Parse JSON
app.use(express.json());

// CORS setup
app.use(cors({
  origin: process.env.FRONTEND_BASE_URL || 'http://localhost:5173', // adjust this if needed
  credentials: true
}));

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
