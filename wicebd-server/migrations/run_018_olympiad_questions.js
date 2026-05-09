/**
 * Migration 018: Create olympiad exam tables and seed 50 MCQ questions.
 * Run: node migrations/run_018_olympiad_questions.js
 * Live: USE_LIVE=1 node migrations/run_018_olympiad_questions.js
 */
const envFile = process.env.USE_LIVE ? '.env.live' : '.env';
require('dotenv').config({ path: envFile });
const mysql = require('mysql2/promise');

const questions = [
  { q: 'What is the chemical symbol for gold?',                              a: 'Ag',                          b: 'Au',                              c: 'Gd',                             d: 'Go',                          ans: 'B' },
  { q: 'Which planet has the most moons?',                                   a: 'Earth',                       b: 'Mars',                            c: 'Saturn',                         d: 'Venus',                       ans: 'C' },
  { q: 'What is the speed of light in vacuum?',                              a: '3×10^8 m/s',                  b: '3×10^6 m/s',                      c: '3000 m/s',                       d: '3×10^5 km/s',                 ans: 'A' },
  { q: 'Which organelle is known as the powerhouse of the cell?',            a: 'Nucleus',                     b: 'Ribosome',                        c: 'Mitochondria',                   d: 'Golgi Body',                  ans: 'C' },
  { q: 'Which gas is most abundant in Earth\'s atmosphere?',                 a: 'Oxygen',                      b: 'Nitrogen',                        c: 'Carbon Dioxide',                 d: 'Hydrogen',                    ans: 'B' },
  { q: 'What is the SI unit of force?',                                      a: 'Joule',                       b: 'Pascal',                          c: 'Newton',                         d: 'Watt',                        ans: 'C' },
  { q: 'Which blood type is known as the universal donor?',                  a: 'AB+',                         b: 'O-',                              c: 'A+',                             d: 'B-',                          ans: 'B' },
  { q: 'What is the process by which plants make food?',                     a: 'Respiration',                 b: 'Photosynthesis',                  c: 'Digestion',                      d: 'Fermentation',                ans: 'B' },
  { q: 'Which layer protects Earth from ultraviolet radiation?',             a: 'Troposphere',                 b: 'Mesosphere',                      c: 'Ozone Layer',                    d: 'Ionosphere',                  ans: 'C' },
  { q: 'What is HCl commonly known as?',                                     a: 'Sulfuric Acid',               b: 'Nitric Acid',                     c: 'Hydrochloric Acid',              d: 'Acetic Acid',                 ans: 'C' },
  { q: 'What does HTTP stand for?',                                          a: 'HyperText Transfer Protocol', b: 'HighText Transfer Program',       c: 'HyperTool Transfer Protocol',    d: 'Home Transfer Text Protocol', ans: 'A' },
  { q: 'Which company developed the Android operating system?',              a: 'Apple',                       b: 'Microsoft',                       c: 'Google',                         d: 'IBM',                         ans: 'C' },
  { q: 'What is the binary value of decimal 10?',                            a: '1010',                        b: '1001',                            c: '1111',                           d: '1100',                        ans: 'A' },
  { q: 'Which programming language is primarily used for web styling?',      a: 'Python',                      b: 'CSS',                             c: 'Java',                           d: 'C++',                         ans: 'B' },
  { q: 'What does GPU stand for?',                                           a: 'General Processing Unit',     b: 'Graphics Processing Unit',        c: 'Graphical Performance Utility',  d: 'Graphics Program Unit',       ans: 'B' },
  { q: 'Which device forwards data packets between networks?',               a: 'Switch',                      b: 'Router',                          c: 'Hub',                            d: 'Repeater',                    ans: 'B' },
  { q: 'What does HTML stand for?',                                          a: 'HyperText Markup Language',   b: 'HighText Machine Language',       c: 'Hyperlink Text Management Language', d: 'Home Tool Markup Language', ans: 'A' },
  { q: 'Which data structure uses FIFO?',                                    a: 'Stack',                       b: 'Queue',                           c: 'Array',                          d: 'Tree',                        ans: 'B' },
  { q: 'Which company created the iPhone?',                                  a: 'Samsung',                     b: 'Nokia',                           c: 'Apple',                          d: 'Sony',                        ans: 'C' },
  { q: 'Which cybersecurity attack tricks users into revealing information?', a: 'Malware',                    b: 'Phishing',                        c: 'Firewall',                       d: 'Encryption',                  ans: 'B' },
  { q: 'Which engineering field designs aircraft?',                          a: 'Civil Engineering',           b: 'Mechanical Engineering',          c: 'Aerospace Engineering',          d: 'Software Engineering',        ans: 'C' },
  { q: 'Which bridge design uses cables hanging from towers?',               a: 'Beam Bridge',                 b: 'Arch Bridge',                     c: 'Suspension Bridge',              d: 'Truss Bridge',                ans: 'C' },
  { q: 'What is the strongest natural material?',                            a: 'Iron',                        b: 'Gold',                            c: 'Diamond',                        d: 'Copper',                      ans: 'C' },
  { q: 'Which tool measures voltage?',                                       a: 'Ammeter',                     b: 'Voltmeter',                       c: 'Barometer',                      d: 'Thermometer',                 ans: 'B' },
  { q: 'Which renewable source uses moving air?',                            a: 'Solar',                       b: 'Wind',                            c: 'Hydro',                          d: 'Biomass',                     ans: 'B' },
  { q: 'What converts mechanical energy into electrical energy?',            a: 'Battery',                     b: 'Generator',                       c: 'Motor',                          d: 'Transformer',                 ans: 'B' },
  { q: 'Which engineering branch focuses on robots?',                        a: 'Chemical Engineering',        b: 'Robotics Engineering',            c: 'Textile Engineering',            d: 'Marine Engineering',          ans: 'B' },
  { q: 'Which material is commonly used as an insulator?',                   a: 'Copper',                      b: 'Silver',                          c: 'Rubber',                         d: 'Iron',                        ans: 'C' },
  { q: 'What type of load acts downward due to gravity?',                    a: 'Live Load',                   b: 'Dead Load',                       c: 'Wind Load',                      d: 'Dynamic Load',                ans: 'B' },
  { q: 'Which machine element is used to transmit rotational motion?',       a: 'Bolt',                        b: 'Gear',                            c: 'Spring',                         d: 'Valve',                       ans: 'B' },
  { q: 'What is 25 × 12?',                                                   a: '250',                         b: '275',                             c: '300',                            d: '325',                         ans: 'C' },
  { q: 'What is the square root of 169?',                                    a: '11',                          b: '12',                              c: '13',                             d: '14',                          ans: 'C' },
  { q: 'What is the value of π approximately?',                              a: '2.14',                        b: '3.14',                            c: '4.13',                           d: '5.14',                        ans: 'B' },
  { q: 'What is 15% of 200?',                                                a: '20',                          b: '25',                              c: '30',                             d: '35',                          ans: 'C' },
  { q: 'Solve: 8²',                                                          a: '16',                          b: '32',                              c: '64',                             d: '128',                         ans: 'C' },
  { q: 'What is the perimeter of a rectangle with length 10 and width 5?',   a: '25',                          b: '30',                              c: '35',                             d: '40',                          ans: 'B' },
  { q: 'What is the area of a triangle with base 8 and height 5?',           a: '20',                          b: '30',                              c: '40',                             d: '50',                          ans: 'A' },
  { q: 'What is 144 ÷ 12?',                                                  a: '10',                          b: '11',                              c: '12',                             d: '13',                          ans: 'C' },
  { q: 'Which angle is greater than 90° but less than 180°?',                a: 'Acute',                       b: 'Right',                           c: 'Obtuse',                         d: 'Straight',                    ans: 'C' },
  { q: 'What is 7 × 9?',                                                     a: '56',                          b: '63',                              c: '72',                             d: '81',                          ans: 'B' },
  { q: 'Which scientist proposed the theory of relativity?',                 a: 'Newton',                      b: 'Einstein',                        c: 'Galileo',                        d: 'Tesla',                       ans: 'B' },
  { q: 'Which planet is closest to the Sun?',                                a: 'Venus',                       b: 'Earth',                           c: 'Mercury',                        d: 'Mars',                        ans: 'C' },
  { q: 'What is the freezing point of water?',                               a: '0°C',                         b: '32°C',                            c: '100°C',                          d: '-10°C',                       ans: 'A' },
  { q: 'Which vitamin is produced by sunlight exposure?',                    a: 'Vitamin A',                   b: 'Vitamin B',                       c: 'Vitamin C',                      d: 'Vitamin D',                   ans: 'D' },
  { q: 'Which instrument measures earthquakes?',                             a: 'Thermometer',                 b: 'Barometer',                       c: 'Seismograph',                    d: 'Altimeter',                   ans: 'C' },
  { q: 'What is the hardest known natural substance?',                       a: 'Steel',                       b: 'Diamond',                         c: 'Quartz',                         d: 'Iron',                        ans: 'B' },
  { q: 'What is the main gas used in balloons to make them float?',          a: 'Oxygen',                      b: 'Nitrogen',                        c: 'Helium',                         d: 'Carbon Dioxide',              ans: 'C' },
  { q: 'Which branch of biology studies animals?',                           a: 'Botany',                      b: 'Zoology',                         c: 'Ecology',                        d: 'Genetics',                    ans: 'B' },
  { q: 'What is the chemical formula of table salt?',                        a: 'NaCl',                        b: 'KCl',                             c: 'H2SO4',                          d: 'CO2',                         ans: 'A' },
  { q: 'Which part of the computer stores permanent data?',                  a: 'RAM',                         b: 'CPU',                             c: 'ROM',                            d: 'Cache',                       ans: 'C' },
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
    // Ensure tables exist
    await conn.query(`
      CREATE TABLE IF NOT EXISTS olympiad_questions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        question_text TEXT NOT NULL,
        option_a VARCHAR(600) NOT NULL,
        option_b VARCHAR(600) NOT NULL,
        option_c VARCHAR(600) NOT NULL,
        option_d VARCHAR(600) NOT NULL,
        correct_answer ENUM('A','B','C','D') NOT NULL,
        marks INT NOT NULL DEFAULT 1,
        question_order INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS olympiad_exam_sessions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL DEFAULT 'Olympiad Exam',
        duration_minutes INT NOT NULL DEFAULT 60,
        status ENUM('draft','open','closed') NOT NULL DEFAULT 'draft',
        started_at DATETIME NULL,
        ends_at DATETIME NULL,
        created_by INT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS olympiad_submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        session_id INT NOT NULL,
        total_marks INT NOT NULL DEFAULT 0,
        max_marks INT NOT NULL DEFAULT 0,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_user_session (user_id, session_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (session_id) REFERENCES olympiad_exam_sessions(id) ON DELETE CASCADE
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS olympiad_answers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        submission_id INT NOT NULL,
        question_id INT NOT NULL,
        selected_answer VARCHAR(1) NOT NULL DEFAULT '',
        is_correct TINYINT(1) NOT NULL DEFAULT 0,
        FOREIGN KEY (submission_id) REFERENCES olympiad_submissions(id) ON DELETE CASCADE,
        FOREIGN KEY (question_id) REFERENCES olympiad_questions(id) ON DELETE CASCADE
      )
    `);

    console.log('Tables ensured.');

    // Clear existing questions and re-seed
    await conn.query('DELETE FROM olympiad_questions');
    console.log('Cleared existing questions.');

    for (let i = 0; i < questions.length; i++) {
      const { q, a, b, c, d, ans } = questions[i];
      await conn.query(
        `INSERT INTO olympiad_questions (question_text, option_a, option_b, option_c, option_d, correct_answer, marks, question_order)
         VALUES (?, ?, ?, ?, ?, ?, 1, ?)`,
        [q, a, b, c, d, ans, i + 1]
      );
    }

    console.log(`\nInserted ${questions.length} questions successfully.`);
  } finally {
    await conn.end();
  }
}

run().catch(err => { console.error(err); process.exit(1); });
