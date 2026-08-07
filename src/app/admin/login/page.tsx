"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, ShieldAlert } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mockSession = localStorage.getItem('admin_session');
      if (mockSession) {
        router.push('/admin/dashboard');
        return;
      }
    }

    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          router.push('/admin/dashboard');
        }
      });
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      // 1. Production Mode (Supabase)
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw new Error(error.message);

        // Check if user has admin record
        const { data: adminRecord, error: adminErr } = await supabase
          .from('admins')
          .select('role')
          .eq('id', data.user?.id)
          .single();

        if (adminErr || !adminRecord || adminRecord.role !== 'admin') {
          await supabase.auth.signOut();
          throw new Error('Access denied: Unauthorized admin role');
        }

        router.push('/admin/dashboard');
      } else {
        // 2. Mock Mode Fallback
        // Accepts admin@kindleaf.in / admin123
        if (email === 'admin@kindleaf.in' && password === 'admin123') {
          localStorage.setItem('admin_session', JSON.stringify({
            email,
            role: 'admin',
            token: 'mock-jwt-token-xyz',
            loginTime: Date.now()
          }));
          router.push('/admin/dashboard');
        } else {
          throw new Error('Invalid credentials. (Hint: use admin@kindleaf.in & admin123)');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center bg-[#0c1912] overflow-hidden px-6">
      {/* Background circles */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-gold/5 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-emerald-900/10 blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand signature */}
        <div className="text-center mb-8">
          <img src="/assets/logo.png" alt="Kindleaf Logo" className="h-12 w-auto mx-auto rounded-lg mb-4 shadow-lg border border-white/5" />
          <h1 className="text-2xl font-serif text-[#F8F6F2]">Admin Portal</h1>
          <p className="text-xs text-slate-400 mt-1">Please sign in with your administrator credentials</p>
        </div>

        {/* Form panel */}
        <div className="glass-panel-heavy border border-white/10 rounded-2xl p-8 shadow-2xl relative">
          {!isSupabaseConfigured && (
            <div className="bg-gold/10 border border-gold/20 text-gold text-[10px] rounded-lg p-3 mb-6 flex items-start gap-2.5">
              <ShieldAlert size={14} className="shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">DEMO MODE ACTIVE</span>
                <p className="opacity-95 text-[9px] mt-0.5">Supabase credentials not configured. Use: <strong className="underline">admin@kindleaf.in</strong> / <strong className="underline">admin123</strong> to login.</p>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="bg-red-500/15 border border-red-500/30 text-red-300 text-xs rounded-lg p-3 mb-6 flex items-center gap-2.5">
              <ShieldAlert size={16} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Mail size={14} />
                </span>
                <input 
                  type="email" 
                  required
                  placeholder="name@kindleaf.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-gold/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Password</label>
                <button 
                  type="button" 
                  onClick={() => setForgotOpen(true)}
                  className="text-[9px] text-gold hover:underline font-semibold uppercase tracking-wider"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Lock size={14} />
                </span>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-10 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-gold/50"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2.5 text-xs text-slate-300 font-semibold cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="accent-gold h-4 w-4 rounded border-white/10 bg-black/20" 
                />
                <span>Remember me</span>
              </label>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gold hover:bg-gold-hover disabled:bg-gold/50 text-[#0c1912] font-semibold text-xs py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md uppercase tracking-wider font-bold mt-4"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setForgotOpen(false)} />
          <div className="relative w-full max-w-sm bg-[#0e2217] border border-white/10 rounded-2xl p-6 shadow-2xl z-10 text-center space-y-4">
            <h3 className="text-lg font-serif text-[#F8F6F2]">Reset Password</h3>
            <p className="text-xs text-slate-300">
              For security, please contact your systems administrator or the main site manager to reset your credentials.
            </p>
            <div className="pt-2">
              <button 
                onClick={() => setForgotOpen(false)}
                className="bg-gold text-[#0c1912] font-semibold px-6 py-2 rounded-full text-xs hover:bg-gold-hover transition-colors"
              >
                Close Dialog
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
