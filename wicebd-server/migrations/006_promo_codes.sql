-- ============================================================
-- WICEBD Migration 006
-- Promo Codes
-- Run once to create promo_codes table and add promo_code column
-- ============================================================

CREATE TABLE IF NOT EXISTS promo_codes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_percentage TINYINT UNSIGNED NOT NULL,   -- 1–100
  competition_type ENUM('project','wall-magazine','olympiad','all') NOT NULL DEFAULT 'all',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Track applied promo codes on paid registrations
ALTER TABLE registrations
  ADD COLUMN IF NOT EXISTS promo_code VARCHAR(50) DEFAULT NULL;

ALTER TABLE temp_registrations
  ADD COLUMN IF NOT EXISTS promo_code VARCHAR(50) DEFAULT NULL;

ALTER TABLE olympiad_registrations
  ADD COLUMN IF NOT EXISTS promo_code VARCHAR(50) DEFAULT NULL;
