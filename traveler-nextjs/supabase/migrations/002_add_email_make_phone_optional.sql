-- Add email column to signups table and make phone_number optional
-- This migration updates the signups table to require email and make phone optional

-- Add email column to signups table
ALTER TABLE signups 
  ADD COLUMN IF NOT EXISTS email TEXT;

-- Make phone_number optional (remove NOT NULL constraint)
ALTER TABLE signups 
  ALTER COLUMN phone_number DROP NOT NULL;

-- Make email required (add NOT NULL constraint)
-- First, set a default for any existing NULL values (if any)
UPDATE signups SET email = '' WHERE email IS NULL;
ALTER TABLE signups 
  ALTER COLUMN email SET NOT NULL;

-- Create index on email for duplicate checking and lookups
CREATE INDEX IF NOT EXISTS idx_signups_email ON signups(email);

-- Add unique constraint on email to prevent duplicates
CREATE UNIQUE INDEX IF NOT EXISTS idx_signups_email_unique ON signups(email) WHERE email IS NOT NULL;

