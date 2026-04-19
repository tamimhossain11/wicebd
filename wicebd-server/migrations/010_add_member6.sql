-- Migration 010: Add member6, institution6, tshirtSize6 (max 6 members per team)

-- temp_registrations
ALTER TABLE temp_registrations ADD COLUMN IF NOT EXISTS member6      VARCHAR(255) DEFAULT NULL AFTER tshirtSize5;
ALTER TABLE temp_registrations ADD COLUMN IF NOT EXISTS institution6 VARCHAR(255) DEFAULT NULL AFTER member6;
ALTER TABLE temp_registrations ADD COLUMN IF NOT EXISTS tshirtSize6  VARCHAR(10)  DEFAULT NULL AFTER institution6;

-- registrations
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS member6      VARCHAR(255) DEFAULT NULL AFTER tshirtSize5;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS institution6 VARCHAR(255) DEFAULT NULL AFTER member6;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS tshirtSize6  VARCHAR(10)  DEFAULT NULL AFTER institution6;
