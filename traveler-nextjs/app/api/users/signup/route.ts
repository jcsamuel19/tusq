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

    // Check if user already exists by phone
    const existingUser = await getUserByPhone(e164Phone);
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this phone number already exists' },
        { status: 400 }
      );
    }

    // Create Supabase Auth user (using phone as email for now, or generate email)
    // Note: Supabase Auth requires an email, so we'll use a generated email
    const email = `${e164Phone.replace(/\+/g, '')}@tusq.local`;
    
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
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
      return NextResponse.json(
        { error: authError?.message || 'Failed to create account' },
        { status: 500 }
      );
    }

    // Create user profile in our database
    console.log('Creating user profile with data:', {
      phone: e164Phone,
      firstName,
      lastName,
      email,
      authUserId: authData.user.id,
    });
    
    const user = await createUser(e164Phone, {
      firstName,
      lastName,
      email,
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

