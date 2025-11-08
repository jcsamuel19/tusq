/**
 * Test script to send an SMS from your Twilio number to your personal number
 * Usage: node test-send-sms.js YOUR_PHONE_NUMBER
 * Example: node test-send-sms.js +15551234567
 */

require('dotenv').config({ path: '.env.local' });

const twilio = require('twilio');

async function sendTestSMS() {
  const toNumber = process.argv[2];

  if (!toNumber) {
    console.error('❌ Please provide a phone number to send to');
    console.log('Usage: node test-send-sms.js +15551234567');
    process.exit(1);
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    console.error('❌ Missing Twilio credentials in .env.local');
    process.exit(1);
  }

  console.log('📱 Sending test SMS...\n');
  console.log(`   FROM: ${fromNumber} (Your Twilio Number)`);
  console.log(`   TO:   ${toNumber} (Your Personal Number)\n`);

  try {
    const client = twilio(accountSid, authToken);

    const message = await client.messages.create({
      body: '🧪 Test message from Twilio! This confirms your setup is working correctly.',
      from: fromNumber,
      to: toNumber,
    });

    console.log('✅ SMS sent successfully!');
    console.log(`   Message SID: ${message.sid}`);
    console.log(`   Status: ${message.status}\n`);
    console.log(`📱 Check your phone (${toNumber}) for the message!\n`);

  } catch (error) {
    console.error('❌ Error sending SMS:', error.message);
    
    if (error.code === 21211) {
      console.error('   The phone number format is invalid. Use E.164 format: +15551234567');
    } else if (error.code === 21608) {
      console.error('   Your Twilio account is in trial mode. You can only send to verified numbers.');
      console.error('   Verify your number at: https://console.twilio.com/us1/develop/phone-numbers/manage/verified');
    } else if (error.code === 21614) {
      console.error('   The "To" number is not a valid mobile number.');
    }
    
    process.exit(1);
  }
}

sendTestSMS();

