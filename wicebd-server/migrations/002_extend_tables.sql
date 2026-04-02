-- ============================================================
-- WICEBD Migration 002 — Extended Tables
-- ============================================================
USE `wice-bd`;

-- ── 1. USER PROFILES (family info, collected after signup) ────────────
CREATE TABLE IF NOT EXISTS user_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  father_name VARCHAR(255) DEFAULT NULL,
  father_occupation VARCHAR(255) DEFAULT NULL,
  mother_name VARCHAR(255) DEFAULT NULL,
  mother_occupation VARCHAR(255) DEFAULT NULL,
  guardian_phone VARCHAR(50) DEFAULT NULL,
  address TEXT DEFAULT NULL,
  date_of_birth DATE DEFAULT NULL,
  gender ENUM('male','female','other') DEFAULT NULL,
  institution VARCHAR(255) DEFAULT NULL,
  class_grade VARCHAR(100) DEFAULT NULL,
  profile_completed TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ── 2. ROBO SOCCER REGISTRATIONS ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS robo_soccer_registrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  registration_id VARCHAR(50) UNIQUE NOT NULL,
  user_id INT DEFAULT NULL,
  team_name VARCHAR(255) NOT NULL,
  institution VARCHAR(255) NOT NULL,
  leader_name VARCHAR(255) NOT NULL,
  leader_email VARCHAR(255) NOT NULL,
  leader_phone VARCHAR(50) NOT NULL,
  member2 VARCHAR(255) DEFAULT NULL,
  member3 VARCHAR(255) DEFAULT NULL,
  member4 VARCHAR(255) DEFAULT NULL,
  robot_description TEXT DEFAULT NULL,
  category VARCHAR(100) DEFAULT 'standard',
  payment_status ENUM('pending','paid','failed') DEFAULT 'pending',
  payment_id VARCHAR(255) DEFAULT NULL,
  amount DECIMAL(10,2) DEFAULT NULL,
  status ENUM('registered','confirmed','disqualified') DEFAULT 'registered',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ── 3. ANNOUNCEMENTS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS announcements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  admin_id INT NOT NULL,
  title VARCHAR(500) NOT NULL,
  body TEXT NOT NULL,
  target_audience ENUM('all','project','olympiad','robo_soccer','event_registered') DEFAULT 'all',
  send_email TINYINT(1) DEFAULT 0,
  email_sent_at TIMESTAMP DEFAULT NULL,
  is_published TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
);

-- ── 4. ID CARDS ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS id_cards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  registration_type ENUM('project','olympiad','robo_soccer') NOT NULL,
  registration_id VARCHAR(255) NOT NULL,
  card_uid VARCHAR(100) UNIQUE NOT NULL,
  qr_data TEXT NOT NULL,
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ── 5. Add missing columns to existing tables ─────────────────────────

-- registrations: add user_id link if not present (safe ALTER)
ALTER TABLE registrations
  MODIFY COLUMN user_id INT DEFAULT NULL;

-- olympiad_registrations: add columns only if they don't exist (MySQL 5.7 compatible)
SET @dbname = DATABASE();
SET @tbl = 'olympiad_registrations';

SET @col = 'registration_id';
SET @sql = IF((SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=@dbname AND TABLE_NAME=@tbl AND COLUMN_NAME=@col)=0,
  CONCAT('ALTER TABLE ',@tbl,' ADD COLUMN registration_id VARCHAR(50) DEFAULT NULL'), 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col = 'full_name';
SET @sql = IF((SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=@dbname AND TABLE_NAME=@tbl AND COLUMN_NAME=@col)=0,
  CONCAT('ALTER TABLE ',@tbl,' ADD COLUMN full_name VARCHAR(255) DEFAULT NULL'), 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col = 'address';
SET @sql = IF((SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=@dbname AND TABLE_NAME=@tbl AND COLUMN_NAME=@col)=0,
  CONCAT('ALTER TABLE ',@tbl,' ADD COLUMN address TEXT DEFAULT NULL'), 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col = 'cr_reference';
SET @sql = IF((SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=@dbname AND TABLE_NAME=@tbl AND COLUMN_NAME=@col)=0,
  CONCAT('ALTER TABLE ',@tbl,' ADD COLUMN cr_reference VARCHAR(255) DEFAULT NULL'), 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col = 'status';
SET @sql = IF((SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=@dbname AND TABLE_NAME=@tbl AND COLUMN_NAME=@col)=0,
  CONCAT('ALTER TABLE ',@tbl,' ADD COLUMN status VARCHAR(50) DEFAULT ''registered'''), 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ── Done ──────────────────────────────────────────────────────────────
