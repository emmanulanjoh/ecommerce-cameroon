import express, { Request, Response } from 'express';
import multer from 'multer';
import { S3Service } from '../../services/s3';
import { authMiddleware } from './auth';

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images and videos
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed'));
    }
  },
});

// Upload single file to S3
router.post('/single', authMiddleware, upload.single('file'), async (req: Request, res: Response) => {
  try {
    console.log('Upload request received');
    console.log('File:', req.file ? 'Present' : 'Missing');
    console.log('Body:', req.body);
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const folder = req.body.folder || 'products';
    const key = S3Service.generateKey(folder, req.file.originalname);
    
    console.log('Uploading to S3:', key);
    
    const fileUrl = await S3Service.uploadFile(
      key,
      req.file.buffer,
      req.file.mimetype
    );
    
    console.log('✅ S3 Upload successful:', fileUrl);

    res.json({
      success: true,
      url: fileUrl,
      key: key,
      message: 'File uploaded to S3 successfully'
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      message: 'Upload failed',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

// Upload multiple files to S3
router.post('/multiple', authMiddleware, upload.array('files', 10), async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const folder = req.body.folder || 'products';
    const uploadPromises = files.map(async (file) => {
      const key = S3Service.generateKey(folder, file.originalname);
      const url = await S3Service.uploadFile(key, file.buffer, file.mimetype);
      return { url, key, originalName: file.originalname };
    });

    const results = await Promise.all(uploadPromises);

    res.json({
      success: true,
      files: results
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed' });
  }
});

// Get presigned URL for direct upload
router.post('/presigned-url', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { filename, contentType, folder = 'products' } = req.body;
    
    if (!filename || !contentType) {
      return res.status(400).json({ message: 'Filename and content type required' });
    }

    const key = S3Service.generateKey(folder, filename);
    const uploadUrl = await S3Service.getUploadUrl(key, contentType);
    const fileUrl = `${process.env.CLOUDFRONT_URL}/${key}`;

    res.json({
      success: true,
      uploadUrl,
      fileUrl,
      key
    });
  } catch (error) {
    console.error('Presigned URL error:', error);
    res.status(500).json({ message: 'Failed to generate upload URL' });
  }
});

export { router };