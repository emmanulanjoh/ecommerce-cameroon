import express, { Request, Response } from 'express';
import Product from '../../models/Product'; // Use original MongoDB model
import { authMiddleware } from './auth';

export const router = express.Router();

// Test endpoint
router.get('/test', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Products API is working',
    timestamp: new Date().toISOString()
  });
});

// Get all products
router.get('/', async (req: Request, res: Response) => {
  try {
    console.log('🔍 Products API called');
    
    const products = await Product.find({ isActive: true })
      .sort({ createdAt: -1 })
      .lean();
    
    console.log('✅ MongoDB products found:', products.length);
    
    res.json({
      products,
      pagination: {
        total: products.length,
        page: 1,
        pages: 1
      }
    });
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ message: (err as Error).message });
  }
});

// Get single product
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ message: (err as Error).message });
  }
});

// Create a new product
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    console.log('📝 Creating product with data:', req.body);
    
    // Images from S3 upload are already full URLs, save them directly
    const productData = {
      ...req.body,
      // Ensure images array exists
      images: req.body.images || [],
      // Set thumbnail from first image if not provided
      thumbnailImage: req.body.thumbnailImage || (req.body.images && req.body.images[0]) || null
    };
    
    const product = new Product(productData);
    const savedProduct = await product.save();
    
    console.log('✅ Product saved to MongoDB with S3 images:', savedProduct.nameEn);
    console.log('🖼️ Images:', savedProduct.images);
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error('❌ Product creation error:', err);
    res.status(500).json({ 
      message: (err as Error).message
    });
  }
});

// Update a product
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ message: (err as Error).message });
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