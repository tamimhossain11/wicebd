-- ============================================================
-- WICEBD Database Migration 001
-- Database: wicebd
-- Run this file once to set up all required tables
-- ============================================================

CREATE DATABASE IF NOT EXISTS `wice-bd` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `wice-bd`;

-- ============================================================
-- 1. USERS TABLE (public user accounts)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) DEFAULT NULL,         -- NULL for OAuth users
  google_id VARCHAR(255) DEFAULT NULL,
  facebook_id VARCHAR(255) DEFAULT NULL,
  avatar VARCHAR(500) DEFAULT NULL,
  provider ENUM('local', 'google', 'facebook') DEFAULT 'local',
  is_verified TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- 2. ADMINS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 3. TEMP REGISTRATIONS TABLE (pending payment)
-- ============================================================
CREATE TABLE IF NOT EXISTS temp_registrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  paymentID VARCHAR(255) UNIQUE NOT NULL,
  user_id INT DEFAULT NULL,
  competitionCategory VARCHAR(255) DEFAULT NULL,
  projectSubcategory VARCHAR(255) DEFAULT NULL,
  categories TEXT DEFAULT NULL,
  crRefrence VARCHAR(255) DEFAULT NULL,
  leader VARCHAR(255) DEFAULT NULL,
  institution VARCHAR(255) DEFAULT NULL,
  leaderPhone VARCHAR(50) DEFAULT NULL,
  leaderWhatsApp VARCHAR(50) DEFAULT NULL,
  leaderEmail VARCHAR(255) DEFAULT NULL,
  tshirtSizeLeader VARCHAR(10) DEFAULT NULL,
  member2 VARCHAR(255) DEFAULT NULL,
  institution2 VARCHAR(255) DEFAULT NULL,
  tshirtSize2 VARCHAR(10) DEFAULT NULL,
  member3 VARCHAR(255) DEFAULT NULL,
  institution3 VARCHAR(255) DEFAULT NULL,
  tshirtSize3 VARCHAR(10) DEFAULT NULL,
  projectTitle VARCHAR(500) DEFAULT NULL,
  projectCategory VARCHAR(255) DEFAULT NULL,
  participatedBefore VARCHAR(10) DEFAULT NULL,
  previousCompetition VARCHAR(500) DEFAULT NULL,
  socialMedia VARCHAR(255) DEFAULT NULL,
  infoSource VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================================
-- 4. REGISTRATIONS TABLE (confirmed / paid)
-- ============================================================
CREATE TABLE IF NOT EXISTS registrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  paymentID VARCHAR(255) UNIQUE NOT NULL,
  user_id INT DEFAULT NULL,
  competitionCategory VARCHAR(255) DEFAULT NULL,
  projectSubcategory VARCHAR(255) DEFAULT NULL,
  categories TEXT DEFAULT NULL,
  crReference VARCHAR(255) DEFAULT NULL,
  leader VARCHAR(255) DEFAULT NULL,
  institution VARCHAR(255) DEFAULT NULL,
  leaderPhone VARCHAR(50) DEFAULT NULL,
  leaderWhatsApp VARCHAR(50) DEFAULT NULL,
  leaderEmail VARCHAR(255) DEFAULT NULL,
  tshirtSizeLeader VARCHAR(10) DEFAULT NULL,
  member2 VARCHAR(255) DEFAULT NULL,
  institution2 VARCHAR(255) DEFAULT NULL,
  tshirtSize2 VARCHAR(10) DEFAULT NULL,
  member3 VARCHAR(255) DEFAULT NULL,
  institution3 VARCHAR(255) DEFAULT NULL,
  tshirtSize3 VARCHAR(10) DEFAULT NULL,
  projectTitle VARCHAR(500) DEFAULT NULL,
  projectCategory VARCHAR(255) DEFAULT NULL,
  participatedBefore VARCHAR(10) DEFAULT NULL,
  previousCompetition VARCHAR(500) DEFAULT NULL,
  socialMedia VARCHAR(255) DEFAULT NULL,
  infoSource VARCHAR(255) DEFAULT NULL,
  bkashTrxId VARCHAR(255) DEFAULT NULL,
  amount DECIMAL(10,2) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================================
-- 5. OLYMPIAD REGISTRATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS olympiad_registrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT DEFAULT NULL,
  full_name VARCHAR(255) DEFAULT NULL,
  institution VARCHAR(255) DEFAULT NULL,
  class_grade VARCHAR(100) DEFAULT NULL,
  phone VARCHAR(50) DEFAULT NULL,
  email VARCHAR(255) DEFAULT NULL,
  district VARCHAR(255) DEFAULT NULL,
  category VARCHAR(255) DEFAULT NULL,
  payment_status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================================
-- 6. QR VERIFICATION TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS qr_verification (
  id INT AUTO_INCREMENT PRIMARY KEY,
  registration_id INT DEFAULT NULL,
  member_type VARCHAR(50) DEFAULT NULL,
  verification_hash VARCHAR(255) UNIQUE NOT NULL,
  is_used TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- SEED: Default admin account
-- Password: admin123  (bcrypt hash — change immediately after setup)
-- Generate a new hash with: node generate-hash.js
-- ============================================================
INSERT IGNORE INTO admins (username, password)
VALUES ('admin', '$2b$10$k994/.TTRFWOqq5mOSaelu90fE/X6Prrfpx0PQbY0hJ5t5Egn9ARy');

-- ============================================================
-- Done. All tables created successfully.
-- ============================================================
