import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';
import { getUserById, updateUserEmail } from '@/lib/db/users';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, email } = body;

    // Validate required fields
    if (!userId || !email) {
      return NextResponse.json(
        { error: 'User ID and email are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Verify user exists
    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if email is already in use by another user
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email.trim().toLowerCase())
      .neq('id', userId)
      .maybeSingle();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking for duplicate email:', checkError);
      return NextResponse.json(
        { error: 'Error checking for existing email' },
        { status: 500 }
      );
    }

    if (existingUser) {
      return NextResponse.json(
        { error: 'This email is already in use' },
        { status: 400 }
      );
    }

    // Update user email
    const updatedUser = await updateUserEmail(userId, email);

    if (!updatedUser) {
      // Check if it's a unique constraint violation
      const { data: checkData } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', email.trim().toLowerCase())
        .neq('id', userId)
        .maybeSingle();

      if (checkData) {
        return NextResponse.json(
          { error: 'This email is already in use' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to update email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

