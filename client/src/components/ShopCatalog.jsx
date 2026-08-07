import React, { useState } from 'react';

function ShopCatalog({ products, handleOpenCheckout }) {
  const [priceFilter, setPriceFilter] = useState(449);
  const [filter100, setFilter100] = useState(true);
  const [filter200, setFilter200] = useState(true);
  const [sortVal, setSortVal] = useState('recommended');

  const filteredProducts = products.filter(p => {
    const isCombo = p.weight.includes('2') || parseInt(p.weight) > 150;
    const isNatural = !isCombo;

    if (p.price > priceFilter) return false;
    if (isNatural && !filter100) return false;
    if (isCombo && !filter200) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortVal === 'price-low') return a.price - b.price;
    if (sortVal === 'price-high') return b.price - a.price;
    return 0; // default Recommended
  });

  return (
    <section id="shop" className="shop-section scroll-reveal">
      <div className="section-container">
        <div className="section-header center-align">
          <span className="section-tag">Our Shop</span>
          <h2 className="section-title">Our Premium Blends</h2>
          <p className="section-subtitle">
            Experience 100% natural, handcrafted wellness tea. Sourced and packed in Uttar Pradesh.
          </p>
        </div>

        <div className="catalog-layout">
          {/* Sidebar */}
          <aside className="catalog-sidebar">
            <div className="sidebar-widget">
              <h4>Browse by</h4>
              <ul className="sidebar-links">
                <li><a href="#shop" className="active">All Products</a></li>
                <li><a href="#shop">Herbal Teas</a></li>
                <li><a href="#shop">Immunity Tea</a></li>
                <li><a href="#shop">Premium Blends</a></li>
              </ul>
            </div>
            
            <div className="sidebar-widget">
              <h4>Filter by</h4>
              <div className="filter-group">
                <label>Price</label>
                <div className="price-slider-container">
                  <input 
                    type="range" 
                    min="249" 
                    max="449" 
                    value={priceFilter} 
                    onChange={(e) => setPriceFilter(parseInt(e.target.value))} 
                    className="slider"
                  />
                  <div className="price-slider-values">
                    <span>₹249</span>
                    <span>₹{priceFilter}</span>
                  </div>
                </div>
              </div>
              <div className="filter-group">
                <label>Weight</label>
                <ul className="checkbox-list">
                  <li>
                    <input 
                      type="checkbox" 
                      id="w-100" 
                      checked={filter100} 
                      onChange={(e) => setFilter100(e.target.checked)} 
                    />
                    <label htmlFor="w-100">100g (Standard)</label>
                  </li>
                  <li>
                    <input 
                      type="checkbox" 
                      id="w-200" 
                      checked={filter200} 
                      onChange={(e) => setFilter200(e.target.checked)} 
                    />
                    <label htmlFor="w-200">200g (Combo)</label>
                  </li>
                </ul>
              </div>
            </div>
          </aside>

          {/* Grid content */}
          <div className="catalog-content">
            <div className="catalog-toolbar">
              <span className="product-count">{sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''}</span>
              <div className="sort-by-container">
                <label htmlFor="sort-select">Sort by:</label>
                <select 
                  id="sort-select" 
                  className="sort-dropdown" 
                  value={sortVal} 
                  onChange={(e) => setSortVal(e.target.value)}
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            <div className="product-grid" id="product-grid">
              {sortedProducts.map(prod => (
                <article key={prod._id} className="product-card">
                  <div className="product-card-badge">Sale</div>
                  <div className="product-card-img-wrapper">
                    <img src={prod.img} alt={prod.title} className="product-card-img" />
                    <div className="product-card-overlay" style={{ flexDirection: 'column', gap: '10px' }}>
                      <button 
                        type="button" 
                        className="btn btn-primary open-checkout-btn" 
                        onClick={() => handleOpenCheckout(prod)}
                      >
                        Quick Order
                      </button>
                      {prod.amazonUrl && (
                        <a 
                          href={prod.amazonUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="btn btn-secondary amazon-card-btn" 
                          style={{ padding: '8px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', width: 'auto' }}
                        >
                          <span>Buy on Amazon</span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="product-card-info">
                    <h3 className="product-card-title">{prod.title}</h3>
                    <div className="product-card-meta">
                      <span className="product-card-weight">{prod.weight}</span>
                      <span className="product-card-rating">⭐️ 4.9</span>
                    </div>
                    <div className="product-card-price-row">
                      <span className="product-card-price">₹{prod.price}</span>
                      <span className="product-card-original-price">₹{prod.originalPrice}</span>
                    </div>
                  </div>
                </article>
              ))}
              {sortedProducts.length === 0 && (
                <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '50px 0', color: 'var(--color-text-muted)' }}>
                  No products match your filter selections.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ShopCatalog;
