import React, { useState, useEffect } from 'react';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header id="site-header" className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <a href="#" className="logo" id="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="assets/logo.png" alt="Kindleaf Logo" style={{ height: '40px', width: 'auto', borderRadius: '6px' }} />
        </a>
        <nav className={`nav-menu ${menuOpen ? 'open' : ''}`} id="nav-menu">
          <a href="#philosophy" className="nav-link" onClick={() => setMenuOpen(false)}>Our Philosophy</a>
          <a href="#blend" className="nav-link" onClick={() => setMenuOpen(false)}>The Blend</a>
          <a href="#planner" className="nav-link" onClick={() => setMenuOpen(false)}>Ritual Planner</a>
          <a href="#brewing" className="nav-link" onClick={() => setMenuOpen(false)}>Brewing Guide</a>
          <a href="#story" className="nav-link" onClick={() => setMenuOpen(false)}>Our Story</a>
          <a href="#shop" className="nav-link shop-now-btn" onClick={() => setMenuOpen(false)}>Shop Now</a>
        </nav>
        <button 
          className={`hamburger ${menuOpen ? 'open' : ''}`} 
          id="hamburger-menu" 
          aria-label="Toggle Menu" 
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;
