-- ============================================================
-- WICEBD Migration 009 — PayStation & Olympiad Live Fixes
-- Run on the live Cloud SQL database via cloud-sql-proxy
-- Uses information_schema checks — fully idempotent (safe to re-run)
-- ============================================================

SET @db = DATABASE();

-- ─────────────────────────────────────────────────────────────
-- 1. temp_registrations ► bkash_payment_id
--    (stores PayStation invoice_number for lookup at confirm time)
-- ─────────────────────────────────────────────────────────────
SET @t = 'temp_registrations'; SET @c = 'bkash_payment_id';
SET @q = IF((SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=@db AND TABLE_NAME=@t AND COLUMN_NAME=@c)=0,
  CONCAT('ALTER TABLE `',@t,'` ADD COLUMN `',@c,'` VARCHAR(255) DEFAULT NULL'), 'SELECT 1');
PREPARE s FROM @q; EXECUTE s; DEALLOCATE PREPARE s;

-- ─────────────────────────────────────────────────────────────
-- 2. temp_registrations ► fix crRefrence typo → crReference
-- ─────────────────────────────────────────────────────────────
SET @t = 'temp_registrations'; SET @c = 'crRefrence';
SET @q = IF((SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=@db AND TABLE_NAME=@t AND COLUMN_NAME=@c)>0,
  'ALTER TABLE `temp_registrations` CHANGE `crRefrence` `crReference` VARCHAR(255) DEFAULT NULL',
  'SELECT 1');
PREPARE s FROM @q; EXECUTE s; DEALLOCATE PREPARE s;

-- ─────────────────────────────────────────────────────────────
-- 3. olympiad_registrations ► columns needed by new payment flow
-- ─────────────────────────────────────────────────────────────
SET @t = 'olympiad_registrations';

SET @c = 'registration_id';
SET @q = IF((SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=@db AND TABLE_NAME=@t AND COLUMN_NAME=@c)=0,
  CONCAT('ALTER TABLE `',@t,'` ADD COLUMN `',@c,'` VARCHAR(50) DEFAULT NULL'), 'SELECT 1');
PREPARE s FROM @q; EXECUTE s; DEALLOCATE PREPARE s;

SET @c = 'full_name';
SET @q = IF((SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=@db AND TABLE_NAME=@t AND COLUMN_NAME=@c)=0,
  CONCAT('ALTER TABLE `',@t,'` ADD COLUMN `',@c,'` VARCHAR(255) DEFAULT NULL'), 'SELECT 1');
PREPARE s FROM @q; EXECUTE s; DEALLOCATE PREPARE s;

SET @c = 'address';
SET @q = IF((SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=@db AND TABLE_NAME=@t AND COLUMN_NAME=@c)=0,
  CONCAT('ALTER TABLE `',@t,'` ADD COLUMN `',@c,'` TEXT DEFAULT NULL'), 'SELECT 1');
PREPARE s FROM @q; EXECUTE s; DEALLOCATE PREPARE s;

SET @c = 'cr_reference';
SET @q = IF((SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=@db AND TABLE_NAME=@t AND COLUMN_NAME=@c)=0,
  CONCAT('ALTER TABLE `',@t,'` ADD COLUMN `',@c,'` VARCHAR(255) DEFAULT NULL'), 'SELECT 1');
PREPARE s FROM @q; EXECUTE s; DEALLOCATE PREPARE s;

SET @c = 'status';
SET @q = IF((SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=@db AND TABLE_NAME=@t AND COLUMN_NAME=@c)=0,
  CONCAT('ALTER TABLE `',@t,'` ADD COLUMN `',@c,'` VARCHAR(50) DEFAULT ''registered'''), 'SELECT 1');
PREPARE s FROM @q; EXECUTE s; DEALLOCATE PREPARE s;

SET @c = 'ca_code';
SET @q = IF((SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=@db AND TABLE_NAME=@t AND COLUMN_NAME=@c)=0,
  CONCAT('ALTER TABLE `',@t,'` ADD COLUMN `',@c,'` VARCHAR(50) DEFAULT NULL'), 'SELECT 1');
PREPARE s FROM @q; EXECUTE s; DEALLOCATE PREPARE s;

SET @c = 'club_code';
SET @q = IF((SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=@db AND TABLE_NAME=@t AND COLUMN_NAME=@c)=0,
  CONCAT('ALTER TABLE `',@t,'` ADD COLUMN `',@c,'` VARCHAR(50) DEFAULT NULL'), 'SELECT 1');
PREPARE s FROM @q; EXECUTE s; DEALLOCATE PREPARE s;

SET @c = 'promo_code';
SET @q = IF((SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=@db AND TABLE_NAME=@t AND COLUMN_NAME=@c)=0,
  CONCAT('ALTER TABLE `',@t,'` ADD COLUMN `',@c,'` VARCHAR(50) DEFAULT NULL'), 'SELECT 1');
PREPARE s FROM @q; EXECUTE s; DEALLOCATE PREPARE s;

-- ─────────────────────────────────────────────────────────────
-- 4. registrations ► bkashTrxId (PayStation trx_id stored here)
-- ─────────────────────────────────────────────────────────────
SET @t = 'registrations'; SET @c = 'bkashTrxId';
SET @q = IF((SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=@db AND TABLE_NAME=@t AND COLUMN_NAME=@c)=0,
  CONCAT('ALTER TABLE `',@t,'` ADD COLUMN `',@c,'` VARCHAR(255) DEFAULT NULL'), 'SELECT 1');
PREPARE s FROM @q; EXECUTE s; DEALLOCATE PREPARE s;

-- ─────────────────────────────────────────────────────────────
-- 5. registrations ► member4 / member5 columns
-- ─────────────────────────────────────────────────────────────
SET @t = 'registrations';

