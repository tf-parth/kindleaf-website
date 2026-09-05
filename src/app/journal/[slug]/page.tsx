import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, Share2, Sparkles, BookOpen } from 'lucide-react';
import { getJournalArticleBySlug, getJournalArticles } from '@/lib/db';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = await getJournalArticles(true);
  return articles.map((article: any) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const article = await getJournalArticleBySlug(slug);
  if (!article) return { title: 'Article Not Found | Kindleaf' };

  return {
    title: article.seo_title || `${article.title} | Kindleaf Journal`,
    description: article.seo_description || article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.coverImage || '/assets/hero_tea_cup.png'],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const article = await getJournalArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#0c1912] text-slate-300 font-sans relative overflow-hidden selection:bg-gold selection:text-[#0c1912]">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-gold/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 left-10 w-96 h-96 rounded-full bg-emerald-900/10 blur-3xl pointer-events-none" />

      {/* Sticky header bar */}
      <header className="border-b border-white/10 bg-[#0c1912]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/journal" className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-gold transition-colors">
            <ArrowLeft size={16} />
            <span>All Articles</span>
          </Link>
          <Link href="/">
            <img src="/assets/logo.png" alt="Kindleaf" className="h-8 w-auto rounded" />
          </Link>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-6 py-16 space-y-10 relative z-10">
        {/* Category & Meta */}
        <div className="space-y-4 text-center">
          <span className="inline-flex items-center gap-1.5 bg-gold/10 text-gold text-xs font-bold px-3.5 py-1 rounded-full border border-gold/20 uppercase tracking-widest">
            <Sparkles size={12} />
            <span>{article.category || 'Tea Rituals'}</span>
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#F8F6F2] font-bold leading-tight">
            {article.title}
          </h1>

          <div className="flex items-center justify-center gap-4 text-xs text-slate-400 pt-2 border-b border-white/10 pb-6">
            <span>By {article.author || 'Kindleaf Herbalist'}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock size={13} />
              <span>{article.readTime || '4 min read'}</span>
            </span>
            <span>•</span>
            <span>{article.date || 'August 2026'}</span>
          </div>
        </div>

        {/* Hero image */}
        {article.coverImage && (
          <div className="aspect-16/9 rounded-3xl overflow-hidden bg-black/40 border border-white/10 shadow-2xl">
            <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Lead Excerpt */}
        {article.excerpt && (
          <p className="text-base sm:text-lg text-slate-200 font-serif italic leading-relaxed border-l-2 border-gold pl-6 py-2 bg-[#163322]/20 rounded-r-2xl pr-4">
            {article.excerpt}
          </p>
        )}

        {/* Article Body */}
        <div className="space-y-6 text-sm sm:text-base leading-relaxed text-slate-300 font-normal">
          {Array.isArray(article.content) ? (
            article.content.map((paragraph: string, idx: number) => (
              <p key={idx} className="leading-relaxed">
                {paragraph}
              </p>
            ))
          ) : (
            <p className="leading-relaxed">{article.content}</p>
          )}
        </div>

        {/* Author bio / Brand footer note */}
        <div className="p-8 rounded-3xl bg-[#163322]/30 border border-white/10 mt-16 space-y-3">
          <div className="flex items-center gap-2 text-gold font-serif font-bold text-sm">
            <BookOpen size={16} />
            <span>The Kindleaf Philosophy</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            At Kindleaf, we believe tea is an intentional pause, not another deadline. Each batch is blended by hand in Jasrana, Uttar Pradesh with 100% natural whole cut botanicals.
          </p>
          <div className="pt-2">
            <Link href="/" className="text-xs text-gold hover:underline font-semibold inline-flex items-center gap-1">
              <span>Explore our handcrafted herbal green tea blends</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
