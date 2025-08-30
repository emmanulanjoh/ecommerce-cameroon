import { redisClient } from '../config/aws';

export class RedisService {
  // Set value with expiration
  static async set(key: string, value: any, ttl: number = 3600) {
    try {
      if (redisClient.isOpen) {
        const serialized = JSON.stringify(value);
        await redisClient.setEx(key, ttl, serialized);
      }
    } catch (error) {
      console.warn('Redis set failed:', (error as Error).message);
    }
  }

  // Get value
  static async get(key: string) {
    try {
      if (redisClient.isOpen) {
        const value = await redisClient.get(key);
        return value ? JSON.parse(value) : null;
      }
    } catch (error) {
      console.warn('Redis get failed:', (error as Error).message);
    }
    return null;
  }

  // Delete key
  static async del(key: string) {
    try {
      if (redisClient.isOpen) {
        await redisClient.del(key);
      }
    } catch (error) {
      console.warn('Redis del failed:', (error as Error).message);
    }
  }

  // Check if key exists
  static async exists(key: string) {
    return await redisClient.exists(key);
  }

  // Set hash field
  static async hSet(key: string, field: string, value: any) {
    await redisClient.hSet(key, field, JSON.stringify(value));
  }

  // Get hash field
  static async hGet(key: string, field: string) {
    const value = await redisClient.hGet(key, field);
    return value ? JSON.parse(value) : null;
  }

  // Get all hash fields
  static async hGetAll(key: string) {
    const hash = await redisClient.hGetAll(key);
    const result: any = {};
    for (const [field, value] of Object.entries(hash)) {
      result[field] = JSON.parse(value);
    }
    return result;
  }

  // Cache keys
  static keys = {
    product: (id: string) => `product:${id}`,
    products: (category?: string) => category ? `products:${category}` : 'products:all',
    cart: (sessionId: string) => `cart:${sessionId}`,
    user: (id: string) => `user:${id}`,
  };
}