"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, LogOut, Shield, Compass, User, Mail, Phone, Calendar, IndianRupee, ArrowLeft, Loader } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export default function CustomerAccount() {
  const router = useRouter();
  const [customer, setCustomer] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initPage = async () => {
      let activeCustomer = null;

      if (typeof window !== 'undefined') {
        const mockSession = localStorage.getItem('customer_session');
        const adminSession = localStorage.getItem('admin_session');

        if (adminSession) {
          setIsAdmin(true);
        }

        if (mockSession) {
          activeCustomer = JSON.parse(mockSession);
          setCustomer(activeCustomer);
        }
      }

      // Supabase verification fallback
      if (isSupabaseConfigured && supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          // Check admin
          const { data: adminRecord } = await supabase
            .from('admins')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (adminRecord && adminRecord.role === 'admin') {
            setIsAdmin(true);
          }

          // Get profile
          const { data: profile } = await supabase
            .from('customers')
            .select('*')
            .eq('email', session.user.email)
            .single();

          if (profile) {
            activeCustomer = profile;
            setCustomer(activeCustomer);
            if (typeof window !== 'undefined') {
              localStorage.setItem('customer_session', JSON.stringify(profile));
            }
          } else {
            // Fallback profile if row missing
            activeCustomer = { name: session.user.email?.split('@')[0], email: session.user.email, phone: '' };
            setCustomer(activeCustomer);
          }
        }
      }

      if (!activeCustomer && !isAdmin) {
        router.push('/login');
        return;
      }

      // Fetch orders and filter for the customer
      try {
        const res = await fetch('/api/orders');
        if (res.ok) {
          const allOrders = await res.json();
          if (activeCustomer) {
            // Filter orders matching either email or phone
            const filtered = allOrders.filter((o: any) => 
              (o.customer_email && o.customer_email.toLowerCase() === activeCustomer.email?.toLowerCase()) ||
              (o.customer_phone && o.customer_phone === activeCustomer.phone)
            );
            setOrders(filtered);
          } else {
            setOrders([]);
          }
        }
      } catch (err) {
        console.error('Failed to load customer orders:', err);
      } finally {
        setLoading(false);
      }
    };

    initPage();
  }, [router]);

  const handleLogout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('customer_session');
    localStorage.removeItem('admin_session');
    router.push('/');
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'shipped':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'processing':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'cancelled':
        return 'bg-red-500/10 text-red-400 border border-red-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c1912] flex flex-col items-center justify-center text-slate-200">
        <div className="flex items-center gap-3 text-gold">
          <Loader className="animate-spin" size={24} />
          <span className="font-serif tracking-wide text-sm font-semibold">Kindleaf Portal Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0c1912] py-12 px-6 relative overflow-hidden">
      {/* Background circles */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-gold/5 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-emerald-900/10 blur-3xl pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10 space-y-8">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/5">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/')}
              className="w-10 h-10 rounded-full bg-[#163322]/20 border border-white/10 flex items-center justify-center text-slate-400 hover:text-gold transition-colors"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <h1 className="text-2xl font-serif text-[#F8F6F2]">My Account</h1>
              <p className="text-xs text-slate-400">Manage orders and profile preferences</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <button 
                onClick={() => router.push('/admin/dashboard')}
                className="bg-gold hover:bg-gold-hover text-[#0c1912] font-semibold text-xs px-5 py-2.5 rounded-full flex items-center gap-2 shadow-md transition-colors"
              >
                <Shield size={14} />
                <span>Admin Console</span>
              </button>
            )}
            <button 
              onClick={handleLogout}
              className="bg-white/5 border border-white/10 hover:border-red-500/30 hover:text-red-300 font-semibold text-xs px-5 py-2.5 rounded-full flex items-center gap-2 transition-colors"
            >
              <LogOut size={14} />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Customer Profile Column */}
          <div className="space-y-6 lg:col-span-1">
            <div className="glass-panel-heavy border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
              <h3 className="font-serif text-[#F8F6F2] font-bold text-base pb-3 border-b border-white/5">Account Profile</h3>
              
              {customer && (
                <div className="space-y-5">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-full bg-gold/10 border border-gold/25 flex items-center justify-center text-gold font-bold text-lg font-serif shrink-0">
                      {customer.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase tracking-wider text-slate-500 font-bold">Full Name</span>
                      <span className="text-slate-200 text-sm font-semibold">{customer.name}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-full bg-[#163322]/40 border border-white/5 flex items-center justify-center text-slate-400 shrink-0">
                      <Mail size={14} />
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase tracking-wider text-slate-500 font-bold">Email Address</span>
                      <span className="text-slate-300 text-xs font-medium">{customer.email}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-full bg-[#163322]/40 border border-white/5 flex items-center justify-center text-slate-400 shrink-0">
                      <Phone size={14} />
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase tracking-wider text-slate-500 font-bold">Phone Number</span>
                      <span className="text-slate-300 text-xs font-medium">{customer.phone || 'Not added'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-[#163322]/10 border border-gold/10 rounded-2xl p-6 text-center space-y-4">
              <span className="text-3xl block">🍵</span>
              <h4 className="font-serif text-gold font-bold text-sm">Need Help with an Order?</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Contact our customer support desk regarding shipping, returns, or order cancellations.
              </p>
              <a 
                href="mailto:support@kindleaf.in"
                className="inline-block bg-[#163322]/50 hover:bg-[#163322] border border-white/10 text-[#F8F6F2] font-semibold text-[11px] px-5 py-2 rounded-full transition-all"
              >
                Email Support
              </a>
            </div>
          </div>

          {/* Orders History Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel border border-white/10 rounded-2xl p-6 lg:p-8 shadow-xl">
              <h3 className="font-serif text-[#F8F6F2] font-bold text-base pb-3 border-b border-white/5 mb-6 flex items-center justify-between">
                <span>Order History</span>
                <span className="bg-gold/10 text-gold text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                  {orders.length} order{orders.length !== 1 ? 's' : ''}
                </span>
              </h3>

              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order: any) => (
                    <div 
                      key={order.id}
                      className="border border-white/5 hover:border-white/10 bg-[#163322]/10 rounded-xl p-5 flex flex-col sm:flex-row justify-between gap-4 transition-all"
                    >
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-xs font-bold text-[#F8F6F2] font-mono">#{order.id.substr(0, 8)}</span>
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <h4 className="text-sm font-serif font-bold text-slate-200 mt-1">{order.product_title}</h4>
                        <div className="flex items-center gap-5 text-[11px] text-slate-400 font-semibold">
                          <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(order.created_at).toLocaleDateString()}</span>
                          <span>Qty: {order.quantity}</span>
                        </div>
                      </div>

                      <div className="flex flex-row sm:flex-col justify-between sm:justify-center items-center sm:items-end gap-2 border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0 shrink-0">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Total Paid</span>
                        <span className="text-base font-bold text-gold font-serif flex items-center"><IndianRupee size={14} />{order.total_price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#163322]/20 border border-white/5 flex items-center justify-center text-slate-500 mx-auto">
                    <ShoppingBag size={24} />
                  </div>
                  <div>
                    <h4 className="font-serif text-[#F8F6F2] font-semibold text-sm">No orders yet</h4>
                    <p className="text-xs text-slate-500 mt-1">You haven't placed any orders with Kindleaf yet.</p>
                  </div>
                  <button 
                    onClick={() => router.push('/#shop')}
                    className="bg-gold hover:bg-gold-hover text-[#0c1912] font-bold text-xs px-6 py-2.5 rounded-full transition-colors flex items-center gap-1.5 mx-auto"
                  >
                    <Compass size={14} />
                    <span>Explore Blends</span>
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
