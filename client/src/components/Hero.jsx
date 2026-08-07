import React, { useState, useEffect } from 'react';

function Hero({ products }) {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const leafCount = 15;
    const newLeaves = [];
    for (let i = 0; i < leafCount; i++) {
      newLeaves.push({
        id: i,
        left: Math.random() * 100,
        duration: 10 + Math.random() * 15,
        delay: Math.random() * -20,
        scale: 0.5 + Math.random() * 1.2,
        opacity: 0.15 + Math.random() * 0.25,
        isGold: Math.random() > 0.5
      });
    }
    setLeaves(newLeaves);
  }, []);

  const amazonUrl = products.find(p => !p.title.includes('Combo'))?.amazonUrl || 'https://www.amazon.in/dp/B0GQCZM7YN';

  return (
    <section id="hero" className="hero-section">
      <div className="hero-bg-overlay"></div>
      <div className="hero-content-wrapper">
        <div className="hero-text-container">
          <div className="badge-accent">🌿 100% Handcrafted & Natural</div>
          <h1 className="hero-title animate-up">
            Awaken Your Senses, <br/>
            <span className="highlight-text">Restore Your Calm</span>
          </h1>
          <p className="hero-subtitle animate-up-delayed">
            Discover a premium herbal green tea crafted to support digestion, immunity, and daily wellness — naturally. A quiet pause in a busy world.
          </p>
          <div className="hero-ctas animate-up-more">
            <a href="#shop" className="btn btn-primary" id="hero-cta-shop">Shop Organic Blend</a>
            <a 
              href={amazonUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-secondary" 
              id="hero-cta-amazon"
            >
              <span>Buy on Amazon</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          </div>
        </div>
      </div>
      
      {/* Floating Leaves Decoration */}
      <div className="floating-leaves-container" id="floating-leaves">
        {leaves.map(leaf => (
          <span 
            key={leaf.id} 
            className="leaf" 
            style={{
              left: `${leaf.left}%`,
              animationDuration: `${leaf.duration}s`,
              animationDelay: `${leaf.delay}s`,
              transform: `scale(${leaf.scale})`,
              opacity: leaf.opacity,
              backgroundColor: leaf.isGold ? 'var(--color-gold)' : 'var(--color-accent-green)'
            }}
          />
        ))}
      </div>
    </section>
  );
}

export default Hero;
