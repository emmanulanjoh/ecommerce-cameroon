import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client, AWS_CONFIG } from '../config/aws';
import sharp from 'sharp';
import path from 'path';

export class S3Service {
  // Upload file to S3
  static async uploadFile(key: string, body: Buffer, contentType: string) {
    try {
      let optimizedBody = body;
      
      // Optimize images
      if (contentType.startsWith('image/')) {
        optimizedBody = await sharp(body)
          .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: 85 })
          .toBuffer();
        contentType = 'image/jpeg';
      }
      
      const command = new PutObjectCommand({
        Bucket: AWS_CONFIG.S3_BUCKET,
        Key: key,
        Body: optimizedBody,
        ContentType: contentType,
      });
      
      console.log('📤 Uploading optimized to S3:', { bucket: AWS_CONFIG.S3_BUCKET, key });
      await s3Client.send(command);
      
      const fileUrl = `${AWS_CONFIG.CLOUDFRONT_URL}/${key}`;
      console.log('✅ S3 upload complete, returning CloudFront URL:', fileUrl);
      
      return fileUrl;
    } catch (error) {
      console.error('❌ S3 upload failed:', error);
      throw error;
    }
  }

  // Get signed URL for upload
  static async getUploadUrl(key: string, contentType: string) {
    const command = new PutObjectCommand({
      Bucket: AWS_CONFIG.S3_BUCKET,
      Key: key,
      ContentType: contentType,
    });
    
    return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  }

  // Delete file from S3
  static async deleteFile(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: AWS_CONFIG.S3_BUCKET,
      Key: key,
    });
    
    await s3Client.send(command);
  }

  // Generate file key with folder prefix
  static generateKey(folder: string, filename: string): string {
    // Prevent path traversal by using only basename
    const safeFilename = path.basename(filename);
    // Check for path traversal sequences
    if (safeFilename.includes('..') || folder.includes('..')) {
      throw new Error('Invalid filename or folder path');
    }
    
    const timestamp = Date.now();
    const extension = safeFilename.split('.').pop();
    const cleanName = safeFilename.replace(/[^a-zA-Z0-9.-]/g, '_').substring(0, 30);
    const safeFolder = folder.replace(/[^a-zA-Z0-9-]/g, '_');
    return `${safeFolder}/${timestamp}-${Math.random().toString(36).substring(7)}.${extension}`;
  }
}