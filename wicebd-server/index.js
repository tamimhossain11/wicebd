require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Routes
const paymentRoutes = require('./routes/paymentRoute');
const registrationRoutes = require('./routes/registerRoute');
const olympiadRoutes = require('./routes/olympiadRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const userAuthRoutes = require('./routes/userAuthRoutes');
const userProfileRoutes = require('./routes/userProfileRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const qr = require('./routes/qr');
const olympiadExamRoutes = require('./routes/olympiadExamRoutes');
const campusAmbassadorRoutes = require('./routes/campusAmbassadorRoutes');
const clubPartnerRoutes = require('./routes/clubPartnerRoutes');
const eventPassRoutes = require('./routes/eventPassRoutes');
const idCardRoutes = require('./routes/idCardRoutes');
const promoCodeRoutes = require('./routes/promoCodeRoutes');
const uploadRoutes    = require('./routes/uploadRoutes');


// ----------------------------
// CORS CONFIG
// ----------------------------

const normalize = (url) => url?.replace(/\/$/, "");

// Get frontend URLs from .env
const allowedOrigins = new Set([
  ...process.env.FRONTEND_BASE_URL.split(',').map(normalize),
  normalize(process.env.FRONTEND_DEV_URL)
]);

console.log("Allowed Origins:", allowedOrigins);

// CORS middleware
app.use(cors({
  origin: (origin, callback) => {
    const o = normalize(origin);

    if (!origin || allowedOrigins.has(o)) {
      return callback(null, true);
    }

    console.log("❌ Blocked CORS:", origin);
    return callback(new Error("CORS blocked"));
  },
  credentials: true
}));

// Extra headers
app.use((req, res, next) => {
  const origin = normalize(req.headers.origin);

  if (!origin || allowedOrigins.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Vary", "Origin");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  if (req.method === "OPTIONS") return res.sendStatus(204);

  next();
});

// ----------------------------
// Middleware
// ----------------------------

app.use(express.json());

app.use('/api/payment', (req, res, next) => {
  console.log('🛣️ Base /api/payment route accessed');
  next();
});

// Routes
app.use('/api/registration', registrationRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/olympiad', olympiadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/qr', qr);
app.use('/api/user-auth', userAuthRoutes);
app.use('/api/user-profile', userProfileRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/olympiad-exam', olympiadExamRoutes);
app.use('/api/campus-ambassador', campusAmbassadorRoutes);
app.use('/api/club-partner', clubPartnerRoutes);
app.use('/api/event-pass', eventPassRoutes);
app.use('/api/id-card', idCardRoutes);
app.use('/api/promo', promoCodeRoutes);
app.use('/api/upload', uploadRoutes);

// ----------------------------
// Server
// ----------------------------

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});