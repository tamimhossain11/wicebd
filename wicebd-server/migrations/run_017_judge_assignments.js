/**
 * Migration 017: Create judge_project_assignments table + seed all judge-project assignments.
 * Run once: node migrations/run_017_judge_assignments.js
 * Live:     USE_LIVE=1 node migrations/run_017_judge_assignments.js
 */
const envFile = process.env.USE_LIVE ? '.env.live' : '.env';
require('dotenv').config({ path: envFile });
const mysql = require('mysql2/promise');

// registration_id = registrations.id (integer primary key)
const assignments = {
  // Applied Physics and Engineering — All
  'akkas-j@wicebd.com':      [163,156,142,141,129,104,99,92,83,65,60,54,29,28,12],
  'masum-j@wicebd.com':      [163,156,142,141,129,104,99,92,83,65,60,54,29,28,12],
  'sajeeb-j@wicebd.com':     [163,156,142,141,129,104,99,92,83,65,60,54,29,28,12],

  // Applied Life Science — All
  'salman-j@wicebd.com':     [174,173,143,137,128,126,103,78,48,17,3],
  'mostain-j@wicebd.com':    [174,173,143,137,128,126,103,78,48,17,3],

  // Environmental Science — Elementary & High School
  'zafi-j@wicebd.com':       [165,164,150,139,119,117,91,90,88,82,68,58,56,42,37,36],
  'noor-j@wicebd.com':       [165,164,150,139,119,117,91,90,88,82,68,58,56,42,37,36],

  // Environmental Science — College & University
  'araf-j@wicebd.com':       [166,161,157,118,113,111,110,101,97,94,86,85,81,73,69,67,41,34,24,23,20,16],
  'rahat-j@wicebd.com':      [166,161,157,118,113,111,110,101,97,94,86,85,81,73,69,67,41,34,24,23,20,16],

  // Innovative Social Science — All
  'tahjib-j@wicebd.com':     [162,151,149,146,145,120,109,108,100,63,44,39,15,9,8,5],
  'kawser-j@wicebd.com':     [162,151,149,146,145,120,109,108,100,63,44,39,15,9,8,5],

  // IT and Robotics — Elementary & High School
  'tanvir-j@wicebd.com':     [172,168,138,130,125,95,93,84,79,76,74,72,70,66,61,49,46,21,10,1],
  'shihab-j@wicebd.com':     [172,168,138,130,125,95,93,84,79,76,74,72,70,66,61,49,46,21,10,1],
  'jawad-j@wicebd.com':      [172,168,138,130,125,95,93,84,79,76,74,72,70,66,61,49,46,21,10,1],

  // IT and Robotics — College
  'akib-j@wicebd.com':       [175,170,167,154,152,148,147,136,133,131,127,124,105,102,47,43,31,25,11,7],
  'rajib-j@wicebd.com':      [175,170,167,154,152,148,147,136,133,131,127,124,105,102,47,43,31,25,11,7],
  'fuad-j@wicebd.com':       [175,170,167,154,152,148,147,136,133,131,127,124,105,102,47,43,31,25,11,7],

  // IT and Robotics — University
  'safaet-j@wicebd.com':     [171,169,160,159,153,134,132,121,114,112,106,96,87,80,77,75,71,64,57,55,53,52,51,45,32,27,26,22,19,18,6,2],
  'dipa-j@wicebd.com':       [171,169,160,159,153,134,132,121,114,112,106,96,87,80,77,75,71,64,57,55,53,52,51,45,32,27,26,22,19,18,6,2],
  'mubassirul-j@wicebd.com': [171,169,160,159,153,134,132,121,114,112,106,96,87,80,77,75,71,64,57,55,53,52,51,45,32,27,26,22,19,18,6,2],
  'bulbul-j@wicebd.com':     [171,169,160,159,153,134,132,121,114,112,106,96,87,80,77,75,71,64,57,55,53,52,51,45,32,27,26,22,19,18,6,2],
};

async function run() {
  const conn = await mysql.createConnection({
    host:     process.env.DB_HOST,
    port:     process.env.DB_PORT || 3306,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    // Create table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS judge_project_assignments (
        id             INT PRIMARY KEY AUTO_INCREMENT,
        judge_id       INT NOT NULL,
        registration_id INT NOT NULL,
        assigned_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (judge_id) REFERENCES judges(id) ON DELETE CASCADE,
        UNIQUE KEY uq_judge_reg (judge_id, registration_id)
      )
    `);
    console.log('Table judge_project_assignments ensured.');

    // Resolve judge usernames → IDs
    const [judgeRows] = await conn.query('SELECT id, username FROM judges');
    const judgeMap = {};
    judgeRows.forEach(j => { judgeMap[j.username] = j.id; });

    let total = 0;
    for (const [username, regIds] of Object.entries(assignments)) {
      const judgeId = judgeMap[username];
      if (!judgeId) { console.warn(`  SKIP (judge not found): ${username}`); continue; }

      for (const regId of regIds) {
        await conn.query(
          `INSERT INTO judge_project_assignments (judge_id, registration_id)
           VALUES (?, ?)
           ON DUPLICATE KEY UPDATE assigned_at = assigned_at`,
          [judgeId, regId]
        );
        total++;
      }
      console.log(`  Assigned ${regIds.length} projects → ${username}`);
    }

    console.log(`\nDone. Total assignment rows: ${total}`);
  } finally {
    await conn.end();
  }
}

run().catch(err => { console.error(err); process.exit(1); });
