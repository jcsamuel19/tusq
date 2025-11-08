# Render Cron Service

This is a separate Node.js service that runs on Render to handle scheduled tasks.

## Setup

1. Create a new Web Service on Render
2. Point it to this directory
3. Set environment variables:
   - `INTERNAL_API_KEY` - Same as in Vercel
   - `VERCEL_API_URL` - Your Vercel deployment URL (e.g., https://your-app.vercel.app)

## Cron Jobs

### Daily Incomplete Survey Check

Configure a cron job in Render with:
- **Schedule**: `0 0 * * *` (daily at midnight UTC)
- **Command**: `node check-timeouts.js`

Or use Render's cron job feature to call:
```bash
curl -X POST ${VERCEL_API_URL}/api/cron/check-timeouts \
  -H "x-api-key: ${INTERNAL_API_KEY}"
```

