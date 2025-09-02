import { S3Client } from '@aws-sdk/client-s3';

// S3 Configuration
export const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const AWS_CONFIG = {
  S3_BUCKET: process.env.S3_BUCKET_NAME || 'ecommerce-cameroon-assets',
  CLOUDFRONT_URL: process.env.CLOUDFRONT_URL || 'https://d35ew0puu9c5cz.cloudfront.net',
};