"use client";

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Smartphone, ArrowDown } from 'lucide-react';

interface HeroProps {
  onOpenAppModal: () => void;
}

function createInitialLeaves() {
  const leafCount = 14;
  const generated = [];
  for (let i = 0; i < leafCount; i++) {
    const yStart = (Math.random() * 120) - 10;
    const duration = 9 + Math.random() * 9;
    const distanceRatio = (115 - yStart) / 125;
    generated.push({
      id: i,
      left: Math.random() * 100,
      yStart,
      duration,
      currentDuration: duration * distanceRatio,
      scale: 0.5 + Math.random() * 0.6,
      opacity: 0.15 + Math.random() * 0.25,
      isGold: Math.random() > 0.65,
      drift: -25 + Math.random() * 50,
      rotate: 180 + Math.random() * 360,
      animCount: 0
    });
  }
  return generated;
}

export default function Hero({ onOpenAppModal }: HeroProps) {
  const shouldReduceMotion = useReducedMotion();
  const [leaves, setLeaves] = useState(() => createInitialLeaves());

  const handleLeafComplete = (id: number) => {
    setLeaves(prev => prev.map(leaf => {
      if (leaf.id === id) {
        const nextDuration = 9 + Math.random() * 9;
        return {
          ...leaf,
          left: Math.random() * 100,
          yStart: -10,
          duration: nextDuration,
          currentDuration: nextDuration,
          scale: 0.5 + Math.random() * 0.6,
          opacity: 0.15 + Math.random() * 0.25,
          isGold: Math.random() > 0.65,
          drift: -25 + Math.random() * 50,
          rotate: 180 + Math.random() * 360,
          animCount: leaf.animCount + 1
        };
      }
      return leaf;
    }));
  };

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-36 sm:pt-40 md:pt-44 lg:pt-48 pb-16 overflow-hidden bg-[#0c1912]">
      {/* Ambient background glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(45,106,79,0.25),transparent_60%)] pointer-events-none" />
      <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle tea cup silhouette background */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-screen pointer-events-none"
        style={{ backgroundImage: "url('/assets/hero_tea_cup.png')" }}
      />

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 text-center relative z-20 flex flex-col items-center">
        {/* Brand Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-[#163322]/80 border border-gold/30 text-gold text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-8 shadow-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          <span>Official Kindleaf Brand &amp; Product Information</span>
        </motion.div>

        {/* Hero Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-[#F8F6F2] leading-[1.15] mb-8 max-w-4xl"
        >
          Awaken Your Senses,<br />
          <span className="text-gold italic font-normal">Restore Your Calm</span>
        </motion.h1>

        {/* Hero Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mb-12 leading-relaxed font-normal"
        >
          Kindleaf crafts artisanal Indian herbal green tea infused with whole holy basil, lemongrass, and ginger. Pure botanicals, mindful daily rituals, and honest Indian craftsmanship.
        </motion.p>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-center w-full sm:w-auto"
        >
          <button 
            onClick={onOpenAppModal} 
            className="w-full sm:w-auto bg-gold hover:bg-gold-hover text-[#0c1912] font-semibold px-8 py-4 rounded-full transition-all duration-300 shadow-xl hover:shadow-gold/20 flex items-center justify-center gap-2.5 cursor-pointer transform hover:-translate-y-1 active:translate-y-0 text-sm tracking-wide uppercase font-sans"
          >
            <Smartphone size={18} />
            <span>GET THE KINDLEAF APP</span>
          </button>

          <a 
            href="#blend" 
            className="w-full sm:w-auto glass-panel hover:bg-white/10 text-[#F8F6F2] font-semibold px-8 py-4 rounded-full transition-all duration-300 flex items-center justify-center gap-2 border border-white/20 transform hover:-translate-y-1 active:translate-y-0 text-sm tracking-wide uppercase font-sans"
          >
            <span>EXPLORE THE BLEND</span>
            <ArrowDown size={16} className="text-gold" />
          </a>
        </motion.div>

        {/* Micro brand trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-14 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-slate-400 text-xs font-medium"
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-gold text-base">🍃</span>
            <span>4 Simple Ingredients</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-gold text-base">✋</span>
            <span>Handcrafted in Small Batches</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-gold text-base">🇮🇳</span>
            <span>Made in India</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-gold text-base">📱</span>
            <span>Order via Kindleaf App</span>
          </div>
        </motion.div>
      </div>

      {/* Lightweight Floating Leaves */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {leaves.map(leaf => (
          <motion.div
            key={`${leaf.id}-${leaf.animCount}`}
            className="absolute pointer-events-none"
            initial={{
              left: `${leaf.left}%`,
              top: 0,
              y: `${leaf.yStart}vh`,
              rotate: 0,
              x: 0
            }}
            animate={shouldReduceMotion ? {} : {
              y: "115vh",
              x: [0, leaf.drift * 0.4, leaf.drift * -0.3, leaf.drift * 0.8, leaf.drift],
              rotate: [0, leaf.rotate * 0.25, leaf.rotate * 0.5, leaf.rotate * 0.75, leaf.rotate]
            }}
            transition={{
              duration: leaf.currentDuration,
              ease: "linear"
            }}
            onAnimationComplete={() => handleLeafComplete(leaf.id)}
            style={{
              opacity: leaf.opacity,
              transformOrigin: "center"
            }}
          >
            <span 
              className="inline-block w-3.5 h-3.5 rounded-tl-[10px] rounded-br-[10px] shadow-sm"
              style={{
                transform: `scale(${leaf.scale})`,
                backgroundColor: leaf.isGold ? '#c5a880' : '#2d6a4f',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
