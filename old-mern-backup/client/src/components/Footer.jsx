import React from 'react';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <img src="assets/logo.png" alt="Kindleaf Logo" style={{ height: '50px', width: 'auto', borderRadius: '6px', marginBottom: '15px' }} />
            <p className="footer-moto">Nourishing body and mind, one quiet cup at a time.</p>
            <div className="social-links">
              <a href="https://instagram.com/kindleaf.wellness" target="_blank" rel="noopener noreferrer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                <span>@kindleaf.wellness</span>
              </a>
            </div>
          </div>

          <div className="footer-links-group">
            <h4>Navigation</h4>
            <ul>
              <li><a href="#philosophy">Our Philosophy</a></li>
              <li><a href="#blend">The Blend</a></li>
              <li><a href="#planner">Ritual Planner</a></li>
              <li><a href="#brewing">Brewing Guide</a></li>
            </ul>
          </div>

          <div className="footer-links-group">
            <h4>Contact Us</h4>
            <p className="contact-info"><strong>Support:</strong> <a href="mailto:support@kindleaf.in">support@kindleaf.in</a></p>
            <p className="contact-info"><strong>Call/WA:</strong> +91 6396461480</p>
            <p className="contact-info"><strong>Origin:</strong> Vill. Katoora, post darapur milawali, jasrana firozabad 283136, Uttar Pradesh</p>
          </div>

          <div className="footer-newsletter">
            <h4>Newsletter</h4>
            <p>Subscribe to receive wellness tips, rituals, and seasonal offers.</p>
            <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing!'); e.target.reset(); }}>
              <input type="email" placeholder="Your email address" required />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-policies">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms &amp; Conditions</a>
            <a href="#">Shipping Policy</a>
            <a href="#">Refund Policy</a>
          </div>
          <p className="copyright">&copy; 2026 Kindleaf Herbal Tea. All rights reserved. Crafted for premium wellness.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
