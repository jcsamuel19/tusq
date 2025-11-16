-- Create signups table for TUSQ landing page
-- This table stores signup information from the landing page

CREATE TABLE IF NOT EXISTS signups (
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

-- Create index on created_at for faster queries and sorting
CREATE INDEX IF NOT EXISTS idx_signups_created_at ON signups(created_at DESC);

-- Create index on phone_number for duplicate checking and lookups
CREATE INDEX IF NOT EXISTS idx_signups_phone_number ON signups(phone_number);

-- Enable Row Level Security (RLS)
ALTER TABLE signups ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role to access everything
-- Note: In production, you should create more restrictive policies
CREATE POLICY "Service role has full access to signups" ON signups
  FOR ALL USING (auth.role() = 'service_role');

-- Create policy to allow anonymous inserts (for the landing page signup form)
CREATE POLICY "Allow anonymous inserts to signups" ON signups
  FOR INSERT WITH CHECK (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at on row updates
CREATE TRIGGER update_signups_updated_at
  BEFORE UPDATE ON signups
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();



