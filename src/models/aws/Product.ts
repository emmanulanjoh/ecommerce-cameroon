import { DynamoDBService } from '../../services/dynamodb';
import { RedisService } from '../../services/redis';

export interface Product {
  id: string;
  nameEn: string;
  nameFr?: string;
  price: number;
  category: string;
  images: string[];
  description?: string;
  stock: number;
  createdAt: string;
}

export class ProductModel {
  static async create(productData: Omit<Product, 'id' | 'createdAt'>) {
    const id = Date.now().toString();
    const product = {
      PK: `PRODUCT#${id}`,
      SK: `PRODUCT#${id}`,
      GSI1PK: `CATEGORY#${productData.category}`,
      GSI1SK: `PRODUCT#${productData.nameEn}`,
      id,
      ...productData,
      entityType: 'PRODUCT',
      createdAt: new Date().toISOString()
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
    const cacheKey = RedisService.keys.products();
    
    try {
      const cached = await RedisService.get(cacheKey);
      if (cached) return cached;
    } catch (error) {
      console.warn('Redis cache miss, querying DynamoDB');
    }
    
    const products = await DynamoDBService.query('PRODUCT#', 'PRODUCT#');
    
    try {
      await RedisService.set(cacheKey, products, 1800);
    } catch (error) {
      console.warn('Failed to cache products');
    }
    
    return products;
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
    const cacheKey = RedisService.keys.products(category);
    
    try {
      const cached = await RedisService.get(cacheKey);
      if (cached) return cached;
    } catch (error) {
      console.warn('Redis cache miss');
    }
    
    const products = await DynamoDBService.query(`CATEGORY#${category}`);
    
    try {
      await RedisService.set(cacheKey, products, 1800);
    } catch (error) {
      console.warn('Failed to cache products');
    }
    
    return products;
  }
}