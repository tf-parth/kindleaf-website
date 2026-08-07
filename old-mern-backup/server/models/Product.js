const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  originalPrice: {
    type: Number
  },
  weight: {
    type: String,
    required: true
  },
  img: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    trim: true
  },
  amazonUrl: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
