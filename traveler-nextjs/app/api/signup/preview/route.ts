import { NextRequest, NextResponse } from 'next/server';
import { previewSupabase } from '@/lib/supabase/preview-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, phoneNumber } = body;

    // Validate required fields
    if (!firstName || !lastName || !phoneNumber) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate phone number format (should be 10 digits)
    const phoneDigits = phoneNumber.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Extract metadata from request
    const ipAddress = 
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown';
    
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const source = 'landing_page'; // Can be updated if needed

    // Insert into preview_signups table
    const { data, error } = await previewSupabase
      .from('preview_signups')
      .insert({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone_number: phoneDigits,
        ip_address: ipAddress,
        user_agent: userAgent,
        source: source,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting signup:', error);
      return NextResponse.json(
        { error: 'Failed to save signup information' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, data },
      { status: 201 }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

