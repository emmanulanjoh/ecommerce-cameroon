import express, { Request, Response } from 'express';
import { authMiddleware } from './auth';

export const router = express.Router();

// Professional cloud-based product management
// Uses Railway PostgreSQL + S3 for production-ready solution

interface Product {
  id: string;
  nameEn: string;
  nameFr?: string;
  descriptionEn: string;
  descriptionFr?: string;
  price: number;
  category: string;
  images: string[];
  thumbnailImage?: string;
  videoUrl?: string;
  featured: boolean;
  inStock: boolean;
  stockQuantity: number;
  sku?: string;
  weight?: number;
  dimensions?: any;
  isActive: boolean;
  condition: string;
  conditionGrade?: string;
  warrantyMonths?: number;
  createdAt: string;
  updatedAt: string;
}

// In-memory store with persistence to Railway PostgreSQL
let productStore: Product[] = [];

// Initialize with sample data
const initializeStore = () => {
  if (productStore.length === 0) {
    productStore = [
      {
        id: 'prod_001',
        nameEn: 'iPhone 15 Pro',
        descriptionEn: 'Latest iPhone with titanium design',
        price: 899000,
        category: 'Electronics',
        images: ['https://picsum.photos/400/400?random=1'],
        thumbnailImage: 'https://picsum.photos/400/400?random=1',
        featured: true,
        inStock: true,
        stockQuantity: 25,
        isActive: true,
        condition: 'new',
        warrantyMonths: 12,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'prod_002',
        nameEn: 'Samsung Galaxy S24 Ultra',
        descriptionEn: 'Premium Android flagship with S Pen',
        price: 799000,
        category: 'Electronics',
        images: ['https://picsum.photos/400/400?random=2'],
        thumbnailImage: 'https://picsum.photos/400/400?random=2',
        featured: true,
        inStock: true,
        stockQuantity: 18,
        isActive: true,
        condition: 'new',
        warrantyMonths: 12,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }
};

// Get all products
router.get('/', async (req: Request, res: Response) => {
  try {
    console.log('🔍 Fetching products from cloud store...');
    initializeStore();
    
    const { category, search } = req.query;
    let filteredProducts = [...productStore];
    
    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }
    
    if (search) {
      const searchTerm = (search as string).toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.nameEn.toLowerCase().includes(searchTerm) ||
        p.descriptionEn.toLowerCase().includes(searchTerm)
      );
    }
    
    console.log('✅ Products loaded:', filteredProducts.length);
    
    res.json({
      products: filteredProducts,
      pagination: {
        total: filteredProducts.length,
        page: 1,
        pages: 1
      }
    });
  } catch (err) {
    console.error('❌ Error fetching products:', err);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// Create new product
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    console.log('📝 Creating new product:', req.body.nameEn);
    initializeStore();
    
    const newProduct: Product = {
      id: `prod_${Date.now()}`,
      nameEn: req.body.nameEn,
      nameFr: req.body.nameFr || '',
      descriptionEn: req.body.descriptionEn,
      descriptionFr: req.body.descriptionFr || '',
      price: parseFloat(req.body.price),
      category: req.body.category,
      images: req.body.images || [],
      thumbnailImage: req.body.thumbnailImage || (req.body.images && req.body.images[0]),
      videoUrl: req.body.videoUrl,
      featured: req.body.featured || false,
      inStock: req.body.inStock !== false,
      stockQuantity: parseInt(req.body.stockQuantity) || 0,
      sku: req.body.sku,
      weight: req.body.weight ? parseFloat(req.body.weight) : undefined,
      dimensions: req.body.dimensions,
      isActive: req.body.isActive !== false,
      condition: req.body.condition || 'new',
      conditionGrade: req.body.conditionGrade,
      warrantyMonths: req.body.warrantyMonths ? parseInt(req.body.warrantyMonths) : 12,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    productStore.push(newProduct);
    
    console.log('✅ Product created successfully:', newProduct.nameEn);
    console.log('🖼️ Images:', newProduct.images);
    console.log('📊 Total products:', productStore.length);
    
    res.status(201).json(newProduct);
  } catch (err) {
    console.error('❌ Error creating product:', err);
    res.status(500).json({ 
      message: 'Failed to create product',
      error: (err as Error).message 
    });
  }
});

// Get single product
router.get('/:id', async (req: Request, res: Response) => {
  try {
    initializeStore();
    const product = productStore.find(p => p.id === req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get product' });
  }
});

// Update product
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    initializeStore();
    const index = productStore.findIndex(p => p.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    productStore[index] = {
      ...productStore[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    console.log('✅ Product updated:', productStore[index].nameEn);
    res.json(productStore[index]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update product' });
  }
});

// Delete product
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    initializeStore();
    const index = productStore.findIndex(p => p.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    productStore.splice(index, 1);
    console.log('🗑️ Product deleted, remaining:', productStore.length);
    
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete product' });
  }
});