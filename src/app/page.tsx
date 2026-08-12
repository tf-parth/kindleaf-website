"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Star, Menu, X, Phone, Mail, MapPin, 
  Send, Instagram, Facebook, Compass, ArrowRight, Clock, Award, User
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// Intentions for Planner
const intentionsByTime: any = {
  morning: [
    { id: 'm-digest', label: 'Metabolism Kickstart', sub: 'Ignite gastric fire after breakfast', icon: '🔥' },
    { id: 'm-focus', label: 'Mental Focus', sub: 'Calm energy for work hours', icon: '🧠' },
    { id: 'm-imm', label: 'Daily Immunity Shield', sub: 'Tulsi adaptogenic boost', icon: '🛡️' }
  ],
  afternoon: [
    { id: 'a-bloat', label: 'Bloating Relief', sub: 'Soothe fullness after lunch', icon: '🎈' },
    { id: 'a-stress', label: 'Mid-day Stress Buster', sub: 'Protect your peace, pause work', icon: '💆' },
    { id: 'a-hydrate', label: 'Clean Rejuvenation', sub: 'Freshen up your energy', icon: '✨' }
  ],
  evening: [
    { id: 'e-relax', label: 'Sleep Preparation', sub: 'Decompress before bed', icon: '🌙' },
    { id: 'e-digest', label: 'Heavy Dinner Digestion', sub: 'Spiced ginger digestive aid', icon: '🫚' },
    { id: 'e-detox', label: 'Gentle Overnight Cleanse', sub: 'Detoxify and rest', icon: '💧' }
  ]
};

// Planner Results
const ritualResults: any = {
  'morning_m-digest': {
    title: 'The Sun-Fire Awakening',
    desc: 'Sip 20 minutes after your breakfast. Focus on the warm notes of dry ginger triggering your digestion. Pair this ritual with sunlight exposure.',
    brewTime: '3 Minutes',
    pair: '5 minutes of direct morning sunlight',
    goal: 'Ignite Kapha dosha, eliminate breakfast bloating'
  },
  'morning_m-focus': {
    title: 'The Clarity Ritual',
    desc: 'Prepare the cup just before starting your work. Inhale the clean steam of Lemongrass. Leave your phone in another room for the first 15 minutes of work.',
    brewTime: '3 Minutes',
    pair: 'Deep, single-task work blocks',
    goal: 'Calm the central nervous system via adaptogenic Tulsi'
  },
  'morning_m-imm': {
    title: 'The Ayurvedic Shield',
    desc: 'A daily morning tonic. Focus on the taste of Holy Basil. Let the antioxidants set a protective layer for your day.',
    brewTime: '4 Minutes',
    pair: 'Light morning stretching/yoga',
    goal: 'Fortify white blood cell activity, adapt to atmospheric changes'
  },
  'afternoon_a-bloat': {
    title: 'The Midday Lightness',
    desc: 'Sip 30 minutes after your lunch. The Lemongrass and Ginger active compounds relax tight gastric muscles, releasing trapped wind and reducing inflation.',
    brewTime: '4 Minutes',
    pair: '100 steps of gentle walking post-meal',
    goal: 'Speed up gastric clearance, reduce post-lunch lethargy'
  },
  'afternoon_a-stress': {
    title: 'The Digital Detox Break',
    desc: 'Step away from all screens. Feel the warm weight of the mug. Take deep nasal breaths. This is a guilt-free pause in your productive day.',
    brewTime: '3 Minutes',
    pair: 'Silence and complete offline presence',
    goal: 'Lower cortisol spikes, restore cognitive clarity'
  },
  'afternoon_a-hydrate': {
    title: 'The Refreshing Infusion',
    desc: 'A light, refreshing cup to clear away brain fog. Let the bright citrus notes of Lemongrass awaken your cognitive senses.',
    brewTime: '3 Minutes',
    pair: 'A large glass of water beforehand',
    goal: 'Cellular hydration, gentle internal cleaning'
  },
  'evening_e-relax': {
    title: 'The Sunset Stillness',
    desc: 'A mindful cup brewed 1 hour before sleep. Let the calming adaptogens in Tulsi ease your mind out of work mode. Read a physical book while sipping.',
    brewTime: '5 Minutes',
    pair: 'Dim lights and a physical fiction book',
    goal: 'Settle down overactive synapses, prepare melatonin cycles'
  },
  'evening_e-digest': {
    title: 'The Overnight Balance',
    desc: 'Brewed right after dinner. The warm ginger comforts the stomach lining, while Lemongrass works on processing proteins and fats.',
    brewTime: '5 Minutes',
    pair: 'No heavy screen scrolling',
    goal: 'Prevent overnight acid reflux, support gut repair cycles'
  },
  'evening_e-detox': {
    title: 'The Soothing Restorative',
    desc: 'A long, slow brew. Breathe in the warm herbal aroma. Let your body enter deep parasympathetic rest.',
    brewTime: '4 Minutes',
    pair: 'Gratitude journaling (write down 3 things)',
    goal: 'Flush out free radicals, lower systemic inflammation'
  }
};

