import { S3Client } from '@aws-sdk/client-s3';

// S3 Configuration with fallback
export const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'dummy-key',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'dummy-secret',
  },
});

export const AWS_CONFIG = {
  S3_BUCKET: process.env.S3_BUCKET_NAME || 'ecommerce-cameroon-assets',
  CLOUDFRONT_URL: process.env.CLOUDFRONT_URL || 'https://d35ew0puu9c5cz.cloudfront.net',
  IS_CONFIGURED: !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY),
};