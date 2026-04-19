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

  console.log('Running migration 010: add member6 columns…');

  for (const table of ['temp_registrations', 'registrations']) {
    await addColumnIfMissing(conn, table, 'member6',      'VARCHAR(255) DEFAULT NULL AFTER tshirtSize5');
    await addColumnIfMissing(conn, table, 'institution6', 'VARCHAR(255) DEFAULT NULL AFTER member6');
    await addColumnIfMissing(conn, table, 'tshirtSize6',  'VARCHAR(10)  DEFAULT NULL AFTER institution6');
  }

  await conn.end();
  console.log('Done.');
})();
