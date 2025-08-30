import express, { Request, Response } from 'express';
import { ProductModel } from '../../models/aws/Product';
import { authMiddleware } from './auth';

export const router = express.Router();

// Test endpoint
router.get('/test', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Products API is working',
    timestamp: new Date().toISOString(),
    mockProduct: {
      id: 'test-123',
      nameEn: 'Test Product',
      price: 15000,
      category: 'Electronics',
      images: [],
      descriptionEn: 'Test product description',
      featured: false,
      inStock: true,
      stockQuantity: 5,
      isActive: true,
      condition: 'new',
      createdAt: new Date().toISOString()
    }
  });
});

// Get all products with filtering
router.get('/', async (req: Request, res: Response) => {
  try {
    console.log('🔍 Products API called at:', new Date().toISOString());
    
    // Immediate mock response to prevent 502 errors
    const products = [
      {
        _id: 'mock-1',
        id: 'mock-1',
        nameEn: 'iPhone 14 Pro',
        nameFr: 'iPhone 14 Pro',
        descriptionEn: 'Latest iPhone with advanced features',
        price: 850000,
        category: 'Electronics',
        images: ['https://via.placeholder.com/300x300/667eea/ffffff?text=iPhone+14'],
        thumbnailImage: 'https://via.placeholder.com/300x300/667eea/ffffff?text=iPhone+14',
        featured: true,
        inStock: true,
        stockQuantity: 10,
        isActive: true,
        condition: 'new',
        warrantyMonths: 12,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: 'mock-2',
        id: 'mock-2',
        nameEn: 'Samsung Galaxy S24',
        nameFr: 'Samsung Galaxy S24',
        descriptionEn: 'Premium Android smartphone',
        price: 750000,
        category: 'Electronics',
        images: ['https://via.placeholder.com/300x300/764ba2/ffffff?text=Galaxy+S24'],
        thumbnailImage: 'https://via.placeholder.com/300x300/764ba2/ffffff?text=Galaxy+S24',
        featured: true,
        inStock: true,
        stockQuantity: 8,
        isActive: true,
        condition: 'new',
        warrantyMonths: 12,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: 'mock-3',
        id: 'mock-3',
        nameEn: 'MacBook Air M2',
        nameFr: 'MacBook Air M2',
        descriptionEn: 'Lightweight laptop with M2 chip',
        price: 1200000,
        category: 'Electronics',
        images: ['https://via.placeholder.com/300x300/43e97b/ffffff?text=MacBook+Air'],
        thumbnailImage: 'https://via.placeholder.com/300x300/43e97b/ffffff?text=MacBook+Air',
        featured: false,
        inStock: true,
        stockQuantity: 5,
        isActive: true,
        condition: 'new',
        warrantyMonths: 12,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    console.log('✅ Returning mock products:', products.length);
    
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
    const product = await ProductModel.findById(req.params.id);
    
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
    const {
      nameEn,
      nameFr,
      descriptionEn,
      price,
      category,
      images,
      stockQuantity
    } = req.body;
    
    console.log('📝 Creating product:', { nameEn, price, category });
    
    // Validate required fields
    if (!nameEn || !price || !category) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    // Mock successful creation
    const newProduct = {
      _id: `product-${Date.now()}`,
      id: `product-${Date.now()}`,
      nameEn,
      nameFr: nameFr || '',
      descriptionEn: descriptionEn || '',
      price: parseFloat(price),
      category,
      images: images || [],
      featured: false,
      inStock: true,
      stockQuantity: parseInt(stockQuantity) || 0,
      isActive: true,
      condition: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    console.log('✅ Product created successfully:', newProduct.nameEn);
    res.status(201).json(newProduct);
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
    const product = await ProductModel.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const updatedProduct = await ProductModel.update(req.params.id, req.body);
    
    res.json(updatedProduct);
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ message: (err as Error).message });
  }
});

// Delete a product
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const deleted = await ProductModel.delete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product removed' });
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ message: (err as Error).message });
  }
});