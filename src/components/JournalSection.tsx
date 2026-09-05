"use client";

import React, { useState } from 'react';
import { JOURNAL_ARTICLES, JournalArticle } from '@/lib/journalData';
import { ArrowRight, Clock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface JournalSectionProps {
  articles?: any[];
}

export default function JournalSection({ articles: dynamicArticles }: JournalSectionProps = {}) {
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);

  const rawList = (dynamicArticles && dynamicArticles.length > 0)
    ? dynamicArticles
    : JOURNAL_ARTICLES;

  const articles = rawList.slice(0, 4).map((art: any) => ({
    id: art.id || art.slug,
    slug: art.slug || art.id,
    title: art.title,
    excerpt: art.excerpt || '',
    category: art.category || 'Mindful Living',
    readTime: art.read_time || art.readTime || '4 min read',
    date: art.date || (art.created_at ? new Date(art.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'),
    coverImage: art.image || art.coverImage || '/assets/ritual-planner-bg.jpg',
    content: Array.isArray(art.content)
      ? art.content
      : typeof art.content === 'string'
      ? art.content.split('\n\n').filter(Boolean)
      : [art.excerpt || '']
  }));

  return (
    <section id="journal" className="py-24 bg-[#0a150f] border-t border-white/5 relative">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-gold text-xs font-semibold uppercase tracking-widest block mb-3">
              Journal &amp; Insights
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#F8F6F2]">
              The Tea Chronicle
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-xl leading-relaxed">
              Explore authentic articles on herbal traditions, mindful steeping science, and the rituals of slow living.
            </p>
          </div>

          <Link
            href="/journal"
            className="text-gold hover:text-gold-hover text-xs font-semibold flex items-center gap-1.5 transition-colors self-start md:self-auto"
          >
            <span>View All Articles</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Article Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((article) => (
            <article 
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="glass-panel border border-white/10 rounded-2xl overflow-hidden hover:border-gold/40 transition-all duration-300 flex flex-col justify-between cursor-pointer group hover:-translate-y-1"
            >
              <div>
                <div className="relative aspect-16/10 overflow-hidden bg-[#0c1912]">
                  <img 
                    src={article.coverImage} 
                    alt={article.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute top-3 left-3 bg-[#0c1912]/80 backdrop-blur-md text-gold text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-white/10">
                    {article.category}
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <Clock size={12} />
                    <span>{article.readTime}</span>
                    <span>•</span>
                    <span>{article.date}</span>
                  </div>

                  <h3 className="font-serif font-bold text-base text-[#F8F6F2] group-hover:text-gold transition-colors leading-snug line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <span className="text-gold text-xs font-semibold flex items-center gap-1 group-hover:underline">
                  <span>Read Story</span>
                  <ArrowRight size={12} />
                </span>
              </div>
            </article>
          ))}
        </div>

      </div>

      {/* Article Reader Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedArticle(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0e2417] border border-white/15 rounded-3xl overflow-hidden shadow-2xl z-10 max-h-[85vh] flex flex-col"
            >
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors z-20 cursor-pointer"
                aria-label="Close article"
              >
                <X size={20} />
              </button>

              <div className="overflow-y-auto p-6 sm:p-10 space-y-6">
                <div>
                  <span className="text-gold text-xs font-semibold uppercase tracking-widest block mb-2">
                    {selectedArticle.category} • {selectedArticle.readTime}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif text-[#F8F6F2] font-bold leading-tight">
                    {selectedArticle.title}
                  </h2>
                  <p className="text-xs text-slate-400 mt-2">
                    Published: {selectedArticle.date} | Kindleaf Tea Journal
                  </p>
                </div>

                <div className="border-t border-white/10 pt-6 space-y-4 text-sm text-slate-300 leading-relaxed font-sans">
                  {selectedArticle.content.map((paragraph: string, i: number) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>

                <div className="pt-6 border-t border-white/10 flex justify-between items-center text-xs text-slate-400">
                  {selectedArticle.slug ? (
                    <Link
                      href={`/journal/${selectedArticle.slug}`}
                      className="text-gold hover:underline font-semibold"
                    >
                      Open Full Page View →
                    </Link>
                  ) : (
                    <span>Kindleaf Editorial</span>
                  )}
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="text-gold hover:underline font-semibold cursor-pointer"
                  >
                    Close Story
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
