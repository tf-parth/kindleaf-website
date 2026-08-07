import React, { useState } from 'react';

function BlendShowcase() {
  const [activeIngredient, setActiveIngredient] = useState('greentea');

  return (
    <section id="blend" className="blend-section scroll-reveal">
      <div className="section-container">
        <div className="section-header center-align">
          <span className="section-tag">The Formulation</span>
          <h2 className="section-title">Four Natural Ingredients. One Perfect Balance.</h2>
          <p className="section-subtitle">
            We don’t hide behind complex chemical names or artificial flavorings. Every cup contains exactly four powerhouse ingredients, blended by hand.
          </p>
        </div>

        <div className="ingredient-showcase-container">
          {/* Switcher Sidebar */}
          <div className="ingredient-switcher" id="ingredient-switcher">
            <button className={`switcher-btn ${activeIngredient === 'greentea' ? 'active' : ''}`} onClick={() => setActiveIngredient('greentea')}>
              <span className="btn-number">01</span>
              <span className="btn-label">Green Tea Base</span>
            </button>
            <button className={`switcher-btn ${activeIngredient === 'tulsi' ? 'active' : ''}`} onClick={() => setActiveIngredient('tulsi')}>
              <span className="btn-number">02</span>
              <span className="btn-label">Holy Basil (Tulsi)</span>
            </button>
            <button className={`switcher-btn ${activeIngredient === 'lemongrass' ? 'active' : ''}`} onClick={() => setActiveIngredient('lemongrass')}>
              <span className="btn-number">03</span>
              <span className="btn-label">Lemongrass</span>
            </button>
            <button className={`switcher-btn ${activeIngredient === 'ginger' ? 'active' : ''}`} onClick={() => setActiveIngredient('ginger')}>
              <span className="btn-number">04</span>
              <span className="btn-label">Ginger Root</span>
            </button>
          </div>

          {/* Content Displays */}
          <div className="ingredient-display" id="ingredient-display-panel">
            {/* Green Tea Content */}
            <div className={`ingredient-content ${activeIngredient === 'greentea' ? 'active' : ''}`}>
              <div className="ingredient-info">
                <h3>Green Tea Base</h3>
                <span className="ingredient-botanical">*Camellia sinensis*</span>
                <p className="ingredient-desc">
                  Sourced from select high-altitude gardens, our premium green tea base is rich in epigallocatechin gallate (EGCG) antioxidants. It gently fires up your metabolism, neutralizes free radicals, and supplies a clean, jitter-free energy boost throughout your day.
                </p>
                <div className="ingredient-benefits-grid">
                  <div className="benefit-tag">🔥 Boosts Metabolism</div>
                  <div className="benefit-tag">✨ Rich in Catechins</div>
                  <div className="benefit-tag">⚡ Steady Focus</div>
                </div>
              </div>
              <div className="ingredient-graphic">
                <div className="circle-backdrop"></div>
                <div className="ingredient-badge">Antioxidant Shield</div>
                <svg viewBox="0 0 100 100" className="svg-ingredient-illustration">
                  <path d="M50,90 C65,70 85,55 85,35 C85,15 65,10 50,30 C35,10 15,15 15,35 C15,55 35,70 50,90 Z" fill="#2d6a4f" opacity="0.8"/>
                  <path d="M50,30 L50,90 M50,50 C55,45 65,42 75,40 M50,65 C55,60 65,58 72,55 M50,42 C45,47 35,45 25,43 M50,57 C45,52 35,50 28,47" stroke="#b79c73" strokeWidth="2" fill="none"/>
                </svg>
              </div>
            </div>

            {/* Tulsi Content */}
            <div className={`ingredient-content ${activeIngredient === 'tulsi' ? 'active' : ''}`}>
              <div className="ingredient-info">
                <h3>Holy Basil (Tulsi)</h3>
                <span className="ingredient-botanical">*Ocimum tenuiflorum*</span>
                <p className="ingredient-desc">
                  Revered in Ayurveda as the 'Queen of Herbs', Tulsi is a powerful adaptogen that helps the body adapt to physical and mental stress. Its soothing properties calm the nervous system, clear respiratory passages, and fortify your body's natural immune defenses.
                </p>
                <div className="ingredient-benefits-grid">
                  <div className="benefit-tag">🛡️ Adaptogenic Support</div>
                  <div className="benefit-tag">🤍 Stress Reduction</div>
                  <div className="benefit-tag">👃 Respiration Clarity</div>
                </div>
              </div>
              <div className="ingredient-graphic">
                <div className="circle-backdrop"></div>
                <div className="ingredient-badge">Sacred Adaptogen</div>
                <svg viewBox="0 0 100 100" className="svg-ingredient-illustration">
                  <path d="M50,90 C60,75 75,70 75,50 C75,30 65,25 50,45 C35,25 25,30 25,50 C25,70 40,75 50,90 Z" fill="#1b4332" opacity="0.9"/>
                  <path d="M50,45 L50,90 M50,55 C58,52 68,54 73,50 M50,68 C58,65 65,67 70,63 M50,50 C42,47 32,49 27,45 M50,63 C42,60 35,62 30,58" stroke="#f4f0e6" strokeWidth="1.5" fill="none"/>
                </svg>
              </div>
            </div>

            {/* Lemongrass Content */}
            <div className={`ingredient-content ${activeIngredient === 'lemongrass' ? 'active' : ''}`}>
              <div className="ingredient-info">
                <h3>Lemongrass</h3>
                <span className="ingredient-botanical">*Cymbopogon citratus*</span>
                <p className="ingredient-desc">
                  Bringing a bright, citrusy, and refreshing aroma to the blend, Lemongrass is a digestive powerhouse. It contains citral, a natural anti-inflammatory compound that relaxes stomach muscles, mitigates bloating, and aids in gentle daily detoxification.
                </p>
                <div className="ingredient-benefits-grid">
                  <div className="benefit-tag">🍋 Citric Freshness</div>
                  <div className="benefit-tag">🎈 Reduces Bloating</div>
                  <div className="benefit-tag">💧 Gentle Detox</div>
                </div>
              </div>
              <div className="ingredient-graphic">
                <div className="circle-backdrop"></div>
                <div className="ingredient-badge">Digestive Aid</div>
                <svg viewBox="0 0 100 100" className="svg-ingredient-illustration">
                  <path d="M20,90 C30,70 45,30 80,10 C60,30 45,70 30,90 Z" fill="#52b788" opacity="0.8"/>
                  <path d="M15,90 C25,80 40,40 75,20 C55,40 40,80 25,90 Z" fill="#74c69d" opacity="0.6"/>
                  <path d="M25,90 L60,40 M30,90 L70,30" stroke="#f4f0e6" strokeWidth="1" fill="none"/>
                </svg>
              </div>
            </div>

            {/* Ginger Content */}
            <div className={`ingredient-content ${activeIngredient === 'ginger' ? 'active' : ''}`}>
              <div className="ingredient-info">
                <h3>Ginger Root</h3>
                <span className="ingredient-botanical">*Zingiber officinale*</span>
                <p className="ingredient-desc">
                  Warm, spicy, and full of character. Sourced directly from local farmers in Uttar Pradesh, Ginger is packed with gingerol, a bio-active compound renowned for its digestive qualities. It speeds up gastric emptying, alleviates post-meal fullness, and provides a comforting inner warmth.
                </p>
                <div className="ingredient-benefits-grid">
                  <div className="benefit-tag">🫚 Soothes Stomach</div>
                  <div className="benefit-tag">❄️ Cold &amp; Cough Defense</div>
                  <div className="benefit-tag">⚡ Bio-active Gingerol</div>
                </div>
              </div>
              <div className="ingredient-graphic">
                <div className="circle-backdrop"></div>
                <div className="ingredient-badge">Inner Warmth</div>
                <svg viewBox="0 0 100 100" className="svg-ingredient-illustration">
                  <path d="M30,70 C25,60 25,45 35,40 C45,35 40,25 55,20 C70,15 75,30 70,45 C65,60 80,65 75,75 C70,85 55,80 50,85 C45,90 35,80 30,70 Z" fill="#c5a880" opacity="0.8"/>
                  <circle cx="35" cy="50" r="4" fill="#b79c73"/>
                  <circle cx="55" cy="30" r="5" fill="#b79c73"/>
                  <circle cx="68" cy="40" r="4" fill="#b79c73"/>
                  <circle cx="65" cy="65" r="5" fill="#b79c73"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BlendShowcase;
