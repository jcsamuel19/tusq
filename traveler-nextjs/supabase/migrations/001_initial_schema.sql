-- Create users table
-- Column order organized logically:
-- 1. Primary key and identifiers
-- 2. User profile information
-- 3. Contact information
-- 4. Status flags
-- 5. Survey tracking
-- 6. Activity tracking
-- 7. System metadata
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE,
  first_name TEXT,
  last_name TEXT,
  phone_number TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  digest_paused BOOLEAN DEFAULT FALSE,
  survey_started_at TIMESTAMP WITH TIME ZONE,
  survey_completed_at TIMESTAMP WITH TIME ZONE,
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_users_phone_number ON users(phone_number);
CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON users(auth_user_id);

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  conversation_state TEXT NOT NULL DEFAULT 'welcome',
  current_question_index INTEGER DEFAULT 0,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_key TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, question_key)
);

-- Create index on user_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

-- Create survey_questions table (configuration)
CREATE TABLE IF NOT EXISTS survey_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_key TEXT UNIQUE NOT NULL,
  question_text TEXT NOT NULL,
  question_order INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default survey questions
INSERT INTO survey_questions (question_key, question_text, question_order, is_active) VALUES
  ('interests', 'What are your main interests? (e.g., music, art, sports, food)', 1, TRUE),
  ('location', 'What city or area are you located in?', 2, TRUE),
  ('activity_type', 'What types of activities do you prefer? (e.g., outdoor, indoor, social, solo)', 3, TRUE),
  ('time_preference', 'When do you typically have free time? (e.g., weekends, evenings, weekday afternoons)', 4, TRUE),
  ('budget', 'What is your typical budget for weekend activities? (e.g., free, $10-20, $20-50)', 5, TRUE)
ON CONFLICT (question_key) DO NOTHING;

-- Enable Row Level Security (RLS) for Supabase
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_questions ENABLE ROW LEVEL SECURITY;

-- Create policies (allow service role to access everything)
-- Note: In production, you should create more restrictive policies
CREATE POLICY "Service role has full access to users" ON users
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to conversations" ON conversations
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to user_preferences" ON user_preferences
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to survey_questions" ON survey_questions
  FOR ALL USING (auth.role() = 'service_role');

