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
      
      // Optimize images only, leave videos as-is
      if (contentType.startsWith('image/')) {
        optimizedBody = await sharp(body)
          .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: 85 })
          .toBuffer();
        contentType = 'image/jpeg';
      }
      // Videos are uploaded without modification
      
      const command = new PutObjectCommand({
        Bucket: AWS_CONFIG.S3_BUCKET,
        Key: key,
        Body: optimizedBody,
        ContentType: contentType,
      });
      
      console.log('📤 Uploading to S3:', { 
        bucket: AWS_CONFIG.S3_BUCKET, 
        key, 
        contentType,
        bodySize: optimizedBody.length,
        isVideo: contentType.startsWith('video/')
      });
      
      await s3Client.send(command);
      
      const fileUrl = `${AWS_CONFIG.CLOUDFRONT_URL}/${key}`;
      console.log('✅ S3 upload complete, returning CloudFront URL:', fileUrl);
      
      // Verify AWS config
      console.log('🔧 AWS Config:', {
        region: process.env.AWS_REGION,
        bucket: AWS_CONFIG.S3_BUCKET,
        cloudfrontUrl: AWS_CONFIG.CLOUDFRONT_URL,
        hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
        hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY
      });
      
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

  // Generate secure file key with folder prefix
  static generateKey(folder: string, filename: string): string {
    // Prevent path traversal by using only basename
    const baseFilename = path.basename(filename);
    
    // Strict validation against path traversal
    if (baseFilename.includes('..') || folder.includes('..') || 
        baseFilename.includes('/') || baseFilename.includes('\\') ||
        folder.includes('/') || folder.includes('\\')) {
      throw new Error('Path traversal detected in filename or folder');
    }
    
    // Sanitize filename for S3 compatibility (allow international chars, spaces)
    const safeFilename = baseFilename
      .replace(/[<>:"|?*\\]/g, '_')  // Remove Windows forbidden chars
      .replace(/\s+/g, '_')          // Replace spaces with underscores
      .replace(/_{2,}/g, '_');       // Replace multiple underscores with single
    
    // Validate folder name
    const allowedFolders = ['products', 'users', 'categories', 'temp'];
    const safeFolder = folder.replace(/[^a-zA-Z0-9-]/g, '_');
    if (!allowedFolders.includes(safeFolder)) {
      throw new Error('Invalid folder name');
    }
    
    const timestamp = Date.now();
    const extension = safeFilename.split('.').pop()?.toLowerCase();
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'webm', 'ogg', 'avi', 'mov'];
    
    if (!extension || !allowedExtensions.includes(extension)) {
      throw new Error('Invalid file extension');
    }
    
    const randomId = Math.random().toString(36).substring(7);
    return `${safeFolder}/${timestamp}-${randomId}.${extension}`;
  }
}