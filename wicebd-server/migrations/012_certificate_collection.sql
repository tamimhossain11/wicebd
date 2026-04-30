-- Migration 012: Add certificate collection tracking to id_cards
-- Only applies to project and wall-magazine participants (not olympiad, not guest)

ALTER TABLE id_cards
  ADD COLUMN certificate_collected     TINYINT(1)   NOT NULL DEFAULT 0,
  ADD COLUMN certificate_collected_at  TIMESTAMP    NULL     DEFAULT NULL,
  ADD COLUMN certificate_collected_by  INT          NULL     DEFAULT NULL;
