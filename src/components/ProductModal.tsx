import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, ShieldCheck, Clock, ShoppingBag, ExternalLink } from 'lucide-react';
import { ProductItem } from './OurBlends';

interface ProductModalProps {
  product: ProductItem | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenAppModal: () => void;
}

export default function ProductModal({ product, isOpen, onClose, onOpenAppModal }: ProductModalProps) {
  if (!isOpen || !product) return null;

  const hasAmazon = Boolean(product.amazon_url && product.amazon_button_enabled !== false);
  
  // Format ingredients list
  const ingredientsList: string[] = Array.isArray(product.ingredients)
    ? product.ingredients
    : (typeof product.ingredients === 'string' && product.ingredients.trim().length > 0)
      ? product.ingredients.split(',').map(s => s.trim()).filter(Boolean)
      : [
          "Premium Green Tea Base (Camellia sinensis)",
          "Holy Basil / Tulsi (Ocimum tenuiflorum)",
          "Fresh Cut Lemongrass (Cymbopogon citratus)",
          "Dry Ginger Root (Zingiber officinale)"
        ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-3xl bg-[#0e2417] border border-white/15 rounded-3xl overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col my-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-[#F8F6F2] bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors z-20 cursor-pointer"
            aria-label="Close product details"
          >
            <X size={20} />
          </button>

          <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
            
            {/* Header with image */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center border-b border-white/10 pb-6">
              <div className="sm:col-span-5 aspect-square bg-[#0c1912] rounded-2xl p-6 flex items-center justify-center border border-white/10">
                <img 
                  src={product.img || "/assets/product_natural.png"} 
                  alt={product.title} 
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div className="sm:col-span-7 space-y-3">
                <span className="text-gold text-xs font-semibold uppercase tracking-widest block">
                  {product.category || "Handcrafted Herbal Green Tea"}
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif text-[#F8F6F2] font-bold">
                  {product.title}
                </h2>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="bg-white/5 px-2.5 py-1 rounded-md border border-white/10 text-slate-300 font-semibold">
                    Net Wt: {product.weight}
                  </span>
                  <span>•</span>
                  <span>100% Whole Cut Botanicals</span>
                </div>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed pt-1">
                  {product.description || product.short_description}
                </p>
              </div>
            </div>

            {/* Ingredients & Sensory Profile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-[#0a150f] border border-white/10 space-y-3">
                <h3 className="text-xs uppercase font-bold tracking-wider text-gold flex items-center gap-2">
                  <span>🍃 Botanical Ingredients</span>
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {ingredientsList.map((ing, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-gold">•</span> {ing}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-[#0a150f] border border-white/10 space-y-3">
                <h3 className="text-xs uppercase font-bold tracking-wider text-gold flex items-center gap-2">
                  <span>✨ Taste &amp; Aroma Notes</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {product.taste_profile || "Clean, slightly brisk green tea base with bright citrus lemongrass upfront, a fragrant herbal middle from Tulsi, and a comforting warm ginger finish."}
                </p>
                {product.aroma && (
                  <p className="text-xs text-slate-400 leading-relaxed italic">
                    <strong className="text-slate-300 not-italic">Aroma: </strong>{product.aroma}
                  </p>
                )}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[11px] bg-[#163322] text-gold px-2.5 py-1 rounded-full border border-gold/20">Whole Botanicals</span>
                  <span className="text-[11px] bg-[#163322] text-gold px-2.5 py-1 rounded-full border border-gold/20">Zero Artificial Flavours</span>
                </div>
              </div>
            </div>

            {/* Brewing Guide & Legal Facts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-[#163322]/30 border border-white/10 space-y-2">
                <h3 className="text-xs uppercase font-bold tracking-wider text-[#F8F6F2] flex items-center gap-2">
                  <Clock size={14} className="text-gold" />
                  <span>Brewing Direction</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {product.brewing_summary || "Heat fresh water to approx. 85°C. Measure 1 teaspoon (~2g). Steep covered for 3 to 5 minutes. Strain and sip mindfully."}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#163322]/30 border border-white/10 space-y-2">
                <h3 className="text-xs uppercase font-bold tracking-wider text-[#F8F6F2] flex items-center gap-2">
                  <ShieldCheck size={14} className="text-gold" />
                  <span>Product &amp; Compliance Details</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {product.fssai_info || "Manufactured in Jasrana, Firozabad, UP. FSSAI Licensed Food Business. Store in a cool, dry place away from direct sunlight."}
                </p>
              </div>
            </div>

            {/* Bottom Callout & Purchase Options */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-[#163322] to-[#0e2417] border border-gold/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-serif font-bold text-base text-[#F8F6F2]">
                  {hasAmazon ? "Order via Amazon or Kindleaf App" : "Order via the Kindleaf App"}
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  {hasAmazon 
                    ? "Direct official Amazon fulfillment or order directly inside the Kindleaf App." 
                    : "Fresh batch ordering, real-time delivery tracking, and mindfulness guides are inside the app."}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
                {hasAmazon && (
                  <a
                    href={product.amazon_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#0c1912] font-bold px-6 py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg tracking-wider"
                  >
                    <ShoppingBag size={15} />
                    <span>BUY ON AMAZON</span>
                    <ExternalLink size={13} />
                  </a>
                )}

                <button
                  onClick={() => {
                    onClose();
                    onOpenAppModal();
                  }}
                  className="w-full sm:w-auto bg-gold hover:bg-gold-hover text-[#0c1912] font-semibold px-6 py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md whitespace-nowrap"
                >
                  <Smartphone size={15} />
                  <span>Get the App</span>
                </button>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
