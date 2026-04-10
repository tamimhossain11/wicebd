const mysql = require('mysql2/promise');

const isProduction = process.env.DB_HOST?.startsWith('/cloudsql/');

const pool = mysql.createPool({
  ...(isProduction
    ? {
        socketPath: process.env.DB_HOST, // ✅ for Cloud Run
      }
    : {
        host: process.env.DB_HOST, // ✅ for local dev
        port: process.env.DB_PORT || 3306,
      }),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function testDatabaseConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL connection successful');
    connection.release();
  } catch (error) {
    console.error('❌ MySQL connection failed:', error.message);
  }
}

testDatabaseConnection();

module.exports = {
  getConnection: () => pool.getConnection(),
  query: (...args) => pool.query(...args),
  execute: (...args) => pool.execute(...args),
  end: () => pool.end(),
};