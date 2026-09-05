"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IngredientsBlendProps {
  items?: any[];
}

const DEFAULT_INGREDIENTS = [
  {
    id: 'greentea',
    number: '01',
    name: 'GREEN TEA',
    botanical: 'Camellia sinensis',
    role: 'Tea Base',
    flavorAroma: 'Fresh, slightly astringent tea base; gives the blend its characteristic green-tea flavour.',
    details: 'Hand-selected leaves providing the crisp, foundational body of each steep without excessive bitterness when brewed with 85°C water.',
    icon: '🍃',
    notes: ['Earthy Base', 'Crisp Clean Finish', 'Subtle Vegetal Notes']
  },
  {
    id: 'tulsi',
    number: '02',
    name: 'TULSI',
    botanical: 'Ocimum tenuiflorum',
    role: 'Aromatic Herb',
    flavorAroma: 'Traditional Indian herb with a distinctive aromatic, peppery profile.',
    details: 'A revered courtyard herb in Indian culture. Whole cut leaves impart a distinctive aromatic depth that gently balances the brisk green tea base.',
    icon: '🌿',
    notes: ['Peppery Undertone', 'Aromatic Sweetness', 'Warm Herbal Body']
  },
  {
    id: 'lemongrass',
    number: '03',
    name: 'LEMONGRASS',
    botanical: 'Cymbopogon citratus',
    role: 'Citrus Brightness',
    flavorAroma: 'Bright, fresh citrus-like aroma and flavour.',
    details: 'Adds an uplifting, zesty fragrance to the steam and lightens the mouthfeel, creating an exceptionally clean and refreshing aftertaste.',
    icon: '🍋',
    notes: ['Citrus Zest', 'Bright Bouquet', 'Crisp Palate Cleanser']
  },
  {
    id: 'ginger',
    number: '04',
    name: 'GINGER',
    botanical: 'Zingiber officinale',
    role: 'Warming Finish',
    flavorAroma: 'Warm, mildly spicy note that gives the blend a rounded finish.',
    details: 'Finely dried ginger root delivers a gentle, lingering warmth at the back of the throat that grounds the brighter citrus and tea notes.',
    icon: '🫚',
    notes: ['Mild Spice', 'Lingering Warmth', 'Rounded Finish']
  }
];

export default function IngredientsBlend({ items }: IngredientsBlendProps = {}) {
  const ingredients = items && items.length > 0
    ? items.map((item, idx) => ({
        id: item.id || `ing-${idx}`,
        number: String(idx + 1).padStart(2, '0'),
        name: item.name || '',
        botanical: item.botanical_name || item.botanical || '',
        role: item.role || item.percentage || 'Botanical',
        flavorAroma: item.flavor_profile || item.flavorAroma || '',
        details: item.description || item.details || '',
        icon: item.icon || '🍃',
        notes: Array.isArray(item.notes)
          ? item.notes
          : typeof item.notes === 'string'
          ? item.notes.split(',').map((s: string) => s.trim()).filter(Boolean)
          : []
      }))
    : DEFAULT_INGREDIENTS;

  const [selectedId, setSelectedId] = useState<string>(ingredients[0]?.id || 'greentea');
  const current = ingredients.find(item => item.id === selectedId) || ingredients[0] || DEFAULT_INGREDIENTS[0];

  return (
    <section id="blend" className="py-24 bg-[#0c1912] relative overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-emerald-950/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-gold text-xs font-semibold uppercase tracking-widest block mb-3">
            The Formulation
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#F8F6F2] mb-5">
            Four Natural Ingredients.<br />
            <span className="text-gold italic font-normal">One Balanced Cup.</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Every batch contains exactly four botanicals blended with care. No extracts, no artificial flavouring sprays, and no synthetic additives.
          </p>
        </div>

        {/* 2-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Ingredient Selection Buttons */}
          <div className="lg:col-span-5 flex flex-col gap-3 justify-center">
            {ingredients.map((item) => {
              const isSelected = item.id === selectedId;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`text-left p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-between group ${
                    isSelected
                      ? 'bg-[#163322] border-gold/60 text-[#F8F6F2] shadow-xl translate-x-1.5'
                      : 'bg-[#0a150f]/60 border-white/10 text-slate-400 hover:border-white/25 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${
                      isSelected ? 'bg-gold/20 text-gold scale-105' : 'bg-white/5 text-slate-400'
                    }`}>
                      {item.icon}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-gold/70">{item.number}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">• {item.role}</span>
                      </div>
                      <h3 className="font-serif font-bold text-base text-[#F8F6F2] group-hover:text-gold transition-colors">
                        {item.name}
                      </h3>
                    </div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                    isSelected 
                      ? 'border-gold/40 text-gold bg-gold/10' 
                      : 'border-transparent text-slate-500'
                  }`}>
                    {item.botanical ? 'Botanical' : 'Natural'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Column: Detailed Interactive Botanical Card */}
          <div className="lg:col-span-7">
            <div className="glass-panel border border-white/10 rounded-3xl p-8 sm:p-10 h-full flex flex-col justify-between relative overflow-hidden shadow-2xl">
              {/* Subtle background glow */}
              <div className="absolute -top-24 -right-24 w-60 h-60 bg-gold/5 rounded-full blur-2xl pointer-events-none" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-6"
                >
                  {/* Top Badge & Botanical Name */}
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-gold text-xs font-semibold uppercase tracking-widest block mb-1">
                        Ingredient {current.number} / 04
                      </span>
                      <h3 className="text-3xl sm:text-4xl font-serif text-[#F8F6F2] font-bold">
                        {current.name}
                      </h3>
                      {current.botanical && (
                        <p className="text-gold/80 italic font-serif text-sm mt-1">
                          Botanical name: {current.botanical}
                        </p>
                      )}
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-[#163322] border border-gold/20 flex items-center justify-center text-3xl shadow-inner shrink-0">
                      {current.icon}
                    </div>
                  </div>

                  {/* Primary Flavour / Aroma Description */}
                  <div className="p-5 rounded-2xl bg-[#163322]/40 border border-gold/20">
                    <span className="text-[11px] uppercase font-bold text-gold tracking-wider block mb-1.5">
                      Flavour &amp; Aroma Profile
                    </span>
                    <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed italic font-serif">
                      &ldquo;{current.flavorAroma}&rdquo;
                    </p>
                  </div>

                  {/* Botanical Description */}
                  <div>
                    <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block mb-2">
                      Thoughtful Blending Note
                    </span>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {current.details}
                    </p>
                  </div>

                  {/* Flavour tags */}
                  <div className="pt-2">
                    <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block mb-2.5">
                      Sensory Characteristics
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {current.notes.map((note: string) => (
                        <span 
                          key={note} 
                          className="text-xs bg-[#163322] border border-white/10 text-[#F8F6F2] px-3.5 py-1.5 rounded-full"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Bottom Assurance Note */}
              <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <span>Natural ingredients • Non-irradiated</span>
                <a href="#brewing" className="text-gold hover:underline font-medium">
                  Learn how to brew →
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
