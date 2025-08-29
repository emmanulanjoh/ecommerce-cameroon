import express, { Request, Response } from 'express';
import { ProductModel } from '../../models/aws/Product';
import { authMiddleware } from './auth';

export const router = express.Router();

// Get all products with filtering
router.get('/', async (req: Request, res: Response) => {
  try {
    // Set cache headers
    res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
    const { 
      category, 
      featured, 
      minPrice, 
      maxPrice, 
      sort = '-createdAt',
      limit = '20',
      page = '1'
    } = req.query;
    
    // Build query
    const query: any = {};
    
    if (category) query.category = category;
    if (featured === 'true') query.featured = true;
    if (minPrice) query.price = { $gte: parseFloat(minPrice as string) };
    if (maxPrice) {
      if (query.price) {
        query.price.$lte = parseFloat(maxPrice as string);
      } else {
        query.price = { $lte: parseFloat(maxPrice as string) };
      }
    }
    
    // Execute query with pagination
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    
    let products;
    if (category) {
      products = await ProductModel.findByCategory(category as string);
    } else {
      products = await ProductModel.findAll();
    }
    
    const total = products.length;
    
    res.json({
      products,
      pagination: {
        total,
        page: parseInt(page as string),
        pages: Math.ceil(total / parseInt(limit as string))
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
    if (!nameEn || !descriptionEn || !price || !category) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    // TODO: Implement ProductModel.create for DynamoDB
    const savedProduct = { message: 'Create product not implemented yet' };
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ message: (err as Error).message });
  }
});

// Update a product
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    // TODO: Implement ProductModel.update for DynamoDB
    const updatedProduct = { message: 'Update product not implemented yet' };
    
    res.json(updatedProduct);
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ message: (err as Error).message });
  }
});

// Delete a product
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    // TODO: Implement ProductModel.delete for DynamoDB
    // const product = await ProductModel.findById(req.params.id);
    res.json({ message: 'Product removed' });
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ message: (err as Error).message });
  }
});