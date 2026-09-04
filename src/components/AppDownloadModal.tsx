"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone } from 'lucide-react';
import { KINDLEAF_APP_CONFIG, openKindleafApp } from '@/lib/constants';

interface AppDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AppDownloadModal({ isOpen, onClose }: AppDownloadModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-2xl bg-[#0c1912] border border-gold/30 rounded-3xl overflow-hidden shadow-2xl z-10 my-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors z-20 cursor-pointer"
            aria-label="Close app modal"
          >
            <X size={20} />
          </button>

          <div className="p-6 sm:p-10 space-y-8">
            
            {/* Header */}
            <div className="text-center space-y-2">
              <span className="inline-flex items-center gap-1.5 bg-gold/10 text-gold text-xs font-semibold px-3.5 py-1 rounded-full border border-gold/20">
                <Smartphone size={13} />
                <span>Mobile Experience</span>
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-[#F8F6F2] font-bold">
                Get the Kindleaf App
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                Direct tea ordering, real-time packaging updates, guided mindfulness timers, and exclusive fresh harvest drops are in the Kindleaf App.
              </p>
            </div>

            {/* Quick Open App button (Deep link) */}
            <div className="text-center">
              <button
                onClick={() => {
                  openKindleafApp();
                }}
                className="w-full sm:w-auto bg-gold hover:bg-gold-hover text-[#0c1912] font-semibold px-8 py-3.5 rounded-full text-xs uppercase tracking-wider transition-all shadow-xl hover:shadow-gold/20 flex items-center justify-center gap-2 mx-auto cursor-pointer transform hover:-translate-y-0.5"
              >
                <Smartphone size={16} />
                <span>Open in Kindleaf App (If Installed)</span>
              </button>
              <p className="text-[11px] text-slate-400 mt-2">
                Schema: <code className="text-gold font-mono">{KINDLEAF_APP_CONFIG.deepLink}</code>
              </p>
            </div>

            {/* Features preview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {KINDLEAF_APP_CONFIG.features.map((feat) => (
                <div 
                  key={feat.title}
                  className="p-3.5 rounded-xl bg-[#163322]/30 border border-white/5 flex items-start gap-3"
                >
                  <span className="text-xl shrink-0">{feat.icon}</span>
                  <div>
                    <h4 className="text-xs font-bold text-[#F8F6F2] mb-0.5">{feat.title}</h4>
                    <p className="text-[11px] text-slate-400 leading-tight">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Store download & QR Code */}
            <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-6">
              {/* Store Buttons */}
              <div className="space-y-2.5 w-full sm:w-auto">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block text-center sm:text-left">
                  Download from App Stores
                </span>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={KINDLEAF_APP_CONFIG.playStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-panel hover:bg-white/10 text-[#F8F6F2] px-4 py-2.5 rounded-xl border border-white/15 flex items-center gap-3 transition-colors justify-center"
                  >
                    <span className="text-lg">🤖</span>
                    <div className="text-left">
                      <span className="text-[9px] uppercase tracking-wider block text-slate-400">Get it on</span>
                      <span className="text-xs font-bold font-sans">Google Play</span>
                    </div>
                  </a>

                  <a
                    href={KINDLEAF_APP_CONFIG.appStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-panel hover:bg-white/10 text-[#F8F6F2] px-4 py-2.5 rounded-xl border border-white/15 flex items-center gap-3 transition-colors justify-center"
                  >
                    <span className="text-lg">🍏</span>
                    <div className="text-left">
                      <span className="text-[9px] uppercase tracking-wider block text-slate-400">Download on</span>
                      <span className="text-xs font-bold font-sans">App Store</span>
                    </div>
                  </a>
                </div>
              </div>

              {/* QR Code Simulation */}
              <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-2xl shrink-0">
                <div className="w-16 h-16 bg-white rounded-lg p-1.5 flex items-center justify-center">
                  {/* Decorative QR code matrix representation */}
                  <div className="w-full h-full grid grid-cols-5 gap-0.5 bg-black p-0.5">
                    <div className="bg-white col-span-2 row-span-2"></div>
                    <div className="bg-black"></div>
                    <div className="bg-white col-span-2 row-span-2"></div>
                    <div className="bg-black"></div>
                    <div className="bg-white"></div>
                    <div className="bg-white"></div>
                    <div className="bg-black"></div>
                    <div className="bg-white col-span-2 row-span-2"></div>
                    <div className="bg-black"></div>
                    <div className="bg-white"></div>
                  </div>
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-gold block">Scan to Open</span>
                  <span className="text-[10px] text-slate-400">Point mobile camera</span>
                </div>
              </div>

            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
