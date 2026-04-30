const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.live') });

(async () => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST, port: process.env.DB_PORT,
    user: process.env.DB_USER, password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME, multipleStatements: true,
  });

  console.log('Running migration 011 (LIVE): judges and national round tables…');

  // SQL uses CREATE TABLE IF NOT EXISTS throughout — safe to re-run
  const sql = fs.readFileSync(path.join(__dirname, '011_judges_national_round.sql'), 'utf8');
  await conn.query(sql);

  await conn.end();
  console.log('Done.');
})().catch(err => { console.error('Migration failed:', err.message); process.exit(1); });
