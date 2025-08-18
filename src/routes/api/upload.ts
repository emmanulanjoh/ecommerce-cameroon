import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { authMiddleware } from './auth';

const router = express.Router();

// Ensure upload directories exist
const uploadDir = path.join(process.cwd(), 'public', 'uploads');
const productsDir = path.join(uploadDir, 'products');
const thumbnailsDir = path.join(uploadDir, 'thumbnails');
const tempDir = path.join(uploadDir, 'temp');

[productsDir, thumbnailsDir, tempDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const originalName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '-').toLowerCase();
    cb(null, originalName + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accept images and videos
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type. Only images and videos are allowed.'));
  }
};

// Configure upload
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880') // 5MB default
  }
});

// @route   POST /api/upload
// @desc    Upload product images or videos
// @access  Private
router.post('/', authMiddleware, upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const file = req.file;
    const isImage = file.mimetype.startsWith('image/');
    const isVideo = file.mimetype.startsWith('video/');
    
    let finalPath = '';
    let thumbnailPath = '';
    let mediumPath = '';

    // Process image files
    if (isImage) {
      // Move from temp to products directory
      finalPath = path.join(productsDir, file.filename);
      fs.renameSync(file.path, finalPath);
      
      // Create thumbnail
      thumbnailPath = path.join(thumbnailsDir, file.filename.replace(path.extname(file.filename), '-thumb' + path.extname(file.filename)));
      await sharp(finalPath)
        .resize(150, 150, { fit: 'cover' })
        .toFile(thumbnailPath);
      
      // Create medium size for product display
      mediumPath = path.join(productsDir, file.filename.replace(path.extname(file.filename), '-medium' + path.extname(file.filename)));
      await sharp(finalPath)
        .resize(500, 500, { fit: 'inside' })
        .toFile(mediumPath);
    } 
    // Process video files
    else if (isVideo) {
      // Just move the video file
      finalPath = path.join(productsDir, file.filename);
      fs.renameSync(file.path, finalPath);
    }

    // Return paths relative to public directory
    const result = {
      originalPath: `/uploads/products/${path.basename(finalPath)}`,
      thumbnailPath: isImage ? `/uploads/thumbnails/${path.basename(thumbnailPath)}` : null,
      mediumPath: isImage ? `/uploads/products/${path.basename(mediumPath)}` : null,
      fileType: isImage ? 'image' : 'video'
    };

    res.json(result);
  } catch (err) {
    console.error('Error uploading file:', err);
    res.status(500).json({ message: 'Error uploading file' });
  }
});

export { router };