# Fixing Twilio Toll-Free Verification Error (30032)

## The Problem

Error 30032 means your Twilio phone number is a **toll-free number** (like 800, 833, 844, 855, 866, 877, 888) that hasn't been verified yet. Twilio requires toll-free numbers to be verified before they can send SMS messages.

## Solution Options

### Option 1: Verify Your Toll-Free Number (Recommended if you want to keep it)

1. Go to Twilio Console: https://console.twilio.com
2. Navigate to **Phone Numbers** → **Manage** → **Active Numbers**
3. Click on your toll-free number
4. Look for a **"Toll-Free Verification"** section or notification
5. Follow the verification process:
   - You may need to provide business information
   - Twilio may require documentation
   - This process can take a few days

### Option 2: Use a Regular Phone Number (Faster for Testing)

If you're in trial mode or want to test quickly, you can:

1. **Use a Twilio trial number** (if you have one):
   - Trial numbers can send to verified numbers only
   - Go to Phone Numbers → Manage → Active Numbers
   - Look for numbers that aren't toll-free

2. **Purchase a regular phone number**:
   - Go to Phone Numbers → Buy a number
   - Select a regular mobile number (not toll-free)
   - Regular numbers don't require verification
   - Cost: ~$1/month + usage

3. **Update your `.env.local`**:
   ```env
   TWILIO_PHONE_NUMBER=+15551234567  # Your new regular number
   ```

## Quick Test with Trial Number

If you're in trial mode, you can:

1. **Verify your personal phone number** in Twilio:
   - Go to: https://console.twilio.com/us1/develop/phone-numbers/manage/verified
   - Add and verify your phone number

2. **Use your trial number** to send to verified numbers only

## Recommended Action

For development/testing:
- **Option 2 is faster** - get a regular phone number or use trial number with verified recipients

For production:
- **Option 1** - verify your toll-free number if you want to keep it (better for marketing)

## After Fixing

Once you have a working number:
1. Update `.env.local` with the new `TWILIO_PHONE_NUMBER`
2. Restart your dev server
3. Test again with the landing page signup

