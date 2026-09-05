"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Smartphone, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface NavbarProps {
  onOpenAppModal: () => void;
  logoUrl?: string;
  websiteName?: string;
  topOffset?: number;
}

export default function Navbar({ 
  onOpenAppModal, 
  logoUrl = "/assets/logo.png", 
  websiteName = "Kindleaf",
  topOffset = 0
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = React.useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState(64);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, [scrolled, topOffset]);

  const navLinks = [
    { label: "Our Philosophy", href: "/#philosophy" },
    { label: "The Blend", href: "/#blend" },
    { label: "Brewing Guide", href: "/#brewing" },
    { label: "Our Story", href: "/#story" },
    { label: "Journal", href: "/#journal" },
    { label: "FAQ", href: "/#faq" },
    { label: "Contact", href: "/#contact" },
  ];

  const drawerTop = topOffset + headerHeight;

  return (
    <>
      <header 
        ref={headerRef}
        style={{ top: `${topOffset}px` }}
        className={`fixed left-0 right-0 w-full z-40 transition-all duration-300 ${
          scrolled 
            ? 'glass-navbar py-2.5 sm:py-3 shadow-xl bg-[#0c1912]/90 backdrop-blur-xl border-b border-white/10' 
            : 'bg-[#0c1912]/60 backdrop-blur-md py-3.5 sm:py-4 border-b border-white/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <img 
              src={logoUrl} 
              alt={websiteName} 
              className="h-8 sm:h-9 md:h-10 w-auto rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105" 
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-3 xl:gap-5 2xl:gap-7 shrink-0">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[#F8F6F2]/90 hover:text-gold transition-colors text-xs xl:text-sm font-medium tracking-wide relative py-1 whitespace-nowrap after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-gold after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </a>
            ))}

            {/* GET THE APP CTA */}
            <button
              onClick={onOpenAppModal}
              className="bg-gold hover:bg-gold-hover text-[#0c1912] font-semibold px-4 xl:px-5 py-2 xl:py-2.5 rounded-full transition-all duration-300 text-xs xl:text-sm shadow-md hover:shadow-gold/20 flex items-center gap-1.5 xl:gap-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 shrink-0 whitespace-nowrap"
            >
              <Smartphone size={14} className="xl:w-[15px] xl:h-[15px]" />
              <span>GET THE APP</span>
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 sm:gap-3 lg:hidden shrink-0">
            <button
              onClick={onOpenAppModal}
              className="bg-gold text-[#0c1912] font-semibold px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 shadow-sm whitespace-nowrap"
            >
              <Smartphone size={13} />
              <span>Get App</span>
            </button>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#F8F6F2] hover:text-gold transition-colors rounded-lg bg-white/5 border border-white/10 shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            style={{ top: `${drawerTop}px` }}
            className="fixed inset-x-0 bottom-0 bg-[#0c1912]/98 backdrop-blur-2xl z-40 flex flex-col justify-between p-6 sm:p-8 lg:hidden border-t border-white/10 overflow-y-auto"
          >
            <div className="flex flex-col gap-4 pt-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[#F8F6F2] text-base sm:text-lg font-serif font-medium hover:text-gold transition-colors py-2.5 border-b border-white/5 flex items-center justify-between"
                >
                  <span>{link.label}</span>
                  <ArrowRight size={16} className="text-gold/60" />
                </a>
              ))}
            </div>

            <div className="pt-6 pb-2 flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAppModal();
                }}
                className="w-full bg-gold hover:bg-gold-hover text-[#0c1912] font-semibold py-3.5 rounded-xl text-center text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Smartphone size={16} />
                <span>GET THE KINDLEAF APP</span>
              </button>
              <p className="text-center text-[11px] text-slate-400">
                Official Kindleaf brand &amp; product information website.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
