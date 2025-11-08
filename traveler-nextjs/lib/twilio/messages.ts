import { twilioClient, TWILIO_PHONE_NUMBER } from './client';

export interface SendSMSOptions {
  to: string;
  body: string;
}

export async function sendSMS({ to, body }: SendSMSOptions) {
  try {
    const message = await twilioClient.messages.create({
      body,
      from: TWILIO_PHONE_NUMBER!,
      to,
    });

    return {
      success: true,
      messageSid: message.sid,
    };
  } catch (error) {
    console.error('Error sending SMS:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

