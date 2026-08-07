import React from 'react';

function Story() {
  return (
    <section id="story" className="story-section scroll-reveal">
      <div className="section-container">
        <div className="story-layout">
          <div className="story-narrative">
            <span className="section-tag">Our Roots</span>
            <h2 className="section-title">A Small Dream from a Soldier’s Home</h2>
            <p>Kindleaf did not begin in a corporate boardroom or a massive commercial factory. It was born right at home in Jasrana, Firozabad, Uttar Pradesh, founded by Gaurav Singh, coming from a proud soldier's family.</p>
            <p>The vision was simple: wellness should be honest, natural, and accessible. In a market flooded with artificial flavorings and chemical shortcuts, we set out to craft a tea blend that is 100% natural. We source our herbs locally and pack them by hand with care.</p>
            <blockquote>
              "I strongly believe in one principle: If you can’t consume your own product every day, you probably shouldn’t be selling it. At Kindleaf, we drink the exact same tea we ship to you."
              <cite>— Gaurav Singh, Founder</cite>
            </blockquote>
          </div>
          <div className="story-badges-grid">
            <div className="story-badge-card">
              <span className="story-badge-num">100%</span>
              <h5>Pure &amp; Natural</h5>
              <p>No artificial oils, sprays, or chemicals</p>
            </div>
            <div className="story-badge-card">
              <span className="story-badge-num">FSSAI</span>
              <h5>Approved Quality</h5>
              <p>Fulfill all safety guidelines</p>
            </div>
            <div className="story-badge-card">
              <span className="story-badge-num">Local</span>
              <h5>Sourced &amp; Handcrafted</h5>
              <p>Supporting local farms in UP</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Story;
