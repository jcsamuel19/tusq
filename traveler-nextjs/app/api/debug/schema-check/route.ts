import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';

/**
 * Debug endpoint to check if migration columns exist
 * Access at: /api/debug/schema-check
 */
export async function GET(request: NextRequest) {
  try {
    const columnsToCheck = ['first_name', 'last_name', 'email', 'auth_user_id'];
    const results: Record<string, { exists: boolean; error?: string }> = {};

    for (const column of columnsToCheck) {
      try {
        const { error } = await supabaseAdmin
          .from('users')
          .select(column)
          .limit(0);

        if (error) {
          results[column] = {
            exists: false,
            error: error.message,
          };
        } else {
          results[column] = {
            exists: true,
          };
        }
      } catch (error: any) {
        results[column] = {
          exists: false,
          error: error.message || 'Unknown error',
        };
      }
    }

    const allExist = Object.values(results).every((r) => r.exists);
    const missingColumns = Object.entries(results)
      .filter(([_, r]) => !r.exists)
      .map(([col, _]) => col);

    return NextResponse.json({
      status: allExist ? 'ok' : 'migration_needed',
      columns: results,
      missingColumns,
      message: allExist
        ? 'All migration columns exist!'
        : `Missing columns: ${missingColumns.join(', ')}. Please run migration: 002_add_user_profile_fields.sql`,
      migrationSQL: `
-- Run this SQL in Supabase SQL Editor:
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS auth_user_id UUID UNIQUE;

CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON users(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email) WHERE email IS NOT NULL;
      `.trim(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        error: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}

