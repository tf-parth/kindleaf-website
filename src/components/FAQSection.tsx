"use client";

import React, { useState } from 'react';
import { ChevronDown, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  onOpenAppModal: () => void;
}

export default function FAQSection({ onOpenAppModal }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: "What is Kindleaf?",
      answer: "Kindleaf is an artisanal Indian herbal tea brand. Founded by Gaurav Singh from a soldier's family in Jasrana, Uttar Pradesh, we craft 100% natural herbal green tea blends designed for mindful daily tea rituals."
    },
    {
      question: "What ingredients are used in the blend?",
      answer: "Kindleaf contains exactly four natural botanicals: Green Tea Leaves (Camellia sinensis), Holy Basil / Tulsi (Ocimum tenuiflorum), Lemongrass (Cymbopogon citratus), and Dried Ginger Root (Zingiber officinale). There are no artificial flavours, sprays, or preservatives."
    },
    {
      question: "How should Kindleaf be brewed for optimal flavour?",
      answer: "Heat fresh water to approximately 85°C (bubbles forming gently, not a violent rolling boil). Add 1 teaspoon (about 2 grams) to your cup or infuser, pour the water, and steep covered for 3 to 5 minutes. Strain and sip mindfully."
    },
    {
      question: "What does the blend taste like?",
      answer: "The blend offers a balanced, smooth flavour profile: fresh, crisp green tea with an uplifting citrus aroma from lemongrass, a fragrant peppery middle from Holy Basil, and a comforting warm finish from dry ginger."
    },
    {
      question: "Where can I purchase Kindleaf?",
      answer: "To ensure direct freshness and direct small-batch packaging, Kindleaf products are ordered exclusively through the official Kindleaf Mobile App for Android and iOS. This website is purely educational and does not process payments or orders directly."
    },
    {
      question: "How does the Kindleaf App work?",
      answer: "The Kindleaf Mobile App allows you to order fresh batches directly, track small-batch dispatch in real time, access daily guided tea mindfulness timers, and receive notifications when limited seasonal harvests become available."
    },
    {
      question: "Does Kindleaf contain caffeine?",
      answer: "Yes, because the base of our blend is natural Camellia sinensis (green tea leaves), it naturally contains a mild amount of caffeine (typically 20-30mg per cup, roughly one-third of a cup of coffee). It is paired with calming herbs like Tulsi for a steady, jitter-free tea moment."
    },
    {
      question: "What is the shelf life and how should it be stored?",
      answer: "Kindleaf tea retains its optimal aromatic freshness for 12 months from the packaging date. Keep the pouch tightly sealed in a cool, dry place away from direct sunlight, moisture, and strong spices."
    }
  ];

  return (
    <section id="faq" className="py-24 bg-[#0c1912] border-t border-white/5 relative">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-gold text-xs font-semibold uppercase tracking-widest block mb-3">
            Common Inquiries
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#F8F6F2]">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-3 max-w-xl mx-auto leading-relaxed">
            Everything you need to know about our blend, brewing rituals, ingredients, and the Kindleaf App.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={faq.question}
                className="glass-panel border border-white/10 rounded-2xl overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left p-6 sm:p-7 flex items-center justify-between gap-4 cursor-pointer hover:bg-white/5 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif font-bold text-base sm:text-lg text-[#F8F6F2]">
                    {faq.question}
                  </span>
                  <span className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gold shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-gold/20' : ''}`}>
                    <ChevronDown size={18} />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-6 sm:px-7 pb-6 text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-white/5 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="mt-12 p-6 rounded-2xl bg-[#163322]/30 border border-gold/20 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="font-serif font-bold text-base text-[#F8F6F2]">
              Have a question not listed here?
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Reach out to our team directly via email or our contact desk.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="#contact"
              className="text-xs glass-panel hover:bg-white/10 text-[#F8F6F2] font-semibold px-4 py-2.5 rounded-full transition-colors border border-white/15"
            >
              Contact Desk
            </a>
            <button
              onClick={onOpenAppModal}
              className="text-xs bg-gold hover:bg-gold-hover text-[#0c1912] font-semibold px-5 py-2.5 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Smartphone size={13} />
              <span>Kindleaf App Support</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
