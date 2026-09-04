import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Clock, Smartphone } from 'lucide-react';
import { JOURNAL_ARTICLES } from '@/lib/journalData';

export const metadata: Metadata = {
  title: 'Journal & Herbal Insights | Kindleaf Official',
  description: 'Explore thoughtful editorial pieces on mindful tea brewing, the heritage of holy basil and lemongrass, and slow living.',
};

export default function JournalPage() {
  return (
    <main className="min-h-screen bg-[#0c1912] text-slate-300 font-sans relative overflow-hidden">
      {/* Header bar */}
      <header className="border-b border-white/10 bg-[#0c1912]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-gold transition-colors">
            <ArrowLeft size={16} />
            <span>Back to Kindleaf Official Brand Website</span>
          </Link>
          <img src="/assets/logo.png" alt="Kindleaf" className="h-8 w-auto rounded" />
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-16 space-y-16">
        
        {/* Intro */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-gold text-xs font-semibold uppercase tracking-widest block">
            The Kindleaf Journal
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif text-[#F8F6F2] font-bold">
            Stories of Tea, Heritage &amp; Slow Living
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Thoughtful essays and guides on the botanical harmony of holy basil and lemongrass, the art of mindful steeping, and honest tea traditions.
          </p>
        </div>

        {/* Articles List */}
        <div className="space-y-16">
          {JOURNAL_ARTICLES.map((article) => (
            <article 
              key={article.id}
              className="glass-panel rounded-3xl border border-white/10 p-8 sm:p-12 space-y-6 shadow-2xl"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="bg-[#163322] text-gold border border-gold/30 px-3 py-1 rounded-full font-semibold uppercase text-[10px] tracking-wider">
                    {article.category}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={12} />
                    <span>{article.readTime}</span>
                  </span>
                </div>
                <span>{article.date}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif text-[#F8F6F2] font-bold leading-snug">
                {article.title}
              </h2>

              <div className="space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
                {article.content.map((paragraph, pIdx) => (
                  <p key={pIdx}>{paragraph}</p>
                ))}
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                <span>Written with care by Kindleaf</span>
                <Link href="/#blends" className="text-gold hover:underline font-semibold">
                  Explore The Blends →
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom App Discovery Callout */}
        <div className="p-8 rounded-3xl bg-[#163322]/40 border border-gold/30 text-center max-w-2xl mx-auto space-y-4">
          <h3 className="text-2xl font-serif text-[#F8F6F2] font-bold">
            Experience the Daily Tea Ritual
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Order small-batch handcrafted blends and access mindful tea timers inside the Kindleaf App.
          </p>
          <Link
            href="/#get-the-app"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-hover text-[#0c1912] font-semibold px-6 py-3.5 rounded-full text-xs transition-colors"
          >
            <Smartphone size={16} />
            <span>GET THE KINDLEAF APP</span>
          </Link>
        </div>

      </div>
    </main>
  );
}
