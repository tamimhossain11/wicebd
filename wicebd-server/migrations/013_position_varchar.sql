-- Migration 013: Widen national_round_selections.position from ENUM to VARCHAR
-- so positions beyond 'bronze' (4th, 5th, …) can be stored.
ALTER TABLE national_round_selections
  MODIFY COLUMN position VARCHAR(20) NOT NULL DEFAULT 'gold';
