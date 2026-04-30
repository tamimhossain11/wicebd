const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.live' });

(async () => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST, port: process.env.DB_PORT,
    user: process.env.DB_USER, password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  console.log('Running migration 013 (LIVE): widen national_round_selections.position to VARCHAR…');
  await conn.query(`ALTER TABLE national_round_selections MODIFY COLUMN position VARCHAR(20) NOT NULL DEFAULT 'gold'`);
  await conn.end();
  console.log('Done.');
})().catch(err => { console.error('Migration failed:', err.message); process.exit(1); });
