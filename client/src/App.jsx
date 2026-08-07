import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Philosophy from './components/Philosophy';
import BlendShowcase from './components/BlendShowcase';
import RitualPlanner from './components/RitualPlanner';
import BrewingGuide from './components/BrewingGuide';
import Story from './components/Story';
import ShopCatalog from './components/ShopCatalog';
import Footer from './components/Footer';
import CheckoutModal from './components/CheckoutModal';

// Frontend fallback product array if Express API is unreachable
const fallbackProducts = [
  {
    _id: "mock-natural",
    title: "Herbal Green Tea for Immunity | Natural",
    price: 249,
    originalPrice: 350,
    weight: "100g",
    img: "assets/product_natural.png",
    desc: "Our standard 100g package. Contains premium green tea infused with organic tulsi leaves, lemongrass, and dry ginger. Handcrafted to support gut health and daily wellness.",
    amazonUrl: "https://www.amazon.in/dp/B0GQCZM7YN"
  },
  {
    _id: "mock-combo",
    title: "Herbal Green Tea for Immunity - Combo",
    price: 449,
    originalPrice: 600,
    weight: "200g",
    img: "assets/product_combo.png",
    desc: "Our premium combo pack (2 x 100g pouches). Sourced locally and handcrafted. Provides double the soothing herbal goodness. Best value pack.",
    amazonUrl: "https://www.amazon.in/dp/B0GQCZM7YN"
  }
];

function App() {
  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);

  // Fetch product listings from backend
  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
      })
      .catch(err => {
        console.warn('Backend offline, using fallback catalog data.', err);
        setProducts(fallbackProducts);
      });
  }, []);

  // Scroll reveal IntersectionObserver trigger
  useEffect(() => {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealElements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [products]);

  const handleOpenCheckout = (product) => {
    setActiveProduct(product);
    setModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseCheckout = () => {
    setModalOpen(false);
    setActiveProduct(null);
    document.body.style.overflow = '';
  };

  return (
    <>
      <Navbar />
      <main>
        <Hero products={products} />
        <Philosophy />
        <BlendShowcase />
        <RitualPlanner />
        <BrewingGuide />
        <Story />
        <ShopCatalog products={products} handleOpenCheckout={handleOpenCheckout} />
      </main>
      <Footer />
      <CheckoutModal 
        isOpen={modalOpen} 
        activeProduct={activeProduct} 
        handleCloseCheckout={handleCloseCheckout} 
      />
    </>
  );
}

export default App;
