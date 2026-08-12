import { NextResponse } from 'next/server';
import { isSupabaseConfigured, supabase } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email')?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ isAdmin: false });
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('admins')
        .select('role')
        .eq('email', email)
        .maybeSingle();

      if (!error && data && data.role === 'admin') {
        return NextResponse.json({ isAdmin: true });
      }
    } else {
      // Mock mode fallback check
      if (email === 'admin@kindleaf.in') {
        return NextResponse.json({ isAdmin: true });
      }
    }

    return NextResponse.json({ isAdmin: false });
  } catch (error: any) {
    console.error('Error checking admin email:', error);
    return NextResponse.json({ isAdmin: false, error: error.message }, { status: 500 });
  }
}
