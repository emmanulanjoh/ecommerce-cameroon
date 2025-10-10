const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Simple Product Schema
const ProductSchema = new mongoose.Schema({
  nameEn: String,
  nameFr: String,
  price: Number,
  category: String,
  images: [String],
  thumbnailImage: String,
  featured: Boolean,
  inStock: Boolean,
  condition: String,
  warrantyMonths: Number,
  descriptionEn: String,
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', ProductSchema);

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ inStock: true }).limit(50);
    res.json({
      success: true,
      products: products,
      count: products.length
    });
  } catch (error) {
    console.error('Products fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = { router };