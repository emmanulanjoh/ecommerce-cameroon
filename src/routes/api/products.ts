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

// Debug endpoint for production
router.get('/debug', async (req: Request, res: Response) => {
  try {
    const dbName = mongoose.connection.db?.databaseName;
    const connectionState = mongoose.connection.readyState;
    const totalProducts = await Product.countDocuments({});
    const activeProducts = await Product.countDocuments({ isActive: true });
    const sampleProduct = await Product.findOne({}).lean();
    
    // List all collections in current database
    const collections = await mongoose.connection.db!.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    res.json({
      database: dbName,
      connectionState,
      collections: collectionNames,
      totalProducts,
      activeProducts,
      sampleProduct: sampleProduct ? {
        id: sampleProduct._id,
        name: sampleProduct.nameEn || sampleProduct.name,
        category: sampleProduct.category,
        isActive: sampleProduct.isActive
      } : null
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Database inspection endpoint
router.get('/db-inspect', async (req: Request, res: Response) => {
  try {
    res.json({
      currentDatabase: mongoose.connection.db?.databaseName,
      connectionString: process.env.MONGODB_URI?.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'),
      readyState: mongoose.connection.readyState
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});



// Get all products with advanced search and filters
router.get('/', async (req: Request, res: Response) => {
  try {
    console.log('🔍 Products API called');
    console.log('🗄️ Database:', mongoose.connection.db?.databaseName);
    console.log('🔗 Connection state:', mongoose.connection.readyState);
    
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const skip = (page - 1) * limit;
    
    // Search and filter parameters
    const search = req.query.search as string;
    const category = req.query.category as string;
    const minPrice = parseFloat(req.query.minPrice as string);
    const maxPrice = parseFloat(req.query.maxPrice as string);
    const inStock = req.query.inStock === 'true';
    const featured = req.query.featured === 'true';
    const sortBy = req.query.sortBy as string || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    // Build query - remove isActive filter to see all products
    let query: any = {};
    
    // Text search with input validation
    if (search && typeof search === 'string') {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { nameEn: { $regex: escapedSearch, $options: 'i' } },
        { nameFr: { $regex: escapedSearch, $options: 'i' } },
        { name: { $regex: escapedSearch, $options: 'i' } },
        { descriptionEn: { $regex: escapedSearch, $options: 'i' } },
        { category: { $regex: escapedSearch, $options: 'i' } }
      ];
    }
    
    if (category && typeof category === 'string') {
      query.category = category.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    if (!isNaN(minPrice) || !isNaN(maxPrice)) {
      query.price = {};
      if (!isNaN(minPrice)) query.price.$gte = minPrice;
      if (!isNaN(maxPrice)) query.price.$lte = maxPrice;
    }
    
    if (inStock) query.inStock = true;
    if (featured) query.featured = true;

    let sort: any = {};
    sort[sortBy] = sortOrder;

    console.log('🔍 Query:', JSON.stringify(query));
    
    // Use Product model instead of direct collection access
    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Product.countDocuments(query);
    
    console.log('📊 Found products:', products.length);
    console.log('📊 Total products:', total);
    
    // Convert S3 URLs to CloudFront URLs and handle legacy field names
    const productsWithCloudFront = products.map((product: any) => ({
      ...product,
      // Handle legacy 'name' field
      nameEn: product.nameEn || product.name,
      descriptionEn: product.descriptionEn || product.description || 'No description available',
      images: product.images?.map((img: string) => 
        img.includes('s3.amazonaws.com') ? 
          img.replace(/https:\/\/[^.]+\.s3\.amazonaws\.com/, 'https://d35ew0puu9c5cz.cloudfront.net') : 
          img
      ) || [],
      thumbnailImage: product.thumbnailImage?.includes('s3.amazonaws.com') ? 
        product.thumbnailImage.replace(/https:\/\/[^.]+\.s3\.amazonaws\.com/, 'https://d35ew0puu9c5cz.cloudfront.net') : 
        product.thumbnailImage
    }));
    
    console.log('🚀 Returning products:', productsWithCloudFront.length);

    res.json({
      products: productsWithCloudFront,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
      filters: {
        search,
        category,
        minPrice,
        maxPrice,
        inStock,
        featured,
        sortBy,
        sortOrder: sortOrder === 1 ? 'asc' : 'desc'
      }
    });
  } catch (err) {
    console.error('API Error:', sanitizeForLog((err as Error).message));
    res.status(500).json({ message: sanitizeForHtml((err as Error).message) });
  }
});

// Get single product
router.get('/:id', async (req: Request, res: Response) => {
  try {
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (err) {
    console.error('API Error:', sanitizeForLog((err as Error).message));
    res.status(500).json({ message: sanitizeForHtml((err as Error).message) });
  }
});

// Create a new product
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    console.log('Creating product:', sanitizeForLog(req.body.nameEn));
    console.log('🖼️ Images received:', sanitizeForLog(JSON.stringify(req.body.images)));
    console.log('🖼️ Thumbnail received:', sanitizeForLog(req.body.thumbnailImage));
    
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
    console.error('❌ Product creation error:', sanitizeForLog((err as Error).message));
    res.status(500).json({ 
      message: sanitizeForHtml((err as Error).message)
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

// Get product recommendations
router.get('/:id/recommendations', async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const limit = parseInt(req.query.limit as string) || 4;
    
    // Get the current product
    const currentProduct = await Product.findById(productId);
    if (!currentProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Find similar products based on category and price range
    const priceRange = currentProduct.price * 0.3; // 30% price range
    
    const recommendations = await Product.find({
      _id: { $ne: productId },
      isActive: true,
      $or: [
        { category: currentProduct.category },
        { 
          price: { 
            $gte: currentProduct.price - priceRange,
            $lte: currentProduct.price + priceRange
          }
        }
      ]
    })
    .sort({ featured: -1, createdAt: -1 })
    .limit(limit)
    .lean();
    
    // Convert S3 URLs to CloudFront URLs
    const recommendationsWithCloudFront = recommendations.map(product => ({
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
    
    res.json(recommendationsWithCloudFront);
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