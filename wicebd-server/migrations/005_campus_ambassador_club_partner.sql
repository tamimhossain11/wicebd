-- ============================================================
-- WICEBD Migration 005
-- Campus Ambassadors & Club Partners
-- Run once to add tables and extend registration tables
-- ============================================================

CREATE TABLE IF NOT EXISTS campus_ambassadors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  institution_name VARCHAR(500) NOT NULL,
  institution_address TEXT NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS club_partners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  club_name VARCHAR(255) NOT NULL,
  institution_name VARCHAR(500) NOT NULL,
  institution_address TEXT NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add reference columns to paid registrations
ALTER TABLE registrations
  ADD COLUMN IF NOT EXISTS ca_code VARCHAR(50) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS club_code VARCHAR(50) DEFAULT NULL;

-- Add reference columns to pending (temp) registrations
ALTER TABLE temp_registrations
  ADD COLUMN IF NOT EXISTS ca_code VARCHAR(50) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS club_code VARCHAR(50) DEFAULT NULL;

-- Add reference columns to Olympiad registrations
ALTER TABLE olympiad_registrations
  ADD COLUMN IF NOT EXISTS ca_code VARCHAR(50) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS club_code VARCHAR(50) DEFAULT NULL;
