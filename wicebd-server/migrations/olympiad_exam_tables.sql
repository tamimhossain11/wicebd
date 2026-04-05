-- Olympiad Exam System Tables
-- Run this migration to set up the olympiad online exam feature

-- Questions bank
CREATE TABLE IF NOT EXISTS olympiad_questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question_text TEXT NOT NULL,
  option_a VARCHAR(600) NOT NULL,
  option_b VARCHAR(600) NOT NULL,
  option_c VARCHAR(600) NOT NULL,
  option_d VARCHAR(600) NOT NULL,
  correct_answer ENUM('A', 'B', 'C', 'D') NOT NULL,
  marks INT NOT NULL DEFAULT 1,
  question_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Exam session (only one active session at a time)
CREATE TABLE IF NOT EXISTS olympiad_exam_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL DEFAULT 'Olympiad Exam',
  duration_minutes INT NOT NULL DEFAULT 60,
  status ENUM('draft', 'open', 'closed') NOT NULL DEFAULT 'draft',
  started_at DATETIME NULL,
  ends_at DATETIME NULL,
  created_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- One submission per user per session
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
);

-- Individual answers per submission
CREATE TABLE IF NOT EXISTS olympiad_answers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  submission_id INT NOT NULL,
  question_id INT NOT NULL,
  selected_answer VARCHAR(1) NOT NULL DEFAULT '',
  is_correct TINYINT(1) NOT NULL DEFAULT 0,
  FOREIGN KEY (submission_id) REFERENCES olympiad_submissions(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES olympiad_questions(id) ON DELETE CASCADE
);
