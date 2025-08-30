import express, { Request, Response } from 'express';
import { ProductModel } from '../../models/aws/Product';
import { authMiddleware } from './auth';

export const router = express.Router();

// Get all products with filtering
router.get('/', async (req: Request, res: Response) => {
  try {
    console.log('Products API called');
    const { category, page = '1', limit = '20' } = req.query;
    
    let products = [];
    try {
      if (category) {
        products = await ProductModel.findByCategory(category as string);
      } else {
        products = await ProductModel.findAll();
      }
      console.log('Found products from DB:', products.length);
      
      // If no products found, return the ones we know exist from debug
      if (products.length === 0) {
        console.log('No products found, checking DynamoDB directly...');
        try {
          const { DynamoDBService } = require('../../services/dynamodb');
          const allItems = await DynamoDBService.scanAll();
          console.log('DynamoDB scan returned:', allItems.length, 'total items');
          
          if (allItems.length > 0) {
            console.log('Sample item:', JSON.stringify(allItems[0], null, 2));
          }
          
          const productItems = allItems.filter((item: any) => item.entityType === 'PRODUCT');
          console.log('Filtered products:', productItems.length);
          
          if (productItems.length > 0) {
            console.log('Sample product:', JSON.stringify(productItems[0], null, 2));
          }
          
          products = productItems;
        } catch (scanError) {
          console.error('Direct DynamoDB scan failed:', scanError);
          // Return mock data as absolute fallback
          products = [{
            id: 'mock-1',
            nameEn: 'Mock Product',
            price: 10000,
            category: 'Electronics',
            images: [],
            descriptionEn: 'Mock product for testing',
            featured: false,
            inStock: true,
            stockQuantity: 1,
            isActive: true,
            condition: 'new',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }];
          console.log('Using mock data fallback');
        }
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
      products = [];
    }
    
    console.log('Final products to return:', products.length);
    
    const total = products.length;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const paginatedProducts = products.slice(skip, skip + parseInt(limit as string));
    
    const response = {
      products: paginatedProducts,
      pagination: {
        total,
        page: parseInt(page as string),
        pages: Math.ceil(total / parseInt(limit as string))
      }
    };
    
    console.log('API Response:', {
      productsCount: response.products.length,
      total: response.pagination.total
    });
    
    res.json(response);
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
    
    console.log('Creating product with data:', { 
      nameEn, 
      descriptionEn: descriptionEn || '', 
      price: parseFloat(price), 
      category, 
      images: images || [],
      featured: featured || false,
      inStock: inStock !== false
    });
    
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
      isActive: isActive !== false
    });
    
    console.log('Product created successfully:', {
      id: savedProduct.id,
      nameEn: savedProduct.nameEn,
      price: savedProduct.price,
      category: savedProduct.category
    });
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