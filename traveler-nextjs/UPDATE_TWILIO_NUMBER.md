# Update Your New Twilio Phone Number

## Steps to Update

1. **Get your new Twilio phone number** from Twilio Console
   - Go to: Phone Numbers → Manage → Active Numbers
   - Copy the phone number (should be in E.164 format like +15551234567)

2. **Update your `.env.local` file**:
   - Open `.env.local` in the `traveler-nextjs` directory
   - Update the `TWILIO_PHONE_NUMBER` line:
     ```env
     TWILIO_PHONE_NUMBER=+1YOUR_NEW_NUMBER_HERE
     ```
   - Make sure it includes the `+1` and country code

3. **Restart your dev server**:
   - Stop the current server (Ctrl+C)
   - Start it again: `npm run dev`

4. **Test it**:
   - Go to http://localhost:3000
   - Enter your personal phone number in the signup form
   - You should receive an SMS from your new Twilio number!

## Verify It's Working

You can also run the test script:
```bash
node test-twilio.js
```

This will verify your new number is set up correctly.

