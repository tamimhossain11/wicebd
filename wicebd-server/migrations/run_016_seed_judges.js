/**
 * Migration 016: Add education_level column to judges table + seed 22 judges for WICEBD 2026.
 * Run once: node migrations/run_016_seed_judges.js
 */
const envFile = process.env.USE_LIVE ? '.env.live' : '.env';
require('dotenv').config({ path: envFile });
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const judges = [
  // 1–2 given as naming examples by organiser (tahjib=1, fuad=2)
  { name: 'MD TAHZIB UL ISLAM',                   username: 'tahjib-j@wicebd.com',    password: 'j-2026@wicebd1',  subcategory: 'Innovative Social Science',      education_level: 'All Category' },
  { name: 'ABU.M.FUAD',                            username: 'fuad-j@wicebd.com',      password: 'j-2026@wicebd2',  subcategory: 'IT and Robotics',                education_level: 'Elementary & High School' },
  { name: 'RAHAT HASAN SHIHAB',                    username: 'shihab-j@wicebd.com',    password: 'j-2026@wicebd3',  subcategory: 'IT and Robotics',                education_level: 'Elementary & High School' },
  { name: 'MD JAWADUR RAHMAN',                     username: 'jawad-j@wicebd.com',     password: 'j-2026@wicebd4',  subcategory: 'IT and Robotics',                education_level: 'Elementary & High School' },
  { name: 'BULBUL',                                username: 'bulbul-j@wicebd.com',    password: 'j-2026@wicebd5',  subcategory: 'IT and Robotics',                education_level: 'College' },
  { name: 'MD MUBASSIRUL ISLAM',                   username: 'mubassirul-j@wicebd.com',password: 'j-2026@wicebd6',  subcategory: 'IT and Robotics',                education_level: 'College' },
  { name: 'ASM AHSANUL SARKAR AKIB',               username: 'akib-j@wicebd.com',      password: 'j-2026@wicebd12', subcategory: 'IT and Robotics',                education_level: 'College' },
  { name: 'MD SHOHIDUL ISLAM',                     username: 'shohidul-j@wicebd.com',  password: 'j-2026@wicebd8',  subcategory: 'IT and Robotics',                education_level: 'College' },
  { name: 'MD SAFAET HOSSAIN',                     username: 'safaet-j@wicebd.com',    password: 'j-2026@wicebd9',  subcategory: 'IT and Robotics',                education_level: 'University' },
  { name: 'DR. MAHFIDA AMJAD DIPA',                username: 'dipa-j@wicebd.com',      password: 'j-2026@wicebd10', subcategory: 'IT and Robotics',                education_level: 'University' },
  { name: 'FAQUEER TANVIR AHMED',                  username: 'tanvir-j@wicebd.com',    password: 'j-2026@wicebd11', subcategory: 'IT and Robotics',                education_level: 'University' },
  { name: 'RAJIB MAZUMDER',                        username: 'rajib-j@wicebd.com',     password: 'j-2026@wicebd12', subcategory: 'IT and Robotics',                education_level: 'University' },
  { name: 'HANA SULTAN CHOWDHURY ZAFI',            username: 'zafi-j@wicebd.com',      password: 'j-2026@wicebd13', subcategory: 'Environmental Science',          education_level: 'Elementary & High School' },
  { name: 'Md. ASHIQUR RAHMAN NOOR',               username: 'noor-j@wicebd.com',      password: 'j-2026@wicebd14', subcategory: 'Environmental Science',          education_level: 'Elementary & High School' },
  { name: 'ABDULLAH AL ARAF',                      username: 'araf-j@wicebd.com',      password: 'j-2026@wicebd15', subcategory: 'Environmental Science',          education_level: 'Elementary & High School' },
  { name: 'RAHAT UDDIN',                           username: 'rahat-j@wicebd.com',     password: 'j-2026@wicebd16', subcategory: 'Environmental Science',          education_level: 'Elementary & High School' },
  { name: 'MOHAMMAD KAWSER UDDIN',                 username: 'kawser-j@wicebd.com',    password: 'j-2026@wicebd17', subcategory: 'Innovative Social Science',      education_level: 'All Category' },
  { name: 'MOHAMMAD ALI AKKAS',                    username: 'akkas-j@wicebd.com',     password: 'j-2026@wicebd18', subcategory: 'Applied Physics and Engineering', education_level: 'All Category' },
  { name: 'Prof. Dr. ABDUL KADAR MUHAMMAD MASUM',  username: 'masum-j@wicebd.com',     password: 'j-2026@wicebd19', subcategory: 'Applied Physics and Engineering', education_level: 'All Category' },
  { name: 'DR. SAJEEB SAHA',                       username: 'sajeeb-j@wicebd.com',    password: 'j-2026@wicebd20', subcategory: 'Applied Physics and Engineering', education_level: 'All Category' },
  { name: 'SALMAN YAHYA',                          username: 'salman-j@wicebd.com',    password: 'j-2026@wicebd21', subcategory: 'Applied Life Science',           education_level: 'All Category' },
  { name: 'MOSTAIN SPORSHO',                       username: 'mostain-j@wicebd.com',   password: 'j-2026@wicebd22', subcategory: 'Applied Life Science',           education_level: 'All Category' },
];

async function run() {
  const conn = await mysql.createConnection({
    host:     process.env.DB_HOST,
    port:     process.env.DB_PORT || 3306,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    // Add education_level column if not present
    const [cols] = await conn.query(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'judges' AND COLUMN_NAME = 'education_level'`
    );
    if (cols.length === 0) {
      await conn.query(`ALTER TABLE judges ADD COLUMN education_level VARCHAR(50) NULL AFTER subcategory`);
      console.log('education_level column added.');
    } else {
      console.log('education_level column already exists.');
    }

    let inserted = 0, updated = 0;
    for (const j of judges) {
      const hash = await bcrypt.hash(j.password, 10);
      const [result] = await conn.query(
        `INSERT INTO judges (name, username, password, judge_type, subcategory, education_level, is_active)
         VALUES (?, ?, ?, 'project', ?, ?, 1)
         ON DUPLICATE KEY UPDATE
           name            = VALUES(name),
           password        = VALUES(password),
           subcategory     = VALUES(subcategory),
           education_level = VALUES(education_level),
           is_active       = 1`,
        [j.name, j.username, hash, j.subcategory, j.education_level]
      );
      if (result.affectedRows === 1) { console.log(`  ✓ Inserted: ${j.username}`); inserted++; }
      else                           { console.log(`  ↻ Updated:  ${j.username}`); updated++; }
    }

    console.log(`\nDone. Inserted: ${inserted}, Updated: ${updated}`);
  } finally {
    await conn.end();
  }
}

run().catch(err => { console.error(err); process.exit(1); });