export default function PublicHome() {
  // Database States
  const [products, setProducts] = useState<any[]>([]);
  const [homepage, setHomepage] = useState<any>({
    hero: {
      tag: "🌿 100% Handcrafted & Natural",
      heading: "Awaken Your Senses, Restore Your Calm",
      description: "Discover a premium herbal green tea crafted to support digestion, immunity, and daily wellness — naturally. A quiet pause in a busy world.",
      primary_btn_text: "Shop Organic Blend",
      secondary_btn_text: "Buy on Amazon"
    },
    why_kindleaf: {
      tag: "Slow Living",
      heading: "Not another notification. Not another deadline.",
      description: "We spend so much time taking care of everything around us that we often forget to recharge ourselves. Kindleaf is more than just green tea. It’s a mindful ritual, a warm cup in your hands, and a small pause that makes a big difference."
    },
    brewing_guide: {
      tag: "The Art of Tea",
      heading: "How to Brew the Perfect Cup",
      description: "A mindful brew unlocks the full botanical synergy of Green Tea, Tulsi, Lemongrass, and Ginger."
    }
  });
  const [settings, setSettings] = useState<any>({
    website_name: "Kindleaf Wellness",
    logo_url: "/assets/logo.png",
    favicon_url: "/favicon.ico",
    contact_email: "support@kindleaf.in",
    contact_phone: "+91 6396461480",
    address: "Vill. Katoora, post darapur milawali, jasrana firozabad 283136, Uttar Pradesh",
    instagram_url: "https://instagram.com/kindleaf.wellness",
    facebook_url: "https://facebook.com",
    whatsapp_phone: "916396461480",
    amazon_store_url: "https://www.amazon.in/dp/B0GQCZM7YN",
    seo_title: "Kindleaf - Premium Handcrafted Herbal Green Tea",
    seo_description: "Experience Kindleaf Herbal Green Tea, a 100% natural blend of premium green tea, Holy Basil (Tulsi), Lemongrass, and dry Ginger."
  });

  // UI States
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [activeIngredient, setActiveIngredient] = useState('greentea');
  
  // Planner State
  const [plannerStep, setPlannerStep] = useState(1);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedIntention, setSelectedIntention] = useState('');

  // Brewing Simulator States
  const [isBrewing, setIsBrewing] = useState(false);
  const [timerText, setTimerText] = useState('03:00');
  const [liquidOpacity, setLiquidOpacity] = useState(0.2);
  const [liquidColor, setLiquidColor] = useState('#808080');
  const [liquidHeight, setLiquidHeight] = useState('90');
  const [isSteaming, setIsSteaming] = useState(false);
  const [brewStep, setBrewStep] = useState(1);
  const brewIntervalRef = useRef<any>(null);

  // Shop States
  const [priceFilter, setPriceFilter] = useState(449);
  const [filter100, setFilter100] = useState(true);
  const [filter200, setFilter200] = useState(true);
  const [sortVal, setSortVal] = useState('recommended');

  // Auth Session States
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [sessionRole, setSessionRole] = useState<string>('');

  // Checkout Modal State
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [orderQty, setOrderQty] = useState(1);
  const [custName, setCustName] = useState('');
  const [custAddress, setCustAddress] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPhone, setCustPhone] = useState('');

  // Load Data
  useEffect(() => {
    // Scroll event listener
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    // Detect active user sessions
    if (typeof window !== 'undefined') {
      const adminSession = localStorage.getItem('admin_session');
      const customerSession = localStorage.getItem('customer_session');
      if (adminSession) {
        setSessionUser(JSON.parse(adminSession));
        setSessionRole('admin');
      } else if (customerSession) {
        setSessionUser(JSON.parse(customerSession));
        setSessionRole('customer');
      }
    }

    const client = supabase;
    if (isSupabaseConfigured && client) {
      client.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          client
            .from('admins')
            .select('role')
            .eq('id', session.user.id)
            .single()
            .then(({ data: adminRecord }) => {
              if (adminRecord && adminRecord.role === 'admin') {
                setSessionRole('admin');
                setSessionUser(session.user);
              } else {
                setSessionRole('customer');
                client
                  .from('customers')
                  .select('*')
                  .eq('email', session.user.email)
                  .single()
                  .then(({ data: profile }) => {
                    if (profile) setSessionUser(profile);
                    else setSessionUser({ name: session.user.email?.split('@')[0], email: session.user.email });
                  });
              }
            });
        }
      });
    }

    // Load initial floating leaves
    const leafCount = 15;
    const newLeaves = [];
    for (let i = 0; i < leafCount; i++) {
      newLeaves.push({
        id: i,
        left: Math.random() * 100,
        duration: 12 + Math.random() * 8, // 12s to 20s for smooth, natural speed
        delay: Math.random() * -20, // Negative delay offsets so they are distributed across the page on load
        scale: 0.5 + Math.random() * 0.7,
        opacity: 0.15 + Math.random() * 0.3,
        isGold: Math.random() > 0.6,
        animType: (i % 3) + 1 // Evenly distribute animation patterns (1, 2, 3)
      });
    }
    setLeaves(newLeaves);

    // Fetch dynamic content
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Error loading products:", err));

    fetch('/api/homepage')
      .then(res => res.json())
      .then(data => {
        if (data && Object.keys(data).length > 0) setHomepage(data);
      })
      .catch(err => console.error("Error loading homepage config:", err));

    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data && Object.keys(data).length > 0) setSettings(data);
      })
      .catch(err => console.error("Error loading global settings:", err));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(brewIntervalRef.current);
    };
  }, []);

  // Brewing simulation logic
  const startBrew = () => {
    if (isBrewing) {
      resetBrew();
      return;
    }

    setIsBrewing(true);
    setIsSteaming(true);

    let totalSeconds = 180;
    const animationSteps = 12;
    let currentStep = 0;

    setLiquidColor('#c5a880');
    setLiquidOpacity(0.15);
    setLiquidHeight('80');
    setBrewStep(1);

    brewIntervalRef.current = setInterval(() => {
      currentStep++;
      totalSeconds -= (180 / animationSteps);

      const min = Math.floor(totalSeconds / 60);
      const sec = Math.floor(totalSeconds % 60);
      setTimerText(`${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`);

      const completionRatio = currentStep / animationSteps;
      setLiquidOpacity(0.15 + (0.75 * completionRatio));

      if (completionRatio >= 0.25 && completionRatio < 0.5) {
        setBrewStep(2);
      } else if (completionRatio >= 0.5 && completionRatio < 0.75) {
        setBrewStep(3);
      } else if (completionRatio >= 0.75) {
        setBrewStep(4);
      }

      if (currentStep >= animationSteps) {
        clearInterval(brewIntervalRef.current);
        setTimerText('00:00');
        setIsSteaming(false);
      }
    }, 1000);
  };

  const resetBrew = () => {
    setIsBrewing(false);
    setIsSteaming(false);
    clearInterval(brewIntervalRef.current);
    setTimerText('03:00');
    setLiquidColor('#808080');
    setLiquidOpacity(0.2);
    setLiquidHeight('90');
    setBrewStep(1);
  };

  // Filter products
  const filteredProducts = products.filter((p: any) => {
    const isCombo = p.weight.includes('200') || p.weight.toLowerCase().includes('combo');
    const isNatural = !isCombo;

    if (p.price > priceFilter) return false;
    if (isNatural && !filter100) return false;
    if (isCombo && !filter200) return false;
    return p.status === 'published';
  });

  const sortedProducts = [...filteredProducts].sort((a: any, b: any) => {
    if (sortVal === 'price-low') return a.price - b.price;
    if (sortVal === 'price-high') return b.price - a.price;
    return 0; // Default
  });

  // Open Checkout
  const handleOpenCheckout = (product: any) => {
    setSelectedProduct(product);
    setOrderQty(1);
    setCustName('');
    setCustAddress('');
    setCustEmail('');
    setCustPhone('');
    setCheckoutOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseCheckout = () => {
    setCheckoutOpen(false);
    setSelectedProduct(null);
    document.body.style.overflow = '';
  };

  // Submit Order via API and WhatsApp
  const submitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !custAddress || !selectedProduct) return;

    const totalAmount = selectedProduct.price * orderQty;

    const payload = {
      customer_name: custName,
      customer_email: custEmail || null,
      customer_phone: custPhone || null,
      shipping_address: custAddress,
      product_title: selectedProduct.title,
      quantity: orderQty,
      total_price: totalAmount
    };

    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .finally(() => {
        // Build WhatsApp message
        const message = `Hello Kindleaf! 🌿 I would like to order the Handcrafted Herbal Green Tea.

🛒 Order Details:
- Product: ${selectedProduct.title}
- Quantity: ${orderQty}
- Total Price: ₹${totalAmount}

📦 Shipping Details:
- Name: ${custName}
- Phone: ${custPhone || 'N/A'}
- Address: ${custAddress}

Thank you!`;

        const encodedMsg = encodeURIComponent(message);
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${settings.whatsapp_phone || '916396461480'}&text=${encodedMsg}`;

        handleCloseCheckout();
        window.open(whatsappUrl, '_blank');
      });
  };

  const heroAmazonUrl = products.find(p => !p.title.includes('Combo'))?.amazon_url || settings.amazon_store_url;

  return (
    <div className="min-h-screen bg-[#0c1912]">
      {/* 1. STICKY NAVBAR */}
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass-navbar py-3 shadow-lg' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3">
            <img src={settings.logo_url} alt={settings.website_name} className="h-10 w-auto rounded-md shadow-md" />
          </a>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#philosophy" className="text-[#F8F6F2] hover:text-gold transition-colors text-sm font-medium relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-gold after:transition-all hover:after:w-full">Our Philosophy</a>
            <a href="#blend" className="text-[#F8F6F2] hover:text-gold transition-colors text-sm font-medium relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-gold after:transition-all hover:after:w-full">The Blend</a>
            <a href="#planner" className="text-[#F8F6F2] hover:text-gold transition-colors text-sm font-medium relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-gold after:transition-all hover:after:w-full">Ritual Planner</a>
            <a href="#brewing" className="text-[#F8F6F2] hover:text-gold transition-colors text-sm font-medium relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-gold after:transition-all hover:after:w-full">Brewing Guide</a>
            <a href="#story" className="text-[#F8F6F2] hover:text-gold transition-colors text-sm font-medium relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-gold after:transition-all hover:after:w-full">Our Story</a>
            
            {sessionUser ? (
              <a 
                href={sessionRole === 'admin' ? "/admin/dashboard" : "/account"} 
                className="text-[#F8F6F2] hover:text-gold transition-colors text-sm font-semibold flex items-center gap-1.5"
              >
                <User size={15} />
                <span>{sessionRole === 'admin' ? "Dashboard" : "Account"}</span>
              </a>
            ) : (
              <a 
                href="/login" 
                className="text-[#F8F6F2] hover:text-gold transition-colors text-sm font-medium relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-gold after:transition-all hover:after:w-full"
              >
                Login
              </a>
            )}

            <a href="#shop" className="bg-gold hover:bg-gold-hover text-[#0c1912] font-semibold px-5 py-2.5 rounded-full transition-colors text-sm shadow-md">Shop Now</a>
          </nav>

          {/* Hamburger */}
          <button className="md:hidden text-[#F8F6F2]" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-0 left-0 w-full h-screen bg-[#0e2217]/95 backdrop-blur-xl z-40 flex flex-col justify-center items-center gap-8 md:hidden"
          >
            <a href="#philosophy" className="text-[#F8F6F2] text-xl font-medium" onClick={() => setMenuOpen(false)}>Our Philosophy</a>
            <a href="#blend" className="text-[#F8F6F2] text-xl font-medium" onClick={() => setMenuOpen(false)}>The Blend</a>
            <a href="#planner" className="text-[#F8F6F2] text-xl font-medium" onClick={() => setMenuOpen(false)}>Ritual Planner</a>
            <a href="#brewing" className="text-[#F8F6F2] text-xl font-medium" onClick={() => setMenuOpen(false)}>Brewing Guide</a>
            <a href="#story" className="text-[#F8F6F2] text-xl font-medium" onClick={() => setMenuOpen(false)}>Our Story</a>
            
            {sessionUser ? (
              <a 
                href={sessionRole === 'admin' ? "/admin/dashboard" : "/account"} 
                className="text-[#F8F6F2] text-xl font-medium flex items-center gap-1.5"
                onClick={() => setMenuOpen(false)}
              >
                <User size={18} />
                <span>{sessionRole === 'admin' ? "Dashboard" : "Account"}</span>
              </a>
            ) : (
              <a 
                href="/login" 
                className="text-[#F8F6F2] text-xl font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </a>
            )}

            <a href="#shop" className="bg-gold text-[#0c1912] font-semibold px-8 py-3.5 rounded-full text-lg" onClick={() => setMenuOpen(false)}>Shop Now</a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(45,106,79,0.3),transparent_40%)]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0c1912]/80 via-[#0c1912]/90 to-[#0c1912] z-10"></div>
        
        {/* Main Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay"
          style={{ backgroundImage: "url('/assets/hero_tea_cup.png')" }}
        ></div>

        <div className="max-w-5xl mx-auto px-6 text-center relative z-20 flex flex-col items-center">
          <span className="inline-block bg-[#163322]/80 border border-white/10 text-gold text-xs font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full mb-6">
            {homepage.hero.tag}
          </span>
          <h1 className="text-4xl md:text-6xl font-serif text-[#F8F6F2] leading-tight mb-6">
            {homepage.hero.heading.split(', ')[0]},<br/>
            <span className="text-gold italic font-normal">{homepage.hero.heading.split(', ')[1]}</span>
          </h1>
          <p className="text-base md:text-lg text-slate-300 max-w-2xl mb-10 leading-relaxed">
            {homepage.hero.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-5 items-center">
            <a href="#shop" className="w-full sm:w-auto bg-gold hover:bg-gold-hover text-[#0c1912] font-semibold px-8 py-4 rounded-full transition-all duration-300 shadow-lg transform hover:-translate-y-1">
              {homepage.hero.primary_btn_text}
            </a>
            <a 
              href={heroAmazonUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-full sm:w-auto glass-panel hover:bg-white/10 text-[#F8F6F2] font-semibold px-8 py-4 rounded-full transition-all duration-300 flex items-center justify-center gap-2 border border-white/20 transform hover:-translate-y-1"
            >
              <span>{homepage.hero.secondary_btn_text}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          </div>
        </div>

        {/* Floating Leaves */}
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          {leaves.map(leaf => (
            <div 
              key={leaf.id} 
              className="absolute pointer-events-none"
              style={{
                left: `${leaf.left}%`,
                top: `0px`,
                transform: `scale(${leaf.scale})`,
                opacity: leaf.opacity
              }}
            >
              <span 
                className={`inline-block w-4 h-4 rounded-tl-[12px] rounded-br-[12px] shadow-sm falling-leaf-${leaf.animType}`}
                style={{
                  animationDuration: `${leaf.duration}s`,
                  animationDelay: `${leaf.delay}s`,
                  backgroundColor: leaf.isGold ? '#c5a880' : '#2d6a4f',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* 3. PHILOSOPHY SECTION */}
      <section id="philosophy" className="py-24 relative overflow-hidden bg-[#0a150f]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-gold text-xs font-semibold uppercase tracking-wider mb-3 block">{homepage.why_kindleaf.tag}</span>
              <h2 className="text-3xl md:text-4xl font-serif text-[#F8F6F2] mb-6 leading-snug">
                {homepage.why_kindleaf.heading.split('. ')[0]}.<br/>
                <span className="text-gold italic font-normal">{homepage.why_kindleaf.heading.split('. ')[1]}</span>
              </h2>
              <p className="text-slate-300 leading-relaxed mb-8 text-sm md:text-base">
                {homepage.why_kindleaf.description}
              </p>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#163322] border border-white/10 flex items-center justify-center shrink-0">
                    <span className="text-xl">🍵</span>
                  </div>
                  <div>
                    <h4 className="text-gold font-serif font-bold text-base mb-1">Daily Mindful Sip</h4>
                    <p className="text-slate-400 text-xs md:text-sm">Incorporate peace into your daily routine, not as a reward, but as a habit.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#163322] border border-white/10 flex items-center justify-center shrink-0">
                    <span className="text-xl">🍃</span>
                  </div>
                  <div>
                    <h4 className="text-gold font-serif font-bold text-base mb-1">Zero Artificial Additives</h4>
                    <p className="text-slate-400 text-xs md:text-sm">100% real ingredients sourced directly from local farms in Uttar Pradesh.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,168,128,0.1),transparent_70%)]"></div>
              <div className="relative border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-4 glass-panel">
                <img src="/assets/hero_tea_cup.png" alt="Kindleaf Editorial" className="w-full h-auto rounded-lg object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BLEND/INGREDIENTS SHOWCASE */}
      <section id="blend" className="py-24 bg-[#0c1912]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-gold text-xs font-semibold uppercase tracking-wider block mb-3">The Formulation</span>
            <h2 className="text-3xl md:text-4xl font-serif text-[#F8F6F2] mb-4">Four Natural Ingredients. One Perfect Balance.</h2>
            <p className="text-slate-300 text-sm">We don’t hide behind complex chemical names or artificial flavorings. Every cup contains exactly four powerhouse ingredients, blended by hand.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* Left switcher */}
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => setActiveIngredient('greentea')}
                className={`text-left p-5 rounded-xl border transition-all ${activeIngredient === 'greentea' ? 'bg-[#163322] border-gold/50 text-[#F8F6F2] shadow-lg' : 'bg-transparent border-white/10 text-slate-400 hover:border-white/20'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase tracking-widest opacity-60">01</span>
                  <span className="text-xs font-semibold bg-gold/10 text-gold px-2 py-0.5 rounded">Shield</span>
                </div>
                <h4 className="font-serif font-bold text-lg">Green Tea Base</h4>
              </button>
              <button 
                onClick={() => setActiveIngredient('tulsi')}
                className={`text-left p-5 rounded-xl border transition-all ${activeIngredient === 'tulsi' ? 'bg-[#163322] border-gold/50 text-[#F8F6F2] shadow-lg' : 'bg-transparent border-white/10 text-slate-400 hover:border-white/20'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase tracking-widest opacity-60">02</span>
                  <span className="text-xs font-semibold bg-gold/10 text-gold px-2 py-0.5 rounded">Stress</span>
                </div>
                <h4 className="font-serif font-bold text-lg">Holy Basil (Tulsi)</h4>
              </button>
              <button 
                onClick={() => setActiveIngredient('lemongrass')}
                className={`text-left p-5 rounded-xl border transition-all ${activeIngredient === 'lemongrass' ? 'bg-[#163322] border-gold/50 text-[#F8F6F2] shadow-lg' : 'bg-transparent border-white/10 text-slate-400 hover:border-white/20'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase tracking-widest opacity-60">03</span>
                  <span className="text-xs font-semibold bg-gold/10 text-gold px-2 py-0.5 rounded">Digest</span>
                </div>
                <h4 className="font-serif font-bold text-lg">Lemongrass</h4>
              </button>
              <button 
                onClick={() => setActiveIngredient('ginger')}
                className={`text-left p-5 rounded-xl border transition-all ${activeIngredient === 'ginger' ? 'bg-[#163322] border-gold/50 text-[#F8F6F2] shadow-lg' : 'bg-transparent border-white/10 text-slate-400 hover:border-white/20'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase tracking-widest opacity-60">04</span>
                  <span className="text-xs font-semibold bg-gold/10 text-gold px-2 py-0.5 rounded">Warmth</span>
                </div>
                <h4 className="font-serif font-bold text-lg">Ginger Root</h4>
              </button>
            </div>

            {/* Right Display area */}
            <div className="lg:col-span-2 glass-panel border border-white/10 rounded-2xl p-8 lg:p-10 relative overflow-hidden min-h-[350px] flex items-center">
              <AnimatePresence mode="wait">
                {activeIngredient === 'greentea' && (
                  <motion.div 
                    key="greentea"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center w-full"
                  >
                    <div className="md:col-span-3">
                      <span className="text-gold text-xs italic tracking-wider block mb-1">Camellia sinensis</span>
                      <h3 className="text-2xl font-serif text-[#F8F6F2] mb-4">Green Tea Base</h3>
                      <p className="text-slate-300 text-sm leading-relaxed mb-6">
                        Sourced from select high-altitude gardens, our premium green tea base is rich in EGCG antioxidants. It gently fires up your metabolism, neutralizes free radicals, and supplies a clean, jitter-free energy boost.
                      </p>
                      <div className="flex flex-wrap gap-2.5">
                        <span className="text-xs bg-[#163322] border border-white/10 text-gold px-3 py-1 rounded-full">🔥 Boosts Metabolism</span>
                        <span className="text-xs bg-[#163322] border border-white/10 text-gold px-3 py-1 rounded-full">✨ Rich in Catechins</span>
                      </div>
                    </div>
                    <div className="md:col-span-2 flex justify-center">
                      <div className="w-40 h-40 rounded-full bg-[#163322]/50 border border-gold/10 flex items-center justify-center relative">
                        <div className="absolute inset-2 border border-dashed border-gold/20 rounded-full animate-[spin_20s_infinite_linear]"></div>
                        <span className="text-6xl animate-float">🍃</span>
                      </div>
                    </div>
                  </motion.div>
                )}
                {activeIngredient === 'tulsi' && (
                  <motion.div 
                    key="tulsi"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center w-full"
                  >
                    <div className="md:col-span-3">
                      <span className="text-gold text-xs italic tracking-wider block mb-1">Ocimum tenuiflorum</span>
                      <h3 className="text-2xl font-serif text-[#F8F6F2] mb-4">Holy Basil (Tulsi)</h3>
                      <p className="text-slate-300 text-sm leading-relaxed mb-6">
                        Revered in Ayurveda as the 'Queen of Herbs', Tulsi is a powerful adaptogen that helps the body adapt to physical and mental stress, calming the nervous system and clear respiratory passages.
                      </p>
                      <div className="flex flex-wrap gap-2.5">
                        <span className="text-xs bg-[#163322] border border-white/10 text-gold px-3 py-1 rounded-full">🛡️ Adaptogenic Support</span>
                        <span className="text-xs bg-[#163322] border border-white/10 text-gold px-3 py-1 rounded-full">💆 Stress Reduction</span>
                      </div>
                    </div>
                    <div className="md:col-span-2 flex justify-center">
                      <div className="w-40 h-40 rounded-full bg-[#163322]/50 border border-gold/10 flex items-center justify-center relative">
                        <div className="absolute inset-2 border border-dashed border-gold/20 rounded-full animate-[spin_20s_infinite_linear]"></div>
                        <span className="text-6xl animate-float">🌿</span>
                      </div>
                    </div>
                  </motion.div>
                )}
                {activeIngredient === 'lemongrass' && (
                  <motion.div 
                    key="lemongrass"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center w-full"
                  >
                    <div className="md:col-span-3">
                      <span className="text-gold text-xs italic tracking-wider block mb-1">Cymbopogon citratus</span>
                      <h3 className="text-2xl font-serif text-[#F8F6F2] mb-4">Lemongrass</h3>
                      <p className="text-slate-300 text-sm leading-relaxed mb-6">
                        Bringing a bright, citrusy, and refreshing aroma to the blend, Lemongrass is a digestive powerhouse. It contains citral, relaxing stomach muscles and mitigating bloating.
                      </p>
                      <div className="flex flex-wrap gap-2.5">
                        <span className="text-xs bg-[#163322] border border-white/10 text-gold px-3 py-1 rounded-full">🍋 Citric Freshness</span>
                        <span className="text-xs bg-[#163322] border border-white/10 text-gold px-3 py-1 rounded-full">🎈 Reduces Bloating</span>
                      </div>
                    </div>
                    <div className="md:col-span-2 flex justify-center">
                      <div className="w-40 h-40 rounded-full bg-[#163322]/50 border border-gold/10 flex items-center justify-center relative">
                        <div className="absolute inset-2 border border-dashed border-gold/20 rounded-full animate-[spin_20s_infinite_linear]"></div>
                        <span className="text-6xl animate-float">🍋</span>
                      </div>
                    </div>
                  </motion.div>
                )}
                {activeIngredient === 'ginger' && (
                  <motion.div 
                    key="ginger"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center w-full"
                  >
                    <div className="md:col-span-3">
                      <span className="text-gold text-xs italic tracking-wider block mb-1">Zingiber officinale</span>
                      <h3 className="text-2xl font-serif text-[#F8F6F2] mb-4">Ginger Root</h3>
                      <p className="text-slate-300 text-sm leading-relaxed mb-6">
                        Warm and spicy. Sourced directly from local farmers in Uttar Pradesh, Ginger contains bio-active gingerol, supporting post-meal comfort and soothing cold & cough defense.
                      </p>
                      <div className="flex flex-wrap gap-2.5">
                        <span className="text-xs bg-[#163322] border border-white/10 text-gold px-3 py-1 rounded-full">🫚 Soothes Stomach</span>
                        <span className="text-xs bg-[#163322] border border-white/10 text-gold px-3 py-1 rounded-full">❄️ Cold & Cough Protection</span>
                      </div>
                    </div>
                    <div className="md:col-span-2 flex justify-center">
                      <div className="w-40 h-40 rounded-full bg-[#163322]/50 border border-gold/10 flex items-center justify-center relative">
                        <div className="absolute inset-2 border border-dashed border-gold/20 rounded-full animate-[spin_20s_infinite_linear]"></div>
                        <span className="text-6xl animate-float">🫚</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* 5. MIND RITUAL PLANNER */}
      <section id="planner" className="py-24 bg-[#0a150f] border-y border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-gold text-xs font-semibold uppercase tracking-wider block mb-2">Interactive Planner</span>
            <h2 className="text-3xl font-serif text-[#F8F6F2]">Design Your Daily Tea Ritual</h2>
            <p className="text-slate-300 text-sm mt-2">How you sip matters. Choose your time and intention to receive a personalized Ayurvedic daily routine.</p>
          </div>

          <div className="glass-panel-heavy border border-white/10 rounded-2xl p-8 shadow-xl">
            {/* Progress indicator */}
            <div className="flex items-center justify-between text-xs font-semibold mb-10 pb-4 border-b border-white/5">
              <span className={`${plannerStep >= 1 ? 'text-gold' : 'text-slate-500'}`}>1. Time of Day</span>
              <span className="w-10 h-[1px] bg-white/10"></span>
              <span className={`${plannerStep >= 2 ? 'text-gold' : 'text-slate-500'}`}>2. Intention</span>
              <span className="w-10 h-[1px] bg-white/10"></span>
              <span className={`${plannerStep === 3 ? 'text-gold' : 'text-slate-500'}`}>3. Your Ritual</span>
            </div>

            {/* Step 1 */}
            {plannerStep === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <h3 className="text-lg font-serif text-[#F8F6F2] font-semibold text-center mb-4">When do you want to introduce your ritual?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button 
                    onClick={() => { setSelectedTime('morning'); setPlannerStep(2); }}
                    className="p-6 rounded-xl border border-white/10 bg-[#163322]/20 hover:border-gold/30 hover:bg-[#163322]/40 transition-all text-center flex flex-col items-center group"
                  >
                    <span className="text-3xl mb-3 transform group-hover:scale-110 transition-transform">🌅</span>
                    <h4 className="font-serif font-bold text-base text-[#F8F6F2] mb-1">Morning Hour</h4>
                    <p className="text-slate-400 text-xs">Post-Breakfast / Start</p>
                  </button>
                  <button 
                    onClick={() => { setSelectedTime('afternoon'); setPlannerStep(2); }}
                    className="p-6 rounded-xl border border-white/10 bg-[#163322]/20 hover:border-gold/30 hover:bg-[#163322]/40 transition-all text-center flex flex-col items-center group"
                  >
                    <span className="text-3xl mb-3 transform group-hover:scale-110 transition-transform">☀️</span>
                    <h4 className="font-serif font-bold text-base text-[#F8F6F2] mb-1">Afternoon Pause</h4>
                    <p className="text-slate-400 text-xs">Post-Lunch Pick-Me-Up</p>
                  </button>
                  <button 
                    onClick={() => { setSelectedTime('evening'); setPlannerStep(2); }}
                    className="p-6 rounded-xl border border-white/10 bg-[#163322]/20 hover:border-gold/30 hover:bg-[#163322]/40 transition-all text-center flex flex-col items-center group"
                  >
                    <span className="text-3xl mb-3 transform group-hover:scale-110 transition-transform">🌙</span>
                    <h4 className="font-serif font-bold text-base text-[#F8F6F2] mb-1">Evening Wind-down</h4>
                    <p className="text-slate-400 text-xs">After-Dinner Digestion</p>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2 */}
            {plannerStep === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <h3 className="text-lg font-serif text-[#F8F6F2] font-semibold text-center mb-4">What is your body &amp; mind seeking most?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {intentionsByTime[selectedTime]?.map((item: any) => (
                    <button 
                      key={item.id}
                      onClick={() => { setSelectedIntention(item.id); setPlannerStep(3); }}
                      className="p-6 rounded-xl border border-white/10 bg-[#163322]/20 hover:border-gold/30 hover:bg-[#163322]/40 transition-all text-center flex flex-col items-center group"
                    >
                      <span className="text-3xl mb-3 transform group-hover:scale-110 transition-transform">{item.icon}</span>
                      <h4 className="font-serif font-bold text-base text-[#F8F6F2] mb-1">{item.label}</h4>
                      <p className="text-slate-400 text-xs">{item.sub}</p>
                    </button>
                  ))}
                </div>
                <div className="text-center mt-6">
                  <button onClick={() => setPlannerStep(1)} className="text-gold text-xs underline hover:text-gold-hover">← Back to Time</button>
                </div>
              </motion.div>
            )}

            {/* Step 3 */}
            {plannerStep === 3 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-6">
                <span className="bg-gold/10 text-gold text-xs font-semibold px-3 py-1 rounded-full">Personalized Ritual</span>
                <h3 className="text-2xl font-serif text-[#F8F6F2] mt-2">
                  {ritualResults[`${selectedTime}_${selectedIntention}`]?.title}
                </h3>
                <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed">
                  {ritualResults[`${selectedTime}_${selectedIntention}`]?.desc}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-lg mx-auto bg-[#163322]/20 p-5 rounded-xl border border-white/5 mt-8">
                  <div className="p-3">
                    <span className="text-gold text-[10px] uppercase font-bold block mb-1">Brew Time</span>
                    <span className="text-[#F8F6F2] text-sm font-semibold">{ritualResults[`${selectedTime}_${selectedIntention}`]?.brewTime}</span>
                  </div>
                  <div className="p-3">
                    <span className="text-gold text-[10px] uppercase font-bold block mb-1">Pairing</span>
                    <span className="text-[#F8F6F2] text-xs font-semibold">{ritualResults[`${selectedTime}_${selectedIntention}`]?.pair}</span>
                  </div>
                  <div className="p-3">
                    <span className="text-gold text-[10px] uppercase font-bold block mb-1">Ayurvedic Goal</span>
                    <span className="text-[#F8F6F2] text-xs font-semibold">{ritualResults[`${selectedTime}_${selectedIntention}`]?.goal}</span>
                  </div>
                </div>

                <div className="flex justify-center gap-4 mt-8 pt-4 border-t border-white/5">
                  <button onClick={() => setPlannerStep(1)} className="bg-gold text-[#0c1912] font-semibold px-6 py-2.5 rounded-full text-xs hover:bg-gold-hover transition-colors">
                    Restart Planner
                  </button>
                  <a href="#shop" className="glass-panel text-[#F8F6F2] font-semibold px-6 py-2.5 rounded-full text-xs hover:bg-white/5 transition-colors border border-white/10">
                    Get the Blend
                  </a>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* 6. BREWING GUIDE SIMULATION */}
      <section id="brewing" className="py-24 bg-[#0c1912]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-gold text-xs font-semibold uppercase tracking-wider block mb-2">{homepage.brewing_guide.tag}</span>
            <h2 className="text-3xl md:text-4xl font-serif text-[#F8F6F2] mb-4">{homepage.brewing_guide.heading}</h2>
            <p className="text-slate-300 text-sm">{homepage.brewing_guide.description}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Visualizer Panel */}
            <div className="flex flex-col items-center glass-panel rounded-2xl p-8 border border-white/10 shadow-xl">
              <div className="relative w-44 h-48 mb-6 flex items-center justify-center">
                {/* Steam lines */}
                <div className="absolute -top-6 left-12 flex gap-4 pointer-events-none">
                  <span className={`w-1 h-8 bg-white/20 rounded-full steam-line line-1 ${isSteaming ? 'block' : 'hidden'}`} style={{ animationDelay: '0.1s' }} />
                  <span className={`w-1 h-12 bg-white/25 rounded-full steam-line line-2 ${isSteaming ? 'block' : 'hidden'}`} style={{ animationDelay: '0.5s' }} />
                  <span className={`w-1 h-8 bg-white/20 rounded-full steam-line line-3 ${isSteaming ? 'block' : 'hidden'}`} style={{ animationDelay: '0.3s' }} />
                </div>

                <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-2xl">
                  {/* Mug Handle */}
                  <path d="M 68,45 C 85,45 85,85 68,85" stroke="#c5a880" strokeWidth="8" fill="none" strokeLinecap="round"/>
                  {/* Mug Body */}
                  <path d="M 20,30 L 20,95 C 20,105 32,112 50,112 C 68,112 80,105 80,95 L 80,30 Z" fill="#1b4332"/>
                  {/* Liquid inside */}
                  <path d={`M 23,${liquidHeight} C 35,${liquidHeight} 45,${liquidHeight} 77,${liquidHeight} L 77,95 C 77,101 68,107 50,107 C 32,107 23,101 23,95 Z`} fill={liquidColor} opacity={liquidOpacity} style={{ transition: 'all 1s ease' }}/>
                  {/* Outer Mug rim */}
                  <ellipse cx="50" cy="30" rx="30" ry="8" fill="#1b4332" stroke="#c5a880" strokeWidth="2"/>
                  {/* Liquid surface */}
                  <ellipse cx="50" cy={liquidHeight} rx="27" ry="6" fill={liquidColor === '#808080' ? '#666666' : '#b8986c'} opacity={liquidOpacity} style={{ transition: 'all 1s ease' }}/>
                </svg>
              </div>

              {/* Timer & button */}
              <div className="text-center space-y-4">
                <div className="text-3xl font-mono text-[#F8F6F2] font-semibold">{timerText}</div>
                <button 
                  onClick={startBrew}
                  className={`px-8 py-3 rounded-full font-bold text-xs shadow-md transition-colors ${isBrewing ? 'bg-[#163322] border border-white/10 text-gold hover:bg-[#1b4332]' : 'bg-gold text-[#0c1912] hover:bg-gold-hover'}`}
                >
                  {isBrewing ? 'Reset Simulation' : 'Simulate Brew'}
                </button>
              </div>
            </div>

            {/* Instruction Steps */}
            <div className="space-y-8">
              <div className={`flex gap-5 border-l-2 pl-6 transition-all ${brewStep === 1 ? 'border-gold opacity-100' : 'border-white/10 opacity-50'}`}>
                <div className="text-2xl font-serif text-gold font-bold">01</div>
                <div>
                  <h4 className="text-base font-serif font-bold text-[#F8F6F2] mb-1">Heat the Water</h4>
                  <p className="text-slate-400 text-xs md:text-sm">Bring fresh water to a gentle bubble (approx. 85°C). Avoid boiling water completely, as burning green tea leaves creates bitterness.</p>
                </div>
              </div>
              <div className={`flex gap-5 border-l-2 pl-6 transition-all ${brewStep === 2 ? 'border-gold opacity-100' : 'border-white/10 opacity-50'}`}>
                <div className="text-2xl font-serif text-gold font-bold">02</div>
                <div>
                  <h4 className="text-base font-serif font-bold text-[#F8F6F2] mb-1">Measure the Blend</h4>
                  <p className="text-slate-400 text-xs md:text-sm">Add 1 teaspoon (about 2g) of Kindleaf Handcrafted Herbal Green Tea into your cup or infuser basket.</p>
                </div>
              </div>
              <div className={`flex gap-5 border-l-2 pl-6 transition-all ${brewStep === 3 ? 'border-gold opacity-100' : 'border-white/10 opacity-50'}`}>
                <div className="text-2xl font-serif text-gold font-bold">03</div>
                <div>
                  <h4 className="text-base font-serif font-bold text-[#F8F6F2] mb-1">Infuse and Breathe</h4>
                  <p className="text-slate-400 text-xs md:text-sm">Pour hot water and cover. Steep for exactly 3 to 5 minutes depending on desired strength. Watch the water take on a golden hue.</p>
                </div>
              </div>
              <div className={`flex gap-5 border-l-2 pl-6 transition-all ${brewStep === 4 ? 'border-gold opacity-100' : 'border-white/10 opacity-50'}`}>
                <div className="text-2xl font-serif text-gold font-bold">04</div>
                <div>
                  <h4 className="text-base font-serif font-bold text-[#F8F6F2] mb-1">Sip Mindfully</h4>
                  <p className="text-slate-400 text-xs md:text-sm">Inhale the warm herbal aroma of lemongrass and ginger. Take your first sip. Reconnect with yourself.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. OUR STORY */}
      <section id="story" className="py-24 bg-[#0a150f]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <span className="text-gold text-xs font-semibold uppercase tracking-wider block mb-1">Our Roots</span>
              <h2 className="text-3xl md:text-4xl font-serif text-[#F8F6F2] leading-tight">A Small Dream from a Soldier’s Home</h2>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                Kindleaf did not begin in a corporate boardroom or a massive commercial factory. It was born right at home in Jasrana, Firozabad, Uttar Pradesh, founded by Gaurav Singh, coming from a proud soldier's family.
              </p>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                The vision was simple: wellness should be honest, natural, and accessible. In a market flooded with artificial flavorings and chemical shortcuts, we set out to craft a tea blend that is 100% natural. We source our herbs locally and pack them by hand with care.
              </p>
              <blockquote className="border-l-2 border-gold pl-6 py-2 italic text-gold text-sm bg-[#163322]/20 rounded-r-lg pr-4">
                "I strongly believe in one principle: If you can’t consume your own product every day, you probably shouldn’t be selling it. At Kindleaf, we drink the exact same tea we ship to you."
                <cite className="block text-slate-400 text-xs font-semibold not-italic mt-2">— Gaurav Singh, Founder</cite>
              </blockquote>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl border border-white/5 bg-[#163322]/10 text-center space-y-2">
                <span className="text-2xl font-serif text-gold font-bold block">100%</span>
                <h5 className="text-[#F8F6F2] font-semibold text-xs uppercase tracking-wider">Pure &amp; Natural</h5>
                <p className="text-slate-400 text-[10px]">No artificial oils, sprays, or chemicals</p>
              </div>
              <div className="p-6 rounded-xl border border-white/5 bg-[#163322]/10 text-center space-y-2">
                <span className="text-2xl font-serif text-gold font-bold block">FSSAI</span>
                <h5 className="text-[#F8F6F2] font-semibold text-xs uppercase tracking-wider">Approved Quality</h5>
                <p className="text-slate-400 text-[10px]">Fulfills all safety guidelines</p>
              </div>
              <div className="p-6 rounded-xl border border-white/5 bg-[#163322]/10 text-center space-y-2">
                <span className="text-2xl font-serif text-gold font-bold block">Local</span>
                <h5 className="text-[#F8F6F2] font-semibold text-xs uppercase tracking-wider">UP Handcrafted</h5>
                <p className="text-slate-400 text-[10px]">Supporting local farming communities</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. PRODUCTS CATALOG */}
      <section id="shop" className="py-24 bg-[#0c1912]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-gold text-xs font-semibold uppercase tracking-wider block mb-2">Our Shop</span>
            <h2 className="text-3xl md:text-4xl font-serif text-[#F8F6F2]">Our Premium Blends</h2>
            <p className="text-slate-300 text-sm mt-2">Experience 100% natural, handcrafted wellness tea. Sourced and packed in Uttar Pradesh.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar filter */}
            <aside className="space-y-8 bg-[#0a150f] p-6 rounded-xl border border-white/5 h-fit">
              <div>
                <h4 className="text-[#F8F6F2] font-serif font-bold text-sm uppercase tracking-wider pb-2 border-b border-white/5 mb-4">Categories</h4>
                <ul className="space-y-2.5 text-xs font-medium text-slate-400">
                  <li><a href="#shop" className="text-gold">All Products</a></li>
                  <li><a href="#shop" className="hover:text-gold transition-colors">Herbal Teas</a></li>
                  <li><a href="#shop" className="hover:text-gold transition-colors">Immunity Tea</a></li>
                  <li><a href="#shop" className="hover:text-gold transition-colors">Premium Blends</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-[#F8F6F2] font-serif font-bold text-sm uppercase tracking-wider pb-2 border-b border-white/5 mb-4">Filter by Price</h4>
                <div className="space-y-4">
                  <input 
                    type="range" 
                    min="249" 
                    max="449" 
                    value={priceFilter} 
                    onChange={(e) => setPriceFilter(parseInt(e.target.value))} 
                    className="w-full accent-gold bg-white/10 h-1.5 rounded-full cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-slate-400 font-semibold">
                    <span>Min: ₹249</span>
                    <span className="text-gold">Max: ₹{priceFilter}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-[#F8F6F2] font-serif font-bold text-sm uppercase tracking-wider pb-2 border-b border-white/5 mb-4">Weight</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 text-xs text-slate-300 font-semibold cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={filter100} 
                      onChange={(e) => setFilter100(e.target.checked)} 
                      className="accent-gold h-4 w-4 rounded border-white/10 bg-[#0a150f]" 
                    />
                    <span>100g (Standard)</span>
                  </label>
                  <label className="flex items-center gap-3 text-xs text-slate-300 font-semibold cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={filter200} 
                      onChange={(e) => setFilter200(e.target.checked)} 
                      className="accent-gold h-4 w-4 rounded border-white/10 bg-[#0a150f]" 
                    />
                    <span>200g (Combo)</span>
                  </label>
                </div>
              </div>
            </aside>

            {/* Grid */}
            <div className="lg:col-span-3 space-y-6">
              <div className="flex justify-between items-center text-xs text-slate-400 font-semibold bg-[#0a150f] p-4 rounded-xl border border-white/5">
                <span>Showing {sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''}</span>
                <div className="flex items-center gap-2">
                  <label htmlFor="sort-dropdown">Sort by:</label>
                  <select 
                    id="sort-dropdown"
                    value={sortVal}
                    onChange={(e) => setSortVal(e.target.value)}
                    className="bg-[#0c1912] border border-white/10 text-slate-300 px-3 py-1.5 rounded-lg text-xs"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {sortedProducts.map((prod: any) => (
                  <article key={prod.id} className="group relative bg-[#0a150f] rounded-2xl overflow-hidden border border-white/5 shadow-lg flex flex-col justify-between">
                    <span className="absolute top-4 left-4 bg-gold text-[#0c1912] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md z-10">Sale</span>
                    <div className="relative aspect-square overflow-hidden bg-emerald-950/20 p-6 flex items-center justify-center">
                      <img src={prod.img} alt={prod.title} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300" />
                      {/* Action overlays */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3.5 z-20">
                        <button 
                          onClick={() => handleOpenCheckout(prod)}
                          className="bg-gold hover:bg-gold-hover text-[#0c1912] font-semibold text-xs px-6 py-2.5 rounded-full shadow-md transition-colors"
                        >
                          Quick Order
                        </button>
                        {prod.amazon_url && (
                          <a 
                            href={prod.amazon_url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="bg-white/10 hover:bg-white/20 text-[#F8F6F2] font-semibold text-xs px-5 py-2.5 rounded-full shadow-md border border-white/20 flex items-center gap-1.5 transition-colors"
                          >
                            <span>Buy on Amazon</span>
                            <ArrowRight size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center text-xs text-slate-400 font-semibold mb-2">
                          <span>{prod.weight}</span>
                          <span className="text-gold flex items-center gap-1">⭐️ 4.9</span>
                        </div>
                        <h3 className="font-serif font-bold text-base text-[#F8F6F2] group-hover:text-gold transition-colors">{prod.title}</h3>
                      </div>
                      <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white/5">
                        <span className="text-gold font-bold font-serif text-lg">₹{prod.price}</span>
                        {prod.sale_price && <span className="text-slate-500 line-through text-xs font-semibold">₹{prod.sale_price}</span>}
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {sortedProducts.length === 0 && (
                <div className="text-center py-20 text-slate-500 text-sm font-semibold">
                  No products match your filter selections.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 9. PREMIUM LUXURY BRAND FOOTER */}
      <footer className="relative bg-gradient-to-b from-[#163322] to-[#0E2417] text-slate-300 pt-20 pb-8 border-t border-white/5 overflow-hidden">
        {/* Subtle decorative background circle */}
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-gold/5 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            
            {/* Column 1: Brand & Logo */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <img src={settings.logo_url} alt={settings.website_name} className="h-10 w-auto rounded-md shadow-md" />
              </div>
              <p className="text-xs leading-relaxed text-slate-400">
                Nourishing body and mind, one quiet cup at a time. Experience handcrafted wellness green tea, infused with Holy Basil, Lemongrass, and Ginger root.
              </p>
              {/* Social icons */}
              <div className="flex items-center gap-4 pt-2">
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-white/10 bg-[#0E2417]/45 hover:border-gold hover:text-gold flex items-center justify-center transition-colors">
                  <Instagram size={14} />
                </a>
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-white/10 bg-[#0E2417]/45 hover:border-gold hover:text-gold flex items-center justify-center transition-colors">
                  <Facebook size={14} />
                </a>
                <a href={`https://api.whatsapp.com/send?phone=${settings.whatsapp_phone || '916396461480'}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-white/10 bg-[#0E2417]/45 hover:border-gold hover:text-gold flex items-center justify-center transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 2.032 14.058.802 11.44.802 6.002.802 1.577 5.172 1.573 10.601c-.002 1.696.452 3.35 1.314 4.8l-.994 3.63 3.754-.976zm12.39-7.234c-.267-.134-1.586-.783-1.831-.873-.245-.089-.424-.134-.602.134-.179.268-.691.873-.847 1.051-.156.178-.311.201-.578.067-.267-.134-1.127-.416-2.146-1.327-.792-.708-1.328-1.583-1.484-1.85-.156-.268-.017-.413.117-.546.121-.12.267-.312.4-.469.134-.156.179-.268.267-.446.089-.178.045-.335-.022-.469-.067-.134-.602-1.449-.824-1.985-.217-.521-.454-.45-.624-.459-.16-.008-.344-.01-.529-.01-.186 0-.489.07-.746.356-.256.285-.979.957-.979 2.334 0 1.378 1.002 2.709 1.143 2.893.141.184 1.973 3.007 4.779 4.212.667.287 1.189.459 1.595.587.67.213 1.28.183 1.763.111.538-.08 1.586-.647 1.809-1.272.223-.625.223-1.16.156-1.272-.067-.112-.245-.178-.512-.313z"/></svg>
                </a>
                <a href={settings.amazon_store_url} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-white/10 bg-[#0E2417]/45 hover:border-gold hover:text-gold flex items-center justify-center transition-colors">
                  <Compass size={14} />
                </a>
              </div>
            </div>

            {/* Column 2: Explore */}
            <div className="space-y-4">
              <h4 className="font-serif font-bold text-sm text-[#F8F6F2] uppercase tracking-wider">Explore</h4>
              <ul className="space-y-2 text-xs font-semibold">
                <li><a href="#" className="hover:text-gold transition-colors">Home</a></li>
                <li><a href="#shop" className="hover:text-gold transition-colors">Shop</a></li>
                <li><a href="#philosophy" className="hover:text-gold transition-colors">About</a></li>
                <li><a href="#brewing" className="hover:text-gold transition-colors">Brewing Guide</a></li>
                <li><a href="#contact" className="hover:text-gold transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Column 3: Support */}
            <div className="space-y-4">
              <h4 className="font-serif font-bold text-sm text-[#F8F6F2] uppercase tracking-wider">Support</h4>
              <ul className="space-y-2 text-xs font-semibold">
                <li><a href="#" className="hover:text-gold transition-colors">Track Order</a></li>
                <li><a href="#" className="hover:text-gold transition-colors">Shipping &amp; Delivery</a></li>
                <li><a href="#" className="hover:text-gold transition-colors">Returns &amp; Refund</a></li>
                <li><a href="#" className="hover:text-gold transition-colors">FAQ</a></li>
              </ul>
            </div>

            {/* Column 4: Contact */}
            <div className="space-y-4">
              <h4 className="font-serif font-bold text-sm text-[#F8F6F2] uppercase tracking-wider">Contact</h4>
              <ul className="space-y-3.5 text-xs text-slate-400">
                <li className="flex items-start gap-3">
                  <Phone size={14} className="text-gold mt-0.5 shrink-0" />
                  <a href={`tel:${settings.contact_phone}`} className="hover:text-gold transition-colors font-semibold">{settings.contact_phone}</a>
                </li>
                <li className="flex items-start gap-3">
                  <Mail size={14} className="text-gold mt-0.5 shrink-0" />
                  <a href={`mailto:${settings.contact_email}`} className="hover:text-gold transition-colors font-semibold">{settings.contact_email}</a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin size={14} className="text-gold mt-0.5 shrink-0" />
                  <span className="leading-relaxed font-semibold">{settings.address}</span>
                </li>
              </ul>
            </div>

            {/* Column 5: Newsletter */}
            <div className="space-y-4">
              <h4 className="font-serif font-bold text-sm text-[#F8F6F2] uppercase tracking-wider">Newsletter</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Subscribe to receive wellness tips, rituals, and seasonal offers.
              </p>
              <form 
                onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing!'); (e.target as any).reset(); }}
                className="flex flex-col gap-2 pt-2"
              >
                <div className="relative">
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    required 
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-gold/50"
                  />
                </div>
                <button type="submit" className="bg-gold hover:bg-gold-hover text-[#0c1912] font-semibold text-xs py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-md">
                  <span>Subscribe</span>
                  <Send size={12} />
                </button>
              </form>
            </div>

          </div>

          {/* Thin Divider */}
          <div className="border-t border-white/5 my-8"></div>

          {/* Bottom Row */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
            <div className="flex flex-wrap items-center justify-center gap-6">
              <a href="#" className="hover:text-gold transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gold transition-colors">Terms &amp; Conditions</a>
              <a href="#" className="hover:text-gold transition-colors">Shipping Policy</a>
              <a href="#" className="hover:text-gold transition-colors">Refund Policy</a>
              <a href="#" className="hover:text-gold transition-colors">FAQ</a>
              <a href="#contact" className="hover:text-gold transition-colors">Contact</a>
            </div>
            <p className="text-center md:text-right normal-case tracking-normal text-xs text-slate-500">
              &copy; 2026 Kindleaf Herbal Tea. Made with ❤️ in India.
            </p>
          </div>
        </div>
      </footer>

      {/* 10. QUICK CHECKOUT MODAL */}
      <AnimatePresence>
        {checkoutOpen && selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseCheckout}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-[#0e2217] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={handleCloseCheckout}
                className="absolute top-4 right-4 text-slate-400 hover:text-[#F8F6F2] text-2xl z-20"
              >
                &times;
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Left col: Product summary */}
                <div className="p-8 bg-emerald-950/20 border-r border-white/5 flex flex-col justify-between">
                  <div>
                    <span className="text-gold text-xs font-semibold uppercase tracking-wider block mb-1">{selectedProduct.category}</span>
                    <h3 className="text-2xl font-serif text-[#F8F6F2] mb-3">{selectedProduct.title}</h3>
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-gold font-bold font-serif text-xl">₹{selectedProduct.price}</span>
                      {selectedProduct.sale_price && <span className="text-slate-500 line-through text-xs font-semibold">₹{selectedProduct.sale_price}</span>}
                    </div>
                    <div className="w-full aspect-square max-h-48 flex items-center justify-center bg-white/5 rounded-xl mb-6">
                      <img src={selectedProduct.img} alt={selectedProduct.title} className="max-h-full object-contain p-4" />
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">{selectedProduct.description}</p>
                  </div>
                </div>

                {/* Right col: Customer form */}
                <div className="p-8">
                  <h4 className="text-base font-serif font-bold text-[#F8F6F2] uppercase tracking-wider pb-2 border-b border-white/5 mb-6">Delivery Details</h4>
                  
                  <form onSubmit={submitOrder} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Quantity</label>
                        <div className="flex items-center border border-white/10 rounded-lg w-fit">
                          <button 
                            type="button" 
                            onClick={() => orderQty > 1 && setOrderQty(orderQty - 1)}
                            className="px-3.5 py-2 text-slate-400 hover:text-gold text-sm font-bold"
                          >
                            -
                          </button>
                          <span className="px-4 text-xs font-bold text-[#F8F6F2]">{orderQty}</span>
                          <button 
                            type="button" 
                            onClick={() => orderQty < 10 && setOrderQty(orderQty + 1)}
                            className="px-3.5 py-2 text-slate-400 hover:text-gold text-sm font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col justify-end text-right">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Total Amount</span>
                        <span className="text-xl font-bold text-gold font-serif">₹{selectedProduct.price * orderQty}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Your Full Name</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="Enter your name" 
                        value={custName}
                        onChange={(e) => setCustName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-gold/50"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email Address</label>
                        <input 
                          type="email" 
                          placeholder="name@example.com" 
                          value={custEmail}
                          onChange={(e) => setCustEmail(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-gold/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Phone Number</label>
                        <input 
                          type="tel" 
                          required
                          placeholder="10-digit mobile number" 
                          value={custPhone}
                          onChange={(e) => setCustPhone(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-gold/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Shipping Address</label>
                      <textarea 
                        required 
                        rows={3} 
                        placeholder="Enter complete shipping address with PIN code" 
                        value={custAddress}
                        onChange={(e) => setCustAddress(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-gold/50"
                      />
                    </div>

                    <div className="pt-4 flex flex-col gap-3">
                      <button 
                        type="submit" 
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-xs shadow-md"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 2.032 14.058.802 11.44.802 6.002.802 1.577 5.172 1.573 10.601c-.002 1.696.452 3.35 1.314 4.8l-.994 3.63 3.754-.976zm12.39-7.234c-.267-.134-1.586-.783-1.831-.873-.245-.089-.424-.134-.602.134-.179.268-.691.873-.847 1.051-.156.178-.311.201-.578.067-.267-.134-1.127-.416-2.146-1.327-.792-.708-1.328-1.583-1.484-1.85-.156-.268-.017-.413.117-.546.121-.12.267-.312.4-.469.134-.156.179-.268.267-.446.089-.178.045-.335-.022-.469-.067-.134-.602-1.449-.824-1.985-.217-.521-.454-.45-.624-.459-.16-.008-.344-.01-.529-.01-.186 0-.489.07-.746.356-.256.285-.979.957-.979 2.334 0 1.378 1.002 2.709 1.143 2.893.141.184 1.973 3.007 4.779 4.212.667.287 1.189.459 1.595.587.67.213 1.28.183 1.763.111.538-.08 1.586-.647 1.809-1.272.223-.625.223-1.16.156-1.272-.067-.112-.245-.178-.512-.313z"/></svg>
                        <span>Confirm &amp; Purchase via WhatsApp</span>
                      </button>
                      
                      {selectedProduct.amazon_url && (
                        <a 
                          href={selectedProduct.amazon_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="w-full bg-[#163322] hover:bg-[#1b4332] text-gold border border-gold/30 font-bold py-3.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-xs shadow-md"
                        >
                          <span>Buy on Amazon Instead</span>
                          <ArrowRight size={14} />
                        </a>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
