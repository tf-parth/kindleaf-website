"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, User, Phone, ShieldAlert, ArrowLeft, Leaf, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export default function UnifiedLogin() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Admin status states
  const [isAdminEmail, setIsAdminEmail] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(false);

  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Debounced check for admin email status
  useEffect(() => {
    const trimmedEmail = email.trim().toLowerCase();
    
    // Only check if it looks like a valid email pattern
    if (!trimmedEmail || !trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setIsAdminEmail(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setCheckingAdmin(true);
      try {
        const res = await fetch(`/api/auth/check-admin?email=${encodeURIComponent(trimmedEmail)}`);
        if (res.ok) {
          const data = await res.json();
          setIsAdminEmail(data.isAdmin);
          if (data.isAdmin) {
            setIsLogin(true); // Force switch to Sign In mode for admins
          }
        }
      } catch (err) {
        console.error('Admin verification error:', err);
      } finally {
        setCheckingAdmin(false);
      }
    }, 450);

    return () => clearTimeout(delayDebounceFn);
  }, [email]);

  // If already logged in, redirect accordingly
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const adminSession = localStorage.getItem('admin_session');
      if (adminSession) {
        router.push('/admin/dashboard');
        return;
      }

      const customerSession = localStorage.getItem('customer_session');
      if (customerSession) {
        router.push('/account');
        return;
      }
    }

    const client = supabase;
    if (isSupabaseConfigured && client) {
      client.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          // Verify if admin or customer
          client
            .from('admins')
            .select('role')
            .eq('id', session.user.id)
            .single()
            .then(({ data: adminRecord }) => {
              if (adminRecord && adminRecord.role === 'admin') {
                router.push('/admin/dashboard');
              } else {
                router.push('/account');
              }
            });
        }
      });
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isLogin) {
        // =========================================================
        // LOGIN FLOW (Unified Customer & Admin)
        // =========================================================
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Authentication failed');
        }

        if (data.role === 'admin') {
          // Admin Session Setup
          localStorage.setItem('admin_session', JSON.stringify({
            email: data.user.email,
            role: 'admin',
            token: data.session?.access_token || 'mock-jwt-token-xyz',
            loginTime: Date.now()
          }));
          
          const client = supabase;
          if (isSupabaseConfigured && client) {
            // Also sync supabase auth state if configured
            await client.auth.signInWithPassword({ email, password });
          }

          setSuccessMsg('Logged in as administrator. Redirecting to dashboard...');
          setTimeout(() => {
            router.push('/admin/dashboard');
          }, 1500);
        } else {
          // Customer Session Setup
          localStorage.setItem('customer_session', JSON.stringify(data.profile));
          
          const client = supabase;
          if (isSupabaseConfigured && client) {
            await client.auth.signInWithPassword({ email, password });
          }

          setSuccessMsg('Logged in successfully. Redirecting to your account...');
          setTimeout(() => {
            router.push('/account');
          }, 1500);
        }
      } else {
        // =========================================================
        // SIGNUP FLOW (Customer Only)
        // =========================================================
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }

        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, phone, password })
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to create account');
        }

        // Set customer session after successful signup
        localStorage.setItem('customer_session', JSON.stringify(data.profile));

        const client = supabase;
        if (isSupabaseConfigured && client) {
          await client.auth.signInWithPassword({ email, password });
        }

        setSuccessMsg('Account created successfully! Redirecting...');
        setTimeout(() => {
          router.push('/account');
        }, 1500);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during submission');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center bg-[#0c1912] overflow-hidden px-6 py-12">
      {/* Background radial effects */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-gold/5 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-emerald-900/10 blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Back Link */}
        <button 
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-gold transition-colors mb-6 group cursor-pointer"
        >
          <ArrowLeft size={14} className="transform group-hover:-translate-x-1 transition-transform" />
          <span>Back to Storefront</span>
        </button>

        {/* Brand signature */}
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-full bg-[#163322]/50 border border-gold/25 items-center justify-center mb-4">
            <Leaf className="text-gold" size={20} />
          </div>
          <h1 className="text-2xl font-serif text-[#F8F6F2]">Kindleaf Wellness</h1>
          <p className="text-xs text-slate-400 mt-1">Sip slow, connect with your body and mind</p>
        </div>

        {/* Tabs toggle or Admin Header */}
        <AnimatePresence mode="wait">
          {isAdminEmail ? (
            <motion.div
              key="admin-badge"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center justify-center pb-4 mb-4 border-b border-gold/20"
            >
              <div className="flex items-center gap-2 bg-gold/10 border border-gold/30 text-gold text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-inner animate-pulse">
                <ShieldAlert size={14} className="text-gold animate-bounce" />
                <span>Kindleaf Admin Portal</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 text-center">
                Please verify your administrative credentials to continue.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="customer-tabs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex border-b border-white/10 mb-6 text-xs font-bold uppercase tracking-wider relative"
            >
              <button 
                type="button"
                onClick={() => { setIsLogin(true); setErrorMsg(''); setSuccessMsg(''); }}
                className={`flex-1 pb-3 text-center relative z-10 transition-colors ${isLogin ? 'text-gold font-bold' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Sign In
              </button>
              <button 
                type="button"
                onClick={() => { setIsLogin(false); setErrorMsg(''); setSuccessMsg(''); }}
                className={`flex-1 pb-3 text-center relative z-10 transition-colors ${!isLogin ? 'text-gold font-bold' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Create Account
              </button>
              <motion.div 
                className="absolute bottom-0 left-0 h-[2px] bg-gold"
                animate={{ x: isLogin ? '0%' : '100%', width: '50%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            borderColor: isAdminEmail ? 'rgba(212, 175, 55, 0.35)' : 'rgba(255, 255, 255, 0.1)',
            boxShadow: isAdminEmail 
              ? '0 0 40px rgba(212, 175, 55, 0.12), inset 0 0 25px rgba(212, 175, 55, 0.05)' 
              : '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="glass-panel-heavy border rounded-2xl p-8 relative"
        >
          
          {/* Notification Alert banners */}
          {errorMsg && (
            <div className="bg-red-500/15 border border-red-500/30 text-red-300 text-xs rounded-lg p-3.5 mb-6 flex items-start gap-2.5">
              <ShieldAlert size={16} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs rounded-lg p-3.5 mb-6 flex items-start gap-2.5">
              <Leaf size={16} className="shrink-0 mt-0.5 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {isLogin ? (
                <motion.div
                  key="login-fields"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  {/* 2. Email Field */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email Address</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                        <Mail size={14} />
                      </span>
                      <input 
                        type="email" 
                        required
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-10 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-gold/50"
                      />
                      {checkingAdmin && (
                        <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gold">
                          <Loader className="animate-spin" size={14} />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 4. Password Field */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Password</label>
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
                </motion.div>
              ) : (
                <motion.div
                  key="signup-fields"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  {/* 1. Name Field (Signup only) */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Full Name</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                        <User size={14} />
                      </span>
                      <input 
                        type="text" 
                        required
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-gold/50"
                      />
                    </div>
                  </div>

                  {/* 2. Email Field */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email Address</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                        <Mail size={14} />
                      </span>
                      <input 
                        type="email" 
                        required
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-10 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-gold/50"
                      />
                      {checkingAdmin && (
                        <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gold">
                          <Loader className="animate-spin" size={14} />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 3. Phone Field (Signup only) */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Phone Number (Optional)</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                        <Phone size={14} />
                      </span>
                      <input 
                        type="tel" 
                        placeholder="+91 98765-43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-gold/50"
                      />
                    </div>
                  </div>

                  {/* 4. Password Field */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Password</label>
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

                  {/* 5. Confirm Password (Signup only) */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Confirm Password</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                        <Lock size={14} />
                      </span>
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        required
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-gold/50"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gold hover:bg-gold-hover disabled:bg-gold/50 text-[#0c1912] font-semibold text-xs py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 shadow-md uppercase tracking-wider font-bold mt-6 cursor-pointer"
            >
              {loading ? 'Processing...' : isAdminEmail ? 'Launch Admin Console' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Additional note for testing */}
          {isLogin && !isSupabaseConfigured && (
            <div className="mt-6 pt-4 border-t border-white/5 text-[9px] text-slate-500 leading-normal text-center">
              <span>Admin Demo: <strong>admin@kindleaf.in</strong> / <strong>admin123</strong></span>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
