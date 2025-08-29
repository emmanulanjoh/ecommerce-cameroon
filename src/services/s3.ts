import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client, AWS_CONFIG } from '../config/aws';

export class S3Service {
  // Upload file to S3
  static async uploadFile(key: string, body: Buffer, contentType: string) {
    const command = new PutObjectCommand({
      Bucket: AWS_CONFIG.S3_BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
      ACL: 'public-read',
    });
    
    await s3Client.send(command);
    return `${AWS_CONFIG.CLOUDFRONT_URL}/${key}`;
  }

  // Get signed URL for upload
  static async getUploadUrl(key: string, contentType: string) {
    const command = new PutObjectCommand({
      Bucket: AWS_CONFIG.S3_BUCKET,
      Key: key,
      ContentType: contentType,
      ACL: 'public-read',
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

  // Generate file key
  static generateKey(folder: string, filename: string): string {
    const timestamp = Date.now();
    const extension = filename.split('.').pop();
    return `${folder}/${timestamp}-${Math.random().toString(36).substring(7)}.${extension}`;
  }
}