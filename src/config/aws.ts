import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { S3Client } from '@aws-sdk/client-s3';
import { createClient } from 'redis';

// DynamoDB Configuration
const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const docClient = DynamoDBDocumentClient.from(dynamoClient);

// S3 Configuration
export const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Redis Configuration
export const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

export const connectRedis = async () => {
  try {
    if (process.env.REDIS_URL && !redisClient.isOpen) {
      await redisClient.connect();
      console.log('✅ Redis Connected');
    } else {
      console.log('⚠️ Redis disabled - no REDIS_URL provided');
    }
  } catch (error) {
    console.warn('⚠️ Redis connection failed, continuing without cache:', (error as Error).message);
  }
};

export const AWS_CONFIG = {
  S3_BUCKET: process.env.S3_BUCKET_NAME || 'ecommerce-cameroon-assets',
  CLOUDFRONT_URL: process.env.CLOUDFRONT_URL || `https://${process.env.S3_BUCKET_NAME || 'ecommerce-cameroon-assets'}.s3.amazonaws.com`,
  DYNAMODB_TABLE: process.env.DYNAMODB_TABLE || 'ecommerce-cameroon',
};