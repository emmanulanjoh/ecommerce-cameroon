import express, { Request, Response } from 'express';
import Product from '../../models/Product';
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
    
    // Convert S3 URLs to CloudFront URLs
    const productsWithCloudFront = products.map(product => ({
      ...product,
      images: product.images?.map((img: string) => 
        img.includes('s3.amazonaws.com') ? 
          img.replace(/https:\/\/[^.]+\.s3\.amazonaws\.com/, 'https://d35ew0puu9c5cz.cloudfront.net') : 
          img
      ) || [],
      thumbnailImage: product.thumbnailImage?.includes('s3.amazonaws.com') ? 
        product.thumbnailImage.replace(/https:\/\/[^.]+\.s3\.amazonaws\.com/, 'https://d35ew0puu9c5cz.cloudfront.net') : 
        product.thumbnailImage
    }));
    
    console.log('✅ MongoDB products found:', productsWithCloudFront.length);
    
    res.json({
      products: productsWithCloudFront,
      pagination: {
        total: productsWithCloudFront.length,
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
    console.log('📝 Creating product:', req.body.nameEn);
    console.log('🖼️ Images received:', req.body.images);
    console.log('🖼️ Thumbnail received:', req.body.thumbnailImage);
    
    // Ensure we have proper image URLs from S3
    const images = Array.isArray(req.body.images) ? req.body.images : [];
    const thumbnailImage = req.body.thumbnailImage || (images.length > 0 ? images[0] : null);
    
    console.log('🖼️ Processing images:', images);
    console.log('🖼️ Processing thumbnail:', thumbnailImage);
    
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
    
    const savedProduct = await product.save();
    
    console.log('✅ Product saved to MongoDB:', savedProduct.nameEn);
    console.log('🖼️ Saved images:', savedProduct.images);
    console.log('🖼️ Saved thumbnail:', savedProduct.thumbnailImage);
    
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