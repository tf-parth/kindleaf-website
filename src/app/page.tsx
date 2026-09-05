"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Philosophy from '@/components/Philosophy';
import IngredientsBlend from '@/components/IngredientsBlend';
import SlowLiving from '@/components/SlowLiving';
import RitualPlanner from '@/components/RitualPlanner';
import BrewingGuide from '@/components/BrewingGuide';
import OurStory from '@/components/OurStory';
import OurBlends from '@/components/OurBlends';
import ProductModal from '@/components/ProductModal';
import JournalSection from '@/components/JournalSection';
import FAQSection from '@/components/FAQSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import AppDownloadModal from '@/components/AppDownloadModal';
import OfferBanner from '@/components/OfferBanner';
import { openKindleafApp } from '@/lib/constants';

export default function KindleafOfficialWebsite() {
  // Dynamic Content & Products from Supabase / Mock Fallback
  const [products, setProducts] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [journalArticles, setJournalArticles] = useState<any[]>([]);
  const [brewingConfig, setBrewingConfig] = useState<any>(null);
  const [storyContent, setStoryContent] = useState<any>(null);

  const [settings, setSettings] = useState<any>({
    website_name: "Kindleaf",
    logo_url: "/assets/logo.png",
    contact_email: "support@kindleaf.in",
    contact_phone: "+91 6396461480",
    address: "Vill. Katoora, post darapur milawali, jasrana firozabad 283136, Uttar Pradesh",
    instagram_url: "https://instagram.com/kindleaf.wellness",
    facebook_url: "https://www.facebook.com/share/1EELT4gBjW/",
    whatsapp_phone: "916396461480"
  });

  // Modal States (Informational only, no checkout)
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);

  useEffect(() => {
    // Fetch products for informational display
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      })
      .catch((err) => console.error("Error loading products:", err));

    // Fetch global settings
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data && Object.keys(data).length > 0) {
          setSettings((prev: any) => ({ ...prev, ...data }));
        }
      })
      .catch((err) => console.error("Error loading settings:", err));

    // Fetch active offers
    fetch('/api/offers')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setOffers(data);
      })
      .catch(() => {});

    // Fetch botanical ingredients
    fetch('/api/ingredients')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setIngredients(data);
      })
      .catch(() => {});

    // Fetch FAQs
    fetch('/api/faqs')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setFaqs(data);
      })
      .catch(() => {});

    // Fetch Journal articles
    fetch('/api/journal')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setJournalArticles(data);
      })
      .catch(() => {});

    // Fetch Brewing Guide config
    fetch('/api/brewing')
      .then((res) => res.json())
      .then((data) => {
        if (data && Object.keys(data).length > 0) setBrewingConfig(data);
      })
      .catch(() => {});

    // Fetch Our Story content
    fetch('/api/story')
      .then((res) => res.json())
      .then((data) => {
        if (data && Object.keys(data).length > 0) setStoryContent(data);
      })
      .catch(() => {});
  }, []);

  const handleOpenProduct = (product: any) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleCloseProduct = () => {
    setIsProductModalOpen(false);
    setSelectedProduct(null);
  };

  const handleOpenAppModal = () => {
    // Attempt deep link scheme, then show app modal with store options & QR code
    openKindleafApp(() => {
      setIsAppModalOpen(true);
    });
    setIsAppModalOpen(true);
  };

  const [isBannerDismissed, setIsBannerDismissed] = useState(false);
  const activeOffer = offers.find((o) => o.active) || offers[0] || null;
  const isBannerVisible = Boolean(activeOffer && !isBannerDismissed);
  const bannerHeight = isBannerVisible ? 40 : 0;

  return (
    <div className="min-h-screen bg-[#0c1912] text-slate-300 font-sans selection:bg-gold selection:text-[#0c1912]">
      {/* 0. DYNAMIC PROMOTIONAL BANNER (Fixed at very top, z-50, h-10) */}
      {isBannerVisible && (
        <OfferBanner 
          offer={activeOffer} 
          onOpenAppModal={handleOpenAppModal} 
          onDismiss={() => setIsBannerDismissed(true)}
        />
      )}
      
      {/* 1. STICKY BRAND HEADER & NAVIGATION (Fixed directly below announcement bar, z-40) */}
      <Navbar 
        onOpenAppModal={handleOpenAppModal} 
        logoUrl={settings.logo_url}
        websiteName={settings.website_name}
        topOffset={bannerHeight}
      />

      <main>
        {/* 2. HERO SECTION */}
        <Hero onOpenAppModal={handleOpenAppModal} />

        {/* 3. OUR PHILOSOPHY */}
        <Philosophy />

        {/* 4. THE BLEND (4 Botanical Ingredients Showcase) */}
        <IngredientsBlend items={ingredients} />

        {/* 5. SLOW LIVING STORYTELLING */}
        <SlowLiving />

        {/* 6. PERSONALIZED DAILY TEA ROUTINE (LIFESTYLE PLANNER) */}
        <RitualPlanner onOpenAppModal={handleOpenAppModal} />

        {/* 7. BREWING GUIDE (Visual steps + interactive simulation) */}
        <BrewingGuide config={brewingConfig} />

        {/* 8. OUR STORY (Soldier's home heritage + trust badges) */}
        <OurStory content={storyContent} />

        {/* 9. OUR BLENDS (Informational Product Library - No Cart, No Checkout) */}
        <OurBlends 
          products={products}
          onSelectProduct={handleOpenProduct}
          onOpenAppModal={handleOpenAppModal}
        />

        {/* 10. JOURNAL (Educational articles & storytelling) */}
        <JournalSection articles={journalArticles} />

        {/* 11. FAQ ACCORDION */}
        <FAQSection faqs={faqs} onOpenAppModal={handleOpenAppModal} />

        {/* 12. CONTACT DESK */}
        <ContactSection settings={settings} />

        {/* Dedicated App Discovery Anchor Section */}
        <section id="get-the-app" className="py-20 bg-gradient-to-b from-[#0a150f] to-[#163322] border-t border-white/10 text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-6">
            <span className="text-gold text-xs font-semibold uppercase tracking-widest block">
              Official Mobile Application
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#F8F6F2] font-bold">
              Shop in the Kindleaf App
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Order fresh small batches, explore guided tea rituals, and track packaging directly in the app. The website is exclusively for brand education and product information.
            </p>
            <div className="pt-2">
              <button
                onClick={handleOpenAppModal}
                className="bg-gold hover:bg-gold-hover text-[#0c1912] font-semibold px-8 py-4 rounded-full text-xs uppercase tracking-wider transition-all duration-300 shadow-xl hover:shadow-gold/25 inline-flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>GET THE KINDLEAF APP</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* 13. OFFICIAL BRAND FOOTER */}
      <Footer 
        onOpenAppModal={handleOpenAppModal}
        settings={settings}
      />

      {/* INFORMATIONAL PRODUCT MODAL */}
      <ProductModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={handleCloseProduct}
        onOpenAppModal={handleOpenAppModal}
      />

      {/* APP DOWNLOAD / DISCOVERY MODAL */}
      <AppDownloadModal
        isOpen={isAppModalOpen}
        onClose={() => setIsAppModalOpen(false)}
      />

    </div>
  );
}
