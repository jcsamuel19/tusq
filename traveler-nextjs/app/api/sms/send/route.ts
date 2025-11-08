import { NextRequest, NextResponse } from 'next/server';
import { sendSMS } from '@/lib/twilio/messages';

// Simple API key check (you should use a more secure method in production)
function isValidApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-api-key');
  return apiKey === process.env.INTERNAL_API_KEY;
}

export async function POST(request: NextRequest) {
  // Check API key
  if (!isValidApiKey(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { to, message } = body;

    if (!to || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: to and message' },
        { status: 400 }
      );
    }

    const result = await sendSMS({ to, body: message });

    if (result.success) {
      return NextResponse.json({
        success: true,
        messageSid: result.messageSid,
      });
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to send SMS' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error sending SMS:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

