const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Product = require('./models/Product');
const Order = require('./models/Order');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.5.1:27017/kindleaf';

// Middleware
app.use(cors());
app.use(express.json());

// In-Memory Database Fallback for Products (if MongoDB is offline)
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
    weight: "200g", // 2x100g
    img: "assets/product_combo.png",
    desc: "Our premium combo pack (2 x 100g pouches). Sourced locally and handcrafted. Provides double the soothing herbal goodness. Best value pack.",
    amazonUrl: "https://www.amazon.in/dp/B0GQCZM7YN"
  }
];

let isDbConnected = false;

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully to ' + MONGO_URI);
    isDbConnected = true;
    seedProducts();
  })
  .catch(err => {
    console.warn('⚠️ MongoDB connection failed. Running server with in-memory mockup fallback.');
    console.error('Error details:', err.message);
    isDbConnected = false;
  });

// Seed Database helper function
async function seedProducts() {
  try {
    const count = await Product.countDocuments();
    const seedData = [
      {
        title: "Herbal Green Tea for Immunity | Natural",
        price: 249,
        originalPrice: 350,
        weight: "100g",
        img: "assets/product_natural.png",
        desc: "Our standard 100g package. Contains premium green tea infused with organic tulsi leaves, lemongrass, and dry ginger. Handcrafted to support gut health and daily wellness.",
        amazonUrl: "https://www.amazon.in/dp/B0GQCZM7YN"
      },
      {
        title: "Herbal Green Tea for Immunity - Combo",
        price: 449,
        originalPrice: 600,
        weight: "200g",
        img: "assets/product_combo.png",
        desc: "Our premium combo pack (2 x 100g pouches). Sourced locally and handcrafted. Provides double the soothing herbal goodness. Best value pack.",
        amazonUrl: "https://www.amazon.in/dp/B0GQCZM7YN"
      }
    ];

    if (count === 0) {
      await Product.insertMany(seedData);
      console.log('🌱 Database seeded with default products successfully!');
    } else {
      // Sync/Update existing products to ensure amazonUrl is present
      for (const item of seedData) {
        await Product.updateOne(
          { title: item.title },
          { $set: { amazonUrl: item.amazonUrl } }
        );
      }
      console.log('🌱 Database products synced/updated with Amazon URLs successfully!');
    }
  } catch (error) {
    console.error('❌ Failed to seed or sync database products:', error);
  }
}

// API Routes

// 1. GET: Fetch Products
app.get('/api/products', async (req, res) => {
  if (isDbConnected) {
    try {
      const dbProducts = await Product.find({});
      return res.json(dbProducts);
    } catch (err) {
      console.error('Failed to fetch from DB, serving mockups', err);
      return res.json(fallbackProducts);
    }
  } else {
    // Graceful fallback
    return res.json(fallbackProducts);
  }
});

// 2. POST: Create Order
app.post('/api/orders', async (req, res) => {
  const { customerName, shippingAddress, productTitle, quantity, totalPrice } = req.body;

  if (!customerName || !shippingAddress || !productTitle || !quantity || !totalPrice) {
    return res.status(400).json({ error: 'All order fields are required.' });
  }

  let savedOrder = null;

  if (isDbConnected) {
    try {
      const newOrder = new Order({
        customerName,
        shippingAddress,
        productTitle,
        quantity,
        totalPrice,
        status: 'Pending'
      });
      savedOrder = await newOrder.save();
      console.log(`📦 Order saved in MongoDB with ID: ${savedOrder._id}`);
    } catch (err) {
      console.error('⚠️ Could not save order to MongoDB database. Processing online...', err.message);
    }
  } else {
    console.log(`📝 Order received in Offline Mockup mode: Name: ${customerName}, Product: ${productTitle}`);
  }

  // Always return success to client to trigger WhatsApp redirections
  return res.status(201).json({
    success: true,
    message: 'Order accepted successfully!',
    orderId: savedOrder ? savedOrder._id : 'offline-mock-id'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Kindleaf server listening on port ${PORT}`);
});
