-- Migration: rename social_twitter → social_threads
-- Run this in Supabase SQL Editor

-- Step 1: Add new column
ALTER TABLE settings ADD COLUMN IF NOT EXISTS social_threads TEXT DEFAULT '';

-- Step 2: Copy existing Twitter data to Threads (optional, preserve old data)
UPDATE settings SET social_threads = social_twitter WHERE social_twitter IS NOT NULL AND social_twitter != '';

-- Step 3: Drop old column
ALTER TABLE settings DROP COLUMN IF EXISTS social_twitter;
