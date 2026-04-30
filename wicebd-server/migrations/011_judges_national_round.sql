-- Migration 011: Judge panel and national round tables

CREATE TABLE IF NOT EXISTS judges (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  username VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NULL,
  judge_type ENUM('project', 'wall_magazine') NOT NULL,
  subcategory VARCHAR(255) NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_judge_username (username)
);

CREATE TABLE IF NOT EXISTS judge_marks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  judge_id INT NOT NULL,
  registration_id VARCHAR(255) NOT NULL,
  competition_type ENUM('project', 'wall_magazine') NOT NULL,
  marks DECIMAL(6,2) NOT NULL DEFAULT 0,
  notes TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (judge_id) REFERENCES judges(id) ON DELETE CASCADE,
  UNIQUE KEY uq_judge_registration (judge_id, registration_id)
);

CREATE TABLE IF NOT EXISTS national_round_selections (
  id INT PRIMARY KEY AUTO_INCREMENT,
  registration_id VARCHAR(255) NOT NULL,
  competition_type ENUM('project', 'wall_magazine') NOT NULL,
  subcategory VARCHAR(255) NULL,
  education_category VARCHAR(100) NULL,
  position ENUM('gold', 'silver', 'bronze') NOT NULL,
  total_marks DECIMAL(8,2) DEFAULT 0,
  selected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  selected_by INT NULL,
  FOREIGN KEY (selected_by) REFERENCES admins(id) ON DELETE SET NULL,
  UNIQUE KEY uq_national_registration (registration_id)
);
