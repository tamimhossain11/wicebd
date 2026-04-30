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

  console.log('Running migration 012 (LIVE): certificate collection columns on id_cards…');

  await addColumnIfMissing(conn, 'id_cards', 'certificate_collected',    'TINYINT(1) NOT NULL DEFAULT 0');
  await addColumnIfMissing(conn, 'id_cards', 'certificate_collected_at', 'TIMESTAMP NULL DEFAULT NULL');
  await addColumnIfMissing(conn, 'id_cards', 'certificate_collected_by', 'INT NULL DEFAULT NULL');

  await conn.end();
  console.log('Done.');
})().catch(err => { console.error('Migration failed:', err.message); process.exit(1); });
