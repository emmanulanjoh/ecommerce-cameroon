import { redisClient } from '../config/aws';

export class RedisService {
  // Set value with expiration
  static async set(key: string, value: any, ttl: number = 3600) {
    const serialized = JSON.stringify(value);
    await redisClient.setEx(key, ttl, serialized);
  }

  // Get value
  static async get(key: string) {
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  }

  // Delete key
  static async del(key: string) {
    await redisClient.del(key);
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