/**
 * Render Cron Job - Check for incomplete surveys
 * Runs daily to check for users with incomplete surveys (3+ days)
 */

const fetch = require('node-fetch');

const VERCEL_API_URL = process.env.VERCEL_API_URL;
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY;

if (!VERCEL_API_URL) {
  console.error('VERCEL_API_URL environment variable is not set');
  process.exit(1);
}

if (!INTERNAL_API_KEY) {
  console.error('INTERNAL_API_KEY environment variable is not set');
  process.exit(1);
}

async function checkTimeouts() {
  try {
    console.log(`[${new Date().toISOString()}] Checking for incomplete surveys...`);
    
    const response = await fetch(`${VERCEL_API_URL}/api/cron/check-timeouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': INTERNAL_API_KEY,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log(`[${new Date().toISOString()}] Success:`, result);
    
    return result;
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error:`, error.message);
    throw error;
  }
}

// Run the check
checkTimeouts()
  .then(() => {
    console.log(`[${new Date().toISOString()}] Cron job completed successfully`);
    process.exit(0);
  })
  .catch((error) => {
    console.error(`[${new Date().toISOString()}] Cron job failed:`, error);
    process.exit(1);
  });

