require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const cors = require('cors');
const mysql = require('mysql2/promise');

const paymentRoutes = require('./routes/paymentRoute');
const registrationRoutes = require('./routes/registerRoute');

const app = express();

// CORS config — adjust FRONTEND_BASE_URL in .env to match your frontend domain
app.use(cors({
  origin: process.env.FRONTEND_BASE_URL,
  credentials: true
}));

app.use(express.json());

// MySQL session store setup
const sessionStore = new MySQLStore({
  host: process.env.DB_HOST,
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Session middleware
app.use(session({
  key: 'wice2025.sid',
  secret: process.env.SESSION_SECRET || 'default-dev-secret',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: true, // must be true if sameSite is 'none'
    sameSite: 'none',
    maxAge: 1000 * 60 * 30
  }
}));

// Debug: print session ID per request
app.use((req, res, next) => {
  console.log('🔥 [Debug] Session ID:', req.sessionID);
  next();
});

// Routes
console.log('Mounting /api/payment route');
app.use('/api/payment', paymentRoutes);
app.use('/api/registration', registrationRoutes);

// Test DB connection
async function testDatabaseConnection() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    console.log('✅ MySQL connection successful');
    await connection.end();
  } catch (error) {
    console.error('❌ MySQL connection failed:', error.message);
  }
}

testDatabaseConnection();

// Start server
app.listen(process.env.PORT, () => {
  console.log(`🚀 Server is running on port ${process.env.PORT}`);
});
