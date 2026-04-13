/**
 * Migration: add team_member_profiles table + member_slot column on id_cards
 * Run once: node wicebd-server/migrations/add_team_member_profiles.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const db = require('../db');

async function run() {
  console.log('Running migration: team member profiles…');
  // Check if member_slot column already exists
  const [cols] = await db.query(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'id_cards' AND COLUMN_NAME = 'member_slot'`
  );
  if (cols.length === 0) {
    await db.query(`ALTER TABLE id_cards ADD COLUMN member_slot TINYINT NULL DEFAULT NULL`);
    console.log('✅  id_cards.member_slot added');
  } else {
    console.log('ℹ️  id_cards.member_slot already exists');
  }

  await db.query(`
    CREATE TABLE IF NOT EXISTS team_member_profiles (
      id                  INT AUTO_INCREMENT PRIMARY KEY,
      payment_id          VARCHAR(100) NOT NULL,
      member_slot         TINYINT NOT NULL COMMENT '2-5',
      name                VARCHAR(255),
      institution         VARCHAR(255),
      father_name         VARCHAR(255),
      father_occupation   VARCHAR(255),
      mother_name         VARCHAR(255),
      mother_occupation   VARCHAR(255),
      guardian_phone      VARCHAR(50),
      address             TEXT,
      date_of_birth       DATE,
      gender              VARCHAR(20),
      class_grade         VARCHAR(50),
      profile_completed   TINYINT(1) NOT NULL DEFAULT 0,
      created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uq_member_slot (payment_id, member_slot)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
  console.log('✅  team_member_profiles table ready');

  console.log('Migration complete.');
  process.exit(0);
}

run().catch(err => { console.error('Migration failed:', err); process.exit(1); });
