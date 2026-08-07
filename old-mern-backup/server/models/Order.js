const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  shippingAddress: {
    type: String,
    required: true,
    trim: true
  },
  productTitle: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Completed', 'Cancelled']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
