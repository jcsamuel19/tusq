# Twilio SMS Survey System Setup Guide

## Prerequisites

1. Twilio account with a phone number
2. Supabase project with PostgreSQL database
3. Vercel account for deployment
4. Render account for cron jobs

## Environment Variables

Create a `.env.local` file in the `traveler-nextjs` directory with the following variables:

```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Internal API Key (for Render cron jobs)
INTERNAL_API_KEY=your_secure_random_api_key_here

# Webhook URL (set in Twilio console after deployment)
TWILIO_WEBHOOK_URL=https://your-domain.vercel.app/api/sms/webhook
```

## Database Setup (Supabase)

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the migration file: `supabase/migrations/001_initial_schema.sql`
4. This will create all necessary tables:
   - `users`
   - `conversations`
   - `user_preferences`
   - `survey_questions`

## Twilio Setup

1. Log in to your Twilio Console
2. Get your Account SID and Auth Token from the dashboard
3. Purchase a phone number (or use a trial number for testing)
4. After deploying to Vercel, configure the webhook:
   - Go to Phone Numbers → Manage → Active Numbers
   - Click on your phone number
   - Under "Messaging", set the webhook URL to: `https://your-domain.vercel.app/api/sms/webhook`
   - Set HTTP method to: `POST`

## Deployment

### Vercel (Landing Page & API)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy

### Render (Cron Jobs)

1. Create a new Web Service on Render
2. Use the following configuration:
   - **Build Command**: `npm install`
   - **Start Command**: `node render-cron/index.js`
   - **Environment**: Node

3. Create a cron job in Render:
   - Schedule: `0 0 * * *` (daily at midnight)
   - Command: `curl -X POST https://your-domain.vercel.app/api/cron/check-timeouts -H "x-api-key: YOUR_INTERNAL_API_KEY"`

4. Set environment variables in Render:
   - `INTERNAL_API_KEY` (same as in Vercel)
   - `VERCEL_API_URL` (your Vercel deployment URL)

## Testing

1. Submit a phone number on the landing page
2. You should receive a welcome SMS
3. Reply to the SMS to start the survey
4. Complete all 5 questions
5. Test preference updates by texting "START"

## Survey Flow

1. User signs up → Welcome SMS sent
2. User replies → First question sent
3. User answers each question → Next question sent
4. After 5 questions → Survey complete message
5. Users can text "START" anytime to update preferences

## Timeout Handling

The Render cron job checks daily for incomplete surveys (3+ days old) and:
- Pauses user digests
- Sends pause message with "START" option

