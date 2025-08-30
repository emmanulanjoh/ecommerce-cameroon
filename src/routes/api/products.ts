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

// In-memory storage for created products
let createdProducts: any[] = [];

// Get all products with filtering
router.get('/', async (req: Request, res: Response) => {
  try {
    console.log('🔍 Products API called at:', new Date().toISOString());
    
    // Base mock products
    const baseProducts = [
      {
        _id: 'mock-1',
        id: 'mock-1',
        nameEn: 'iPhone 14 Pro',
        nameFr: 'iPhone 14 Pro',
        descriptionEn: 'Latest iPhone with advanced features',
        price: 850000,
        category: 'Electronics',
        images: ['https://picsum.photos/300/300?random=1'],
        thumbnailImage: 'https://picsum.photos/300/300?random=1',
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
        images: ['https://picsum.photos/300/300?random=2'],
        thumbnailImage: 'https://picsum.photos/300/300?random=2',
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
        images: ['https://picsum.photos/300/300?random=3'],
        thumbnailImage: 'https://picsum.photos/300/300?random=3',
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
    
    // Combine base products with created products
    const allProducts = [...baseProducts, ...createdProducts];
    
    console.log('✅ Returning products:', allProducts.length, '(base:', baseProducts.length, 'created:', createdProducts.length, ')');
    
    res.json({
      products: allProducts,
      pagination: {
        total: allProducts.length,
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
    const productId = `product-${Date.now()}`;
    const newProduct = {
      _id: productId,
      id: productId,
      nameEn,
      nameFr: nameFr || '',
      descriptionEn: descriptionEn || '',
      price: parseFloat(price),
      category,
      images: (images || []).map((img: string) => {
        // If it's already a full URL, keep it; otherwise make it a placeholder
        if (img.startsWith('http')) return img;
        return `https://picsum.photos/300/300?random=${Date.now()}`;
      }),
      thumbnailImage: `https://picsum.photos/300/300?random=${Date.now()}`,
      featured: false,
      inStock: true,
      stockQuantity: parseInt(stockQuantity) || 0,
      isActive: true,
      condition: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add to in-memory storage
    createdProducts.push(newProduct);
    
    console.log('✅ Product created and stored:', newProduct.nameEn);
    console.log('📊 Total created products:', createdProducts.length);
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