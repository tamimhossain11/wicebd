-- Migration 008: Add member4 and member5 to temp_registrations and registrations tables
-- Run once against the live database

USE `wice-bd`;

-- temp_registrations
ALTER TABLE temp_registrations
  ADD COLUMN IF NOT EXISTS member4      VARCHAR(255) DEFAULT NULL AFTER tshirtSize3,
  ADD COLUMN IF NOT EXISTS institution4 VARCHAR(255) DEFAULT NULL AFTER member4,
  ADD COLUMN IF NOT EXISTS tshirtSize4  VARCHAR(10)  DEFAULT NULL AFTER institution4,
  ADD COLUMN IF NOT EXISTS member5      VARCHAR(255) DEFAULT NULL AFTER tshirtSize4,
  ADD COLUMN IF NOT EXISTS institution5 VARCHAR(255) DEFAULT NULL AFTER member5,
  ADD COLUMN IF NOT EXISTS tshirtSize5  VARCHAR(10)  DEFAULT NULL AFTER institution5;

-- registrations
ALTER TABLE registrations
  ADD COLUMN IF NOT EXISTS member4      VARCHAR(255) DEFAULT NULL AFTER tshirtSize3,
  ADD COLUMN IF NOT EXISTS institution4 VARCHAR(255) DEFAULT NULL AFTER member4,
  ADD COLUMN IF NOT EXISTS tshirtSize4  VARCHAR(10)  DEFAULT NULL AFTER institution4,
  ADD COLUMN IF NOT EXISTS member5      VARCHAR(255) DEFAULT NULL AFTER tshirtSize4,
  ADD COLUMN IF NOT EXISTS institution5 VARCHAR(255) DEFAULT NULL AFTER member5,
  ADD COLUMN IF NOT EXISTS tshirtSize5  VARCHAR(10)  DEFAULT NULL AFTER institution5;
