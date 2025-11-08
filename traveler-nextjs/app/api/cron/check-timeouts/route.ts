import { NextRequest, NextResponse } from 'next/server';
import { checkAndHandleIncompleteSurveys } from '@/lib/conversation/timeout';

// Simple API key check (you should use a more secure method in production)
function isValidApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-api-key');
  return apiKey === process.env.INTERNAL_API_KEY;
}

export async function POST(request: NextRequest) {
  // Check API key for security
  if (!isValidApiKey(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const result = await checkAndHandleIncompleteSurveys();
    
    return NextResponse.json({
      success: true,
      processed: result.processed,
      errors: result.errors,
    });
  } catch (error) {
    console.error('Error checking timeouts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

