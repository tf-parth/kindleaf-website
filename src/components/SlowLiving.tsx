"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function SlowLiving() {
  return (
    <section className="py-24 relative overflow-hidden bg-[#0a150f] border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Visual card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 relative order-2 lg:order-1"
          >
            <div className="relative border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-4 glass-panel group">
              <img 
                src="/assets/hero_tea_cup.png" 
                alt="Kindleaf slow living tea cup ritual" 
                className="w-full h-auto rounded-2xl object-cover transform group-hover:scale-102 transition-transform duration-500" 
              />
              <div className="absolute bottom-8 left-8 right-8 p-5 bg-[#0c1912]/85 backdrop-blur-md rounded-xl border border-white/10">
                <span className="text-gold text-xs font-semibold uppercase tracking-wider block mb-1">
                  Daily Mindful Sip
                </span>
                <p className="text-xs sm:text-sm text-slate-200">
                  &ldquo;Take three deep breaths before your first sip. Feel the warmth of the ceramic cup.&rdquo;
                </p>
              </div>
            </div>
          </motion.div>

          {/* Narrative Content */}
          <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
            <span className="text-gold text-xs font-semibold uppercase tracking-widest block">
              Slow Living
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#F8F6F2] leading-tight">
              Not another notification.<br />
              <span className="text-gold italic font-normal">Not another deadline.</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              We spend so much time taking care of everything around us that we often forget to recharge ourselves. Kindleaf is more than just green tea. It’s a mindful ritual, a warm cup in your hands, and a small pause that makes a big difference.
            </p>

            {/* Simple Ingredients callout */}
            <div className="p-6 rounded-2xl bg-[#163322]/30 border border-gold/20 space-y-2">
              <h3 className="text-base font-serif font-bold text-gold">
                Simple Ingredients
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Our blend is made from green tea, tulsi, lemongrass and ginger, selected and blended with care.
              </p>
            </div>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              No hurried preparation, no complicated tools needed. Just heated water, a teaspoon of whole botanicals, and five undisturbed minutes to reclaim your clarity.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
