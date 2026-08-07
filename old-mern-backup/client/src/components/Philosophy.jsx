import React from 'react';

function Philosophy() {
  return (
    <section id="philosophy" className="philosophy-section scroll-reveal">
      <div className="section-container">
        <div className="editorial-grid">
          <div className="editorial-text">
            <span className="section-tag">Slow Living</span>
            <h2 className="section-title">Not another notification.<br/>Not another deadline.</h2>
            <p className="section-description">
              We spend so much time taking care of everything around us that we often forget to recharge ourselves. Kindleaf is more than just green tea. It’s a mindful ritual, a warm cup in your hands, and a small pause that makes a big difference.
            </p>
            <div className="philosophy-bullets">
              <div className="bullet-item">
                <div className="bullet-icon">🍵</div>
                <div>
                  <h4>Daily Mindful Sip</h4>
                  <p>Incorporate peace into your daily routine, not as a reward, but as a habit.</p>
                </div>
              </div>
              <div className="bullet-item">
                <div className="bullet-icon">🍃</div>
                <div>
                  <h4>Zero Artificial Additives</h4>
                  <p>100% real ingredients sourced directly from local farms in Uttar Pradesh.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="editorial-image-wrapper">
            <div className="editorial-image-card">
              <div className="card-glow"></div>
              <img src="assets/hero_tea_cup.png" alt="Cup of Kindleaf Herbal Tea" className="editorial-img" loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Philosophy;
