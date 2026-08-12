import { NextResponse } from 'next/server';
import { authenticateCustomer, isSupabaseConfigured, supabase } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    if (isSupabaseConfigured && supabase) {
      // 1. Authenticate with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        return NextResponse.json({ error: authError.message }, { status: 400 });
      }

      // 2. Check if user is in admins table
      const { data: adminRecord, error: adminErr } = await supabase
        .from('admins')
        .select('role')
        .eq('id', authData.user.id)
        .single();

      if (!adminErr && adminRecord && adminRecord.role === 'admin') {
        return NextResponse.json({
          success: true,
          role: 'admin',
          user: authData.user,
          session: authData.session
        });
      }

      // 3. Otherwise, treat as customer
      try {
        const profile = await authenticateCustomer(email, password);
        return NextResponse.json({
          success: true,
          role: 'customer',
          user: authData.user,
          profile,
          session: authData.session
        });
      } catch (err: any) {
        console.error('Customer profile fetch failed:', err);
        return NextResponse.json({
          success: true,
          role: 'customer',
          user: authData.user,
          profile: { name: email.split('@')[0], email, phone: '' },
          session: authData.session
        });
      }
    } else {
      // 2. Mock mode login
      if (email === 'admin@kindleaf.in' && password === 'admin123') {
        return NextResponse.json({
          success: true,
          role: 'admin',
          user: { email, id: 'admin-mock-id' },
          session: {
            access_token: 'mock-jwt-token-xyz',
            user: { email, id: 'admin-mock-id' }
          }
        });
      }

      // Customer mock login
      try {
        const customer = await authenticateCustomer(email, password);
        return NextResponse.json({
          success: true,
          role: 'customer',
          user: { email, id: customer.id },
          profile: customer
        });
      } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Invalid email or password' }, { status: 401 });
      }
    }
  } catch (error: any) {
    console.error('Login API error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
