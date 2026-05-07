const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.live' });

async function addColumnIfMissing(conn, table, column, definition) {
  const [rows] = await conn.query(
    `SELECT COUNT(*) AS cnt FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [process.env.DB_NAME, table, column]
  );
  if (rows[0].cnt === 0) {
    await conn.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`);
    console.log(`  ✅ Added ${table}.${column}`);
  } else {
    console.log(`  ⏭  ${table}.${column} already exists`);
  }
}

(async () => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST, port: process.env.DB_PORT,
    user: process.env.DB_USER, password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  console.log('Running migration 015 (LIVE): judge marks breakdown + honorable mention support…');

  // judge_marks: 4 breakdown fields
  await addColumnIfMissing(conn, 'judge_marks', 'urgency',      'DECIMAL(5,2) NOT NULL DEFAULT 0');
  await addColumnIfMissing(conn, 'judge_marks', 'visibility',   'DECIMAL(5,2) NOT NULL DEFAULT 0');
  await addColumnIfMissing(conn, 'judge_marks', 'relevance',    'DECIMAL(5,2) NOT NULL DEFAULT 0');
  await addColumnIfMissing(conn, 'judge_marks', 'presentation', 'DECIMAL(5,2) NOT NULL DEFAULT 0');

  // national_round_selections: judge_count + is_manual
  await addColumnIfMissing(conn, 'national_round_selections', 'judge_count', 'INT NOT NULL DEFAULT 0');
  await addColumnIfMissing(conn, 'national_round_selections', 'is_manual',   'TINYINT(1) NOT NULL DEFAULT 0');

  await conn.end();
  console.log('Done.');
})().catch(err => { console.error('Migration failed:', err.message); process.exit(1); });
