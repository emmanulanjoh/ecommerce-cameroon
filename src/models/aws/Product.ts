import { DynamoDBService } from '../../services/dynamodb';
import { RedisService } from '../../services/redis';

export interface Product {
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
  stockQuantity?: number;
  sku?: string;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  averageRating?: number;
  reviewCount?: number;
  isActive: boolean;
  condition?: 'new' | 'refurbished' | 'used';
  conditionGrade?: 'A' | 'B' | 'C';
  warrantyMonths?: number;
  createdAt: string;
  updatedAt: string;
}

export class ProductModel {
  static async create(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
    const id = Date.now().toString();
    const product = {
      PK: `PRODUCT#${id}`,
      SK: `PRODUCT#${id}`,
      GSI1PK: `CATEGORY#${productData.category}`,
      GSI1SK: `PRODUCT#${productData.nameEn}`,
      id,
      ...productData,
      // Set defaults for missing fields
      featured: productData.featured ?? false,
      inStock: productData.inStock ?? true,
      isActive: productData.isActive ?? true,
      condition: productData.condition ?? 'new',
      warrantyMonths: productData.warrantyMonths ?? 12,
      averageRating: 0,
      reviewCount: 0,
      entityType: 'PRODUCT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await DynamoDBService.create(product);
    
    try {
      await RedisService.set(RedisService.keys.product(id), product, 3600);
      await RedisService.del(RedisService.keys.products());
      await RedisService.del(RedisService.keys.products(productData.category));
    } catch (error) {
      console.warn('Failed to update cache');
    }
    
    return product;
  }

  static async update(id: string, updates: Partial<Product>) {
    const updated = await DynamoDBService.update(`PRODUCT#${id}`, `PRODUCT#${id}`, updates);
    
    try {
      await RedisService.set(RedisService.keys.product(id), updated, 3600);
      await RedisService.del(RedisService.keys.products());
      if (updates.category) {
        await RedisService.del(RedisService.keys.products(updates.category));
      }
    } catch (error) {
      console.warn('Failed to update cache');
    }
    
    return updated;
  }

  static async delete(id: string) {
    const product = await this.findById(id);
    if (!product) return false;
    
    await DynamoDBService.delete(`PRODUCT#${id}`, `PRODUCT#${id}`);
    
    try {
      await RedisService.del(RedisService.keys.product(id));
      await RedisService.del(RedisService.keys.products());
      await RedisService.del(RedisService.keys.products(product.category));
    } catch (error) {
      console.warn('Failed to update cache');
    }
    
    return true;
  }

  static async findAll() {
    try {
      const cacheKey = RedisService.keys.products();
      
      try {
        const cached = await RedisService.get(cacheKey);
        if (cached) return cached;
      } catch (error) {
        console.warn('Redis cache miss, querying DynamoDB');
      }
      
      // Use scan to get all products
      const products = await DynamoDBService.scanAll();
      const productItems = products.filter(item => item.entityType === 'PRODUCT');
      
      try {
        await RedisService.set(cacheKey, productItems, 1800);
      } catch (error) {
        console.warn('Failed to cache products');
      }
      
      return productItems;
    } catch (error) {
      console.error('Error in ProductModel.findAll:', error);
      return [];
    }
  }

  static async findById(id: string) {
    const cacheKey = RedisService.keys.product(id);
    
    try {
      const cached = await RedisService.get(cacheKey);
      if (cached) return cached;
    } catch (error) {
      console.warn('Redis cache miss');
    }
    
    const product = await DynamoDBService.get(`PRODUCT#${id}`, `PRODUCT#${id}`);
    
    if (product) {
      try {
        await RedisService.set(cacheKey, product, 3600);
      } catch (error) {
        console.warn('Failed to cache product');
      }
    }
    
    return product;
  }

  static async findByCategory(category: string) {
    try {
      const cacheKey = RedisService.keys.products(category);
      
      try {
        const cached = await RedisService.get(cacheKey);
        if (cached) return cached;
      } catch (error) {
        console.warn('Redis cache miss');
      }
      
      // Use GSI to query by category, fallback to scan if GSI fails
      let products;
      try {
        products = await DynamoDBService.queryGSI(`CATEGORY#${category}`);
      } catch (gsiError) {
        console.warn('GSI query failed, using scan fallback:', gsiError);
        const allProducts = await DynamoDBService.scanAll();
        products = allProducts.filter(item => 
          item.entityType === 'PRODUCT' && 
          item.category?.toLowerCase() === category.toLowerCase()
        );
      }
      
      try {
        await RedisService.set(cacheKey, products, 1800);
      } catch (error) {
        console.warn('Failed to cache products');
      }
      
      return products;
    } catch (error) {
      console.error('Error in ProductModel.findByCategory:', error);
      return [];
    }
  }
}