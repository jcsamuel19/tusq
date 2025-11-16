import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';

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

    // Check if admin client is available (requires service role key)
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Server configuration error. Please set SUPABASE_SERVICE_ROLE_KEY2' },
        { status: 500 }
      );
    }

    // Check if phone number already exists
    const { data: existingSignup, error: checkError } = await supabaseAdmin
      .from('signups')
      .select('phone_number')
      .eq('phone_number', phoneDigits)
      .maybeSingle();

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 is "not found" which is fine, other errors are not
      console.error('Error checking for duplicate phone:', checkError);
      return NextResponse.json(
        { error: 'Error checking for existing signup' },
        { status: 500 }
      );
    }

    if (existingSignup) {
      return NextResponse.json(
        { error: 'This phone number is already on the waitlist' },
        { status: 400 }
      );
    }

    // Insert into signups table (main TUSQ database)
    // Using admin client to bypass RLS for server-side operations
    const { data, error } = await supabaseAdmin
      .from('signups')
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
      
      // Provide more specific error messages
      if (error.code === '42P01') {
        // Table doesn't exist
        return NextResponse.json(
          { error: 'Database table not found. Please run the migration: 001_initial_schema.sql' },
          { status: 500 }
        );
      }
      
      if (error.code === '42501') {
        // Permission denied (RLS policy issue)
        return NextResponse.json(
          { error: 'Permission denied. Please check Row Level Security policies.' },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { error: error.message || 'Failed to save signup information' },
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

