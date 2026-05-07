-- Migration 015: Judge marks breakdown fields + honorable mention support
ALTER TABLE judge_marks
  ADD COLUMN IF NOT EXISTS urgency      DECIMAL(5,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS visibility   DECIMAL(5,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS relevance    DECIMAL(5,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS presentation DECIMAL(5,2) NOT NULL DEFAULT 0;

ALTER TABLE national_round_selections
  ADD COLUMN IF NOT EXISTS judge_count INT          NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_manual   TINYINT(1)   NOT NULL DEFAULT 0;
