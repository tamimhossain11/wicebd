-- Add wall-magazine to the registration_type ENUM in id_cards
ALTER TABLE id_cards
  MODIFY COLUMN registration_type ENUM('project','olympiad','robo_soccer','wall-magazine') NOT NULL;
