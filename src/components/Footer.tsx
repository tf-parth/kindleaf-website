"use client";

import React from 'react';
import Link from 'next/link';
import { Smartphone, Instagram, Facebook } from 'lucide-react';

interface FooterProps {
  onOpenAppModal: () => void;
  settings?: {
    logo_url?: string;
    website_name?: string;
    contact_email?: string;
    contact_phone?: string;
    address?: string;
    instagram_url?: string;
    facebook_url?: string;
    whatsapp_phone?: string;
  };
}

export default function Footer({ onOpenAppModal, settings }: FooterProps) {
  const logoUrl = settings?.logo_url || "/assets/logo.png";
  const websiteName = settings?.website_name || "Kindleaf";
  const instagram = settings?.instagram_url || "https://instagram.com/kindleaf.wellness";
  const facebook = settings?.facebook_url || "https://facebook.com";
  const whatsapp = settings?.whatsapp_phone || "916396461480";

  return (
    <footer className="relative bg-gradient-to-b from-[#163322] via-[#0e2417] to-[#08150e] text-slate-300 pt-20 pb-12 border-t border-white/10 overflow-hidden font-sans">
      {/* Background glow decoration */}
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-gold/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 mb-16">
          
          {/* Column 1: Brand story & Logo */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="inline-block">
              <img 
                src={logoUrl} 
                alt={websiteName} 
                className="h-10 w-auto rounded-lg shadow-md" 
              />
            </Link>
            <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
              Nourishing body and mind, one quiet cup at a time. Handcrafted Indian herbal green tea infused with whole holy basil (Tulsi), lemongrass, and dry ginger root.
            </p>
            
            {/* Social links */}
            <div className="flex items-center gap-3 pt-1">
              <a 
                href={instagram} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Instagram"
                className="w-9 h-9 rounded-full border border-white/10 bg-[#0E2417]/60 hover:border-gold hover:text-gold flex items-center justify-center transition-colors"
              >
                <Instagram size={15} />
              </a>
              <a 
                href={facebook} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Facebook"
                className="w-9 h-9 rounded-full border border-white/10 bg-[#0E2417]/60 hover:border-gold hover:text-gold flex items-center justify-center transition-colors"
              >
                <Facebook size={15} />
              </a>
              <a 
                href={`https://api.whatsapp.com/send?phone=${whatsapp}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-full border border-white/10 bg-[#0E2417]/60 hover:border-gold hover:text-gold flex items-center justify-center transition-colors"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 2.032 14.058.802 11.44.802 6.002.802 1.577 5.172 1.573 10.601c-.002 1.696.452 3.35 1.314 4.8l-.994 3.63 3.754-.976zm12.39-7.234c-.267-.134-1.586-.783-1.831-.873-.245-.089-.424-.134-.602.134-.179.268-.691.873-.847 1.051-.156.178-.311.201-.578.067-.267-.134-1.127-.416-2.146-1.327-.792-.708-1.328-1.583-1.484-1.85-.156-.268-.017-.413.117-.546.121-.12.267-.312.4-.469.134-.156.179-.268.267-.446.089-.178.045-.335-.022-.469-.067-.134-.602-1.449-.824-1.985-.217-.521-.454-.45-.624-.459-.16-.008-.344-.01-.529-.01-.186 0-.489.07-.746.356-.256.285-.979.957-.979 2.334 0 1.378 1.002 2.709 1.143 2.893.141.184 1.973 3.007 4.779 4.212.667.287 1.189.459 1.595.587.67.213 1.28.183 1.763.111.538-.08 1.586-.647 1.809-1.272.223-.625.223-1.16.156-1.272-.067-.112-.245-.178-.512-.313z"/></svg>
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-serif font-bold text-sm text-[#F8F6F2] uppercase tracking-wider">
              Explore Kindleaf
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/#philosophy" className="hover:text-gold transition-colors">Our Philosophy</Link></li>
              <li><Link href="/#blend" className="hover:text-gold transition-colors">The Blend</Link></li>
              <li><Link href="/#brewing" className="hover:text-gold transition-colors">Brewing Guide</Link></li>
              <li><Link href="/#story" className="hover:text-gold transition-colors">Our Story</Link></li>
              <li><Link href="/#blends" className="hover:text-gold transition-colors">Our Blends</Link></li>
              <li><Link href="/#journal" className="hover:text-gold transition-colors">Journal</Link></li>
              <li><Link href="/#faq" className="hover:text-gold transition-colors">FAQ</Link></li>
              <li><Link href="/#contact" className="hover:text-gold transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Column 3: Legal & Policies */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-serif font-bold text-sm text-[#F8F6F2] uppercase tracking-wider">
              Legal &amp; Policy
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/legal?tab=privacy" className="hover:text-gold transition-colors">Privacy Policy</Link></li>
              <li><Link href="/legal?tab=terms" className="hover:text-gold transition-colors">Terms &amp; Conditions</Link></li>
              <li><Link href="/legal?tab=refund" className="hover:text-gold transition-colors">Refund Policy</Link></li>
              <li><Link href="/legal?tab=shipping" className="hover:text-gold transition-colors">Shipping Policy</Link></li>
              <li><Link href="/legal?tab=disclaimer" className="hover:text-gold transition-colors">Medical Disclaimer</Link></li>
            </ul>
          </div>

          {/* Column 4: App CTA */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-serif font-bold text-sm text-[#F8F6F2] uppercase tracking-wider">
              Kindleaf App
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Order fresh small batches, explore guided tea rituals, and track packaging directly in the app.
            </p>
            <button
              onClick={onOpenAppModal}
              className="w-full bg-gold hover:bg-gold-hover text-[#0c1912] font-semibold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <Smartphone size={15} />
              <span>GET THE KINDLEAF APP</span>
            </button>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8 mt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="text-center md:text-left">
            © 2026 Kindleaf Herbal Tea. All rights reserved. | Official Kindleaf brand &amp; product information.
          </p>
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span>Handcrafted with pride in India</span>
            <span>•</span>
            <span>Jasrana, Uttar Pradesh</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
