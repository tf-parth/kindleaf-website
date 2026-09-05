"use client";

import React, { useState } from 'react';
import { Sparkles, X, ArrowRight } from 'lucide-react';

interface OfferBannerProps {
  offer: {
    id?: string;
    title: string;
    description?: string;
    cta_text?: string;
    active?: boolean;
  } | null;
  onOpenAppModal: () => void;
  onDismiss?: () => void;
}

export default function OfferBanner({ offer, onOpenAppModal, onDismiss }: OfferBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (!offer || !offer.active || dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <aside 
      role="banner"
      className="fixed top-0 left-0 right-0 w-full z-50 h-10 min-h-[40px] max-h-[40px] bg-gradient-to-r from-[#163322] via-[#1c442e] to-[#163322] border-b border-gold/30 text-slate-200 px-3 sm:px-6 shadow-md flex items-center"
    >
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2 overflow-hidden min-w-0">
          <span className="bg-gold/20 text-gold p-1 rounded-full shrink-0">
            <Sparkles size={12} />
          </span>
          <span className="font-bold text-[#F8F6F2] text-xs truncate">{offer.title}</span>
          {offer.description && (
            <span className="hidden md:inline text-slate-300 text-xs truncate opacity-90">• {offer.description}</span>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onOpenAppModal}
            className="bg-gold hover:bg-gold-hover text-[#0c1912] font-semibold px-3 py-1 rounded-full text-[10px] sm:text-[11px] flex items-center gap-1.5 transition-all cursor-pointer shadow whitespace-nowrap"
          >
            <span>{offer.cta_text || "GET THE APP"}</span>
            <ArrowRight size={11} />
          </button>
          <button
            onClick={handleDismiss}
            className="text-slate-400 hover:text-white p-1 cursor-pointer transition-colors shrink-0"
            aria-label="Dismiss banner"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
