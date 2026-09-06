"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, ShoppingBasket, FileText, Image as ImageIcon, 
  Tag, Home, Sparkles, Clock, HelpCircle, BookOpen, Scale, 
  Search, Globe, Smartphone, Share2, LogOut, Menu, X, Plus, 
  Edit, Trash2, Check, ExternalLink, Eye, Upload, Music, 
  AlertTriangle, CheckCircle2, ChevronRight, Copy, ArrowUpRight,
  ChevronUp, ChevronDown, ShoppingBag
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export default function AdminDashboard() {
  const router = useRouter();

  // Auth state
  const [adminUser, setAdminUser] = useState<any>(null);

  // Active module tab
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Data Collections
  const [products, setProducts] = useState<any[]>([]);
  const [journalArticles, setJournalArticles] = useState<any[]>([]);
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [homepageContent, setHomepageContent] = useState<any>({});
  const [brewingGuide, setBrewingGuide] = useState<any>({});
  const [ourStory, setOurStory] = useState<any>({});
  const [legalContent, setLegalContent] = useState<any>({});
  const [seoSettings, setSeoSettings] = useState<any>({});
  const [appSettings, setAppSettings] = useState<any>({});
  const [socialLinks, setSocialLinks] = useState<any>({});

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [mediaTypeFilter, setMediaTypeFilter] = useState<'all' | 'image' | 'audio'>('all');

  // Modal states
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; title: string; onConfirm: () => void } | null>(null);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaPickerCallback, setMediaPickerCallback] = useState<((url: string) => void) | null>(null);
  const [previewModal, setPreviewModal] = useState<{ open: boolean; type: string; data: any } | null>(null);

  // Editing Modals
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const [journalModalOpen, setJournalModalOpen] = useState(false);
  const [editingJournal, setEditingJournal] = useState<any>(null);

  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<any>(null);

  const [ingredientModalOpen, setIngredientModalOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<any>(null);

  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<any>(null);

  // File Upload Ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  // 1. Verify Auth
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

  // 2. Load all CMS data
  const loadAllData = async () => {
    try {
      const [
        prodRes, journalRes, mediaRes, offerRes, ingRes,
        faqRes, homeRes, brewRes, storyRes, legalRes,
        seoRes, appRes, socialRes
      ] = await Promise.all([
        fetch('/api/products?all=true').then(r => r.json()).catch(() => []),
        fetch('/api/journal?all=true').then(r => r.json()).catch(() => []),
        fetch('/api/media').then(r => r.json()).catch(() => []),
        fetch('/api/offers?all=true').then(r => r.json()).catch(() => []),
        fetch('/api/ingredients?all=true').then(r => r.json()).catch(() => []),
        fetch('/api/faqs?all=true').then(r => r.json()).catch(() => []),
        fetch('/api/homepage').then(r => r.json()).catch(() => ({})),
        fetch('/api/brewing').then(r => r.json()).catch(() => ({})),
        fetch('/api/story').then(r => r.json()).catch(() => ({})),
        fetch('/api/legal').then(r => r.json()).catch(() => ({})),
        fetch('/api/seo').then(r => r.json()).catch(() => ({})),
        fetch('/api/settings').then(r => r.json()).then(d => d?.app_settings || {}).catch(() => ({})),
        fetch('/api/settings').then(r => r.json()).then(d => d?.social_links || {}).catch(() => ({}))
      ]);

      if (Array.isArray(prodRes)) setProducts(prodRes);
      if (Array.isArray(journalRes)) setJournalArticles(journalRes);
      if (Array.isArray(mediaRes)) setMediaItems(mediaRes);
      if (Array.isArray(offerRes)) setOffers(offerRes);
      if (Array.isArray(ingRes)) setIngredients(ingRes);
      if (Array.isArray(faqRes)) setFaqs(faqRes);
      if (homeRes) setHomepageContent(homeRes);
      if (brewRes) setBrewingGuide(brewRes);
      if (storyRes) setOurStory(storyRes);
      if (legalRes) setLegalContent(legalRes);
      if (seoRes) setSeoSettings(seoRes);
      if (appRes) setAppSettings(appRes);
      if (socialRes) setSocialLinks(socialRes);
    } catch (err) {
      console.error('Error loading CMS data:', err);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Handle Logout
  const handleLogout = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_session');
    }
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    router.push('/admin/login');
  };

  // Open Media Picker Helper
  const openMediaPicker = (callback: (url: string) => void) => {
    setMediaPickerCallback(() => callback);
    setMediaPickerOpen(true);
  };

  // File Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, category = 'General') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);

    try {
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setMediaItems(prev => [data, ...prev]);
      showToast(`Uploaded ${file.name} successfully!`);

      if (mediaPickerCallback) {
        mediaPickerCallback(data.url);
        setMediaPickerOpen(false);
      }
    } catch (err: any) {
      showToast(err.message || 'Upload error', 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Quick Product Toggles & Reorder
  const toggleProductStatus = async (p: any) => {
    const nextStatus = p.status === 'published' ? 'draft' : 'published';
    const updated = { ...p, status: nextStatus };
    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      setProducts(prev => prev.map(item => item.id === p.id ? updated : item));
      showToast(`Product set to ${nextStatus}`);
    } catch (e: any) {
      showToast(e.message || 'Error updating product', 'error');
    }
  };

  const toggleProductAmazon = async (p: any) => {
    const nextVal = !p.amazon_button_enabled;
    const updated = { ...p, amazon_button_enabled: nextVal };
    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      setProducts(prev => prev.map(item => item.id === p.id ? updated : item));
      showToast(`Amazon button turned ${nextVal ? 'ON' : 'OFF'}`);
    } catch (e: any) {
      showToast(e.message || 'Error updating product', 'error');
    }
  };

  const moveProductOrder = async (p: any, direction: 'up' | 'down') => {
    const sorted = [...products].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
    const idx = sorted.findIndex(item => item.id === p.id);
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= sorted.length) return;

    const target = sorted[targetIdx];
    const oldCurrentOrder = p.display_order ?? idx;
    const oldTargetOrder = target.display_order ?? targetIdx;

    const newCurrentOrder = oldTargetOrder;
    const newTargetOrder = oldCurrentOrder === oldTargetOrder ? (direction === 'up' ? oldTargetOrder + 1 : oldTargetOrder - 1) : oldCurrentOrder;

    const updatedCurrent = { ...p, display_order: newCurrentOrder };
    const updatedTarget = { ...target, display_order: newTargetOrder };

    setProducts(prev => prev.map(item => {
      if (item.id === p.id) return updatedCurrent;
      if (item.id === target.id) return updatedTarget;
      return item;
    }));

    try {
      await Promise.all([
        fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updatedCurrent) }),
        fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updatedTarget) })
      ]);
      showToast("Product order updated!");
    } catch (e: any) {
      showToast(e.message || 'Error saving order', 'error');
    }
  };

  // Navigation Items
  const navSections = [
    {
      group: "OVERVIEW",
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
      ]
    },
    {
      group: "CATALOG & CONTENT",
      items: [
        { id: 'products', label: 'Products', icon: ShoppingBasket, count: products.length },
        { id: 'journal', label: 'Journal / Blogs', icon: FileText, count: journalArticles.length },
        { id: 'ingredients', label: 'Botanicals', icon: Sparkles, count: ingredients.length },
        { id: 'offers', label: 'Offers & Banners', icon: Tag, count: offers.length }
      ]
    },
    {
      group: "WEBSITE SECTIONS",
      items: [
        { id: 'homepage', label: 'Homepage', icon: Home },
        { id: 'brewing', label: 'Brewing Guide', icon: Clock },
        { id: 'story', label: 'Our Story', icon: BookOpen },
        { id: 'faqs', label: 'FAQs', icon: HelpCircle, count: faqs.length },
        { id: 'legal', label: 'Legal Hub', icon: Scale }
      ]
    },
    {
      group: "ASSETS & CONFIG",
      items: [
        { id: 'media', label: 'Media Library', icon: ImageIcon, count: mediaItems.length },
        { id: 'seo', label: 'SEO Metadata', icon: Globe },
        { id: 'app', label: 'App Settings', icon: Smartphone },
        { id: 'social', label: 'Social Links', icon: Share2 }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#08120c] text-slate-200 font-sans flex flex-col lg:flex-row antialiased">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border text-xs font-medium ${
              toast.type === 'error' 
                ? 'bg-red-950/90 border-red-700 text-red-200' 
                : 'bg-[#163322]/95 border-gold/40 text-gold'
            }`}
          >
            {toast.type === 'error' ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden File Input for Quick Uploads */}
      <input 
        ref={fileInputRef} 
        type="file" 
        className="hidden" 
        accept="image/*,audio/*" 
        onChange={(e) => handleFileUpload(e)}
      />

      {/* Mobile Header */}
      <header className="lg:hidden bg-[#0c1912] border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <img src="/assets/logo.png" alt="Kindleaf" className="h-8 w-auto rounded" />
          <span className="font-serif font-bold text-sm text-[#F8F6F2]">Kindleaf CMS</span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-[#0c1912] border-r border-white/10 flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Brand header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/assets/logo.png" alt="Kindleaf" className="h-9 w-auto rounded shadow" />
              <div>
                <h1 className="font-serif font-bold text-sm text-[#F8F6F2] leading-none">Kindleaf CMS</h1>
                <span className="text-[10px] text-gold tracking-widest uppercase font-semibold block mt-1">Content Manager</span>
              </div>
            </div>
          </div>

          {/* Nav items list */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-6">
            {navSections.map(section => (
              <div key={section.group} className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-3 mb-1 block">
                  {section.group}
                </span>
                {section.items.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                        isActive 
                          ? 'bg-gold text-[#0c1912] font-semibold shadow-md' 
                          : 'text-slate-300 hover:bg-[#163322]/40 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={16} className={isActive ? 'text-[#0c1912]' : 'text-gold'} />
                        <span>{item.label}</span>
                      </div>
                      {item.count !== undefined && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          isActive ? 'bg-[#0c1912]/20 text-[#0c1912]' : 'bg-white/5 text-slate-400'
                        }`}>
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* User profile & actions footer */}
          <div className="p-4 border-t border-white/10 bg-[#0a150f] space-y-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-gold hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-2">
                <ExternalLink size={14} />
                <span>View Live Website</span>
              </div>
              <ArrowUpRight size={12} className="text-gold" />
            </a>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto p-6 sm:p-8 lg:p-10 space-y-8">
        
        {/* ========================================================= */}
        {/* 1. DASHBOARD OVERVIEW TAB */}
        {/* ========================================================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <span className="text-gold text-xs font-semibold uppercase tracking-widest">Kindleaf Control Center</span>
                <h2 className="text-2xl sm:text-3xl font-serif text-[#F8F6F2] font-bold mt-1">Website Overview &amp; Content Status</h2>
                <p className="text-xs text-slate-400 mt-1">Manage public tea products, stories, botanicals, and promotions without editing code.</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="bg-gold hover:bg-gold-hover text-[#0c1912] font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow"
                >
                  <Upload size={14} />
                  <span>{uploading ? 'Uploading...' : 'Quick Upload Media'}</span>
                </button>
              </div>
            </div>

            {/* Metrics Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { label: 'Products', count: products.length, icon: ShoppingBasket, tab: 'products', sub: `${products.filter(p => p.status === 'published').length} Live` },
                { label: 'Journal Articles', count: journalArticles.length, icon: FileText, tab: 'journal', sub: `${journalArticles.filter(b => b.status === 'published').length} Published` },
                { label: 'Botanicals', count: ingredients.length, icon: Sparkles, tab: 'ingredients', sub: 'Active blends' },
                { label: 'Media Files', count: mediaItems.length, icon: ImageIcon, tab: 'media', sub: 'Images & Audio' },
                { label: 'Active Offers', count: offers.filter(o => o.active).length, icon: Tag, tab: 'offers', sub: 'Live banners' },
                { label: 'Help FAQs', count: faqs.length, icon: HelpCircle, tab: 'faqs', sub: `${faqs.filter(f => f.status === 'published').length} Active` }
              ].map(stat => (
                <div 
                  key={stat.label}
                  onClick={() => setActiveTab(stat.tab)}
                  className="p-5 rounded-2xl bg-[#0c1912] border border-white/10 hover:border-gold/40 transition-all cursor-pointer space-y-2 group"
                >
                  <div className="flex items-center justify-between text-slate-400">
                    <stat.icon size={18} className="text-gold group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] text-slate-400 font-mono">{stat.sub}</span>
                  </div>
                  <div className="text-2xl font-serif text-[#F8F6F2] font-bold">{stat.count}</div>
                  <div className="text-xs font-medium text-slate-300">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Quick Action Navigation Panels */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Card 1: Products quick launch */}
              <div className="p-6 rounded-2xl bg-[#0c1912] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-base text-[#F8F6F2]">Public Products</h3>
                  <button onClick={() => { setEditingProduct(null); setProductModalOpen(true); }} className="text-xs text-gold hover:underline flex items-center gap-1">
                    <Plus size={13} /> Add Product
                  </button>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Modify pack sizes, pricing, botanical ingredients, tasting notes, and FSSAI facts displayed on the website.
                </p>
                <div className="space-y-2 pt-1">
                  {products.slice(0, 3).map(p => (
                    <div key={p.id} className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 text-xs">
                      <span className="truncate max-w-[180px] text-[#F8F6F2] font-medium">{p.title}</span>
                      <span className="text-gold font-mono">{p.weight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 2: Journal quick launch */}
              <div className="p-6 rounded-2xl bg-[#0c1912] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-base text-[#F8F6F2]">The Tea Chronicle</h3>
                  <button onClick={() => { setEditingJournal(null); setJournalModalOpen(true); }} className="text-xs text-gold hover:underline flex items-center gap-1">
                    <Plus size={13} /> Write Story
                  </button>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Publish essays on slow living, brewing science, and ingredients. Published blogs appear on the homepage and /journal.
                </p>
                <div className="space-y-2 pt-1">
                  {journalArticles.slice(0, 3).map(b => (
                    <div key={b.id} className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 text-xs">
                      <span className="truncate max-w-[180px] text-[#F8F6F2] font-medium">{b.title}</span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider">{b.category}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 3: Promo offers quick launch */}
              <div className="p-6 rounded-2xl bg-[#0c1912] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-base text-[#F8F6F2]">Active Offers</h3>
                  <button onClick={() => { setEditingOffer(null); setOfferModalOpen(true); }} className="text-xs text-gold hover:underline flex items-center gap-1">
                    <Plus size={13} /> New Offer
                  </button>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Promotional banners show at the top of the website and redirect users to download the Kindleaf Mobile App.
                </p>
                <div className="space-y-2 pt-1">
                  {offers.slice(0, 3).map(o => (
                    <div key={o.id} className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 text-xs">
                      <span className="truncate max-w-[180px] text-[#F8F6F2] font-medium">{o.title}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${o.active ? 'bg-emerald-900/60 text-emerald-300' : 'bg-slate-700 text-slate-300'}`}>
                        {o.active ? 'Active' : 'Paused'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 2. PRODUCTS MANAGEMENT TAB */}
        {/* ========================================================= */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <h2 className="text-2xl font-serif text-[#F8F6F2] font-bold">Product Catalog</h2>
                <p className="text-xs text-slate-400 mt-1">Manage public blend listings, weights, pack descriptions, and botanical specifications.</p>
              </div>

              <button
                onClick={() => {
                  setEditingProduct({
                    title: "",
                    slug: "",
                    description: "",
                    short_description: "",
                    price: 249,
                    weight: "50g Pouch",
                    category: "Single Pack",
                    taste_profile: "",
                    aroma: "",
                    brewing_summary: "85°C water • 1 tsp (~2g) • 3-5 mins covered",
                    fssai_info: "FSSAI Licensed Food Business",
                    ingredients: "Rose petals, chamomile, lavender, spearmint, ashwagandha, stevia leaf",
                    img: "/assets/product_natural.png",
                    images: ["/assets/product_natural.png"],
                    amazon_url: "",
                    amazon_button_enabled: true,
                    display_order: products.length,
                    status: "published",
                    featured: false,
                    seo_title: "",
                    seo_description: ""
                  });
                  setProductModalOpen(true);
                }}
                className="bg-gold hover:bg-gold-hover text-[#0c1912] font-semibold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow"
              >
                <Plus size={16} />
                <span>Add New Product</span>
              </button>
            </div>

            {/* Filter bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#0c1912] border border-white/10 text-xs">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 w-full sm:w-72">
                <Search size={14} className="text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent outline-none w-full text-slate-200 placeholder-slate-500"
                />
              </div>

              <div className="flex items-center gap-2">
                {(['all', 'published', 'draft'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer ${
                      statusFilter === st ? 'bg-gold text-[#0c1912] font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Table */}
            <div className="rounded-2xl border border-white/10 bg-[#0c1912] overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[750px]">
                <thead className="border-b border-white/10 bg-[#0a150f] text-slate-400 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4 w-14 text-center">Order</th>
                    <th className="p-4">Product</th>
                    <th className="p-4">Net Weight</th>
                    <th className="p-4">Amazon Purchase</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[...products]
                    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
                    .filter(p => {
                      const matchesSearch = p.title?.toLowerCase().includes(searchQuery.toLowerCase()) || p.slug?.toLowerCase().includes(searchQuery.toLowerCase());
                      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
                      return matchesSearch && matchesStatus;
                    })
                    .map((p, idx, arr) => (
                      <tr key={p.id || idx} className="hover:bg-white/5 transition-colors">
                        {/* Order Controls */}
                        <td className="p-4 text-center">
                          <div className="flex flex-col items-center justify-center gap-0.5">
                            <button
                              onClick={() => moveProductOrder(p, 'up')}
                              disabled={idx === 0}
                              title="Move up"
                              className="p-1 rounded text-slate-400 hover:text-gold disabled:opacity-20 disabled:hover:text-slate-400 transition-colors cursor-pointer"
                            >
                              <ChevronUp size={14} />
                            </button>
                            <span className="text-[10px] font-mono text-gold font-bold">{p.display_order ?? idx}</span>
                            <button
                              onClick={() => moveProductOrder(p, 'down')}
                              disabled={idx === arr.length - 1}
                              title="Move down"
                              className="p-1 rounded text-slate-400 hover:text-gold disabled:opacity-20 disabled:hover:text-slate-400 transition-colors cursor-pointer"
                            >
                              <ChevronDown size={14} />
                            </button>
                          </div>
                        </td>

                        {/* Product Info */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img src={p.img || '/assets/product_natural.png'} alt={p.title} className="w-10 h-10 object-contain rounded-lg bg-[#163322]/30 p-1 border border-white/10" />
                            <div>
                              <span className="font-serif font-bold text-[#F8F6F2] block">{p.title}</span>
                              <span className="text-[11px] text-slate-400 font-mono">{p.slug}</span>
                            </div>
                          </div>
                        </td>

                        {/* Weight & Category */}
                        <td className="p-4">
                          <div className="font-mono text-gold font-semibold">{p.weight}</div>
                          <div className="text-[10px] text-slate-400">{p.category || 'Single Pack'}</div>
                        </td>

                        {/* Amazon Purchase Status & Quick Toggle */}
                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleProductAmazon(p)}
                                title={p.amazon_button_enabled ? "Click to turn OFF Amazon button" : "Click to turn ON Amazon button"}
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors ${
                                  p.amazon_button_enabled 
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30' 
                                    : 'bg-slate-800 text-slate-400 border border-white/5 hover:bg-slate-700'
                                }`}
                              >
                                <ShoppingBag size={10} />
                                <span>{p.amazon_button_enabled ? 'AMAZON ON' : 'AMAZON OFF'}</span>
                              </button>

                              {p.amazon_url && (
                                <a
                                  href={p.amazon_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Test Amazon Product Link"
                                  className="text-slate-400 hover:text-gold transition-colors p-1"
                                >
                                  <ExternalLink size={12} />
                                </a>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate max-w-[180px]" title={p.amazon_url || "No Amazon URL set"}>
                              {p.amazon_url ? p.amazon_url.replace(/^https?:\/\//, '') : 'No URL set'}
                            </div>
                          </div>
                        </td>

                        {/* 1-Click Status Toggle */}
                        <td className="p-4">
                          <button
                            onClick={() => toggleProductStatus(p)}
                            title={`Click to set as ${p.status === 'published' ? 'draft' : 'published'}`}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                              p.status === 'published' 
                                ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900/60' 
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                          >
                            {p.status}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setPreviewModal({ open: true, type: 'product', data: p });
                            }}
                            title="Preview in website component"
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-gold transition-colors cursor-pointer"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setProductModalOpen(true);
                            }}
                            title="Edit product"
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => {
                              setDeleteModal({
                                open: true,
                                title: `Delete product "${p.title}"?`,
                                onConfirm: async () => {
                                  await fetch(`/api/products?id=${p.id}`, { method: 'DELETE' });
                                  setProducts(prev => prev.filter(x => x.id !== p.id));
                                  showToast("Product deleted successfully");
                                  setDeleteModal(null);
                                }
                              });
                            }}
                            title="Delete product"
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 3. JOURNAL / BLOG MANAGEMENT TAB */}
        {/* ========================================================= */}
        {activeTab === 'journal' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <h2 className="text-2xl font-serif text-[#F8F6F2] font-bold">The Tea Chronicle (Journal)</h2>
                <p className="text-xs text-slate-400 mt-1">Write, edit, and publish stories on slow living, herbal botanicals, and brewing mindfulness.</p>
              </div>

              <button
                onClick={() => {
                  setEditingJournal({
                    title: "",
                    slug: "",
                    category: "Tea Rituals",
                    readTime: "4 min read",
                    author: "Kindleaf Herbalist",
                    date: "September 2026",
                    coverImage: "/assets/hero_tea_cup.png",
                    excerpt: "",
                    content: ["Write the first paragraph of your story here..."],
                    status: "published",
                    seo_title: "",
                    seo_description: ""
                  });
                  setJournalModalOpen(true);
                }}
                className="bg-gold hover:bg-gold-hover text-[#0c1912] font-semibold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow"
              >
                <Plus size={16} />
                <span>Write New Article</span>
              </button>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {journalArticles
                .filter(a => {
                  return a.title?.toLowerCase().includes(searchQuery.toLowerCase()) || a.category?.toLowerCase().includes(searchQuery.toLowerCase());
                })
                .map(article => (
                  <div key={article.id} className="p-5 rounded-2xl bg-[#0c1912] border border-white/10 space-y-4 flex flex-col justify-between hover:border-gold/30 transition-all">
                    <div className="space-y-3">
                      <div className="aspect-16/9 rounded-xl overflow-hidden bg-black/40 relative">
                        <img src={article.coverImage || '/assets/hero_tea_cup.png'} alt={article.title} className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 bg-[#0c1912]/80 backdrop-blur-md text-gold text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/10">
                          {article.category}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-[#F8F6F2] text-sm leading-snug line-clamp-2">{article.title}</h3>
                      <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed">{article.excerpt}</p>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold ${
                        article.status === 'published' ? 'bg-emerald-900/40 text-emerald-300' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {article.status}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setPreviewModal({ open: true, type: 'journal', data: article })}
                          title="Preview article"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-gold transition-colors"
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          onClick={() => {
                            setEditingJournal(article);
                            setJournalModalOpen(true);
                          }}
                          title="Edit article"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                        >
                          <Edit size={13} />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteModal({
                              open: true,
                              title: `Delete article "${article.title}"?`,
                              onConfirm: async () => {
                                await fetch(`/api/journal?id=${article.id}`, { method: 'DELETE' });
                                setJournalArticles(prev => prev.filter(x => x.id !== article.id));
                                showToast("Article deleted successfully");
                                setDeleteModal(null);
                              }
                            });
                          }}
                          title="Delete article"
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 4. MEDIA LIBRARY TAB */}
        {/* ========================================================= */}
        {activeTab === 'media' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <h2 className="text-2xl font-serif text-[#F8F6F2] font-bold">Media Library</h2>
                <p className="text-xs text-slate-400 mt-1">Upload and manage image assets and ambient audio files for all website sections.</p>
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="bg-gold hover:bg-gold-hover text-[#0c1912] font-semibold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow"
              >
                <Upload size={15} />
                <span>{uploading ? 'Uploading...' : 'Upload Media'}</span>
              </button>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-2 text-xs">
              {(['all', 'image', 'audio'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setMediaTypeFilter(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer ${
                    mediaTypeFilter === t ? 'bg-gold text-[#0c1912] font-bold' : 'text-slate-400 hover:text-white bg-white/5'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Media Items Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {mediaItems
                .filter(m => {
                  if (mediaTypeFilter === 'image') return m.mime_type?.startsWith('image/') || m.url?.match(/\.(png|jpg|jpeg|webp|svg)$/i);
                  if (mediaTypeFilter === 'audio') return m.mime_type?.startsWith('audio/') || m.url?.match(/\.(mp3|mpeg|wav|ogg|m4a)$/i);
                  return true;
                })
                .map(item => {
                  const isAudio = item.mime_type?.startsWith('audio/') || item.url?.match(/\.(mp3|mpeg|wav|ogg|m4a)$/i);
                  return (
                    <div key={item.id} className="p-3 rounded-2xl bg-[#0c1912] border border-white/10 space-y-2 flex flex-col justify-between group hover:border-gold/30 transition-all">
                      <div className="aspect-square rounded-xl bg-black/40 flex items-center justify-center overflow-hidden relative">
                        {isAudio ? (
                          <div className="flex flex-col items-center gap-2 text-gold">
                            <Music size={28} />
                            <span className="text-[10px] text-slate-400 font-mono">Audio Clip</span>
                          </div>
                        ) : (
                          <img src={item.url} alt={item.filename} className="max-h-full max-w-full object-contain p-2" />
                        )}
                      </div>

                      <div>
                        <span className="text-xs font-medium text-[#F8F6F2] truncate block" title={item.filename}>{item.filename}</span>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          {item.size ? `${(item.size / 1024).toFixed(1)} KB` : 'Local Asset'}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(item.url);
                            showToast("Copied URL to clipboard!");
                          }}
                          className="text-[11px] text-gold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Copy size={11} /> Copy URL
                        </button>
                        <button
                          onClick={() => {
                            setDeleteModal({
                              open: true,
                              title: `Delete media "${item.filename}"?`,
                              onConfirm: async () => {
                                await fetch(`/api/media?id=${item.id}`, { method: 'DELETE' });
                                setMediaItems(prev => prev.filter(x => x.id !== item.id));
                                showToast("Media file removed");
                                setDeleteModal(null);
                              }
                            });
                          }}
                          className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 5. OFFERS & PROMOTIONS TAB */}
        {/* ========================================================= */}
        {activeTab === 'offers' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <h2 className="text-2xl font-serif text-[#F8F6F2] font-bold">Promotional Banners &amp; Offers</h2>
                <p className="text-xs text-slate-400 mt-1">Configure announcement banners with app download calls to action (no web checkout).</p>
              </div>

              <button
                onClick={() => {
                  setEditingOffer({
                    title: "Special Harvest Offering",
                    description: "Handcrafted in small batches in Jasrana. Available exclusively via the Kindleaf App.",
                    cta_text: "GET THE KINDLEAF APP",
                    cta_link: "#get-the-app",
                    start_date: new Date().toISOString().split('T')[0],
                    end_date: "2026-12-31",
                    active: true,
                    priority: 1,
                    status: "published"
                  });
                  setOfferModalOpen(true);
                }}
                className="bg-gold hover:bg-gold-hover text-[#0c1912] font-semibold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow"
              >
                <Plus size={16} />
                <span>Create Offer Banner</span>
              </button>
            </div>

            <div className="space-y-4">
              {offers.map(offer => (
                <div key={offer.id} className="p-6 rounded-2xl bg-[#0c1912] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-gold/30 transition-all">
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-2.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        offer.active ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {offer.active ? 'Active & Displaying' : 'Paused'}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">Until {offer.end_date || 'No expiry'}</span>
                    </div>

                    <h3 className="font-serif font-bold text-lg text-[#F8F6F2]">{offer.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{offer.description}</p>
                    
                    <div className="flex items-center gap-3 pt-1">
                      <span className="text-xs font-semibold text-gold bg-gold/10 px-3 py-1 rounded-lg border border-gold/20">
                        CTA: {offer.cta_text || 'GET THE KINDLEAF APP'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => setPreviewModal({ open: true, type: 'offer', data: offer })}
                      className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 hover:text-gold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye size={14} /> Preview
                    </button>
                    <button
                      onClick={() => {
                        setEditingOffer(offer);
                        setOfferModalOpen(true);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit size={14} /> Edit
                    </button>
                    <button
                      onClick={() => {
                        setDeleteModal({
                          open: true,
                          title: `Delete offer "${offer.title}"?`,
                          onConfirm: async () => {
                            await fetch(`/api/offers?id=${offer.id}`, { method: 'DELETE' });
                            setOffers(prev => prev.filter(x => x.id !== offer.id));
                            showToast("Offer removed");
                            setDeleteModal(null);
                          }
                        });
                      }}
                      className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 6. HOMEPAGE CONTENT TAB */}
        {/* ========================================================= */}
        {activeTab === 'homepage' && (
          <div className="space-y-8 max-w-4xl">
            <div className="border-b border-white/10 pb-6">
              <h2 className="text-2xl font-serif text-[#F8F6F2] font-bold">Homepage Content Editor</h2>
              <p className="text-xs text-slate-400 mt-1">Update headline text, hero copy, and philosophy statements. The approved frontend presentation remains untouched.</p>
            </div>

            {/* Hero Editor */}
            <div className="p-6 rounded-2xl bg-[#0c1912] border border-white/10 space-y-4">
              <h3 className="font-serif font-bold text-base text-gold flex items-center gap-2">
                <span>1. Hero Section</span>
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Headline Badge / Tag</label>
                  <input
                    type="text"
                    value={homepageContent?.hero?.tag || ""}
                    onChange={(e) => setHomepageContent({
                      ...homepageContent,
                      hero: { ...homepageContent.hero, tag: e.target.value }
                    })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#F8F6F2] outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Main Heading</label>
                  <input
                    type="text"
                    value={homepageContent?.hero?.heading || ""}
                    onChange={(e) => setHomepageContent({
                      ...homepageContent,
                      hero: { ...homepageContent.hero, heading: e.target.value }
                    })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#F8F6F2] outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Hero Description Paragraph</label>
                  <textarea
                    rows={3}
                    value={homepageContent?.hero?.description || ""}
                    onChange={(e) => setHomepageContent({
                      ...homepageContent,
                      hero: { ...homepageContent.hero, description: e.target.value }
                    })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#F8F6F2] outline-none focus:border-gold leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Primary CTA Button</label>
                    <input
                      type="text"
                      value={homepageContent?.hero?.primary_btn_text || "GET THE KINDLEAF APP"}
                      onChange={(e) => setHomepageContent({
                        ...homepageContent,
                        hero: { ...homepageContent.hero, primary_btn_text: e.target.value }
                      })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F6F2] outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Secondary Button</label>
                    <input
                      type="text"
                      value={homepageContent?.hero?.secondary_btn_text || "EXPLORE THE BLEND"}
                      onChange={(e) => setHomepageContent({
                        ...homepageContent,
                        hero: { ...homepageContent.hero, secondary_btn_text: e.target.value }
                      })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F6F2] outline-none focus:border-gold"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Philosophy Editor */}
            <div className="p-6 rounded-2xl bg-[#0c1912] border border-white/10 space-y-4">
              <h3 className="font-serif font-bold text-base text-gold">2. Philosophy &amp; Slow Living</h3>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Slow Living Heading</label>
                  <input
                    type="text"
                    value={homepageContent?.slow_living?.heading || ""}
                    onChange={(e) => setHomepageContent({
                      ...homepageContent,
                      slow_living: { ...homepageContent.slow_living, heading: e.target.value }
                    })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#F8F6F2] outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Slow Living Narrative</label>
                  <textarea
                    rows={3}
                    value={homepageContent?.slow_living?.description || ""}
                    onChange={(e) => setHomepageContent({
                      ...homepageContent,
                      slow_living: { ...homepageContent.slow_living, description: e.target.value }
                    })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#F8F6F2] outline-none focus:border-gold leading-relaxed"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={async () => {
                  await fetch('/api/homepage', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ key: 'homepage_content', content: homepageContent })
                  });
                  showToast("Homepage content published to live website!");
                }}
                className="bg-gold hover:bg-gold-hover text-[#0c1912] font-semibold px-8 py-3 rounded-xl text-xs transition-all cursor-pointer shadow-lg"
              >
                Save &amp; Publish Homepage Changes
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 7. BOTANICAL INGREDIENTS TAB */}
        {/* ========================================================= */}
        {activeTab === 'ingredients' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <h2 className="text-2xl font-serif text-[#F8F6F2] font-bold">Botanical Ingredients</h2>
                <p className="text-xs text-slate-400 mt-1">Manage the 4 core botanicals and add seasonal herbs without touching code.</p>
              </div>

              <button
                onClick={() => {
                  setEditingIngredient({
                    name: "",
                    botanical: "",
                    role: "Botanical Herb",
                    flavorAroma: "",
                    details: "",
                    icon: "🍃",
                    notes: ["Natural Aroma", "Pure Herb"],
                    image: "/assets/hero_tea_cup.png",
                    display_order: ingredients.length + 1,
                    status: "published"
                  });
                  setIngredientModalOpen(true);
                }}
                className="bg-gold hover:bg-gold-hover text-[#0c1912] font-semibold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow"
              >
                <Plus size={16} />
                <span>Add Botanical</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {ingredients.map(ing => (
                <div key={ing.id || ing.key} className="p-6 rounded-2xl bg-[#0c1912] border border-white/10 space-y-4 flex flex-col justify-between hover:border-gold/30 transition-all">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{ing.icon || "🍃"}</span>
                      <span className="text-gold font-mono text-xs">#{ing.number || ing.display_order}</span>
                    </div>

                    <div>
                      <h3 className="font-serif font-bold text-base text-[#F8F6F2]">{ing.name}</h3>
                      <p className="text-gold text-xs italic font-serif">{ing.botanical}</p>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">{ing.flavorAroma}</p>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setEditingIngredient(ing);
                        setIngredientModalOpen(true);
                      }}
                      className="text-xs text-gold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Edit size={13} /> Edit Details
                    </button>
                    <button
                      onClick={() => {
                        setDeleteModal({
                          open: true,
                          title: `Delete botanical "${ing.name}"?`,
                          onConfirm: async () => {
                            await fetch(`/api/ingredients?id=${ing.id}`, { method: 'DELETE' });
                            setIngredients(prev => prev.filter(x => x.id !== ing.id));
                            showToast("Botanical deleted");
                            setDeleteModal(null);
                          }
                        });
                      }}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 8. BREWING GUIDE TAB */}
        {/* ========================================================= */}
        {activeTab === 'brewing' && (
          <div className="space-y-8 max-w-4xl">
            <div className="border-b border-white/10 pb-6">
              <h2 className="text-2xl font-serif text-[#F8F6F2] font-bold">Brewing Guide &amp; Audio Manager</h2>
              <p className="text-xs text-slate-400 mt-1">Configure the 4 steeping steps, water temperature, tips, and the background ambient audio track.</p>
            </div>

            {/* Brewing Details */}
            <div className="p-6 rounded-2xl bg-[#0c1912] border border-white/10 space-y-4">
              <h3 className="font-serif font-bold text-base text-gold">1. Steeping Parameters</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Serving Size</label>
                  <input
                    type="text"
                    value={brewingGuide?.serving_size || "1 teaspoon (~2g)"}
                    onChange={(e) => setBrewingGuide({ ...brewingGuide, serving_size: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F6F2] outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Water Temperature</label>
                  <input
                    type="text"
                    value={brewingGuide?.water_temp || "Approx. 85°C"}
                    onChange={(e) => setBrewingGuide({ ...brewingGuide, water_temp: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F6F2] outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Steeping Duration</label>
                  <input
                    type="text"
                    value={brewingGuide?.steep_time || "3 to 5 minutes covered"}
                    onChange={(e) => setBrewingGuide({ ...brewingGuide, steep_time: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F6F2] outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Ambient Audio Track URL</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={brewingGuide?.audio_url || "/audio/brewing-ambient.mpeg"}
                    onChange={(e) => setBrewingGuide({ ...brewingGuide, audio_url: e.target.value })}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F6F2] font-mono outline-none focus:border-gold"
                  />
                  <button
                    onClick={() => openMediaPicker((url) => setBrewingGuide({ ...brewingGuide, audio_url: url }))}
                    className="px-4 py-2 rounded-xl bg-gold/10 hover:bg-gold/20 text-gold text-xs font-semibold border border-gold/30 cursor-pointer"
                  >
                    Select Audio
                  </button>
                </div>
              </div>
            </div>

            {/* Steeping Steps */}
            <div className="p-6 rounded-2xl bg-[#0c1912] border border-white/10 space-y-4">
              <h3 className="font-serif font-bold text-base text-gold">2. 4-Step Steeping Instructions</h3>

              <div className="space-y-4">
                {(brewingGuide?.steps || []).map((step: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-gold font-bold text-xs">{step.num || `0${idx + 1}`}</span>
                      <input
                        type="text"
                        value={step.title}
                        onChange={(e) => {
                          const newSteps = [...brewingGuide.steps];
                          newSteps[idx].title = e.target.value;
                          setBrewingGuide({ ...brewingGuide, steps: newSteps });
                        }}
                        className="flex-1 bg-transparent border-b border-white/10 pb-1 text-xs font-semibold text-[#F8F6F2] outline-none focus:border-gold"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={step.summary}
                      onChange={(e) => {
                        const newSteps = [...brewingGuide.steps];
                        newSteps[idx].summary = e.target.value;
                        setBrewingGuide({ ...brewingGuide, steps: newSteps });
                      }}
                      className="w-full bg-transparent text-xs text-slate-300 leading-relaxed outline-none border border-white/5 rounded-lg p-2"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={async () => {
                  await fetch('/api/brewing', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(brewingGuide)
                  });
                  showToast("Brewing guide updated and published!");
                }}
                className="bg-gold hover:bg-gold-hover text-[#0c1912] font-semibold px-8 py-3 rounded-xl text-xs transition-all cursor-pointer shadow-lg"
              >
                Save &amp; Publish Brewing Guide
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 9. OUR STORY TAB */}
        {/* ========================================================= */}
        {activeTab === 'story' && (
          <div className="space-y-8 max-w-4xl">
            <div className="border-b border-white/10 pb-6">
              <h2 className="text-2xl font-serif text-[#F8F6F2] font-bold">Our Story &amp; Heritage</h2>
              <p className="text-xs text-slate-400 mt-1">Manage the narrative of Gaurav Singh, Jasrana origins, and the 4 trust badges.</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0c1912] border border-white/10 space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Story Heading</label>
                  <input
                    type="text"
                    value={ourStory?.heading || "A Small Dream from a Soldier’s Home"}
                    onChange={(e) => setOurStory({ ...ourStory, heading: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#F8F6F2] outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Story Paragraph 1 (Roots)</label>
                  <textarea
                    rows={3}
                    value={ourStory?.story_p1 || ""}
                    onChange={(e) => setOurStory({ ...ourStory, story_p1: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#F8F6F2] outline-none focus:border-gold leading-relaxed"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Story Paragraph 2 (Integrity)</label>
                  <textarea
                    rows={3}
                    value={ourStory?.story_p2 || ""}
                    onChange={(e) => setOurStory({ ...ourStory, story_p2: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#F8F6F2] outline-none focus:border-gold leading-relaxed"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Founder Principle Quote</label>
                  <textarea
                    rows={2}
                    value={ourStory?.founder_quote || ""}
                    onChange={(e) => setOurStory({ ...ourStory, founder_quote: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#F8F6F2] outline-none focus:border-gold leading-relaxed"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={async () => {
                  await fetch('/api/story', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(ourStory)
                  });
                  showToast("Our Story updated successfully!");
                }}
                className="bg-gold hover:bg-gold-hover text-[#0c1912] font-semibold px-8 py-3 rounded-xl text-xs transition-all cursor-pointer shadow-lg"
              >
                Save &amp; Publish Story Changes
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 10. FAQS TAB */}
        {/* ========================================================= */}
        {activeTab === 'faqs' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <h2 className="text-2xl font-serif text-[#F8F6F2] font-bold">Frequently Asked Questions</h2>
                <p className="text-xs text-slate-400 mt-1">Add and reorder public FAQs. Published items appear on the homepage accordion.</p>
              </div>

              <button
                onClick={() => {
                  setEditingFaq({
                    question: "",
                    answer: "",
                    category: "General",
                    display_order: faqs.length + 1,
                    status: "published"
                  });
                  setFaqModalOpen(true);
                }}
                className="bg-gold hover:bg-gold-hover text-[#0c1912] font-semibold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow"
              >
                <Plus size={16} />
                <span>Add FAQ</span>
              </button>
            </div>

            <div className="space-y-3">
              {faqs.map(faq => (
                <div key={faq.id} className="p-5 rounded-2xl bg-[#0c1912] border border-white/10 space-y-2 hover:border-gold/30 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-gold tracking-wider">{faq.category || "General"}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingFaq(faq);
                          setFaqModalOpen(true);
                        }}
                        className="text-slate-400 hover:text-white p-1 cursor-pointer"
                      >
                        <Edit size={13} />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteModal({
                            open: true,
                            title: `Delete FAQ "${faq.question}"?`,
                            onConfirm: async () => {
                              await fetch(`/api/faqs?id=${faq.id}`, { method: 'DELETE' });
                              setFaqs(prev => prev.filter(x => x.id !== faq.id));
                              showToast("FAQ removed");
                              setDeleteModal(null);
                            }
                          });
                        }}
                        className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-serif font-bold text-sm text-[#F8F6F2]">{faq.question}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 11. LEGAL HUB TAB */}
        {/* ========================================================= */}
        {activeTab === 'legal' && (
          <div className="space-y-8 max-w-4xl">
            <div className="border-b border-white/10 pb-6">
              <h2 className="text-2xl font-serif text-[#F8F6F2] font-bold">Legal &amp; Transparency Policy Hub</h2>
              <p className="text-xs text-slate-400 mt-1">Manage Privacy Policy, Terms &amp; Conditions, Shipping, Refund, and Medical Disclaimers.</p>
            </div>

            <div className="space-y-6">
              {['privacy_policy', 'terms_conditions', 'shipping_policy', 'refund_policy', 'medical_disclaimer'].map((docKey) => {
                const doc = legalContent?.[docKey] || {};
                const titleMap: any = {
                  privacy_policy: "Privacy Policy",
                  terms_conditions: "Terms & Conditions",
                  shipping_policy: "Shipping & Delivery Policy",
                  refund_policy: "Refund & Return Policy",
                  medical_disclaimer: "Medical & Health Disclaimer"
                };

                return (
                  <div key={docKey} className="p-6 rounded-2xl bg-[#0c1912] border border-white/10 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <h3 className="font-serif font-bold text-base text-[#F8F6F2]">{titleMap[docKey]}</h3>
                      <span className="text-[10px] text-slate-400">Last updated: {doc.last_updated || 'August 2026'}</span>
                    </div>

                    <div className="space-y-3">
                      {(doc.sections || []).map((sec: any, sIdx: number) => (
                        <div key={sIdx} className="p-3.5 rounded-xl bg-white/5 space-y-2">
                          <input
                            type="text"
                            value={sec.title}
                            onChange={(e) => {
                              const updated = { ...legalContent };
                              updated[docKey].sections[sIdx].title = e.target.value;
                              setLegalContent(updated);
                            }}
                            className="w-full bg-transparent text-xs font-bold text-gold outline-none border-b border-white/10 pb-1"
                          />
                          <textarea
                            rows={3}
                            value={sec.content}
                            onChange={(e) => {
                              const updated = { ...legalContent };
                              updated[docKey].sections[sIdx].content = e.target.value;
                              setLegalContent(updated);
                            }}
                            className="w-full bg-transparent text-xs text-slate-300 leading-relaxed outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end">
              <button
                onClick={async () => {
                  await fetch('/api/legal', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(legalContent)
                  });
                  showToast("Legal documents updated on live site!");
                }}
                className="bg-gold hover:bg-gold-hover text-[#0c1912] font-semibold px-8 py-3 rounded-xl text-xs transition-all cursor-pointer shadow-lg"
              >
                Save &amp; Publish Legal Hub
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 12. SEO METADATA TAB */}
        {/* ========================================================= */}
        {activeTab === 'seo' && (
          <div className="space-y-8 max-w-4xl">
            <div className="border-b border-white/10 pb-6">
              <h2 className="text-2xl font-serif text-[#F8F6F2] font-bold">SEO &amp; Social Meta Management</h2>
              <p className="text-xs text-slate-400 mt-1">Configure search titles, meta descriptions, and OG share images for Google and social previews.</p>
            </div>

            {['home', 'journal', 'legal'].map(page => (
              <div key={page} className="p-6 rounded-2xl bg-[#0c1912] border border-white/10 space-y-4">
                <h3 className="font-serif font-bold text-base text-gold uppercase tracking-wider text-xs">
                  {page} Page SEO
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">SEO Title Tag</label>
                    <input
                      type="text"
                      value={seoSettings?.[page]?.title || ""}
                      onChange={(e) => setSeoSettings({
                        ...seoSettings,
                        [page]: { ...seoSettings[page], title: e.target.value }
                      })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F6F2] outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Meta Description</label>
                    <textarea
                      rows={2}
                      value={seoSettings?.[page]?.description || ""}
                      onChange={(e) => setSeoSettings({
                        ...seoSettings,
                        [page]: { ...seoSettings[page], description: e.target.value }
                      })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F6F2] outline-none focus:border-gold leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-end">
              <button
                onClick={async () => {
                  await fetch('/api/seo', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(seoSettings)
                  });
                  showToast("SEO settings updated!");
                }}
                className="bg-gold hover:bg-gold-hover text-[#0c1912] font-semibold px-8 py-3 rounded-xl text-xs transition-all cursor-pointer shadow-lg"
              >
                Save SEO Metadata
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 13. APP SETTINGS TAB */}
        {/* ========================================================= */}
        {activeTab === 'app' && (
          <div className="space-y-8 max-w-4xl">
            <div className="border-b border-white/10 pb-6">
              <h2 className="text-2xl font-serif text-[#F8F6F2] font-bold">App Store &amp; Deep Link Settings</h2>
              <p className="text-xs text-slate-400 mt-1">Manage official application links and default download button copy without editing code.</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0c1912] border border-white/10 space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Application Name</label>
                  <input
                    type="text"
                    value={appSettings?.app_name || "Kindleaf: Handcrafted Herbal Tea"}
                    onChange={(e) => setAppSettings({ ...appSettings, app_name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F6F2] outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Custom Deep Link Scheme</label>
                  <input
                    type="text"
                    value={appSettings?.deep_link || "kindleaf://open"}
                    onChange={(e) => setAppSettings({ ...appSettings, deep_link: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F6F2] font-mono outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Google Play Store URL</label>
                  <input
                    type="text"
                    value={appSettings?.play_store_url || ""}
                    onChange={(e) => setAppSettings({ ...appSettings, play_store_url: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F6F2] font-mono outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Apple App Store URL</label>
                  <input
                    type="text"
                    value={appSettings?.app_store_url || ""}
                    onChange={(e) => setAppSettings({ ...appSettings, app_store_url: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F6F2] font-mono outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Default App CTA Button Label</label>
                  <input
                    type="text"
                    value={appSettings?.default_cta || "GET THE KINDLEAF APP"}
                    onChange={(e) => setAppSettings({ ...appSettings, default_cta: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F6F2] outline-none focus:border-gold"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={async () => {
                  await fetch('/api/settings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ key: 'app_settings', value: appSettings })
                  });
                  showToast("App settings updated successfully!");
                }}
                className="bg-gold hover:bg-gold-hover text-[#0c1912] font-semibold px-8 py-3 rounded-xl text-xs transition-all cursor-pointer shadow-lg"
              >
                Save App Settings
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 14. SOCIAL LINKS TAB */}
        {/* ========================================================= */}
        {activeTab === 'social' && (
          <div className="space-y-8 max-w-4xl">
            <div className="border-b border-white/10 pb-6">
              <h2 className="text-2xl font-serif text-[#F8F6F2] font-bold">Social Media Channels</h2>
              <p className="text-xs text-slate-400 mt-1">Update external brand links displayed in the footer and contact sections.</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0c1912] border border-white/10 space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Facebook Page URL</label>
                  <input
                    type="text"
                    value={socialLinks?.facebook_url || "https://www.facebook.com/share/1EELT4gBjW/"}
                    onChange={(e) => setSocialLinks({ ...socialLinks, facebook_url: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F6F2] font-mono outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Instagram URL</label>
                  <input
                    type="text"
                    value={socialLinks?.instagram_url || "https://instagram.com/kindleaf.wellness"}
                    onChange={(e) => setSocialLinks({ ...socialLinks, instagram_url: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F6F2] font-mono outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">WhatsApp Customer Desk Number</label>
                  <input
                    type="text"
                    value={socialLinks?.whatsapp_phone || "916396461480"}
                    onChange={(e) => setSocialLinks({ ...socialLinks, whatsapp_phone: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F6F2] font-mono outline-none focus:border-gold"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={async () => {
                  await fetch('/api/settings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ key: 'social_links', value: socialLinks })
                  });
                  showToast("Social links updated across the website!");
                }}
                className="bg-gold hover:bg-gold-hover text-[#0c1912] font-semibold px-8 py-3 rounded-xl text-xs transition-all cursor-pointer shadow-lg"
              >
                Save Social Links
              </button>
            </div>
          </div>
        )}

      </main>

      {/* ========================================================= */}
      {/* GLOBAL REUSABLE MODALS */}
      {/* ========================================================= */}

      {/* 1. MEDIA PICKER MODAL */}
      <AnimatePresence>
        {mediaPickerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMediaPickerOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-3xl bg-[#0c1912] border border-white/15 rounded-3xl p-6 shadow-2xl z-10 max-h-[85vh] flex flex-col">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#F8F6F2]">Select from Media Library</h3>
                  <p className="text-xs text-slate-400">Choose an existing media file or upload a new one directly</p>
                </div>
                <button onClick={() => setMediaPickerOpen(false)} className="p-2 text-slate-400 hover:text-white cursor-pointer"><X size={18} /></button>
              </div>

              <div className="py-4 flex items-center justify-between gap-4">
                <input
                  type="file"
                  onChange={(e) => handleFileUpload(e)}
                  className="text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-gold file:text-[#0c1912] hover:file:bg-gold-hover cursor-pointer"
                />
              </div>

              <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-1">
                {mediaItems.map(item => (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (mediaPickerCallback) mediaPickerCallback(item.url);
                      setMediaPickerOpen(false);
                    }}
                    className="p-2 rounded-xl bg-white/5 hover:bg-[#163322] border border-white/10 hover:border-gold cursor-pointer transition-all flex flex-col justify-between group"
                  >
                    <div className="aspect-square rounded-lg bg-black/30 flex items-center justify-center overflow-hidden">
                      {item.mime_type?.startsWith('audio/') ? <Music size={24} className="text-gold" /> : <img src={item.url} alt={item.filename} className="max-h-full max-w-full object-contain" />}
                    </div>
                    <span className="text-[11px] text-slate-300 truncate mt-2 block group-hover:text-gold">{item.filename}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. DELETE SAFETY CONFIRMATION MODAL */}
      <AnimatePresence>
        {deleteModal?.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteModal(null)} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-[#0e2417] border border-red-500/30 rounded-2xl p-6 shadow-2xl z-10 space-y-4">
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                <AlertTriangle size={22} />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-[#F8F6F2]">{deleteModal.title}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">This action cannot be undone. The content will be immediately removed from the live website.</p>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button onClick={() => setDeleteModal(null)} className="px-4 py-2 rounded-xl text-xs text-slate-300 hover:text-white bg-white/5 cursor-pointer">Cancel</button>
                <button onClick={deleteModal.onConfirm} className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 cursor-pointer shadow">Confirm Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. PRODUCT EDIT / ADD MODAL */}
      <AnimatePresence>
        {productModalOpen && editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setProductModalOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-4xl bg-[#0c1912] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 max-h-[92vh] overflow-y-auto space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="font-serif font-bold text-xl text-[#F8F6F2]">
                    {editingProduct.id ? 'Edit Product' : 'Add New Product'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Manage public product listing, Amazon purchase button, and botanical details.</p>
                </div>
                <button onClick={() => setProductModalOpen(false)} className="p-2 text-slate-400 hover:text-white cursor-pointer"><X size={20} /></button>
              </div>

              {/* Basic Details */}
              <div className="space-y-4">
                <span className="text-[11px] uppercase font-bold text-gold tracking-wider block">1. Basic Information</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Product Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Chamomile &amp; Rose Calming Blend"
                      value={editingProduct.title || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F6F2] outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Slug (URL identifier)</label>
                    <input
                      type="text"
                      placeholder="e.g. chamomile-rose"
                      value={editingProduct.slug || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, slug: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F6F2] outline-none focus:border-gold font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Net Weight / Pack Size</label>
                    <input
                      type="text"
                      placeholder="e.g. 50g Pouch"
                      value={editingProduct.weight || "50g Pouch"}
                      onChange={(e) => setEditingProduct({ ...editingProduct, weight: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F6F2] outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Variant / Category</label>
                    <input
                      type="text"
                      placeholder="e.g. Single Pack or Loose Leaf"
                      value={editingProduct.category || "Single Pack"}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F6F2] outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Short Description (Summary for cards &amp; modal)</label>
                  <input
                    type="text"
                    placeholder="e.g. A serene botanical infusion of whole chamomile flowers and gentle roses."
                    value={editingProduct.short_description || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, short_description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F6F2] outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Full Description</label>
                  <textarea
                    rows={3}
                    placeholder="Full product story, wellness benefits, and background."
                    value={editingProduct.description || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F6F2] outline-none focus:border-gold leading-relaxed"
                  />
                </div>
              </div>

              {/* Amazon Purchase Integration Section */}
              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag size={16} className="text-amber-400" />
                    <span className="text-xs uppercase font-bold text-amber-300 tracking-wider">2. Amazon Purchase Button Settings</span>
                  </div>
                  <label className="flex items-center gap-2 text-xs text-amber-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.amazon_button_enabled !== false}
                      onChange={(e) => setEditingProduct({ ...editingProduct, amazon_button_enabled: e.target.checked })}
                      className="rounded text-gold focus:ring-0"
                    />
                    <span className="font-semibold">Enable Amazon Button: ON</span>
                  </label>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Amazon Product URL</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      placeholder="https://www.amazon.in/dp/..."
                      value={editingProduct.amazon_url || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, amazon_url: e.target.value })}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F6F2] outline-none focus:border-gold font-mono"
                    />
                    {editingProduct.amazon_url && (
                      <a
                        href={editingProduct.amazon_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs flex items-center gap-1 transition-colors"
                      >
                        <ExternalLink size={12} />
                        <span>Test Link</span>
                      </a>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    When enabled with a valid URL, visitors will see the prominent &ldquo;BUY ON AMAZON&rdquo; button opening in a new tab. When empty or disabled, the button is omitted cleanly.
                  </p>
                </div>
              </div>

              {/* Botanicals, Notes & Brewing Specs */}
              <div className="space-y-4">
                <span className="text-[11px] uppercase font-bold text-gold tracking-wider block">3. Botanical Formulation &amp; Brewing Specifications</span>
                
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Botanical Ingredients (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Rose petals, Chamomile flowers, French Lavender, Spearmint leaf"
                    value={Array.isArray(editingProduct.ingredients) ? editingProduct.ingredients.join(', ') : (editingProduct.ingredients || "")}
                    onChange={(e) => setEditingProduct({ ...editingProduct, ingredients: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F6F2] outline-none focus:border-gold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Taste Profile Notes</label>
                    <input
                      type="text"
                      placeholder="e.g. Floral, gentle honey-like sweetness, velvety finish"
                      value={editingProduct.taste_profile || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, taste_profile: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F6F2] outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Aroma Notes</label>
                    <input
                      type="text"
                      placeholder="e.g. Delicate blooming roses and fresh herbal meadow"
                      value={editingProduct.aroma || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, aroma: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F6F2] outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Brewing Summary</label>
                    <input
                      type="text"
                      placeholder="e.g. 85°C water • 1 tsp (~2g) • 3-5 mins covered"
                      value={editingProduct.brewing_summary || "85°C water • 1 tsp (~2g) • 3-5 mins covered"}
                      onChange={(e) => setEditingProduct({ ...editingProduct, brewing_summary: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F6F2] outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">FSSAI Status / Regulatory</label>
                    <input
                      type="text"
                      placeholder="e.g. FSSAI Licensed Food Business"
                      value={editingProduct.fssai_info || "FSSAI Licensed Food Business"}
                      onChange={(e) => setEditingProduct({ ...editingProduct, fssai_info: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F6F2] outline-none focus:border-gold"
                    />
                  </div>
                </div>
              </div>

              {/* Product Media & Gallery */}
              <div className="space-y-4">
                <span className="text-[11px] uppercase font-bold text-gold tracking-wider block">4. Imagery &amp; Gallery</span>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Main Product Image URL</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={editingProduct.img || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, img: e.target.value })}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F6F2] outline-none focus:border-gold font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => openMediaPicker((url) => setEditingProduct({ ...editingProduct, img: url }))}
                      className="px-4 py-2 rounded-xl bg-gold/10 hover:bg-gold/20 text-gold text-xs font-semibold border border-gold/30 cursor-pointer"
                    >
                      Select Media
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-300">Product Gallery Images</label>
                    <button
                      type="button"
                      onClick={() => openMediaPicker((url) => {
                        const current = Array.isArray(editingProduct.images) ? [...editingProduct.images] : [];
                        setEditingProduct({ ...editingProduct, images: [...current, url] });
                      })}
                      className="text-xs text-gold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={12} /> Add from Media Library
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3 p-3 rounded-xl bg-white/5 border border-white/10 min-h-[70px]">
                    {(Array.isArray(editingProduct.images) ? editingProduct.images : []).map((imgUrl: string, gIdx: number) => (
                      <div key={gIdx} className="relative group w-16 h-16 rounded-lg overflow-hidden border border-white/20 bg-black/40">
                        <img src={imgUrl} alt={`Gallery ${gIdx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            const copy = [...editingProduct.images];
                            copy.splice(gIdx, 1);
                            setEditingProduct({ ...editingProduct, images: copy });
                          }}
                          className="absolute inset-0 bg-black/70 flex items-center justify-center text-red-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    {(!editingProduct.images || editingProduct.images.length === 0) && (
                      <span className="text-xs text-slate-500 italic flex items-center">No extra gallery images added.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Publishing & SEO */}
              <div className="space-y-4">
                <span className="text-[11px] uppercase font-bold text-gold tracking-wider block">5. Organization, SEO &amp; Status</span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Display Order</label>
                    <input
                      type="number"
                      value={editingProduct.display_order ?? 0}
                      onChange={(e) => setEditingProduct({ ...editingProduct, display_order: parseInt(e.target.value) || 0 })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F6F2] outline-none focus:border-gold font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">SEO Title (Optional)</label>
                    <input
                      type="text"
                      placeholder="Meta title for Google"
                      value={editingProduct.seo_title || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, seo_title: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F6F2] outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">SEO Description (Optional)</label>
                    <input
                      type="text"
                      placeholder="Meta description"
                      value={editingProduct.seo_description || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, seo_description: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F6F2] outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.status === 'published'}
                      onChange={(e) => setEditingProduct({ ...editingProduct, status: e.target.checked ? 'published' : 'draft' })}
                      className="rounded text-gold focus:ring-0"
                    />
                    <span className="font-semibold text-[#F8F6F2]">Published on Live Website</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.featured || false}
                      onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                      className="rounded text-gold focus:ring-0"
                    />
                    <span>Featured Product</span>
                  </label>
                </div>
              </div>

              {/* Footer Save & Cancel */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button onClick={() => setProductModalOpen(false)} className="px-5 py-2.5 rounded-xl text-xs text-slate-300 hover:text-white bg-white/5 cursor-pointer">Cancel</button>
                <button
                  onClick={async () => {
                    // Normalize ingredients if string
                    let toSave = { ...editingProduct };
                    if (typeof toSave.ingredients === 'string') {
                      toSave.ingredients = toSave.ingredients.split(',').map((s: string) => s.trim()).filter(Boolean);
                    }
                    try {
                      const res = await fetch('/api/products', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(toSave)
                      });
                      const saved = await res.json();
                      setProducts(prev => {
                        const idx = prev.findIndex(p => p.id === saved.id);
                        if (idx >= 0) {
                          const copy = [...prev];
                          copy[idx] = saved;
                          return copy;
                        }
                        return [saved, ...prev];
                      });
                      showToast("Product saved & published!");
                      setProductModalOpen(false);
                    } catch (e: any) {
                      showToast(e.message || "Error saving product", "error");
                    }
                  }}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-[#0c1912] bg-gold hover:bg-gold-hover cursor-pointer shadow"
                >
                  Save &amp; Publish
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. JOURNAL EDIT / ADD MODAL */}
      <AnimatePresence>
        {journalModalOpen && editingJournal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setJournalModalOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-3xl bg-[#0c1912] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="font-serif font-bold text-xl text-[#F8F6F2]">
                  {editingJournal.id ? 'Edit Story / Article' : 'Write New Story'}
                </h3>
                <button onClick={() => setJournalModalOpen(false)} className="p-2 text-slate-400 hover:text-white cursor-pointer"><X size={20} /></button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Article Title</label>
                  <input
                    type="text"
                    value={editingJournal.title || ""}
                    onChange={(e) => setEditingJournal({ ...editingJournal, title: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F6F2] outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Slug</label>
                  <input
                    type="text"
                    value={editingJournal.slug || ""}
                    onChange={(e) => setEditingJournal({ ...editingJournal, slug: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F6F2] outline-none focus:border-gold font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
                  <select
                    value={editingJournal.category || "Tea Rituals"}
                    onChange={(e) => setEditingJournal({ ...editingJournal, category: e.target.value })}
                    className="w-full bg-[#163322] border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F6F2] outline-none focus:border-gold"
                  >
                    <option value="Tea Rituals">Tea Rituals</option>
                    <option value="Herbal Ingredients">Herbal Ingredients</option>
                    <option value="Brewing">Brewing</option>
                    <option value="Kindleaf Story">Kindleaf Story</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Author Name</label>
                  <input
                    type="text"
                    value={editingJournal.author || "Kindleaf Herbalist"}
                    onChange={(e) => setEditingJournal({ ...editingJournal, author: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F6F2] outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Featured Cover Image URL</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={editingJournal.coverImage || ""}
                    onChange={(e) => setEditingJournal({ ...editingJournal, coverImage: e.target.value })}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F6F2] font-mono outline-none focus:border-gold"
                  />
                  <button
                    type="button"
                    onClick={() => openMediaPicker((url) => setEditingJournal({ ...editingJournal, coverImage: url }))}
                    className="px-4 py-2 rounded-xl bg-gold/10 hover:bg-gold/20 text-gold text-xs font-semibold border border-gold/30 cursor-pointer"
                  >
                    Select Media
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Excerpt (Summary)</label>
                <textarea
                  rows={2}
                  value={editingJournal.excerpt || ""}
                  onChange={(e) => setEditingJournal({ ...editingJournal, excerpt: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F6F2] outline-none focus:border-gold leading-relaxed"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Full Content (Each paragraph separated by a blank line)</label>
                <textarea
                  rows={6}
                  value={Array.isArray(editingJournal.content) ? editingJournal.content.join('\n\n') : (editingJournal.content || '')}
                  onChange={(e) => setEditingJournal({
                    ...editingJournal,
                    content: e.target.value.split('\n\n').filter(Boolean)
                  })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F6F2] outline-none focus:border-gold leading-relaxed font-sans"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingJournal.status === 'published'}
                    onChange={(e) => setEditingJournal({ ...editingJournal, status: e.target.checked ? 'published' : 'draft' })}
                    className="rounded text-gold focus:ring-0"
                  />
                  <span>Published in Journal &amp; Homepage</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button onClick={() => setJournalModalOpen(false)} className="px-5 py-2.5 rounded-xl text-xs text-slate-300 hover:text-white bg-white/5 cursor-pointer">Cancel</button>
                <button
                  onClick={async () => {
                    const res = await fetch('/api/journal', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(editingJournal)
                    });
                    const saved = await res.json();
                    setJournalArticles(prev => {
                      const idx = prev.findIndex(a => a.id === saved.id);
                      if (idx >= 0) {
                        const copy = [...prev];
                        copy[idx] = saved;
                        return copy;
                      }
                      return [saved, ...prev];
                    });
                    showToast("Article published successfully!");
                    setJournalModalOpen(false);
                  }}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-[#0c1912] bg-gold hover:bg-gold-hover cursor-pointer shadow"
                >
                  Save &amp; Publish Article
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. OFFER EDIT / ADD MODAL */}
      <AnimatePresence>
        {offerModalOpen && editingOffer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOfferModalOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-xl bg-[#0c1912] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-serif font-bold text-lg text-[#F8F6F2]">
                  {editingOffer.id ? 'Edit Offer Banner' : 'Create Offer Banner'}
                </h3>
                <button onClick={() => setOfferModalOpen(false)} className="p-2 text-slate-400 hover:text-white cursor-pointer"><X size={18} /></button>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Offer Title</label>
                <input
                  type="text"
                  value={editingOffer.title || ""}
                  onChange={(e) => setEditingOffer({ ...editingOffer, title: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F6F2] outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Offer Subtext / Description</label>
                <textarea
                  rows={2}
                  value={editingOffer.description || ""}
                  onChange={(e) => setEditingOffer({ ...editingOffer, description: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F6F2] outline-none focus:border-gold leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Button CTA Text</label>
                  <input
                    type="text"
                    value={editingOffer.cta_text || "GET THE KINDLEAF APP"}
                    onChange={(e) => setEditingOffer({ ...editingOffer, cta_text: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F6F2] outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Button Target Link (URL)</label>
                  <input
                    type="text"
                    placeholder="e.g. Amazon URL, /#app-download, etc."
                    value={editingOffer.cta_link || ""}
                    onChange={(e) => setEditingOffer({ ...editingOffer, cta_link: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F6F2] outline-none focus:border-gold font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">End Date</label>
                <input
                  type="date"
                  value={editingOffer.end_date || ""}
                  onChange={(e) => setEditingOffer({ ...editingOffer, end_date: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F6F2] outline-none focus:border-gold"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingOffer.active !== false}
                    onChange={(e) => setEditingOffer({ ...editingOffer, active: e.target.checked })}
                    className="rounded text-gold focus:ring-0"
                  />
                  <span>Active &amp; Displaying on Homepage</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button onClick={() => setOfferModalOpen(false)} className="px-4 py-2 rounded-xl text-xs text-slate-300 hover:text-white bg-white/5 cursor-pointer">Cancel</button>
                <button
                  onClick={async () => {
                    const res = await fetch('/api/offers', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(editingOffer)
                    });
                    const saved = await res.json();
                    setOffers(prev => {
                      const idx = prev.findIndex(o => o.id === saved.id);
                      if (idx >= 0) {
                        const copy = [...prev];
                        copy[idx] = saved;
                        return copy;
                      }
                      return [saved, ...prev];
                    });
                    showToast("Offer saved successfully!");
                    setOfferModalOpen(false);
                  }}
                  className="px-6 py-2 rounded-xl text-xs font-bold text-[#0c1912] bg-gold hover:bg-gold-hover cursor-pointer shadow"
                >
                  Save &amp; Publish Offer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. BOTANICAL INGREDIENT EDIT MODAL */}
      <AnimatePresence>
        {ingredientModalOpen && editingIngredient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIngredientModalOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-xl bg-[#0c1912] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-serif font-bold text-lg text-[#F8F6F2]">
                  {editingIngredient.id ? 'Edit Botanical' : 'Add Botanical'}
                </h3>
                <button onClick={() => setIngredientModalOpen(false)} className="p-2 text-slate-400 hover:text-white cursor-pointer"><X size={18} /></button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Common Name</label>
                  <input
                    type="text"
                    value={editingIngredient.name || ""}
                    onChange={(e) => setEditingIngredient({ ...editingIngredient, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F6F2] outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Botanical Name (Latin)</label>
                  <input
                    type="text"
                    value={editingIngredient.botanical || ""}
                    onChange={(e) => setEditingIngredient({ ...editingIngredient, botanical: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F6F2] outline-none focus:border-gold font-serif italic"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Role in Blend</label>
                <input
                  type="text"
                  value={editingIngredient.role || ""}
                  onChange={(e) => setEditingIngredient({ ...editingIngredient, role: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F6F2] outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Flavour &amp; Aroma Description</label>
                <textarea
                  rows={2}
                  value={editingIngredient.flavorAroma || ""}
                  onChange={(e) => setEditingIngredient({ ...editingIngredient, flavorAroma: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F6F2] outline-none focus:border-gold leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button onClick={() => setIngredientModalOpen(false)} className="px-4 py-2 rounded-xl text-xs text-slate-300 hover:text-white bg-white/5 cursor-pointer">Cancel</button>
                <button
                  onClick={async () => {
                    const res = await fetch('/api/ingredients', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(editingIngredient)
                    });
                    const saved = await res.json();
                    setIngredients(prev => {
                      const idx = prev.findIndex(i => i.id === saved.id);
                      if (idx >= 0) {
                        const copy = [...prev];
                        copy[idx] = saved;
                        return copy;
                      }
                      return [...prev, saved];
                    });
                    showToast("Botanical saved!");
                    setIngredientModalOpen(false);
                  }}
                  className="px-6 py-2 rounded-xl text-xs font-bold text-[#0c1912] bg-gold hover:bg-gold-hover cursor-pointer shadow"
                >
                  Save Botanical
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. FAQ EDIT MODAL */}
      <AnimatePresence>
        {faqModalOpen && editingFaq && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setFaqModalOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-lg bg-[#0c1912] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-serif font-bold text-lg text-[#F8F6F2]">
                  {editingFaq.id ? 'Edit FAQ' : 'Add FAQ'}
                </h3>
                <button onClick={() => setFaqModalOpen(false)} className="p-2 text-slate-400 hover:text-white cursor-pointer"><X size={18} /></button>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Question</label>
                <input
                  type="text"
                  value={editingFaq.question || ""}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F6F2] outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
                <input
                  type="text"
                  value={editingFaq.category || "General"}
                  onChange={(e) => setEditingFaq({ ...editingFaq, category: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F6F2] outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Answer</label>
                <textarea
                  rows={4}
                  value={editingFaq.answer || ""}
                  onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-[#F8F6F2] outline-none focus:border-gold leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button onClick={() => setFaqModalOpen(false)} className="px-4 py-2 rounded-xl text-xs text-slate-300 hover:text-white bg-white/5 cursor-pointer">Cancel</button>
                <button
                  onClick={async () => {
                    const res = await fetch('/api/faqs', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(editingFaq)
                    });
                    const saved = await res.json();
                    setFaqs(prev => {
                      const idx = prev.findIndex(f => f.id === saved.id);
                      if (idx >= 0) {
                        const copy = [...prev];
                        copy[idx] = saved;
                        return copy;
                      }
                      return [...prev, saved];
                    });
                    showToast("FAQ saved successfully!");
                    setFaqModalOpen(false);
                  }}
                  className="px-6 py-2 rounded-xl text-xs font-bold text-[#0c1912] bg-gold hover:bg-gold-hover cursor-pointer shadow"
                >
                  Save FAQ
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 8. LIVE COMPONENT PREVIEW MODAL */}
      <AnimatePresence>
        {previewModal?.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPreviewModal(null)} className="fixed inset-0 bg-black/85 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-3xl bg-[#0c1912] border border-gold/40 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2 text-gold">
                  <Eye size={18} />
                  <span className="font-serif font-bold text-base text-[#F8F6F2]">Component Preview</span>
                </div>
                <button onClick={() => setPreviewModal(null)} className="p-2 text-slate-400 hover:text-white cursor-pointer"><X size={20} /></button>
              </div>

              {previewModal.type === 'product' && (
                <div className="p-6 rounded-2xl bg-[#0e2417] border border-white/10 space-y-4">
                  <div className="flex items-center gap-6">
                    <img src={previewModal.data.img || '/assets/product_natural.png'} alt={previewModal.data.title} className="w-24 h-24 object-contain rounded-xl bg-[#0c1912] p-2 border border-white/10" />
                    <div>
                      <span className="text-gold text-xs font-semibold uppercase">{previewModal.data.category || "Herbal Tea"}</span>
                      <h4 className="font-serif font-bold text-xl text-[#F8F6F2]">{previewModal.data.title}</h4>
                      <p className="text-xs text-slate-400 mt-1 font-mono">Net Wt: {previewModal.data.weight}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{previewModal.data.description}</p>
                </div>
              )}

              {previewModal.type === 'journal' && (
                <div className="space-y-4">
                  <div className="aspect-16/9 rounded-2xl overflow-hidden bg-black/40">
                    <img src={previewModal.data.coverImage || '/assets/hero_tea_cup.png'} alt={previewModal.data.title} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-gold text-xs font-semibold uppercase">{previewModal.data.category}</span>
                  <h4 className="font-serif font-bold text-2xl text-[#F8F6F2]">{previewModal.data.title}</h4>
                  <div className="space-y-3 pt-2 text-xs text-slate-300 leading-relaxed">
                    {Array.isArray(previewModal.data.content) 
                      ? previewModal.data.content.map((p: string, i: number) => <p key={i}>{p}</p>)
                      : <p>{previewModal.data.content}</p>
                    }
                  </div>
                </div>
              )}

              {previewModal.type === 'offer' && (
                <div className="p-5 rounded-2xl bg-gradient-to-r from-[#163322] to-[#0e2417] border border-gold/40 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] text-gold uppercase font-bold tracking-wider">Announcement Preview</span>
                    <h4 className="font-serif font-bold text-base text-[#F8F6F2]">{previewModal.data.title}</h4>
                    <p className="text-xs text-slate-300 mt-0.5">{previewModal.data.description}</p>
                  </div>
                  <span className="bg-gold text-[#0c1912] text-xs font-bold px-4 py-2 rounded-xl shrink-0">
                    {previewModal.data.cta_text || "GET THE APP"}
                  </span>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
