-- ============================================================
-- WICEBD Migration 014 — Robotics Segments Update
-- Adds new fields to robo_soccer_registrations,
-- creates micromouse_registrations table,
-- and extends id_cards registration_type enum.
-- ============================================================
USE `wice-bd`;

-- ── 1. Update robo_soccer_registrations with new fields ──────

ALTER TABLE robo_soccer_registrations
  ADD COLUMN IF NOT EXISTS leader_size    VARCHAR(10)  DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS member1_name   VARCHAR(255) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS member1_phone  VARCHAR(50)  DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS member1_size   VARCHAR(10)  DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS member2_name   VARCHAR(255) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS member2_phone  VARCHAR(50)  DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS member2_size   VARCHAR(10)  DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS member3_name   VARCHAR(255) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS member3_phone  VARCHAR(50)  DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS member3_size   VARCHAR(10)  DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS member4_name   VARCHAR(255) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS member4_phone  VARCHAR(50)  DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS member4_size   VARCHAR(10)  DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS bot_name       VARCHAR(255) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS prior_experience ENUM('yes','no') DEFAULT NULL;

-- Rename leader_phone if the old column was leader_phone (already exists as leader_phone, no change needed)
-- Add amount column if missing
SET @dbname = DATABASE();
SET @tbl = 'robo_soccer_registrations';
SET @col = 'amount';
SET @sql = IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=@dbname AND TABLE_NAME=@tbl AND COLUMN_NAME=@col)=0,
  'ALTER TABLE robo_soccer_registrations ADD COLUMN amount DECIMAL(10,2) DEFAULT 777.00',
  'SELECT 1'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ── 2. Create micromouse_registrations table ──────────────────

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
  member3_name      VARCHAR(255)  DEFAULT NULL,
  member3_phone     VARCHAR(50)   DEFAULT NULL,
  member3_size      VARCHAR(10)   DEFAULT NULL,
  member4_name      VARCHAR(255)  DEFAULT NULL,
  member4_phone     VARCHAR(50)   DEFAULT NULL,
  member4_size      VARCHAR(10)   DEFAULT NULL,
  bot_name          VARCHAR(255)  DEFAULT NULL,
  prior_experience  ENUM('yes','no') DEFAULT NULL,
  payment_status    ENUM('pending','paid','failed') DEFAULT 'pending',
  payment_id        VARCHAR(255)  DEFAULT NULL,
  amount            DECIMAL(10,2) DEFAULT 888.00,
  status            ENUM('registered','confirmed','disqualified') DEFAULT 'registered',
  created_at        TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ── 3. Extend id_cards registration_type to include micromouse ─

ALTER TABLE id_cards
  MODIFY COLUMN registration_type
    ENUM('project','olympiad','robo_soccer','wall-magazine','guest','micromouse') NOT NULL;

-- ── Done ──────────────────────────────────────────────────────
