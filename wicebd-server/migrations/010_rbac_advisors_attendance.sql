-- ============================================================
-- Migration 010: RBAC, Advisors table, Attendance tracking
-- MySQL 5.7+ compatible (no ADD COLUMN IF NOT EXISTS)
-- ============================================================

-- 1. Admin role-based access control
ALTER TABLE admins
  ADD COLUMN email     VARCHAR(255) DEFAULT NULL                                            AFTER username,
  ADD COLUMN role      ENUM('super_admin','data_extractor','ca_cl_manager')
                       NOT NULL DEFAULT 'data_extractor'                                    AFTER password,
  ADD COLUMN is_active TINYINT(1) NOT NULL DEFAULT 1                                       AFTER role;

-- Promote the original admin account to super_admin
UPDATE admins SET role = 'super_admin' WHERE username = 'admin';

-- 2. Allow platform users to be restricted
ALTER TABLE users
  ADD COLUMN is_active TINYINT(1) NOT NULL DEFAULT 1 AFTER is_verified;

-- 3. Advisors / Speakers table
CREATE TABLE IF NOT EXISTS advisors (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  title       VARCHAR(500) DEFAULT NULL,
  institution VARCHAR(500) DEFAULT NULL,
  category    ENUM('Academic','Industry','Government','International','Technical') DEFAULT 'Academic',
  image_url   VARCHAR(1000) DEFAULT NULL,
  sort_order  INT DEFAULT 0,
  is_visible  TINYINT(1) DEFAULT 1,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. Event-day attendance & lunch tracking
CREATE TABLE IF NOT EXISTS attendance (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  card_uid          VARCHAR(100) NOT NULL,
  user_id           INT          DEFAULT NULL,
  registration_type VARCHAR(50)  DEFAULT NULL,
  registration_id   VARCHAR(255) DEFAULT NULL,
  participant_name  VARCHAR(255) DEFAULT NULL,
  checked_in_at     TIMESTAMP    NULL DEFAULT NULL,
  checked_in_by     INT          DEFAULT NULL,
  lunch_claimed_at  TIMESTAMP    NULL DEFAULT NULL,
  lunch_claimed_by  INT          DEFAULT NULL,
  notes             TEXT         DEFAULT NULL,
  created_at        TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_attendance_card (card_uid),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
