"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function Philosophy() {
  const pillars = [
    {
      icon: "🌱",
      title: "Simple Ingredients",
      desc: "No artificial flavoring oils, chemical preservatives, or synthetic sprays. Exactly four natural ingredients blended in honest proportions."
    },
    {
      icon: "🧘",
      title: "Mindful Tea Rituals",
      desc: "We view tea not as a rushed morning caffeine hit, but as a deliberate ten-minute pause to ground your senses and reset your day."
    },
    {
      icon: "✨",
      title: "Thoughtful Blending",
      desc: "Every botanical is chosen for sensory harmony: refreshing green tea base, peppery holy basil, citrusy lemongrass, and warming ginger."
    },
    {
      icon: "☀️",
      title: "Everyday Tea Moments",
      desc: "Created for real life. Whether greeting the dawn, taking an afternoon breath, or unwinding after sunset, Kindleaf fits seamlessly into your rhythm."
    }
  ];

  return (
    <section id="philosophy" className="py-24 relative overflow-hidden bg-[#0a150f] border-t border-white/5">
      {/* Decorative ambient lighting */}
      <div className="absolute top-1/2 -left-40 w-80 h-80 bg-[#1b4332]/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Story & Philosophy */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-gold text-xs font-semibold uppercase tracking-widest block">
              Our Philosophy
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#F8F6F2] leading-tight">
              A Quiet Pause in a <br className="hidden sm:inline" />
              <span className="text-gold italic font-normal">Busy World</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              In a world full of rapid notifications, urgent deadlines, and sensory overload, true wellness begins with simplicity. Kindleaf was created on the premise that what you put into your body every day should be honest, transparent, and grounding.
            </p>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              We do not formulate trendy quick fixes or make exaggerated claims. Instead, we hand-blend pure green tea leaves with traditional Indian herbs for a cup that tastes clean, smells vibrant, and gives you space to simply breathe.
            </p>

            <div className="pt-4 flex items-center gap-6">
              <div className="border-l-2 border-gold pl-4 py-1">
                <span className="text-xl font-serif font-bold text-gold block">4 Ingredients</span>
                <span className="text-xs text-slate-400">Zero Artificial Flavoring</span>
              </div>
              <div className="border-l-2 border-gold pl-4 py-1">
                <span className="text-xl font-serif font-bold text-gold block">100% Whole</span>
                <span className="text-xs text-slate-400">Handcrafted Cut Leaves</span>
              </div>
            </div>
          </div>

          {/* Right Column: 4 Pillars Cards */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {pillars.map((pillar, idx) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-gold/30 transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-[#163322] border border-white/10 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  {pillar.icon}
                </div>
                <h3 className="font-serif font-bold text-base text-[#F8F6F2] mb-2 group-hover:text-gold transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  {pillar.desc}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
