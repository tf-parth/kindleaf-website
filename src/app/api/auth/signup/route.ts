import { NextResponse } from 'next/server';
import { registerCustomer, isSupabaseConfigured, supabase } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { name, email, phone, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields (name, email, password)' }, { status: 400 });
    }

    if (isSupabaseConfigured && supabase) {
      // 1. Create authentication user in Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone
          }
        }
      });

      if (authError) {
        return NextResponse.json({ error: authError.message }, { status: 400 });
      }

      // 2. Create customer profile record in public.customers
      try {
        const profile = await registerCustomer({ name, email, phone });
        return NextResponse.json({
          success: true,
          user: authData.user,
          profile,
          session: authData.session
        });
      } catch (err: any) {
        console.error('Failed to create customer profile after auth signup:', err);
        // We still return success since auth succeeded, but note the profile issue
        return NextResponse.json({
          success: true,
          user: authData.user,
          error: 'Auth succeeded but profile creation failed: ' + err.message
        });
      }
    } else {
      // 2. Mock mode registration
      const customer = await registerCustomer({ name, email, phone, password });
      return NextResponse.json({
        success: true,
        user: { email, id: customer.id },
        profile: customer
      });
    }
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
