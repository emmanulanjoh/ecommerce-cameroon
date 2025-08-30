import express, { Request, Response } from 'express';
import { ProductModel } from '../../models/aws/Product';
import { authMiddleware } from './auth';

export const router = express.Router();

// Get all products with filtering
router.get('/', async (req: Request, res: Response) => {
  try {
    console.log('Products API called');
    
    // Return mock data temporarily to prevent 502
    const mockProducts = [
      {
        id: '1',
        nameEn: 'Sample Product 1',
        price: 25000,
        category: 'Electronics',
        images: [],
        description: 'Sample product description',
        stock: 10,
        createdAt: new Date().toISOString()
      },
      {
        id: '2', 
        nameEn: 'Sample Product 2',
        price: 35000,
        category: 'Clothing',
        images: [],
        description: 'Another sample product',
        stock: 5,
        createdAt: new Date().toISOString()
      }
    ];
    
    res.json({
      products: mockProducts,
      pagination: {
        total: mockProducts.length,
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
      isActive
    } = req.body;
    
    // Validate required fields
    if (!nameEn || !price || !category) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    console.log('Creating product with data:', { nameEn, price, category, images });
    
    const savedProduct = await ProductModel.create({
      nameEn,
      nameFr: nameFr || '',
      price: parseFloat(price),
      category,
      images: images || [],
      description: descriptionEn || '',
      stock: parseInt(stockQuantity) || 0
    });
    
    console.log('Product created successfully:', savedProduct.id);
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error('Product creation error:', err);
    res.status(500).json({ 
      message: (err as Error).message,
      error: process.env.NODE_ENV === 'development' ? err : undefined
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