-- Add poster/image URL support to announcements (news)
ALTER TABLE announcements
  ADD COLUMN image_url VARCHAR(500) DEFAULT NULL AFTER body;
