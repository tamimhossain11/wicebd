const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.live' });

(async () => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST, port: Number(process.env.DB_PORT) || 3307,
    user: process.env.DB_USER, password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true,
  });
  console.log('Connected to live DB. Running migration 014…\n');

  // ── 1. Add new columns to robo_soccer_registrations ──────────
  const rsNewCols = [
    ['leader_size',      'VARCHAR(10)  DEFAULT NULL'],
    ['member1_name',     'VARCHAR(255) DEFAULT NULL'],
    ['member1_phone',    'VARCHAR(50)  DEFAULT NULL'],
    ['member1_size',     'VARCHAR(10)  DEFAULT NULL'],
    ['member2_name',     'VARCHAR(255) DEFAULT NULL'],
    ['member2_phone',    'VARCHAR(50)  DEFAULT NULL'],
    ['member2_size',     'VARCHAR(10)  DEFAULT NULL'],
    ['bot_name',         'VARCHAR(255) DEFAULT NULL'],
    ['prior_experience', "ENUM('yes','no') DEFAULT NULL"],
  ];
  for (const [col, def] of rsNewCols) {
    const [[row]] = await conn.query(
      `SELECT COUNT(*) AS cnt FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'robo_soccer_registrations' AND COLUMN_NAME = ?`,
      [col]
    );
    if (row.cnt === 0) {
      await conn.query(`ALTER TABLE robo_soccer_registrations ADD COLUMN ${col} ${def}`);
      console.log(`  ✅  robo_soccer_registrations.${col} added`);
    } else {
      console.log(`  ℹ️   robo_soccer_registrations.${col} already exists`);
    }
  }

  // Add amount column if missing
  const [[amtRow]] = await conn.query(
    `SELECT COUNT(*) AS cnt FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'robo_soccer_registrations' AND COLUMN_NAME = 'amount'`
  );
  if (amtRow.cnt === 0) {
    await conn.query(`ALTER TABLE robo_soccer_registrations ADD COLUMN amount DECIMAL(10,2) DEFAULT 777.00`);
    console.log('  ✅  robo_soccer_registrations.amount added');
  } else {
    console.log('  ℹ️   robo_soccer_registrations.amount already exists');
  }

  // ── 2. Create micromouse_registrations ────────────────────────
  await conn.query(`
    CREATE TABLE IF NOT EXISTS micromouse_registrations (
      id                INT AUTO_INCREMENT PRIMARY KEY,
      registration_id   VARCHAR(50)   UNIQUE NOT NULL,
      user_id           INT           DEFAULT NULL,
      team_name         VARCHAR(255)  NOT NULL,
      institution       VARCHAR(255)  NOT NULL,
      leader_name       VARCHAR(255)  NOT NULL,
      leader_phone      VARCHAR(50)   NOT NULL,
      leader_email      VARCHAR(255)  NOT NULL,
      leader_size       VARCHAR(10)   DEFAULT NULL,
      member1_name      VARCHAR(255)  DEFAULT NULL,
      member1_phone     VARCHAR(50)   DEFAULT NULL,
      member1_size      VARCHAR(10)   DEFAULT NULL,
      member2_name      VARCHAR(255)  DEFAULT NULL,
      member2_phone     VARCHAR(50)   DEFAULT NULL,
      member2_size      VARCHAR(10)   DEFAULT NULL,
      bot_name          VARCHAR(255)  DEFAULT NULL,
      prior_experience  ENUM('yes','no') DEFAULT NULL,
      payment_status    ENUM('pending','paid','failed') DEFAULT 'pending',
      payment_id        VARCHAR(255)  DEFAULT NULL,
      amount            DECIMAL(10,2) DEFAULT 888.00,
      status            ENUM('registered','confirmed','disqualified') DEFAULT 'registered',
      created_at        TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
      updated_at        TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `);
  console.log('\n  ✅  micromouse_registrations table ready');

  // ── 3. Extend id_cards registration_type ENUM ────────────────
  await conn.query(`
    ALTER TABLE id_cards
      MODIFY COLUMN registration_type
        ENUM('project','olympiad','robo_soccer','wall-magazine','guest','micromouse') NOT NULL
  `);
  console.log('  ✅  id_cards.registration_type ENUM extended to include micromouse');

  await conn.end();
  console.log('\n✅  Migration 014 complete.');
})().catch(err => { console.error('Migration failed:', err.message); process.exit(1); });
