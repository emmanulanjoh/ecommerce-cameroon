import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client, AWS_CONFIG } from '../config/aws';

export class S3Service {
  // Upload file to S3
  static async uploadFile(key: string, body: Buffer, contentType: string) {
    try {
      const command = new PutObjectCommand({
        Bucket: AWS_CONFIG.S3_BUCKET,
        Key: key,
        Body: body,
        ContentType: contentType,
        // Remove ACL - bucket should have public read policy
      });
      
      console.log('📤 Uploading to S3:', { bucket: AWS_CONFIG.S3_BUCKET, key });
      await s3Client.send(command);
      
      // Always return CloudFront URL
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

  // Generate file key - no folder prefix since CloudFront origin path is /products
  static generateKey(folder: string, filename: string): string {
    const timestamp = Date.now();
    const extension = filename.split('.').pop();
    const cleanName = filename.replace(/[^a-zA-Z0-9.-]/g, '_').substring(0, 30);
    return `${timestamp}-${Math.random().toString(36).substring(7)}.${extension}`;
  }
}