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
    
    let allProducts = [];
    
    // Try to get products from DynamoDB first
    try {
      const dbProducts = await ProductModel.findAll();
      console.log('📊 DynamoDB products found:', dbProducts.length);
      allProducts = [...dbProducts];
    } catch (dbError) {
      console.warn('⚠️ DynamoDB query failed, using mock data:', dbError.message);
    }
    
    // Add created products from memory
    allProducts = [...allProducts, ...createdProducts];
    
    // If no products at all, use base mock products
    if (allProducts.length === 0) {
      console.log('🔄 Using base mock products');
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
      allProducts = baseProducts;
    }
    
    console.log('✅ Returning products:', allProducts.length);
    
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
    console.log('📝 Creating product with data:', req.body);
    
    const {
      nameEn,
      nameFr,
      descriptionEn,
      descriptionFr,
      price,
      category,
      images,
      thumbnailImage,
      videoUrl,
      featured,
      inStock,
      stockQuantity,
      sku,
      weight,
      dimensions,
      isActive,
      condition,
      conditionGrade,
      warrantyMonths
    } = req.body;
    
    // Validate required fields
    if (!nameEn || !price || !category) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    try {
      // Try to save to DynamoDB
      const savedProduct = await ProductModel.create({
        nameEn,
        nameFr: nameFr || '',
        descriptionEn: descriptionEn || '',
        descriptionFr: descriptionFr || '',
        price: parseFloat(price),
        category,
        images: images || [],
        thumbnailImage,
        videoUrl,
        featured: featured || false,
        inStock: inStock !== false,
        stockQuantity: parseInt(stockQuantity) || 0,
        sku,
        weight: weight ? parseFloat(weight) : undefined,
        dimensions,
        isActive: isActive !== false,
        condition: condition || 'new',
        conditionGrade,
        warrantyMonths: warrantyMonths ? parseInt(warrantyMonths) : 12
      });
      
      console.log('✅ Product saved to DynamoDB:', savedProduct.nameEn);
      res.status(201).json(savedProduct);
      
    } catch (dbError) {
      console.error('❌ DynamoDB save failed, using fallback:', dbError);
      
      // Fallback: create mock product and add to memory
      const productId = `product-${Date.now()}`;
      const newProduct = {
        _id: productId,
        id: productId,
        nameEn,
        nameFr: nameFr || '',
        descriptionEn: descriptionEn || '',
        descriptionFr: descriptionFr || '',
        price: parseFloat(price),
        category,
        images: images || [],
        thumbnailImage: thumbnailImage || `https://picsum.photos/300/300?random=${Date.now()}`,
        videoUrl,
        featured: featured || false,
        inStock: inStock !== false,
        stockQuantity: parseInt(stockQuantity) || 0,
        sku,
        weight: weight ? parseFloat(weight) : undefined,
        dimensions,
        isActive: isActive !== false,
        condition: condition || 'new',
        conditionGrade,
        warrantyMonths: warrantyMonths ? parseInt(warrantyMonths) : 12,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Add to in-memory storage as fallback
      createdProducts.push(newProduct);
      
      console.log('✅ Product created with fallback storage:', newProduct.nameEn);
      res.status(201).json(newProduct);
    }
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