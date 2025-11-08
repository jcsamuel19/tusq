# Supabase Setup Guide

## Step 1: Get Your Supabase Credentials

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** → **API** (in the left sidebar)
4. You'll need:
   - **Project URL**: Found at the top (e.g., `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public key**: Under "Project API keys" → "anon" → "public"
   - **service_role key**: Under "Project API keys" → "service_role" → "secret" ⚠️ Keep this secret!

## Step 2: Run the Migration

1. In Supabase dashboard, click **SQL Editor** in the left sidebar
2. Click **New query**
3. Copy and paste the entire contents of `supabase/migrations/001_initial_schema.sql`
4. Click **Run** (or press Cmd/Ctrl + Enter)
5. You should see: "Success. No rows returned"

## Step 3: Verify Tables Were Created

1. Click **Table Editor** in the left sidebar
2. You should see 4 tables:
   - ✅ `users`
   - ✅ `conversations`
   - ✅ `user_preferences`
   - ✅ `survey_questions`
3. Click on `survey_questions` table - it should have 5 rows (the default questions)

## Step 4: Set Up Environment Variables

Create or update your `.env.local` file in the `traveler-nextjs` directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Twilio Configuration (you'll add these later)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Internal API Key (generate a random secure string)
INTERNAL_API_KEY=your_secure_random_api_key_here

# Webhook URL (set after Vercel deployment)
TWILIO_WEBHOOK_URL=https://your-domain.vercel.app/api/sms/webhook
```

## Step 5: Test the Connection

After setting up environment variables, you can test the connection by running:

```bash
npm run dev
```

Then try signing up with a phone number. Check the Supabase dashboard → Table Editor → `users` table to see if a new user was created.

## Troubleshooting

### "relation does not exist" error
- Make sure you ran the migration SQL completely
- Check that all 4 tables exist in Table Editor

### "permission denied" error
- Make sure you're using the service_role key for server-side operations
- Check that the RLS policies were created (they're in the migration)

### Can't see survey_questions data
- Click on the `survey_questions` table in Table Editor
- You should see 5 rows with the default questions

## Next Steps

After database setup:
1. ✅ Set up Twilio account and get credentials
2. ✅ Configure environment variables
3. ✅ Deploy to Vercel
4. ✅ Set up Render cron service
5. ✅ Configure Twilio webhook URL

