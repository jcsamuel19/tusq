import { NextRequest, NextResponse } from 'next/server';
import { getUserByPhone, getUserByAuthId, createUser } from '@/lib/db/users';
import { createConversation } from '@/lib/db/conversations';
import { toE164US } from '@/lib/utils/phoneValidation';
import { supabaseAdmin } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, phone, password } = body;

    // Validate required fields
    if (!firstName || !lastName || !phone || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Convert to E.164 format
    const e164Phone = toE164US(phone);
    if (!e164Phone) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Check if user already exists by phone in our database
    const existingUser = await getUserByPhone(e164Phone);
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this phone number already exists' },
        { status: 400 }
      );
    }

    // Create Supabase Auth user
    // Note: Supabase Auth requires an email, so we generate one internally for auth only
    // We don't store email in our users table
    const authEmail = `${e164Phone.replace(/\+/g, '')}@tusq.local`;
    
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: authEmail,
      password,
      phone: e164Phone,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        phone_number: e164Phone,
      },
    });

    if (authError || !authData.user) {
      console.error('Error creating auth user:', authError);
      
      // Handle email_exists error (422) - means account already exists in Auth
      if (authError?.status === 422 || authError?.code === 'email_exists' || authError?.message?.includes('email_exists')) {
        // Double-check our database to be sure
        const doubleCheckUser = await getUserByPhone(e164Phone);
        
        if (doubleCheckUser) {
          // User exists in our database - return appropriate error
          return NextResponse.json(
            { error: 'An account with this phone number already exists' },
            { status: 400 }
          );
        }
        
        // Auth user exists but not in our database - orphaned auth user
        // Return user-friendly error message
        return NextResponse.json(
          { error: 'An account with this phone number already exists. Please try logging in instead.' },
          { status: 400 }
        );
      }

      // Generic error response for other auth errors
      const errorMessage = authError?.message || 'Failed to create account';
      return NextResponse.json(
        { error: errorMessage },
        { status: authError?.status || 500 }
      );
    }

    // Create user profile in our database (no email stored)
    console.log('Creating user profile with data:', {
      phone: e164Phone,
      firstName,
      lastName,
      authUserId: authData.user.id,
    });
    
    const user = await createUser(e164Phone, {
      firstName,
      lastName,
      authUserId: authData.user.id,
    });

    if (!user) {
      console.error('Failed to create user profile - cleaning up auth user');
      // Clean up auth user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: 'Failed to create user profile. The auth_user_id column may not exist in the database. Please run the migration: 002_add_user_profile_fields.sql' },
        { status: 500 }
      );
    }

    // Create conversation
    const conversation = await createConversation(user.id, 'welcome');
    if (!conversation) {
      return NextResponse.json(
        { error: 'Failed to create conversation' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      userId: user.id,
      conversationId: conversation.id,
      firstName: user.first_name || firstName,
      phoneNumber: e164Phone,
    });
  } catch (error) {
    console.error('Error in signup:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

