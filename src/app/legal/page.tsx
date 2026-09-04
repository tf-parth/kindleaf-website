"use client";

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type TabType = 'privacy' | 'terms' | 'shipping' | 'refund' | 'disclaimer';

function LegalContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') as TabType;
  const initialTab: TabType = (tabParam && ['privacy', 'terms', 'shipping', 'refund', 'disclaimer'].includes(tabParam)) ? tabParam : 'privacy';
  const [selectedTab, setSelectedTab] = useState<TabType | null>(null);
  const activeTab = selectedTab || initialTab;

  const tabs = [
    { id: 'privacy', label: 'Privacy Policy' },
    { id: 'terms', label: 'Terms & Conditions' },
    { id: 'shipping', label: 'Shipping Policy' },
    { id: 'refund', label: 'Refund Policy' },
    { id: 'disclaimer', label: 'Medical Disclaimer' },
  ];

  return (
    <div className="max-w-4xl mx-auto relative z-10 space-y-10">
      {/* Header navigation back */}
      <div className="flex items-center gap-4 pb-6 border-b border-white/10">
        <Link 
          href="/"
          className="w-10 h-10 rounded-full bg-[#163322]/40 border border-white/10 flex items-center justify-center text-slate-400 hover:text-gold transition-colors cursor-pointer"
          aria-label="Back to home"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-3xl font-serif text-[#F8F6F2]">Legal &amp; Policy Hub</h1>
          <p className="text-xs text-slate-400">Official transparency and compliance information for Kindleaf Herbal Tea</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-white/5 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as TabType)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer ${
              activeTab === tab.id
                ? 'bg-gold text-[#0c1912] shadow-md'
                : 'bg-[#163322]/20 hover:bg-[#163322]/50 text-slate-400 border border-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Display Area */}
      <div className="glass-panel border border-white/10 rounded-2xl p-8 lg:p-10 shadow-xl leading-relaxed text-sm">
        {activeTab === 'privacy' && (
          <section className="space-y-6">
            <h2 className="text-xl font-serif text-[#F8F6F2] font-bold border-b border-white/5 pb-2">Privacy Policy</h2>
            <p className="text-slate-400 text-xs">Last updated: August 2026</p>
            <p>
              At Kindleaf, we respect your privacy and are committed to protecting your personal data. This privacy policy describes how we handle information when you visit our website or download/use the Kindleaf Mobile App.
            </p>
            <h3 className="text-base font-serif text-gold font-bold">1. Informational Website</h3>
            <p>
              This website does not store checkout payment details or process credit card transactions. We do not sell or trade personal data to third-party marketing brokers.
            </p>
            <h3 className="text-base font-serif text-gold font-bold">2. Contact Messages</h3>
            <p>
              When you submit an inquiry through our Contact Desk, your email and message are used solely to communicate with you and answer your questions.
            </p>
            <h3 className="text-base font-serif text-gold font-bold">3. Mobile Application Data</h3>
            <p>
              Shipping and delivery details collected in the Kindleaf Mobile App are processed strictly for order fulfillment and courier tracking in India.
            </p>
          </section>
        )}

        {activeTab === 'terms' && (
          <section className="space-y-6">
            <h2 className="text-xl font-serif text-[#F8F6F2] font-bold border-b border-white/5 pb-2">Terms &amp; Conditions</h2>
            <p className="text-slate-400 text-xs">Last updated: August 2026</p>
            <p>
              Welcome to Kindleaf. By accessing this website or installing the Kindleaf App, you agree to comply with and be bound by the following terms of service.
            </p>
            <h3 className="text-base font-serif text-gold font-bold">1. Purpose of the Website</h3>
            <p>
              This website serves as the official brand, educational, and product information hub. All purchasing, shopping cart management, and order placement take place within the Kindleaf Mobile App.
            </p>
            <h3 className="text-base font-serif text-gold font-bold">2. Intellectual Property</h3>
            <p>
              All editorial copy, photography, botanical guides, and trademarks are owned by Kindleaf. Unauthorized reproduction or commercial distribution is prohibited.
            </p>
            <h3 className="text-base font-serif text-gold font-bold">3. Compliance &amp; Standards</h3>
            <p>
              Our tea blends comply with applicable food safety standards and are handcrafted in Jasrana, Firozabad, Uttar Pradesh, India.
            </p>
          </section>
        )}

        {activeTab === 'shipping' && (
          <section className="space-y-6">
            <h2 className="text-xl font-serif text-[#F8F6F2] font-bold border-b border-white/5 pb-2">Shipping &amp; Delivery Information</h2>
            <p className="text-slate-400 text-xs">Last updated: August 2026</p>
            <p>
              All product shipments are initiated through orders confirmed inside the Kindleaf Mobile App.
            </p>
            <h3 className="text-base font-serif text-gold font-bold">1. Small-Batch Fulfillment</h3>
            <p>
              To maintain optimal botanical freshness, we prepare our blends in small batches. Orders are packed and dispatched within 24–48 hours of confirmation.
            </p>
            <h3 className="text-base font-serif text-gold font-bold">2. Delivery Timeframes</h3>
            <p>
              Standard courier delivery across India typically takes 3 to 7 business days depending on location. Tracking updates are sent directly to your phone via the Kindleaf App.
            </p>
          </section>
        )}

        {activeTab === 'refund' && (
          <section className="space-y-6">
            <h2 className="text-xl font-serif text-[#F8F6F2] font-bold border-b border-white/5 pb-2">Refund &amp; Return Policy</h2>
            <p className="text-slate-400 text-xs">Last updated: August 2026</p>
            <p>
              As herbal tea is a consumable food product, returns are handled with care to ensure hygiene and food safety.
            </p>
            <h3 className="text-base font-serif text-gold font-bold">1. Damaged or Incorrect Packages</h3>
            <p>
              If a package arrives damaged, torn, or with an incorrect variant, please report it within 48 hours of delivery via the Kindleaf App support desk or email support@kindleaf.in with photos of the package.
            </p>
            <h3 className="text-base font-serif text-gold font-bold">2. Resolution</h3>
            <p>
              Verified claims are eligible for a replacement dispatch or a full refund to the original payment source within 5–7 business days.
            </p>
          </section>
        )}

        {activeTab === 'disclaimer' && (
          <section className="space-y-6">
            <h2 className="text-xl font-serif text-[#F8F6F2] font-bold border-b border-white/5 pb-2">Medical &amp; Health Disclaimer</h2>
            <p className="text-slate-400 text-xs">Last updated: August 2026</p>
            <div className="bg-[#163322]/40 border border-gold/30 p-5 rounded-xl text-slate-200">
              <p className="font-semibold text-[#F8F6F2] mb-2">Important Health Notice:</p>
              <p className="text-xs sm:text-sm leading-relaxed">
                Kindleaf Herbal Green Tea is a handcrafted natural beverage made with green tea, holy basil (Tulsi), lemongrass, and dry ginger. It is formulated as a refreshing dietary drink for daily mindfulness rituals.
              </p>
            </div>
            <h3 className="text-base font-serif text-gold font-bold">1. Not Medical Advice</h3>
            <p>
              Information presented on this website, including the interactive Daily Tea Routine Planner, is strictly for educational and lifestyle mindfulness purposes. It does not constitute medical advice, Ayurvedic prescriptions, diagnosis, treatment, or health prevention.
            </p>
            <h3 className="text-base font-serif text-gold font-bold">2. No Medical Claims</h3>
            <p>
              We do not claim that Kindleaf treats, cures, or prevents any disease or illness. Always consult a qualified healthcare provider if you have underlying medical conditions, are pregnant or nursing, or are taking prescription medications.
            </p>
          </section>
        )}
      </div>
    </div>
  );
}

export default function LegalPage() {
  return (
    <main className="min-h-screen bg-[#0c1912] py-16 px-6 relative overflow-hidden font-sans text-slate-300">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(45,106,79,0.2),transparent_45%)] pointer-events-none"></div>
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-gold/5 blur-3xl pointer-events-none"></div>

      <Suspense fallback={<div className="max-w-4xl mx-auto text-center py-20 text-slate-400">Loading policy documents...</div>}>
        <LegalContent />
      </Suspense>
    </main>
  );
}
