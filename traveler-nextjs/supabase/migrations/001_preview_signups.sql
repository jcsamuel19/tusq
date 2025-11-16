-- Create preview_signups table for TUSQ_PREVIEW database
-- This table stores signup information from the landing page

CREATE TABLE IF NOT EXISTS preview_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  source TEXT DEFAULT 'landing_page',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on created_at for faster queries
CREATE INDEX IF NOT EXISTS idx_preview_signups_created_at ON preview_signups(created_at);

-- Create index on phone_number for duplicate checking
CREATE INDEX IF NOT EXISTS idx_preview_signups_phone_number ON preview_signups(phone_number);

-- Enable Row Level Security (RLS)
ALTER TABLE preview_signups ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role to access everything
-- Note: In production, you should create more restrictive policies
CREATE POLICY "Service role has full access to preview_signups" ON preview_signups
  FOR ALL USING (auth.role() = 'service_role');

-- Create policy to allow anonymous inserts (for the signup form)
CREATE POLICY "Allow anonymous inserts to preview_signups" ON preview_signups
  FOR INSERT WITH CHECK (true);

