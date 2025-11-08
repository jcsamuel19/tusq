# Environment Variables Setup

## Location

Create a file named `.env.local` in the `traveler-nextjs` directory:

```
/Users/jeremysamuel/Desktop/Coding Projects/tusq/traveler-nextjs/.env.local
```

## How to Create the File

### Option 1: Using Your IDE
1. In your file explorer, navigate to `traveler-nextjs` folder
2. Create a new file named `.env.local` (note the dot at the beginning)
3. Paste the content below into it

### Option 2: Using Terminal
```bash
cd "/Users/jeremysamuel/Desktop/Coding Projects/tusq/traveler-nextjs"
touch .env.local
```

Then open it in your editor and paste the content.

## File Content

Copy and paste this into your `.env.local` file, then fill in the values:

```env
# Supabase Configuration
# Get these from: Supabase Dashboard → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_public_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_secret_key_here

# Twilio Configuration
# Get these from: Twilio Console → Account Dashboard
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Internal API Key
# Generate a random secure string
# You can use: openssl rand -base64 32
INTERNAL_API_KEY=your_secure_random_api_key_here

# Webhook URL
# Set this after deploying to Vercel
TWILIO_WEBHOOK_URL=https://your-domain.vercel.app/api/sms/webhook
```

## Getting Your Values

### Supabase Credentials
1. Go to Supabase Dashboard
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** (secret) → `SUPABASE_SERVICE_ROLE_KEY`

### Twilio Credentials
1. Go to Twilio Console: https://console.twilio.com
2. Your **Account SID** → `TWILIO_ACCOUNT_SID`
3. Your **Auth Token** → `TWILIO_AUTH_TOKEN`
4. Your **Phone Number** (purchase one if needed) → `TWILIO_PHONE_NUMBER`

### Internal API Key
Generate a random secure string. You can use:
```bash
openssl rand -base64 32
```

Or use any random string generator. This is used to secure your cron job endpoints.

### Webhook URL
Leave this empty for now. Set it after you deploy to Vercel.

## Important Notes

- ✅ The `.env.local` file is in `.gitignore` - it won't be committed to git (good for security!)
- ✅ Never commit this file or share these credentials
- ✅ Restart your dev server after creating/updating `.env.local`
- ✅ For production (Vercel), add these same variables in the Vercel dashboard

## Verify It's Working

After creating the file, restart your dev server:
```bash
npm run dev
```

If there are any missing required variables, you'll see errors in the console.

