import express, { Request, Response } from 'express';
import Product from '../../models/Product';
import { authMiddleware } from './auth';
import { sanitizeForLog, sanitizeForHtml } from '../../utils/sanitize';

import mongoose from 'mongoose';

export const router = express.Router();

// Test endpoint
router.get('/test', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Products API is working',
    timestamp: new Date().toISOString()
  });
});

// Fisher-Yates shuffle algorithm for randomizing array
const shuffleArray = (array: any[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Get all products
router.get('/', async (req: Request, res: Response) => {
  try {
    const products = await Product.find({ isActive: { $ne: false } })
      .select('nameEn nameFr price category thumbnailImage images inStock featured condition warrantyMonths')
      .lean();
    
    // Randomize product order using Fisher-Yates shuffle
    const randomizedProducts = shuffleArray(products);
    
    res.set('Cache-Control', 'no-cache');
    res.json({ products: randomizedProducts });
  } catch (err) {
    console.error('API Error:', sanitizeForLog((err as Error).message));
    res.status(500).json({ message: sanitizeForHtml((err as Error).message) });
  }
});

// Get single product
router.get('/:id', async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
    const product = await Product.findById(req.params.id).lean();
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.set('Cache-Control', 'public, max-age=600');
    res.json(product);
  } catch (err) {
    console.error('API Error:', sanitizeForLog((err as Error).message));
    res.status(500).json({ message: sanitizeForHtml((err as Error).message) });
  }
});

// Create a new product
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    console.log('🆕 Creating new product...');
    console.log('📝 Request body:', sanitizeForLog(JSON.stringify(req.body)));
    
    if (!req.body.nameEn) {
      console.log('❌ Missing nameEn');
      return res.status(400).json({ message: 'Product name in English is required' });
    }
    if (!req.body.descriptionEn) {
      console.log('❌ Missing descriptionEn');
      return res.status(400).json({ message: 'Product description in English is required' });
    }
    if (!req.body.price || isNaN(parseFloat(req.body.price))) {
      console.log('❌ Invalid price:', req.body.price);
      return res.status(400).json({ message: 'Valid price is required' });
    }
    if (!req.body.category) {
      console.log('❌ Missing category');
      return res.status(400).json({ message: 'Product category is required' });
    }
    
    const images = Array.isArray(req.body.images) ? req.body.images : [];
    const thumbnailImage = req.body.thumbnailImage || (images.length > 0 ? images[0] : null);
    
    const product = new Product({
      nameEn: req.body.nameEn,
      nameFr: req.body.nameFr,
      descriptionEn: req.body.descriptionEn,
      descriptionFr: req.body.descriptionFr,
      price: req.body.price,
      category: req.body.category,
      images: images,
      thumbnailImage: thumbnailImage,
      videoUrl: req.body.videoUrl,
      featured: req.body.featured || false,
      inStock: req.body.inStock !== false,
      stockQuantity: req.body.stockQuantity || 0,
      sku: req.body.sku,
      weight: req.body.weight,
      dimensions: req.body.dimensions,
      isActive: req.body.isActive !== false,
      condition: req.body.condition || 'new',
      conditionGrade: req.body.conditionGrade,
      warrantyMonths: req.body.warrantyMonths || 12
    });
    
    console.log('💾 Saving product to database...');
    const savedProduct = await product.save();
    
    console.log('✅ Product saved to MongoDB:', savedProduct.nameEn);
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error('❌ Product creation error:', sanitizeForLog((err as Error).message));
    
    if ((err as any).name === 'MongoServerSelectionError' || (err as any).code === 'ENOTFOUND') {
      return res.status(503).json({ message: 'Database temporarily unavailable' });
    }
    
    if ((err as any).name === 'ValidationError') {
      const validationErrors = Object.values((err as any).errors).map((e: any) => e.message);
      return res.status(400).json({ 
        message: 'Product creation validation failed', 
        errors: validationErrors 
      });
    }
    
    res.status(500).json({ 
      message: sanitizeForHtml((err as Error).message)
    });
  }
});

// Test update without auth
router.put('/:id/test', async (req: Request, res: Response) => {
  console.log('🧪 Test PUT route reached');
  res.json({ success: true, message: 'Test PUT works', data: req.body });
});

// Update a product
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  console.log('🔄 PUT route handler reached for product:', req.params.id);
  try {
    console.log('🔄 Updating product:', req.params.id);
    console.log('📝 Update data:', sanitizeForLog(JSON.stringify(req.body)));
    
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
    
    const product = await Product.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    console.log('✅ Product updated successfully:', product.nameEn);
    res.json(product);
  } catch (err) {
    console.error('❌ Product update error:', sanitizeForLog((err as Error).message));
    
    if ((err as any).name === 'MongoServerSelectionError' || (err as any).code === 'ENOTFOUND') {
      return res.status(503).json({ message: 'Database temporarily unavailable' });
    }
    
    if ((err as any).name === 'ValidationError') {
      const validationErrors = Object.values((err as any).errors).map((e: any) => e.message);
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: validationErrors 
      });
    }
    
    res.status(500).json({ message: sanitizeForHtml((err as Error).message) });
  }
});

// Delete a product
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ message: 'Product removed' });
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ message: (err as Error).message });
  }
});