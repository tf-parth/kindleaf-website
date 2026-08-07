import React, { useState, useEffect } from 'react';

function CheckoutModal({ isOpen, activeProduct, handleCloseCheckout }) {
  const [orderQty, setOrderQty] = useState(1);
  const [custName, setCustName] = useState('');
  const [custAddress, setCustAddress] = useState('');

  // Reset local state when product changes
  useEffect(() => {
    if (activeProduct) {
      setOrderQty(1);
      setCustName('');
      setCustAddress('');
    }
  }, [activeProduct]);

  if (!isOpen || !activeProduct) return null;

  const submitOrder = (e) => {
    e.preventDefault();
    if (!custName || !custAddress) return;

    const totalAmount = activeProduct.price * orderQty;

    const payload = {
      customerName: custName,
      shippingAddress: custAddress,
      productTitle: activeProduct.title,
      quantity: orderQty,
      totalPrice: totalAmount
    };

    // Save to Database
    fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(() => {
        const message = `Hello Kindleaf! 🌿 I would like to order the Handcrafted Herbal Green Tea.

🛒 Order Details:
- Product: ${activeProduct.title}
- Quantity: ${orderQty}
- Total Price: ₹${totalAmount}

📦 Shipping Details:
- Name: ${custName}
- Address: ${custAddress}

Thank you!`;

        const encodedMsg = encodeURIComponent(message);
        const whatsappUrl = `https://api.whatsapp.com/send?phone=916396461480&text=${encodedMsg}`;

        handleCloseCheckout();
        window.open(whatsappUrl, '_blank');
      })
      .catch(err => {
        console.error('API checkout failed, falling back to direct WhatsApp launch', err);
        const message = `Hello Kindleaf! 🌿 I would like to order the Handcrafted Herbal Green Tea.

🛒 Order Details:
- Product: ${activeProduct.title}
- Quantity: ${orderQty}
- Total Price: ₹${totalAmount}

📦 Shipping Details:
- Name: ${custName}
- Address: ${custAddress}

Thank you!`;
        const encodedMsg = encodeURIComponent(message);
        const whatsappUrl = `https://api.whatsapp.com/send?phone=916396461480&text=${encodedMsg}`;
        handleCloseCheckout();
        window.open(whatsappUrl, '_blank');
      });
  };

  return (
    <div className="modal-backdrop open" onClick={handleCloseCheckout}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleCloseCheckout}>&times;</button>
        
        <div className="modal-body-layout">
          {/* Product Summary */}
          <div className="modal-product-summary">
            <h3>{activeProduct.title}</h3>
            <div className="modal-price-rating">
              <span className="modal-price">₹{activeProduct.price}</span>
              <span className="modal-original-price">₹{activeProduct.originalPrice}</span>
            </div>
            <div className="modal-img-container">
              <img src={activeProduct.img} alt={activeProduct.title} />
            </div>
            <p className="modal-product-desc">{activeProduct.desc}</p>
          </div>

          {/* Form */}
          <div className="modal-form-container">
            <h4 className="form-section-title">Delivery Details</h4>
            <form className="checkout-form" onSubmit={submitOrder}>
              <div className="form-row">
                <div className="form-group qty-group">
                  <label>Quantity</label>
                  <div className="quantity-picker">
                    <button type="button" className="qty-btn" onClick={() => orderQty > 1 && setOrderQty(orderQty - 1)}>-</button>
                    <span className="qty-value">{orderQty}</span>
                    <button type="button" className="qty-btn" onClick={() => orderQty < 10 && setOrderQty(orderQty + 1)}>+</button>
                  </div>
                </div>
                <div className="form-group total-group">
                  <span className="total-label">Total Amount</span>
                  <span className="total-value">₹{activeProduct.price * orderQty}</span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="cust-name">Your Full Name</label>
                <input 
                  type="text" 
                  id="cust-name" 
                  placeholder="Enter your name" 
                  value={custName} 
                  onChange={(e) => setCustName(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="cust-address">Shipping Address</label>
                <textarea 
                  id="cust-address" 
                  rows="3" 
                  placeholder="Enter complete delivery address with PIN code" 
                  value={custAddress} 
                  onChange={(e) => setCustAddress(e.target.value)} 
                  required 
                />
              </div>

              <button type="submit" className="btn btn-primary w-100 whatsapp-submit-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="wa-icon"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 2.032 14.058.802 11.44.802 6.002.802 1.577 5.172 1.573 10.601c-.002 1.696.452 3.35 1.314 4.8l-.994 3.63 3.754-.976zm12.39-7.234c-.267-.134-1.586-.783-1.831-.873-.245-.089-.424-.134-.602.134-.179.268-.691.873-.847 1.051-.156.178-.311.201-.578.067-.267-.134-1.127-.416-2.146-1.327-.792-.708-1.328-1.583-1.484-1.85-.156-.268-.017-.413.117-.546.121-.12.267-.312.4-.469.134-.156.179-.268.267-.446.089-.178.045-.335-.022-.469-.067-.134-.602-1.449-.824-1.985-.217-.521-.454-.45-.624-.459-.16-.008-.344-.01-.529-.01-.186 0-.489.07-.746.356-.256.285-.979.957-.979 2.334 0 1.378 1.002 2.709 1.143 2.893.141.184 1.973 3.007 4.779 4.212.667.287 1.189.459 1.595.587.67.213 1.28.183 1.763.111.538-.08 1.586-.647 1.809-1.272.223-.625.223-1.16.156-1.272-.067-.112-.245-.178-.512-.313z"/></svg>
                <span>Confirm Order via WhatsApp</span>
              </button>
              {activeProduct.amazonUrl && (
                <a 
                  href={activeProduct.amazonUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-secondary w-100 amazon-modal-btn" 
                  style={{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <span>Buy on Amazon</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </a>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutModal;
