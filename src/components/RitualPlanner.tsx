"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RotateCcw, Smartphone, ArrowRight } from 'lucide-react';

interface RitualPlannerProps {
  onOpenAppModal: () => void;
}

const intentionsByTime: Record<string, Array<{ id: string; label: string; sub: string; icon: string }>> = {
  morning: [
    { id: 'm-digest', label: 'Morning Warmth', sub: 'A gentle spiced finish to start your day', icon: '🔥' },
    { id: 'm-focus', label: 'Mental Pause', sub: 'Quiet presence for early morning hours', icon: '🧠' },
    { id: 'm-imm', label: 'Daily Aromatic Ritual', sub: 'Traditional botanical harmony', icon: '🌿' }
  ],
  afternoon: [
    { id: 'a-bloat', label: 'After-Lunch Comfort', sub: 'Warm finish after your midday meal', icon: '🍃' },
    { id: 'a-stress', label: 'Mid-day Pause', sub: 'Step away from screens and breathe', icon: '💆' },
    { id: 'a-hydrate', label: 'Bright Refreshment', sub: 'Invigorating citrus lemongrass notes', icon: '✨' }
  ],
  evening: [
    { id: 'e-relax', label: 'Evening Stillness', sub: 'Slow down and ease into calm', icon: '🌙' },
    { id: 'e-digest', label: 'Post-Dinner Sip', sub: 'Soothing ginger and lemongrass notes', icon: '🫚' },
    { id: 'e-detox', label: 'Mindful Restorative', sub: 'Gentle reflection before sleep', icon: '💧' }
  ]
};

const ritualResults: Record<string, { title: string; desc: string; brewTime: string; pair: string; goal: string }> = {
  'morning_m-digest': {
    title: 'The Morning Warmth Ritual',
    desc: 'Sip 20 minutes after your morning meal. Focus on the warm notes of dry ginger awakening your senses. Pair this pause with natural morning light.',
    brewTime: '3 Minutes',
    pair: '5 minutes of natural sunlight exposure',
    goal: 'A warm, comforting start to your morning'
  },
  'morning_m-focus': {
    title: 'The Clarity Pause',
    desc: 'Prepare the cup just before starting your daily tasks. Inhale the clean steam of lemongrass. Keep notifications silent during your tea moments.',
    brewTime: '3 Minutes',
    pair: 'Quiet single-task focus',
    goal: 'A calm, centered morning presence'
  },
  'morning_m-imm': {
    title: 'The Traditional Botanical Cup',
    desc: 'A mindful daily morning brew. Appreciate the peppery aroma of holy basil. Allow the warm tea to establish an unhurried cadence for the day.',
    brewTime: '4 Minutes',
    pair: 'Gentle morning stretching or quiet reflection',
    goal: 'A grounding, fragrant herbal cup'
  },
  'afternoon_a-bloat': {
    title: 'The Post-Lunch Pause',
    desc: 'Sip 30 minutes after your lunch. Enjoy the crisp lemongrass and ginger notes that leave a clean, refreshed palate.',
    brewTime: '4 Minutes',
    pair: 'A slow 5-minute stroll post-meal',
    goal: 'A clean, refreshing after-lunch sip'
  },
  'afternoon_a-stress': {
    title: 'The Digital Screen Break',
    desc: 'Step completely away from your monitor and phone. Feel the gentle warmth of the ceramic mug. This is an intentional pause in your workday.',
    brewTime: '3 Minutes',
    pair: 'Screen-free stillness and deep breathing',
    goal: 'Restoring everyday calm and balance'
  },
  'afternoon_a-hydrate': {
    title: 'The Citrus Refresher',
    desc: 'A bright, aromatic infusion to clear afternoon lethargy. The crisp citrus notes of lemongrass deliver an uplifting sensory pause.',
    brewTime: '3 Minutes',
    pair: 'A glass of cool water before tea',
    goal: 'Refreshing citrus botanical flavors'
  },
  'evening_e-relax': {
    title: 'The Twilight Stillness',
    desc: 'Brewed roughly an hour before sleep. Let the fragrant notes of Tulsi help you transition out of busy work mode. Read a physical book while sipping.',
    brewTime: '5 Minutes',
    pair: 'Warm low lighting and screen-free reading',
    goal: 'Unwinding mindfully into the evening'
  },
  'evening_e-digest': {
    title: 'The Post-Dinner Comfort',
    desc: 'Brewed after your evening dinner. Warm dried ginger comforts the palate while lemongrass leaves a fresh, pleasing aroma.',
    brewTime: '5 Minutes',
    pair: 'Quiet conversation or mindful breathing',
    goal: 'A comforting ginger-citrus nightcap'
  },
  'evening_e-detox': {
    title: 'The Restorative Evening',
    desc: 'A slow, meditative steep. Breathe in the warm herbal aroma of tulsi and lemongrass as steam rises gently from the cup.',
    brewTime: '4 Minutes',
    pair: 'Gratitude journaling (write 3 highlights of the day)',
    goal: 'A gentle, slow evening tea routine'
  }
};

