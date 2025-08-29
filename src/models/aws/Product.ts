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
  static async findAll() {
    const cacheKey = RedisService.keys.products();
    
    try {
      const cached = await RedisService.get(cacheKey);
      if (cached) return cached;
    } catch (error) {
      console.warn('Redis cache miss, querying DynamoDB');
    }
    
    // Query all products from DynamoDB
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