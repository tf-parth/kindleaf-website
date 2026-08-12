"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Shield } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // The login page itself is accessible without auth
      if (pathname === '/admin/login') {
        setAuthorized(true);
        setLoading(false);
        return;
      }

      // Check Mock mode
      if (!isSupabaseConfigured) {
        const mockSession = localStorage.getItem('admin_session');
        if (mockSession) {
          setAuthorized(true);
        } else {
          const customerSession = localStorage.getItem('customer_session');
          if (customerSession) {
            router.push('/account');
          } else {
            router.push('/login');
          }
        }
        setLoading(false);
        return;
      }

      // Check Supabase Auth
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          // Check role in admins table
          const { data: adminRecord, error } = await supabase
            .from('admins')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (!error && adminRecord && adminRecord.role === 'admin') {
            setAuthorized(true);
          } else {
            // Customer logged in, redirect to customer portal
            router.push('/account');
          }
        } else {
          router.push('/login');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08100b] flex flex-col items-center justify-center text-slate-200">
        <div className="relative w-16 h-16 flex items-center justify-center mb-4">
          <div className="absolute inset-0 border-4 border-dashed border-gold/30 rounded-full animate-spin"></div>
          <Shield size={24} className="text-gold" />
        </div>
        <span className="text-xs uppercase tracking-widest font-bold text-slate-500">Checking credentials...</span>
      </div>
    );
  }

  // Render children only if authorized
  return authorized ? <>{children}</> : null;
}
