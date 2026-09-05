import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Leaf, Clock, ShieldCheck, Sparkles, Smartphone, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { getProducts } from '@/lib/db';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const products = await getProducts();
  const product = products.find((p: any) => p.slug === slug);

  if (!product) {
    return {
      title: 'Product Information | Kindleaf',
      description: 'Official product information and botanical facts for Kindleaf Herbal Green Tea.',
    };
  }

  return {
    title: `${product.title} | Kindleaf Official Product Facts`,
    description: product.description || product.short_description,
    openGraph: {
      title: `${product.title} | Kindleaf Herbal Green Tea`,
      description: product.description || product.short_description,
      images: [product.img || '/assets/product_natural.png'],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const products = await getProducts();
  let product = products.find((p: any) => p.slug === slug);

  // Fallback match by partial slug if needed
  if (!product) {
    if (slug.includes('combo')) {
      product = products.find((p: any) => p.slug?.includes('combo') || p.weight?.includes('2x') || p.title?.includes('Combo'));
    } else {
      product = products.find((p: any) => !p.title?.includes('Combo'));
    }
  }

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#0c1912] text-slate-300 font-sans relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-950/20 rounded-full blur-3xl pointer-events-none" />

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

      {/* Product Content Container */}
      <div className="max-w-6xl mx-auto px-6 py-12 lg:py-16 space-y-12 relative z-10">
        
        {/* Main Product Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Visual Showcase */}
          <div className="lg:col-span-6 glass-panel rounded-3xl p-8 border border-white/10 flex items-center justify-center aspect-square bg-[#0a150f]/80 shadow-2xl">
            <img 
              src={product.img || "/assets/product_natural.png"} 
              alt={product.title} 
              className="max-h-full max-w-full object-contain"
            />
          </div>

          {/* Product Fact Sheet */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-gold text-xs font-semibold uppercase tracking-widest block mb-2">
                Official Product Information • No Direct Website Sales
              </span>
              <h1 className="text-3xl sm:text-4xl font-serif text-[#F8F6F2] font-bold leading-tight">
                {product.title}
              </h1>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                <span className="bg-white/5 border border-white/10 px-2.5 py-1 rounded-md text-gold font-semibold">
                  Net Wt: {product.weight}
                </span>
                <span>•</span>
                <span>100% Whole Botanicals</span>
                <span>•</span>
                <span>Small-Batch Handcrafted</span>
              </div>
            </div>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {product.description}
            </p>

            {/* Botanical Composition */}
            <div className="p-6 rounded-2xl bg-[#0a150f] border border-white/10 space-y-3">
              <h2 className="text-xs uppercase font-bold tracking-wider text-gold flex items-center gap-2">
                <Leaf size={14} />
                <span>Verified Ingredients (Whole Cut)</span>
              </h2>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                <li className="flex items-center justify-between border-b border-white/5 pb-1.5">
                  <span>Premium Green Tea Leaves</span>
                  <span className="text-slate-400 italic text-xs">Camellia sinensis</span>
                </li>
                <li className="flex items-center justify-between border-b border-white/5 pb-1.5">
                  <span>Holy Basil / Tulsi</span>
                  <span className="text-slate-400 italic text-xs">Ocimum tenuiflorum</span>
                </li>
                <li className="flex items-center justify-between border-b border-white/5 pb-1.5">
                  <span>Fresh Dried Lemongrass</span>
                  <span className="text-slate-400 italic text-xs">Cymbopogon citratus</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Dried Ginger Root</span>
                  <span className="text-slate-400 italic text-xs">Zingiber officinale</span>
                </li>
              </ul>
            </div>

            {/* Sensory & Taste Notes */}
            <div className="p-6 rounded-2xl bg-[#0a150f] border border-white/10 space-y-2">
              <h2 className="text-xs uppercase font-bold tracking-wider text-gold flex items-center gap-2">
                <Sparkles size={14} />
                <span>Taste Profile &amp; Aroma</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Light vegetal sweetness with bright citrus notes from lemongrass, balanced by the aromatic peppery aroma of holy basil, finishing with a lingering, gentle ginger warmth.
              </p>
            </div>

            {/* How to Order Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-[#163322] to-[#0e2417] border border-gold/40 space-y-4">
              <div>
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#F8F6F2]">
                  Order via the Kindleaf App
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Kindleaf teas are packaged in small batches and sold directly to customers through the Kindleaf Mobile App to guarantee maximum leaf freshness.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/#get-the-app"
                  className="bg-gold hover:bg-gold-hover text-[#0c1912] font-semibold px-6 py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <Smartphone size={16} />
                  <span>GET THE KINDLEAF APP</span>
                </Link>
                <Link
                  href="/#brewing"
                  className="glass-panel text-slate-300 hover:text-white font-semibold px-6 py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 border border-white/15 transition-colors"
                >
                  <Clock size={16} />
                  <span>Brewing Guide</span>
                </Link>
              </div>
            </div>

          </div>

        </div>

        {/* Detailed Specs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-2">
            <h3 className="font-serif font-bold text-sm text-[#F8F6F2] flex items-center gap-2">
              <Clock size={16} className="text-gold" />
              <span>Brewing Parameters</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              • Water Temperature: 85°C (bubbles forming)<br />
              • Serving Size: 1 tsp (~2 grams)<br />
              • Steeping Duration: 3–5 minutes covered<br />
              • Repeat Infusions: 1–2 times
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-2">
            <h3 className="font-serif font-bold text-sm text-[#F8F6F2] flex items-center gap-2">
              <ShieldCheck size={16} className="text-gold" />
              <span>Storage &amp; Freshness</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              • Shelf Life: 12 months from packing<br />
              • Storage: Cool, dry, dark pantry<br />
              • Packaging: Sealed pouch designed to help preserve aroma and naturally occurring volatile compounds.<br />
              • Additives: 0% synthetic flavourings
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-2">
            <h3 className="font-serif font-bold text-sm text-[#F8F6F2] flex items-center gap-2">
              <CheckCircle2 size={16} className="text-gold" />
              <span>Manufacturer Details</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              • Origin: Jasrana, Firozabad, UP, India<br />
              • Regulatory: FSSAI Licensed Food Business<br />
              • Direct Inquiries: support@kindleaf.in<br />
              • Helpline: +91 6396461480
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