SET @c = 'member4';
SET @q = IF((SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=@db AND TABLE_NAME=@t AND COLUMN_NAME=@c)=0,
  CONCAT('ALTER TABLE `',@t,'` ADD COLUMN `',@c,'` VARCHAR(255) DEFAULT NULL'), 'SELECT 1');
PREPARE s FROM @q; EXECUTE s; DEALLOCATE PREPARE s;

SET @c = 'institution4';
SET @q = IF((SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=@db AND TABLE_NAME=@t AND COLUMN_NAME=@c)=0,
  CONCAT('ALTER TABLE `',@t,'` ADD COLUMN `',@c,'` VARCHAR(255) DEFAULT NULL'), 'SELECT 1');
PREPARE s FROM @q; EXECUTE s; DEALLOCATE PREPARE s;

SET @c = 'tshirtSize4';
SET @q = IF((SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=@db AND TABLE_NAME=@t AND COLUMN_NAME=@c)=0,
  CONCAT('ALTER TABLE `',@t,'` ADD COLUMN `',@c,'` VARCHAR(10) DEFAULT NULL'), 'SELECT 1');
PREPARE s FROM @q; EXECUTE s; DEALLOCATE PREPARE s;

SET @c = 'member5';
SET @q = IF((SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=@db AND TABLE_NAME=@t AND COLUMN_NAME=@c)=0,
  CONCAT('ALTER TABLE `',@t,'` ADD COLUMN `',@c,'` VARCHAR(255) DEFAULT NULL'), 'SELECT 1');
PREPARE s FROM @q; EXECUTE s; DEALLOCATE PREPARE s;

SET @c = 'institution5';
SET @q = IF((SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=@db AND TABLE_NAME=@t AND COLUMN_NAME=@c)=0,
  CONCAT('ALTER TABLE `',@t,'` ADD COLUMN `',@c,'` VARCHAR(255) DEFAULT NULL'), 'SELECT 1');
PREPARE s FROM @q; EXECUTE s; DEALLOCATE PREPARE s;

SET @c = 'tshirtSize5';
SET @q = IF((SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=@db AND TABLE_NAME=@t AND COLUMN_NAME=@c)=0,
  CONCAT('ALTER TABLE `',@t,'` ADD COLUMN `',@c,'` VARCHAR(10) DEFAULT NULL'), 'SELECT 1');
PREPARE s FROM @q; EXECUTE s; DEALLOCATE PREPARE s;

-- ─────────────────────────────────────────────────────────────
-- 6. temp_registrations ► member4 / member5 columns
-- ─────────────────────────────────────────────────────────────
SET @t = 'temp_registrations';

SET @c = 'member4';
SET @q = IF((SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=@db AND TABLE_NAME=@t AND COLUMN_NAME=@c)=0,
  CONCAT('ALTER TABLE `',@t,'` ADD COLUMN `',@c,'` VARCHAR(255) DEFAULT NULL'), 'SELECT 1');
PREPARE s FROM @q; EXECUTE s; DEALLOCATE PREPARE s;

SET @c = 'institution4';
SET @q = IF((SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=@db AND TABLE_NAME=@t AND COLUMN_NAME=@c)=0,
  CONCAT('ALTER TABLE `',@t,'` ADD COLUMN `',@c,'` VARCHAR(255) DEFAULT NULL'), 'SELECT 1');
PREPARE s FROM @q; EXECUTE s; DEALLOCATE PREPARE s;

SET @c = 'tshirtSize4';
SET @q = IF((SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=@db AND TABLE_NAME=@t AND COLUMN_NAME=@c)=0,
  CONCAT('ALTER TABLE `',@t,'` ADD COLUMN `',@c,'` VARCHAR(10) DEFAULT NULL'), 'SELECT 1');
PREPARE s FROM @q; EXECUTE s; DEALLOCATE PREPARE s;

SET @c = 'member5';
SET @q = IF((SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=@db AND TABLE_NAME=@t AND COLUMN_NAME=@c)=0,
  CONCAT('ALTER TABLE `',@t,'` ADD COLUMN `',@c,'` VARCHAR(255) DEFAULT NULL'), 'SELECT 1');
PREPARE s FROM @q; EXECUTE s; DEALLOCATE PREPARE s;

SET @c = 'institution5';
SET @q = IF((SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=@db AND TABLE_NAME=@t AND COLUMN_NAME=@c)=0,
  CONCAT('ALTER TABLE `',@t,'` ADD COLUMN `',@c,'` VARCHAR(255) DEFAULT NULL'), 'SELECT 1');
PREPARE s FROM @q; EXECUTE s; DEALLOCATE PREPARE s;

SET @c = 'tshirtSize5';
SET @q = IF((SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=@db AND TABLE_NAME=@t AND COLUMN_NAME=@c)=0,
  CONCAT('ALTER TABLE `',@t,'` ADD COLUMN `',@c,'` VARCHAR(10) DEFAULT NULL'), 'SELECT 1');
PREPARE s FROM @q; EXECUTE s; DEALLOCATE PREPARE s;

-- ─────────────────────────────────────────────────────────────
-- Verify key columns after migration
-- ─────────────────────────────────────────────────────────────
SELECT TABLE_NAME, COLUMN_NAME, COLUMN_TYPE
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND (
    (TABLE_NAME = 'temp_registrations'     AND COLUMN_NAME IN ('bkash_payment_id','crReference','member4','member5'))
    OR (TABLE_NAME = 'olympiad_registrations' AND COLUMN_NAME IN ('registration_id','address','cr_reference','status','ca_code','club_code'))
    OR (TABLE_NAME = 'registrations'         AND COLUMN_NAME IN ('bkashTrxId','member4','member5'))
  )
ORDER BY TABLE_NAME, COLUMN_NAME;
