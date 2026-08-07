"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, ShoppingBasket, FileText, Users, MessageSquare, 
  Home, Image, Settings, LogOut, Search, Bell, User, Plus, 
  Edit, Trash2, Check, X, ShieldAlert, Upload, Globe, Link, ArrowDown, Eye
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export default function AdminDashboard() {
  const router = useRouter();
  
  // Auth state
  const [adminUser, setAdminUser] = useState<any>(null);
  
  // Active module tab
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Data lists
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [media, setMedia] = useState<any[]>([]);
  const [homepageContent, setHomepageContent] = useState<any>({
    hero: { tag: "", heading: "", description: "", primary_btn_text: "", secondary_btn_text: "" },
    why_kindleaf: { tag: "", heading: "", description: "" },
    brewing_guide: { tag: "", heading: "", description: "" }
  });
  const [globalSettings, setGlobalSettings] = useState<any>({
    website_name: "", contact_email: "", contact_phone: "", address: "", 
    instagram_url: "", facebook_url: "", whatsapp_phone: "", amazon_store_url: "",
    seo_title: "", seo_description: ""
  });

  // UI state variables
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<any[]>([
    { id: 1, text: "New Order #ord-2 pending review", time: "2 hours ago", read: false },
    { id: 2, text: "New review submitted by Vikram", time: "1 day ago", read: true }
  ]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // CRUD Overlay Modals
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productForm, setProductForm] = useState<any>({
    title: "", slug: "", description: "", short_description: "", price: 0, sale_price: 0,
    stock: 100, sku: "", weight: "100g", category: "Herbal Green Tea", 
    benefits: ["", "", ""], ingredients: ["", "", "", ""], 
    brewing_instructions: ["", "", "", ""], amazon_url: "", img: "", status: "published",
    featured: false, seo_title: "", seo_description: ""
  });

  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<any>(null);
  
  // Media Drag-Drop simulated upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  // 1. Verify Auth status
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mockSession = localStorage.getItem('admin_session');
      if (mockSession) {
        setAdminUser(JSON.parse(mockSession));
      } else if (!isSupabaseConfigured) {
        router.push('/admin/login');
      }
    }

    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) {
          router.push('/admin/login');
        } else {
          setAdminUser(session.user);
        }
      });
    }
  }, [router]);

  // 2. Fetch all lists
  const refreshData = () => {
    fetch('/api/products').then(res => res.json()).then(data => setProducts(data));
    fetch('/api/orders').then(res => res.json()).then(data => setOrders(data));
    fetch('/api/customers').then(res => res.json()).then(data => setCustomers(data));
    fetch('/api/reviews').then(res => res.json()).then(data => setReviews(data));
    fetch('/api/media').then(res => res.json()).then(data => setMedia(data));
    
    fetch('/api/homepage').then(res => res.json()).then(data => {
      if (data && Object.keys(data).length > 0) setHomepageContent(data);
    });
    
    fetch('/api/settings').then(res => res.json()).then(data => {
      if (data && Object.keys(data).length > 0) setGlobalSettings(data);
    });
  };

  useEffect(() => {
    if (adminUser) {
      refreshData();
    }
  }, [adminUser]);

  // Log Out
  const handleLogout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('admin_session');
    router.push('/admin/login');
  };

  // =========================================================
  // PRODUCTS CRUD HANDLERS
  // =========================================================
  const openProductForm = (product: any = null) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        ...product,
        benefits: Array.isArray(product.benefits) ? [...product.benefits] : ["", "", ""],
        ingredients: Array.isArray(product.ingredients) ? [...product.ingredients] : ["", "", "", ""],
        brewing_instructions: Array.isArray(product.brewing_instructions) ? [...product.brewing_instructions] : ["", "", "", ""]
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        title: "", slug: "", description: "", short_description: "", price: 249, sale_price: 350,
        stock: 100, sku: "", weight: "100g", category: "Herbal Green Tea", 
        benefits: ["", "", ""], ingredients: ["", "", "", ""], 
        brewing_instructions: ["", "", "", ""], amazon_url: "", img: "", status: "published",
        featured: false, seo_title: "", seo_description: ""
      });
    }
    setProductModalOpen(true);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      ...productForm,
      id: editingProduct ? editingProduct.id : undefined
    };

    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(() => {
        setProductModalOpen(false);
        refreshData();
      });
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      fetch(`/api/products?id=${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(() => refreshData());
    }
  };

  const toggleProductStatus = (product: any) => {
    const nextStatus = product.status === 'published' ? 'hidden' : 'published';
    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...product, status: nextStatus })
    }).then(() => refreshData());
  };

  // =========================================================
  // ORDERS HANDLERS
  // =========================================================
  const updateStatus = (orderId: string, nextStatus: string) => {
    fetch('/api/orders/status', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: orderId, status: nextStatus })
    }).then(() => refreshData());
  };

  // =========================================================
  // REVIEWS HANDLERS
  // =========================================================
  const toggleReviewFlag = (reviewId: string, field: 'approved' | 'featured', val: boolean) => {
    fetch('/api/reviews', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: reviewId, field, value: val })
    }).then(() => refreshData());
  };

  const handleDeleteReview = (id: string) => {
    if (confirm('Delete this review?')) {
      fetch(`/api/reviews?id=${id}`, { method: 'DELETE' })
        .then(() => refreshData());
    }
  };

  // =========================================================
  // HOMEPAGE & SETTINGS HANDLERS
  // =========================================================
  const saveHomepageConfig = (sectionKey: string, content: any) => {
    fetch('/api/homepage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: sectionKey, content })
    })
      .then(res => res.json())
      .then(() => {
        alert('Homepage updated successfully!');
        refreshData();
      });
  };

  const saveSettingsConfig = (key: string, value: any) => {
    fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value })
    })
      .then(res => res.json())
      .then(() => {
        alert('Settings updated successfully!');
        refreshData();
      });
  };

  // =========================================================
  // MEDIA LIBRARY HANDLERS
  // =========================================================
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    fetch('/api/media/upload', {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(() => {
        refreshData();
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const handleDeleteMedia = (id: string) => {
    if (confirm('Delete this media asset?')) {
      fetch(`/api/media?id=${id}`, { method: 'DELETE' })
        .then(() => refreshData());
    }
  };

  // Filter calculations
  const totalRev = orders.filter(o => o.status === 'delivered').reduce((acc, o) => acc + o.total_price, 0);

  if (!adminUser) return null;

  return (
    <div className="flex min-h-screen bg-[#08100b] text-slate-200">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-[#0a150f] border-r border-white/5 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo signature */}
          <div className="p-6 border-b border-white/5 flex items-center gap-3">
            <img src="/assets/logo.png" alt="Logo" className="h-9 w-auto rounded" />
            <div>
              <span className="font-serif font-bold text-sm block tracking-wide text-gold">KINDLEAF</span>
              <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block -mt-1">Admin Panel</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 text-xs font-semibold">
            <button 
              onClick={() => { setActiveTab('dashboard'); setSearchQuery(''); }}
              className={`w-full flex items-center gap-3.5 px-4.5 py-3 rounded-lg transition-colors text-left ${activeTab === 'dashboard' ? 'bg-[#163322] text-gold border border-gold/10' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
            >
              <LayoutDashboard size={16} />
              <span>Dashboard</span>
            </button>
            <button 
              onClick={() => { setActiveTab('products'); setSearchQuery(''); }}
              className={`w-full flex items-center gap-3.5 px-4.5 py-3 rounded-lg transition-colors text-left ${activeTab === 'products' ? 'bg-[#163322] text-gold border border-gold/10' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
            >
              <ShoppingBasket size={16} />
              <span>Products</span>
            </button>
            <button 
              onClick={() => { setActiveTab('orders'); setSearchQuery(''); }}
              className={`w-full flex items-center gap-3.5 px-4.5 py-3 rounded-lg transition-colors text-left ${activeTab === 'orders' ? 'bg-[#163322] text-gold border border-gold/10' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
            >
              <FileText size={16} />
              <span>Orders</span>
            </button>
            <button 
              onClick={() => { setActiveTab('customers'); setSearchQuery(''); }}
              className={`w-full flex items-center gap-3.5 px-4.5 py-3 rounded-lg transition-colors text-left ${activeTab === 'customers' ? 'bg-[#163322] text-gold border border-gold/10' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
            >
              <Users size={16} />
              <span>Customers</span>
            </button>
            <button 
              onClick={() => { setActiveTab('reviews'); setSearchQuery(''); }}
              className={`w-full flex items-center gap-3.5 px-4.5 py-3 rounded-lg transition-colors text-left ${activeTab === 'reviews' ? 'bg-[#163322] text-gold border border-gold/10' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
            >
              <MessageSquare size={16} />
              <span>Reviews</span>
            </button>
            <button 
              onClick={() => { setActiveTab('homepage'); setSearchQuery(''); }}
              className={`w-full flex items-center gap-3.5 px-4.5 py-3 rounded-lg transition-colors text-left ${activeTab === 'homepage' ? 'bg-[#163322] text-gold border border-gold/10' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
            >
              <Home size={16} />
              <span>Homepage</span>
            </button>
            <button 
              onClick={() => { setActiveTab('media'); setSearchQuery(''); }}
              className={`w-full flex items-center gap-3.5 px-4.5 py-3 rounded-lg transition-colors text-left ${activeTab === 'media' ? 'bg-[#163322] text-gold border border-gold/10' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
            >
              <Image size={16} />
              <span>Media Library</span>
            </button>
            <button 
              onClick={() => { setActiveTab('settings'); setSearchQuery(''); }}
              className={`w-full flex items-center gap-3.5 px-4.5 py-3 rounded-lg transition-colors text-left ${activeTab === 'settings' ? 'bg-[#163322] text-gold border border-gold/10' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
            >
              <Settings size={16} />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Logout bottom */}
        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-4.5 py-3.5 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-xs font-semibold text-left"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* TOP BAR */}
        <header className="h-16 bg-[#0a150f] border-b border-white/5 flex items-center justify-between px-8 shrink-0 relative z-30">
          
          {/* Search bar */}
          <div className="relative w-80">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
              <Search size={14} />
            </span>
            <input 
              type="text" 
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-gold/30 placeholder-slate-600"
            />
          </div>

          {/* Right section icons */}
          <div className="flex items-center gap-5">
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setNotifOpen(!notifOpen)}
                className="w-9 h-9 rounded-full bg-[#163322]/20 border border-white/5 flex items-center justify-center text-slate-400 hover:text-slate-200 relative"
              >
                <Bell size={16} />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-gold rounded-full border-2 border-[#0a150f]" />
                )}
              </button>
              
              {/* Notif box dropdown */}
              {notifOpen && (
                <div className="absolute right-0 mt-3 w-80 glass-panel-heavy rounded-xl border border-white/10 p-4 shadow-xl space-y-3 z-50">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-white/5">Store Notifications</h4>
                  <div className="space-y-2.5">
                    {notifications.map(n => (
                      <div key={n.id} className="text-xs border-b border-white/5 pb-2.5 last:border-0 last:pb-0">
                        <p className={`font-medium ${n.read ? 'text-slate-400' : 'text-slate-200'}`}>{n.text}</p>
                        <span className="text-[10px] text-slate-500 mt-1 block">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar */}
            <div className="relative">
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2"
              >
                <div className="w-9 h-9 rounded-full bg-[#163322]/50 border border-gold/20 flex items-center justify-center text-gold font-bold text-sm">
                  A
                </div>
              </button>
              
              {/* Profile dropdown */}
              {profileOpen && (
                <div className="absolute right-0 mt-3 w-48 glass-panel-heavy rounded-xl border border-white/10 p-2.5 shadow-xl space-y-1.5 z-50 text-xs font-semibold">
                  <div className="px-3.5 py-2 border-b border-white/5">
                    <span className="block text-slate-400 text-[10px] uppercase font-bold">Admin Account</span>
                    <span className="block text-slate-200 truncate mt-0.5">{adminUser.email}</span>
                  </div>
                  <button onClick={handleLogout} className="w-full text-left px-3.5 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors">
                    Log out
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* WORKSPACE VIEW CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-8 relative z-10">
          
          {/* A. DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <h2 className="text-xl font-serif text-[#F8F6F2]">Dashboard Overview</h2>
              
              {/* Statistics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-[#163322]/30 border border-white/5 rounded-xl p-5 shadow-lg flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Total Products</span>
                    <span className="text-2xl font-serif text-[#F8F6F2] font-bold mt-1 block">{products.length}</span>
                  </div>
                  <span className="text-3xl">🍵</span>
                </div>
                <div className="bg-[#163322]/30 border border-white/5 rounded-xl p-5 shadow-lg flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Total Orders</span>
                    <span className="text-2xl font-serif text-[#F8F6F2] font-bold mt-1 block">{orders.length}</span>
                  </div>
                  <span className="text-3xl">📦</span>
                </div>
                <div className="bg-[#163322]/30 border border-white/5 rounded-xl p-5 shadow-lg flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Customers</span>
                    <span className="text-2xl font-serif text-[#F8F6F2] font-bold mt-1 block">{customers.length}</span>
                  </div>
                  <span className="text-3xl">👥</span>
                </div>
                <div className="bg-[#163322]/30 border border-gold/10 rounded-xl p-5 shadow-lg flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gold/60 font-bold uppercase tracking-wider block">Revenue</span>
                    <span className="text-2xl font-serif text-gold font-bold mt-1 block">₹{totalRev}</span>
                  </div>
                  <span className="text-3xl">💵</span>
                </div>
              </div>

              {/* Graphic custom Chart and Recents */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Visual SVG chart */}
                <div className="lg:col-span-2 bg-[#0a150f] border border-white/5 rounded-xl p-6 shadow-lg">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Revenue Trend (Delivered)</h4>
                    <span className="text-[10px] bg-gold/10 text-gold px-2 py-0.5 rounded font-bold">Store Sales</span>
                  </div>
                  {/* SVG Chart placeholder */}
                  <div className="h-48 w-full flex items-end">
                    <svg viewBox="0 0 100 40" className="w-full h-full">
                      <defs>
                        <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#c5a880" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#c5a880" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d="M 0,40 Q 20,20 40,30 T 80,10 L 100,20 L 100,40 Z" fill="url(#chart-grad)" />
                      <path d="M 0,40 Q 20,20 40,30 T 80,10 L 100,20" fill="none" stroke="#c5a880" strokeWidth="1.5" />
                    </svg>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-4">
                    <span>Aug 01</span>
                    <span>Aug 03</span>
                    <span>Aug 05</span>
                    <span>Today</span>
                  </div>
                </div>

                {/* Quick actions panel */}
                <div className="bg-[#0a150f] border border-white/5 rounded-xl p-6 shadow-lg flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-white/5 mb-6">Quick Actions</h4>
                    <div className="space-y-3">
                      <button onClick={() => openProductForm()} className="w-full bg-gold hover:bg-gold-hover text-[#0c1912] font-semibold py-2.5 rounded-lg text-xs flex items-center justify-center gap-2">
                        <Plus size={14} />
                        <span>Add New Product</span>
                      </button>
                      <button onClick={() => setActiveTab('homepage')} className="w-full bg-[#163322]/20 border border-white/10 hover:bg-[#163322]/40 text-[#F8F6F2] font-semibold py-2.5 rounded-lg text-xs flex items-center justify-center gap-2">
                        <Home size={14} />
                        <span>Edit Homepage Details</span>
                      </button>
                      <button onClick={() => setActiveTab('reviews')} className="w-full bg-[#163322]/20 border border-white/10 hover:bg-[#163322]/40 text-[#F8F6F2] font-semibold py-2.5 rounded-lg text-xs flex items-center justify-center gap-2">
                        <Check size={14} />
                        <span>Approve Pending Reviews</span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* B. PRODUCTS MANAGEMENT VIEW */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-serif text-[#F8F6F2]">Catalog Management</h2>
                <button 
                  onClick={() => openProductForm()}
                  className="bg-gold hover:bg-gold-hover text-[#0c1912] font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-2"
                >
                  <Plus size={14} />
                  <span>Add Product</span>
                </button>
              </div>

              {/* Products Table */}
              <div className="bg-[#0a150f] border border-white/5 rounded-xl overflow-hidden shadow-lg">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#163322]/20 border-b border-white/5 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-4">Product Details</th>
                      <th className="p-4">SKU / Code</th>
                      <th className="p-4">Weight</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="font-semibold text-slate-300 divide-y divide-white/5">
                    {products.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase())).map(p => (
                      <tr key={p.id} className="hover:bg-white/5">
                        <td className="p-4 flex items-center gap-3">
                          <img src={p.img} alt={p.title} className="w-10 h-10 object-contain rounded bg-emerald-950/20" />
                          <div>
                            <span className="block font-serif text-sm text-[#F8F6F2]">{p.title}</span>
                            <span className="text-[10px] text-slate-500">{p.category}</span>
                          </div>
                        </td>
                        <td className="p-4 font-mono text-slate-400">{p.sku || 'N/A'}</td>
                        <td className="p-4">{p.weight}</td>
                        <td className="p-4">{p.stock}</td>
                        <td className="p-4">
                          <span className="text-gold">₹{p.price}</span>
                          {p.sale_price && <span className="text-slate-500 line-through text-[10px] ml-2">₹{p.sale_price}</span>}
                        </td>
                        <td className="p-4">
                          <button 
                            onClick={() => toggleProductStatus(p)}
                            className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold ${p.status === 'published' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-700/30 text-slate-500'}`}
                          >
                            {p.status}
                          </button>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-3">
                            <button onClick={() => openProductForm(p)} className="text-slate-400 hover:text-gold transition-colors">
                              <Edit size={14} />
                            </button>
                            <button onClick={() => handleDeleteProduct(p.id)} className="text-slate-400 hover:text-red-400 transition-colors">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* C. ORDERS MANAGEMENT VIEW */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="text-xl font-serif text-[#F8F6F2]">Order Queue</h2>
              
              <div className="bg-[#0a150f] border border-white/5 rounded-xl overflow-hidden shadow-lg">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#163322]/20 border-b border-white/5 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Customer Details</th>
                      <th className="p-4">Product Info</th>
                      <th className="p-4">Total Amount</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-center">Invoice</th>
                    </tr>
                  </thead>
                  <tbody className="font-semibold text-slate-300 divide-y divide-white/5">
                    {orders.filter(o => o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) || o.product_title.toLowerCase().includes(searchQuery.toLowerCase())).map(o => (
                      <tr key={o.id} className="hover:bg-white/5">
                        <td className="p-4 font-mono text-slate-400">{o.id}</td>
                        <td className="p-4">
                          <span className="block text-[#F8F6F2]">{o.customer_name}</span>
                          <span className="text-[10px] text-slate-500 block">{o.customer_phone}</span>
                        </td>
                        <td className="p-4">
                          <span>{o.product_title}</span>
                          <span className="text-[10px] text-slate-500 block">Qty: {o.quantity}</span>
                        </td>
                        <td className="p-4 text-gold">₹{o.total_price}</td>
                        <td className="p-4 text-slate-400">{new Date(o.created_at).toLocaleDateString()}</td>
                        <td className="p-4">
                          <select 
                            value={o.status}
                            onChange={(e) => updateStatus(o.id, e.target.value)}
                            className="bg-[#0c1912] border border-white/10 rounded px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="p-4 text-center">
                          <button 
                            onClick={() => { setActiveOrder(o); setOrderModalOpen(true); }}
                            className="text-gold hover:text-gold-hover flex items-center gap-1 mx-auto"
                          >
                            <Eye size={12} />
                            <span>Invoice</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* D. CUSTOMERS LIST VIEW */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              <h2 className="text-xl font-serif text-[#F8F6F2]">Customer Records</h2>

              <div className="bg-[#0a150f] border border-white/5 rounded-xl overflow-hidden shadow-lg">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#163322]/20 border-b border-white/5 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-4">Customer Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Phone Number</th>
                      <th className="p-4">Order History Count</th>
                    </tr>
                  </thead>
                  <tbody className="font-semibold text-slate-300 divide-y divide-white/5">
                    {customers.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map(c => (
                      <tr key={c.id} className="hover:bg-white/5">
                        <td className="p-4 text-[#F8F6F2]">{c.name}</td>
                        <td className="p-4 text-slate-400">{c.email || 'N/A'}</td>
                        <td className="p-4 font-mono text-slate-400">{c.phone || 'N/A'}</td>
                        <td className="p-4">
                          <span className="bg-[#163322] border border-white/10 px-2.5 py-0.5 rounded text-[10px] text-gold font-bold">
                            {c.order_history ? c.order_history.length : 0} Orders
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* E. REVIEWS MANAGEMENT VIEW */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <h2 className="text-xl font-serif text-[#F8F6F2]">Review Moderation</h2>

              <div className="bg-[#0a150f] border border-white/5 rounded-xl overflow-hidden shadow-lg">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#163322]/20 border-b border-white/5 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-4">Customer</th>
                      <th className="p-4">Rating</th>
                      <th className="p-4">Comment</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Featured</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="font-semibold text-slate-300 divide-y divide-white/5">
                    {reviews.filter(r => r.customer_name.toLowerCase().includes(searchQuery.toLowerCase())).map(r => (
                      <tr key={r.id} className="hover:bg-white/5">
                        <td className="p-4 text-[#F8F6F2]">{r.customer_name}</td>
                        <td className="p-4 text-gold font-serif">{"★".repeat(r.rating)}</td>
                        <td className="p-4 max-w-xs truncate text-slate-400">{r.comment}</td>
                        <td className="p-4">
                          <button 
                            onClick={() => toggleReviewFlag(r.id, 'approved', !r.approved)}
                            className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold ${r.approved ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}
                          >
                            {r.approved ? 'Approved' : 'Pending'}
                          </button>
                        </td>
                        <td className="p-4">
                          <button 
                            onClick={() => toggleReviewFlag(r.id, 'featured', !r.featured)}
                            className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold ${r.featured ? 'bg-gold/10 text-gold border border-gold/30' : 'bg-slate-700/30 text-slate-500'}`}
                          >
                            {r.featured ? 'Featured' : 'Regular'}
                          </button>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-3">
                            <button onClick={() => handleDeleteReview(r.id)} className="text-slate-400 hover:text-red-400 transition-colors">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* F. HOMEPAGE CUSTOMIZER VIEW */}
          {activeTab === 'homepage' && (
            <div className="space-y-8">
              <h2 className="text-xl font-serif text-[#F8F6F2]">Homepage Editor</h2>
              
              {/* Section 1: Hero */}
              <div className="bg-[#0a150f] border border-white/5 rounded-xl p-6 shadow-lg space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-white/5 mb-2">Hero Section</h4>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-[10px] text-slate-500 font-bold uppercase">Accent Tag</label>
                    <input 
                      type="text" 
                      value={homepageContent.hero.tag}
                      onChange={(e) => setHomepageContent({ ...homepageContent, hero: { ...homepageContent.hero, tag: e.target.value } })}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] text-slate-500 font-bold uppercase">Heading Text</label>
                    <input 
                      type="text" 
                      value={homepageContent.hero.heading}
                      onChange={(e) => setHomepageContent({ ...homepageContent, hero: { ...homepageContent.hero, heading: e.target.value } })}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] text-slate-500 font-bold uppercase">Sub-description</label>
                  <textarea 
                    rows={2}
                    value={homepageContent.hero.description}
                    onChange={(e) => setHomepageContent({ ...homepageContent, hero: { ...homepageContent.hero, description: e.target.value } })}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-xs text-slate-200 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button 
                    onClick={() => saveHomepageConfig('hero', homepageContent.hero)}
                    className="bg-gold text-[#0c1912] font-bold text-xs px-5 py-2 rounded-lg"
                  >
                    Save Changes
                  </button>
                </div>
              </div>

              {/* Section 2: Why Kindleaf */}
              <div className="bg-[#0a150f] border border-white/5 rounded-xl p-6 shadow-lg space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-white/5 mb-2">Why Kindleaf (Philosophy)</h4>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-[10px] text-slate-500 font-bold uppercase">Accent Tag</label>
                    <input 
                      type="text" 
                      value={homepageContent.why_kindleaf.tag}
                      onChange={(e) => setHomepageContent({ ...homepageContent, why_kindleaf: { ...homepageContent.why_kindleaf, tag: e.target.value } })}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] text-slate-500 font-bold uppercase">Heading Text</label>
                    <input 
                      type="text" 
                      value={homepageContent.why_kindleaf.heading}
                      onChange={(e) => setHomepageContent({ ...homepageContent, why_kindleaf: { ...homepageContent.why_kindleaf, heading: e.target.value } })}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] text-slate-500 font-bold uppercase">Description</label>
                  <textarea 
                    rows={2}
                    value={homepageContent.why_kindleaf.description}
                    onChange={(e) => setHomepageContent({ ...homepageContent, why_kindleaf: { ...homepageContent.why_kindleaf, description: e.target.value } })}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-xs text-slate-200 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button 
                    onClick={() => saveHomepageConfig('why_kindleaf', homepageContent.why_kindleaf)}
                    className="bg-gold text-[#0c1912] font-bold text-xs px-5 py-2 rounded-lg"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* G. MEDIA LIBRARY VIEW */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-serif text-[#F8F6F2]">Media Library</h2>
                <div className="flex items-center gap-4">
                  <input 
                    type="file" 
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden" 
                  />
                  <button 
                    onClick={handleUploadClick}
                    disabled={uploading}
                    className="bg-gold hover:bg-gold-hover disabled:bg-gold/50 text-[#0c1912] font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-2"
                  >
                    <Upload size={14} />
                    <span>{uploading ? 'Compressing & Saving...' : 'Upload Image'}</span>
                  </button>
                </div>
              </div>

              {/* Drag and Drop visual grid */}
              <div 
                onClick={handleUploadClick}
                className="border-2 border-dashed border-white/10 hover:border-gold/30 rounded-2xl p-10 text-center cursor-pointer bg-[#0a150f] transition-colors"
              >
                <Upload size={32} className="mx-auto text-slate-500 mb-3" />
                <span className="text-xs font-semibold text-slate-300 block">Drag &amp; Drop images here to upload</span>
                <span className="text-[10px] text-slate-500 mt-1 block">Compression is applied automatically on server.</span>
              </div>

              {/* Media items grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
                {media.map(m => (
                  <div key={m.id} className="group relative bg-[#0a150f] border border-white/5 rounded-xl overflow-hidden shadow-md">
                    <div className="aspect-square bg-emerald-950/10 p-4 flex items-center justify-center relative">
                      <img src={m.url} alt={m.filename} className="max-h-full max-w-full object-contain" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button onClick={() => handleDeleteMedia(m.id)} className="p-2 bg-red-500/80 rounded-full text-white hover:bg-red-600 transition-colors">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                    <div className="p-2 text-[10px] border-t border-white/5 truncate">
                      <span className="text-slate-300 font-semibold block truncate">{m.filename}</span>
                      <span className="text-slate-500">{(m.size / 1024).toFixed(1)} KB</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* H. GLOBAL SETTINGS VIEW */}
          {activeTab === 'settings' && (
            <div className="space-y-8">
              <h2 className="text-xl font-serif text-[#F8F6F2]">Website Configurations</h2>

              {/* Contacts info */}
              <div className="bg-[#0a150f] border border-white/5 rounded-xl p-6 shadow-lg space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-white/5">Company Contact Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-[10px] text-slate-500 font-bold uppercase">Website Name</label>
                    <input 
                      type="text" 
                      value={globalSettings.website_name}
                      onChange={(e) => setGlobalSettings({ ...globalSettings, website_name: e.target.value })}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] text-slate-500 font-bold uppercase">Support Email</label>
                    <input 
                      type="email" 
                      value={globalSettings.contact_email}
                      onChange={(e) => setGlobalSettings({ ...globalSettings, contact_email: e.target.value })}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] text-slate-500 font-bold uppercase">Support Phone</label>
                    <input 
                      type="text" 
                      value={globalSettings.contact_phone}
                      onChange={(e) => setGlobalSettings({ ...globalSettings, contact_phone: e.target.value })}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] text-slate-500 font-bold uppercase">WhatsApp Phone String</label>
                    <input 
                      type="text" 
                      value={globalSettings.whatsapp_phone}
                      onChange={(e) => setGlobalSettings({ ...globalSettings, whatsapp_phone: e.target.value })}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] text-slate-500 font-bold uppercase">Origin Address</label>
                  <input 
                    type="text" 
                    value={globalSettings.address}
                    onChange={(e) => setGlobalSettings({ ...globalSettings, address: e.target.value })}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-xs text-slate-200 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button 
                    onClick={() => saveSettingsConfig('website_details', globalSettings)}
                    className="bg-gold text-[#0c1912] font-bold text-xs px-5 py-2 rounded-lg"
                  >
                    Save Contacts
                  </button>
                </div>
              </div>

              {/* SEO and Links */}
              <div className="bg-[#0a150f] border border-white/5 rounded-xl p-6 shadow-lg space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-white/5">SEO Meta &amp; Integrations</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-[10px] text-slate-500 font-bold uppercase">SEO Global Title</label>
                    <input 
                      type="text" 
                      value={globalSettings.seo_title}
                      onChange={(e) => setGlobalSettings({ ...globalSettings, seo_title: e.target.value })}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] text-slate-500 font-bold uppercase">Instagram URL</label>
                    <input 
                      type="text" 
                      value={globalSettings.instagram_url}
                      onChange={(e) => setGlobalSettings({ ...globalSettings, instagram_url: e.target.value })}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] text-slate-500 font-bold uppercase">Amazon Store Link</label>
                    <input 
                      type="text" 
                      value={globalSettings.amazon_store_url}
                      onChange={(e) => setGlobalSettings({ ...globalSettings, amazon_store_url: e.target.value })}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] text-slate-500 font-bold uppercase">SEO Global Description</label>
                  <textarea 
                    rows={2}
                    value={globalSettings.seo_description}
                    onChange={(e) => setGlobalSettings({ ...globalSettings, seo_description: e.target.value })}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-xs text-slate-200 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button 
                    onClick={() => saveSettingsConfig('website_seo_links', globalSettings)}
                    className="bg-gold text-[#0c1912] font-bold text-xs px-5 py-2 rounded-lg"
                  >
                    Save SEO &amp; Links
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* PRODUCT FORM MODAL */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setProductModalOpen(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-4xl bg-[#0e2217] border border-white/10 rounded-2xl p-8 shadow-2xl z-10 max-h-[85vh] overflow-y-auto"
          >
            <h3 className="text-lg font-serif text-[#F8F6F2] mb-6 border-b border-white/5 pb-2">
              {editingProduct ? 'Edit Product details' : 'Add New Product'}
            </h3>

            <form onSubmit={handleProductSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Column 1: Core details */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-500 font-bold uppercase">Product Name</label>
                    <input 
                      type="text" required
                      value={productForm.title}
                      onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-500 font-bold uppercase">Slug (URL friendly)</label>
                    <input 
                      type="text" required
                      value={productForm.slug}
                      onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-500 font-bold uppercase">SKU Code</label>
                    <input 
                      type="text"
                      value={productForm.sku}
                      onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] text-slate-500 font-bold uppercase">Weight</label>
                      <input 
                        type="text" required
                        value={productForm.weight}
                        onChange={(e) => setProductForm({ ...productForm, weight: e.target.value })}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] text-slate-500 font-bold uppercase">Stock Count</label>
                      <input 
                        type="number" required
                        value={productForm.stock}
                        onChange={(e) => setProductForm({ ...productForm, stock: parseInt(e.target.value) })}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] text-slate-500 font-bold uppercase">Sale Price (₹)</label>
                      <input 
                        type="number" required
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) })}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] text-slate-500 font-bold uppercase">Original Price (₹)</label>
                      <input 
                        type="number"
                        value={productForm.sale_price || productForm.originalPrice}
                        onChange={(e) => setProductForm({ ...productForm, sale_price: parseFloat(e.target.value) })}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Column 2: Graphics and links */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-500 font-bold uppercase">Main Image URL</label>
                    <input 
                      type="text" required
                      value={productForm.img}
                      onChange={(e) => setProductForm({ ...productForm, img: e.target.value })}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-500 font-bold uppercase">Amazon Store Listing URL</label>
                    <input 
                      type="text"
                      value={productForm.amazon_url || productForm.amazonUrl}
                      onChange={(e) => setProductForm({ ...productForm, amazon_url: e.target.value })}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-500 font-bold uppercase">Category</label>
                    <input 
                      type="text" required
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-500 font-bold uppercase">Short Description</label>
                    <textarea 
                      rows={2} required
                      value={productForm.short_description}
                      onChange={(e) => setProductForm({ ...productForm, short_description: e.target.value })}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <label className="flex items-center gap-2 text-xs text-slate-300 font-semibold cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={productForm.featured}
                        onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                        className="accent-gold h-4 w-4 rounded border-white/10 bg-black/20" 
                      />
                      <span>Featured</span>
                    </label>
                    <div className="flex gap-2">
                      <span className="text-[10px] text-slate-500 uppercase font-bold mt-1">Status:</span>
                      <select 
                        value={productForm.status}
                        onChange={(e) => setProductForm({ ...productForm, status: e.target.value })}
                        className="bg-black/25 border border-white/10 rounded px-2 text-[10px] text-slate-200"
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="hidden">Hidden</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Column 3: Description, Benefits & Ingredients */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-500 font-bold uppercase">Full Description</label>
                    <textarea 
                      rows={3} required
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-500 font-bold uppercase">Benefits (Comma-separated)</label>
                    <input 
                      type="text"
                      placeholder="Benefit 1, Benefit 2, Benefit 3"
                      value={Array.isArray(productForm.benefits) ? productForm.benefits.join(', ') : ''}
                      onChange={(e) => setProductForm({ ...productForm, benefits: e.target.value.split(',').map((x: string) => x.trim()) })}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-500 font-bold uppercase">Ingredients (Comma-separated)</label>
                    <input 
                      type="text"
                      placeholder="Ingredient 1, Ingredient 2, Ingredient 3"
                      value={Array.isArray(productForm.ingredients) ? productForm.ingredients.join(', ') : ''}
                      onChange={(e) => setProductForm({ ...productForm, ingredients: e.target.value.split(',').map((x: string) => x.trim()) })}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>
                </div>

              </div>

              {/* SEO parameters */}
              <div className="bg-black/10 border border-white/5 rounded-xl p-5 space-y-4">
                <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">SEO Configuration</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-500 font-bold uppercase">SEO Title</label>
                    <input 
                      type="text"
                      value={productForm.seo_title}
                      onChange={(e) => setProductForm({ ...productForm, seo_title: e.target.value })}
                      className="w-full bg-[#0c1912] border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-500 font-bold uppercase">SEO Description</label>
                    <input 
                      type="text"
                      value={productForm.seo_description}
                      onChange={(e) => setProductForm({ ...productForm, seo_description: e.target.value })}
                      className="w-full bg-[#0c1912] border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Actions row */}
              <div className="flex justify-end gap-4 pt-4 border-t border-white/5">
                <button 
                  type="button" 
                  onClick={() => setProductModalOpen(false)}
                  className="bg-transparent border border-white/10 hover:bg-white/5 text-slate-300 font-semibold px-6 py-2.5 rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-gold hover:bg-gold-hover text-[#0c1912] font-bold px-6 py-2.5 rounded-lg text-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ORDER INVOICE MODAL */}
      {orderModalOpen && activeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setOrderModalOpen(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-lg bg-[#0e2217] border border-white/10 rounded-2xl p-8 shadow-2xl z-10"
          >
            <button 
              onClick={() => setOrderModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl"
            >
              &times;
            </button>

            <div className="space-y-6">
              {/* Invoice header */}
              <div className="text-center pb-4 border-b border-white/5">
                <span className="text-gold text-[10px] uppercase font-bold tracking-widest block">Kindleaf Store Invoice</span>
                <h3 className="text-xl font-serif text-[#F8F6F2] mt-1">Order #{(activeOrder.id).substring(0, 8)}</h3>
                <span className="text-[10px] text-slate-500 mt-1 block">{new Date(activeOrder.created_at).toLocaleString()}</span>
              </div>

              {/* Order content */}
              <div className="space-y-3.5">
                <h5 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Item details</h5>
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="block text-[#F8F6F2] font-semibold">{activeOrder.product_title}</span>
                    <span className="text-[10px] text-slate-500">Quantity: {activeOrder.quantity}</span>
                  </div>
                  <span className="text-gold font-bold">₹{activeOrder.total_price}</span>
                </div>
              </div>

              {/* Customer details */}
              <div className="space-y-3.5 pt-4 border-t border-white/5">
                <h5 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Shipping Details</h5>
                <ul className="text-xs space-y-2 text-slate-300">
                  <li className="flex justify-between"><span className="text-slate-500">Name:</span> <span className="font-semibold">{activeOrder.customer_name}</span></li>
                  <li className="flex justify-between"><span className="text-slate-500">Phone:</span> <span className="font-semibold">{activeOrder.customer_phone || 'N/A'}</span></li>
                  <li className="flex justify-between"><span className="text-slate-500">Email:</span> <span className="font-semibold">{activeOrder.customer_email || 'N/A'}</span></li>
                  <li className="flex flex-col gap-1 pt-1"><span className="text-slate-500">Address:</span> <span className="p-3 bg-black/25 rounded border border-white/5 text-[11px] leading-relaxed">{activeOrder.shipping_address}</span></li>
                </ul>
              </div>

              {/* Order Status footer actions */}
              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Status:</span>
                  <select 
                    value={activeOrder.status}
                    onChange={(e) => {
                      updateStatus(activeOrder.id, e.target.value);
                      setActiveOrder({ ...activeOrder, status: e.target.value });
                    }}
                    className="bg-black/25 border border-white/10 rounded px-2 py-1 text-xs text-slate-200"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <button 
                  onClick={() => setOrderModalOpen(false)}
                  className="bg-gold text-[#0c1912] font-bold text-xs px-5 py-2 rounded-lg"
                >
                  Close Invoice
                </button>
              </div>

            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
