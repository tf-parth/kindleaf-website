"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Smartphone, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface NavbarProps {
  onOpenAppModal: () => void;
  logoUrl?: string;
  websiteName?: string;
}

export default function Navbar({ onOpenAppModal, logoUrl = "/assets/logo.png", websiteName = "Kindleaf" }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: "Our Philosophy", href: "/#philosophy" },
    { label: "The Blend", href: "/#blend" },
    { label: "Brewing Guide", href: "/#brewing" },
    { label: "Our Story", href: "/#story" },
    { label: "Journal", href: "/#journal" },
    { label: "FAQ", href: "/#faq" },
    { label: "Contact", href: "/#contact" },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled 
            ? 'glass-navbar py-3 shadow-xl bg-[#0c1912]/80 backdrop-blur-xl border-b border-white/10' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <img 
              src={logoUrl} 
              alt={websiteName} 
              className="h-9 md:h-10 w-auto rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105" 
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[#F8F6F2]/90 hover:text-gold transition-colors text-xs xl:text-sm font-medium tracking-wide relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-gold after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </a>
            ))}

            {/* GET THE APP CTA */}
            <button
              onClick={onOpenAppModal}
              className="bg-gold hover:bg-gold-hover text-[#0c1912] font-semibold px-5 py-2.5 rounded-full transition-all duration-300 text-xs xl:text-sm shadow-md hover:shadow-gold/20 flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Smartphone size={15} />
              <span>GET THE APP</span>
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={onOpenAppModal}
              className="bg-gold text-[#0c1912] font-semibold px-3.5 py-1.5 rounded-full text-xs flex items-center gap-1.5 shadow-sm"
            >
              <Smartphone size={13} />
              <span>Get App</span>
            </button>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#F8F6F2] hover:text-gold transition-colors rounded-lg bg-white/5 border border-white/10"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="fixed inset-0 top-[60px] bg-[#0c1912]/95 backdrop-blur-2xl z-40 flex flex-col justify-between p-8 lg:hidden border-t border-white/10 overflow-y-auto"
          >
            <div className="flex flex-col gap-5 pt-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[#F8F6F2] text-lg font-serif font-medium hover:text-gold transition-colors py-2 border-b border-white/5 flex items-center justify-between"
                >
                  <span>{link.label}</span>
                  <ArrowRight size={16} className="text-gold/60" />
                </a>
              ))}
            </div>

            <div className="pt-8 pb-4 flex flex-col gap-4">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAppModal();
                }}
                className="w-full bg-gold hover:bg-gold-hover text-[#0c1912] font-semibold py-4 rounded-xl text-center text-sm shadow-lg flex items-center justify-center gap-2"
              >
                <Smartphone size={18} />
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
