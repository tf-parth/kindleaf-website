import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Clock, Smartphone } from 'lucide-react';
import { JOURNAL_ARTICLES } from '@/lib/journalData';
import { getJournalArticles } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Journal & Herbal Insights | Kindleaf Official',
  description: 'Explore thoughtful editorial pieces on mindful tea brewing, the heritage of holy basil and lemongrass, and slow living.',
};

export const revalidate = 0; // Fresh data on each load

export default async function JournalPage() {
  let articles: any[] = [];
  try {
    const fetched = await getJournalArticles();
    if (fetched && fetched.length > 0) {
      articles = fetched;
    } else {
      articles = JOURNAL_ARTICLES;
    }
  } catch (err) {
    articles = JOURNAL_ARTICLES;
  }

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
          {articles.map((article) => {
            const paragraphs = Array.isArray(article.content)
              ? article.content
              : typeof article.content === 'string'
              ? article.content.split('\n\n').filter(Boolean)
              : [article.excerpt || ''];

            return (
              <article 
                key={article.id || article.slug}
                className="glass-panel rounded-3xl border border-white/10 p-8 sm:p-12 space-y-6 shadow-2xl transition hover:border-gold/30"
              >
                {article.image && (
                  <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden mb-6 border border-white/10">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 text-xs text-slate-400">
                  <div className="flex items-center gap-3">
                    <span className="bg-[#163322] text-gold border border-gold/30 px-3 py-1 rounded-full font-semibold uppercase text-[10px] tracking-wider">
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={12} />
                      <span>{article.read_time || article.readTime || '4 min read'}</span>
                    </span>
                  </div>
                  <span>{article.date || (article.created_at ? new Date(article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '')}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-serif text-[#F8F6F2] font-bold leading-snug">
                  {article.slug ? (
                    <Link href={`/journal/${article.slug}`} className="hover:text-gold transition-colors">
                      {article.title}
                    </Link>
                  ) : (
                    article.title
                  )}
                </h2>

                <div className="space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
                  {paragraphs.map((paragraph: string, pIdx: number) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                  <span>Written with care by Kindleaf</span>
                  {article.slug && (
                    <Link href={`/journal/${article.slug}`} className="text-gold hover:underline font-semibold">
                      Read Standalone Article →
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
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
