import React from 'react';
import { Smartphone, Eye, ArrowRight, ShieldCheck, Sparkles, Clock, Leaf, ShoppingBag, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export interface ProductItem {
  id: string;
  title: string;
  slug?: string;
  description?: string;
  short_description?: string;
  weight: string;
  category?: string;
  taste_profile?: string;
  aroma?: string;
  ingredients?: string | string[];
  img?: string;
  images?: string[];
  brewing_summary?: string;
  fssai_info?: string;
  amazon_url?: string;
  amazon_button_enabled?: boolean;
  status?: string;
  display_order?: number;
}

interface OurBlendsProps {
  products: ProductItem[];
  onSelectProduct: (product: ProductItem) => void;
  onOpenAppModal: () => void;
}

export default function OurBlends({ products, onSelectProduct, onOpenAppModal }: OurBlendsProps) {
  // Fallback products if DB is loading
  const defaultProducts = [
    {
      id: "mock-natural-100",
      title: "Handcrafted Herbal Green Tea | Standard Pack",
      slug: "herbal-green-tea-natural",
      description: "Our standard 50g pouch. Contains premium green tea infused with whole holy basil (Tulsi) leaves, lemongrass, and dry ginger root.",
      short_description: "100% natural handcrafted herbal green tea infused with Tulsi, Lemongrass, and Ginger.",
      weight: "50g Pouch",
      category: "Single Pack",
      taste_profile: "Crisp green tea with bright citrus lemongrass and a lingering ginger warmth.",
      aroma: "Fresh cut botanicals with peppery holy basil and citrus",
      ingredients: ["Premium Green Tea", "Tulsi", "Lemongrass", "Dried Ginger"],
      img: "/assets/product_natural.png",
      brewing_summary: "85°C water • 1 tsp (~2g) • 3-5 mins covered",
      fssai_info: "FSSAI Licensed Food Business • Handcrafted in UP, India",
      amazon_url: "https://www.amazon.in/dp/B0D1SAMPLE",
      amazon_button_enabled: true,
      status: "published"
    },
    {
      id: "mock-combo-200",
      title: "Handcrafted Herbal Green Tea | Double Ritual Combo",
      slug: "herbal-green-tea-combo",
      description: "Our value duo pack (2 x 50g pouches). Handcrafted and sealed in small batches to preserve botanical freshness.",
      short_description: "Two 50g pouches of our signature herbal green tea blend.",
      weight: "100g (2x50g Pouches)",
      category: "Duo Pack",
      taste_profile: "Zesty, herbaceous, and warm. Designed for regular daily tea rituals.",
      aroma: "Fragrant soothing meadow with warming ginger note",
      ingredients: ["Premium Green Tea", "Tulsi", "Lemongrass", "Dried Ginger"],
      img: "/assets/product_combo.png",
      brewing_summary: "85°C water • 1 tsp (~2g) • 3-5 mins covered",
      fssai_info: "FSSAI Licensed Food Business • Handcrafted in UP, India",
      amazon_url: "https://www.amazon.in/dp/B0D2SAMPLE",
      amazon_button_enabled: true,
      status: "published"
    }
  ];

  const displayProducts = products && products.length > 0 ? products : defaultProducts;

  return (
    <section id="blends" className="py-24 bg-[#0c1912] relative border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-gold text-xs font-semibold uppercase tracking-widest block mb-3">
            Product Library
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#F8F6F2] mb-4">
            Our Blends
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Pure botanicals, whole cut leaves, and zero artificial additions. Explore detailed blend information, ingredients, and preparation rituals below.
          </p>
        </div>

        {/* Informational Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {displayProducts.map((prod) => {
            const ingredientsText = Array.isArray(prod.ingredients)
              ? prod.ingredients.join(', ')
              : (prod.ingredients || "Green Tea, Tulsi, Lemongrass, Dried Ginger");
            const hasAmazon = Boolean(prod.amazon_url && prod.amazon_button_enabled !== false);

            return (
              <article 
                key={prod.id} 
                className="glass-panel border border-white/10 rounded-3xl overflow-hidden shadow-xl hover:border-gold/40 transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Product Visual Container */}
                <div className="relative aspect-4/3 overflow-hidden bg-gradient-to-b from-[#163322]/40 to-[#0a150f] p-8 flex items-center justify-center">
                  <img 
                    src={prod.img || "/assets/product_natural.png"} 
                    alt={prod.title} 
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-4 left-4 bg-[#0c1912]/80 backdrop-blur-md border border-white/10 text-gold text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    {prod.category || "Herbal Green Tea"}
                  </div>
                  <div className="absolute top-4 right-4 bg-[#0c1912]/80 backdrop-blur-md border border-white/10 text-slate-300 text-[10px] font-bold px-3 py-1 rounded-full">
                    {prod.weight}
                  </div>
                </div>

                {/* Product Informational Details */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div>
                    <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#F8F6F2] mb-3 group-hover:text-gold transition-colors">
                      {prod.title}
                    </h3>
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
                      {prod.description || prod.short_description}
                    </p>

                    {/* Informational Breakdown Specs */}
                    <div className="space-y-3 pt-2 border-t border-white/10 text-xs">
                      <div className="flex items-start gap-2 text-slate-300">
                        <Leaf size={14} className="text-gold mt-0.5 shrink-0" />
                        <span>
                          <strong className="text-slate-200">Ingredients:</strong> {ingredientsText}
                        </span>
                      </div>

                      <div className="flex items-start gap-2 text-slate-300">
                        <Sparkles size={14} className="text-gold mt-0.5 shrink-0" />
                        <span>
                          <strong className="text-slate-200">Taste Profile:</strong> {prod.taste_profile || "Fresh vegetal green tea, peppery herbal aroma, bright citrus, warm finish"}
                        </span>
                      </div>

                      <div className="flex items-start gap-2 text-slate-300">
                        <Clock size={14} className="text-gold mt-0.5 shrink-0" />
                        <span>
                          <strong className="text-slate-200">Brewing:</strong> {prod.brewing_summary || "85°C water • 1 tsp (~2g) • Steep covered 3–5 minutes"}
                        </span>
                      </div>

                      <div className="flex items-start gap-2 text-slate-300">
                        <ShieldCheck size={14} className="text-gold mt-0.5 shrink-0" />
                        <span>
                          <strong className="text-slate-200">Quality:</strong> {prod.fssai_info || "FSSAI Licensed Food Business • Handcrafted in UP, India"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions: BUY ON AMAZON (if enabled) + VIEW PRODUCT + Link to Facts */}
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    {hasAmazon && (
                      <a
                        href={prod.amazon_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#0c1912] font-bold px-5 py-3 rounded-xl transition-all duration-300 text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-amber-500/20 tracking-wider"
                      >
                        <ShoppingBag size={15} />
                        <span>BUY ON AMAZON</span>
                        <ExternalLink size={13} />
                      </a>
                    )}

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <button
                        onClick={() => onSelectProduct(prod)}
                        className="w-full sm:flex-1 bg-[#163322] hover:bg-[#1b4332] text-gold border border-gold/40 font-semibold px-5 py-2.5 rounded-xl transition-all duration-300 text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-gold/10"
                      >
                        <Eye size={14} />
                        <span>VIEW PRODUCT</span>
                      </button>

                      <Link
                        href={`/blends/${prod.slug || (prod.weight?.includes('200') ? 'herbal-green-tea-combo' : 'herbal-green-tea-natural')}`}
                        className="w-full sm:w-auto text-slate-300 hover:text-gold text-xs font-semibold px-4 py-2.5 rounded-xl border border-white/10 hover:border-white/20 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <span>Full Facts</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Section Notice: Direct Orders Routed to App */}
        <div className="mt-14 p-6 rounded-3xl bg-gradient-to-r from-[#163322]/50 via-[#0e2417]/80 to-[#163322]/50 border border-gold/30 text-center flex flex-col sm:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
          <div className="text-left">
            <h4 className="font-serif font-bold text-base text-[#F8F6F2]">
              Looking to order Kindleaf tea?
            </h4>
            <p className="text-xs text-slate-300 mt-1">
              Purchases, batch subscriptions, and tracked orders are handled exclusively within the Kindleaf Mobile App or direct Amazon official store.
            </p>
          </div>
          <button
            onClick={onOpenAppModal}
            className="w-full sm:w-auto bg-gold hover:bg-gold-hover text-[#0c1912] font-semibold px-6 py-3.5 rounded-full text-xs flex items-center justify-center gap-2 transition-all shrink-0 cursor-pointer shadow-md"
          >
            <Smartphone size={15} />
            <span>GET THE KINDLEAF APP</span>
          </button>
        </div>

      </div>
    </section>
  );
}