export default function RitualPlanner({ onOpenAppModal }: RitualPlannerProps) {
  const [plannerStep, setPlannerStep] = useState(1);
  const [selectedTime, setSelectedTime] = useState('morning');
  const [selectedIntention, setSelectedIntention] = useState('m-focus');

  const currentResult = ritualResults[`${selectedTime}_${selectedIntention}`] || ritualResults['morning_m-focus'];

  return (
    <section id="planner" className="py-24 bg-[#0a150f] border-y border-white/5 relative">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-gold text-xs font-semibold uppercase tracking-widest block mb-2">
            Lifestyle Tea Planner
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#F8F6F2]">
            Personalized Daily Tea Routine
          </h2>
          <p className="text-slate-300 text-sm mt-3 max-w-xl mx-auto leading-relaxed">
            How you sip matters. Choose your time of day and mindfulness intention to discover your customized daily tea pause.
          </p>
          <p className="text-[11px] text-slate-400 mt-1 italic">
            *Lifestyle and mindfulness routine suggestion; not intended as medical advice.
          </p>
        </div>

        {/* Interactive Box */}
        <div className="glass-panel-heavy border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl">
          {/* Step Breadcrumbs */}
          <div className="flex items-center justify-between text-xs font-semibold mb-8 pb-4 border-b border-white/10 max-w-md mx-auto">
            <button 
              onClick={() => setPlannerStep(1)}
              className={`transition-colors cursor-pointer ${plannerStep >= 1 ? 'text-gold' : 'text-slate-500'}`}
            >
              1. Time of Day
            </button>
            <span className="w-8 h-[1px] bg-white/15" />
            <button 
              onClick={() => { if (selectedTime) setPlannerStep(2); }}
              className={`transition-colors cursor-pointer ${plannerStep >= 2 ? 'text-gold' : 'text-slate-500'}`}
            >
              2. Intention
            </button>
            <span className="w-8 h-[1px] bg-white/15" />
            <button 
              onClick={() => { if (selectedTime && selectedIntention) setPlannerStep(3); }}
              className={`transition-colors cursor-pointer ${plannerStep === 3 ? 'text-gold' : 'text-slate-500'}`}
            >
              3. Your Ritual
            </button>
          </div>

          {/* STEP 1: Time of Day */}
          {plannerStep === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h3 className="text-base sm:text-lg font-serif text-[#F8F6F2] font-semibold text-center mb-6">
                When would you like to introduce your tea pause?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button 
                  onClick={() => { setSelectedTime('morning'); setPlannerStep(2); }}
                  className="p-6 rounded-2xl border border-white/10 bg-[#163322]/20 hover:border-gold/50 hover:bg-[#163322]/40 transition-all text-center flex flex-col items-center group cursor-pointer"
                >
                  <span className="text-4xl mb-3 transform group-hover:scale-110 transition-transform">🌅</span>
                  <h4 className="font-serif font-bold text-base text-[#F8F6F2] mb-1">Morning Hour</h4>
                  <p className="text-slate-400 text-xs">Awaken &amp; Focus</p>
                </button>
                <button 
                  onClick={() => { setSelectedTime('afternoon'); setPlannerStep(2); }}
                  className="p-6 rounded-2xl border border-white/10 bg-[#163322]/20 hover:border-gold/50 hover:bg-[#163322]/40 transition-all text-center flex flex-col items-center group cursor-pointer"
                >
                  <span className="text-4xl mb-3 transform group-hover:scale-110 transition-transform">☀️</span>
                  <h4 className="font-serif font-bold text-base text-[#F8F6F2] mb-1">Afternoon Pause</h4>
                  <p className="text-slate-400 text-xs">Reset &amp; Refresh</p>
                </button>
                <button 
                  onClick={() => { setSelectedTime('evening'); setPlannerStep(2); }}
                  className="p-6 rounded-2xl border border-white/10 bg-[#163322]/20 hover:border-gold/50 hover:bg-[#163322]/40 transition-all text-center flex flex-col items-center group cursor-pointer"
                >
                  <span className="text-4xl mb-3 transform group-hover:scale-110 transition-transform">🌙</span>
                  <h4 className="font-serif font-bold text-base text-[#F8F6F2] mb-1">Evening Stillness</h4>
                  <p className="text-slate-400 text-xs">Unwind &amp; Comfort</p>
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Intention */}
          {plannerStep === 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h3 className="text-base sm:text-lg font-serif text-[#F8F6F2] font-semibold text-center mb-6">
                What sensory quality is your day seeking?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {intentionsByTime[selectedTime]?.map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => { setSelectedIntention(item.id); setPlannerStep(3); }}
                    className="p-6 rounded-2xl border border-white/10 bg-[#163322]/20 hover:border-gold/50 hover:bg-[#163322]/40 transition-all text-center flex flex-col items-center group cursor-pointer"
                  >
                    <span className="text-4xl mb-3 transform group-hover:scale-110 transition-transform">{item.icon}</span>
                    <h4 className="font-serif font-bold text-base text-[#F8F6F2] mb-1">{item.label}</h4>
                    <p className="text-slate-400 text-xs">{item.sub}</p>
                  </button>
                ))}
              </div>
              <div className="text-center pt-2">
                <button 
                  onClick={() => setPlannerStep(1)} 
                  className="text-gold text-xs underline hover:text-gold-hover cursor-pointer"
                >
                  ← Back to Time of Day
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Result */}
          {plannerStep === 3 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-6">
              <span className="inline-flex items-center gap-1.5 bg-gold/10 text-gold text-xs font-semibold px-3.5 py-1 rounded-full border border-gold/30">
                <Sparkles size={13} />
                <span>Your Personalized Tea Routine</span>
              </span>

              <h3 className="text-2xl sm:text-3xl font-serif text-[#F8F6F2] font-bold">
                {currentResult.title}
              </h3>

              <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                {currentResult.desc}
              </p>

              {/* Routine Detail Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-2xl mx-auto bg-[#163322]/30 p-5 rounded-2xl border border-white/10 mt-6">
                <div className="p-3">
                  <span className="text-gold text-[10px] uppercase font-bold tracking-wider block mb-1">Recommended Steep</span>
                  <span className="text-[#F8F6F2] text-sm font-semibold">{currentResult.brewTime}</span>
                </div>
                <div className="p-3">
                  <span className="text-gold text-[10px] uppercase font-bold tracking-wider block mb-1">Mindful Pairing</span>
                  <span className="text-[#F8F6F2] text-xs font-semibold leading-snug">{currentResult.pair}</span>
                </div>
                <div className="p-3">
                  <span className="text-gold text-[10px] uppercase font-bold tracking-wider block mb-1">Sensory Goal</span>
                  <span className="text-[#F8F6F2] text-xs font-semibold leading-snug">{currentResult.goal}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-4 pt-6 border-t border-white/10">
                <button 
                  onClick={() => setPlannerStep(1)} 
                  className="glass-panel text-slate-300 hover:text-white font-semibold px-6 py-3 rounded-full text-xs transition-colors flex items-center gap-2 cursor-pointer border border-white/10"
                >
                  <RotateCcw size={13} />
                  <span>Restart Planner</span>
                </button>

                <a 
                  href="#blend" 
                  className="bg-transparent hover:bg-white/5 text-gold border border-gold/40 font-semibold px-6 py-3 rounded-full text-xs transition-colors flex items-center gap-1.5"
                >
                  <span>Explore the Blend</span>
                  <ArrowRight size={13} />
                </a>

                <button 
                  onClick={onOpenAppModal}
                  className="bg-gold hover:bg-gold-hover text-[#0c1912] font-semibold px-6 py-3 rounded-full text-xs transition-colors flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Smartphone size={14} />
                  <span>Get the Kindleaf App</span>
                </button>
              </div>
            </motion.div>
          )}

        </div>

      </div>
    </section>
  );
}
