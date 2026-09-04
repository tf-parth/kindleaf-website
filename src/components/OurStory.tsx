"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function OurStory() {
  const trustBadges = [
    {
      top: "100%",
      label: "Pure & Natural",
      sub: "No artificial oils, sprays, or chemicals"
    },
    {
      top: "FSSAI",
      label: "Licensed / Registered",
      sub: "Food safety standards compliant"
    },
    {
      top: "Handcrafted",
      label: "Small-Batch Blended",
      sub: "Prepared with precision and pride"
    },
    {
      top: "India",
      label: "Made in India",
      sub: "Jasrana, Firozabad, Uttar Pradesh"
    }
  ];

  return (
    <section id="story" className="py-24 bg-[#0a150f] border-t border-white/5 relative overflow-hidden">
      {/* Decorative ambient background */}
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Story Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-gold text-xs font-semibold uppercase tracking-widest block">
              Our Roots &amp; Heritage
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#F8F6F2] leading-tight">
              A Small Dream from a <br className="hidden sm:inline" />
              <span className="text-gold italic font-normal">Soldier’s Home</span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Kindleaf did not begin in a corporate boardroom or an industrial processing plant. It was born right at home in Jasrana, Firozabad, Uttar Pradesh, founded by Gaurav Singh, coming from a proud soldier’s family.
            </p>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Growing up in a home anchored in discipline and integrity, honesty was non-negotiable. When observing the commercial tea industry, it was clear that many shelves were filled with artificial flavorings, synthetic sprays, and hollow marketing promises.
            </p>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Kindleaf was created with an unwavering commitment: craft a tea blend that is 100% natural, using pure whole green tea leaves, aromatic holy basil (Tulsi), zesty lemongrass, and warming dried ginger. Each batch is blended and packaged in small quantities with meticulous care.
            </p>

            {/* Founder Quote */}
            <blockquote className="border-l-2 border-gold pl-6 py-4 bg-[#163322]/25 rounded-r-2xl pr-6 space-y-2">
              <p className="text-gold font-serif italic text-sm sm:text-base leading-relaxed">
                &ldquo;I strongly believe in one principle: If you can&rsquo;t consume your own product every day, you probably shouldn&rsquo;t be selling it. At Kindleaf, we drink the exact same tea we ship to you.&rdquo;
              </p>
              <cite className="block text-xs font-semibold text-slate-400 not-italic tracking-wider uppercase">
                — Gaurav Singh, Founder
              </cite>
            </blockquote>
          </div>

          {/* Trust Badges Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {trustBadges.map((badge, idx) => (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-6 rounded-2xl border border-white/10 bg-[#163322]/15 text-center space-y-2 glass-panel hover:border-gold/30 transition-all duration-300"
              >
                <span className="text-2xl font-serif text-gold font-bold block">
                  {badge.top}
                </span>
                <h3 className="text-[#F8F6F2] font-semibold text-xs uppercase tracking-wider">
                  {badge.label}
                </h3>
                <p className="text-slate-400 text-[11px] leading-snug">
                  {badge.sub}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
