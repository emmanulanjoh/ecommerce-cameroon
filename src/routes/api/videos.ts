import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { adminAuth } from '../../middleware/auth';
import { Video } from '../../models/Video';
import { S3Service } from '../../services/s3';
import { sanitizeForLog } from '../../utils/sanitize';

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
});

// Upload video to S3
router.post('/upload', adminAuth, upload.single('video'), async (req, res) => {
  try {
    console.log('📹 Video upload request received');
    
    if (!req.file) {
      return res.status(400).json({ message: 'No video file provided' });
    }

    console.log('📹 Video file details:', {
      filename: sanitizeForLog(req.file.originalname),
      size: req.file.size,
      mimetype: req.file.mimetype
    });

    const videoId = uuidv4();
    const s3Key = `videos/${videoId}-${req.file.originalname}`;
    
    console.log('📤 Uploading video to S3:', sanitizeForLog(s3Key));
    
    // Upload to S3 using S3Service
    const s3Url = await S3Service.uploadFile(
      s3Key,
      req.file.buffer,
      req.file.mimetype
    );
    
    console.log('✅ Video uploaded to S3:', sanitizeForLog(s3Url));
    
    const video = new Video({
      filename: req.file.originalname,
      s3Key: s3Key,
      s3Url: s3Url,
      fileSize: req.file.size,
      isActive: true
    });

    await video.save();
    console.log('✅ Video saved to database:', sanitizeForLog(video._id));
    
    res.json(video);
  } catch (error: any) {
    console.error('❌ Video upload error:', sanitizeForLog(error.message));
    res.status(500).json({ 
      message: 'Upload failed',
      error: error.message
    });
  }
});

// Get all videos (admin)
router.get('/', adminAuth, async (req, res) => {
  try {
    const videos = await Video.find().sort({ uploadDate: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch videos' });
  }
});

// Get active videos (public)
router.get('/active', async (req, res) => {
  try {
    const videos = await Video.find({ isActive: true }).sort({ uploadDate: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch videos' });
  }
});

// Delete video
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    console.log('🗑️ Deleting video from S3:', sanitizeForLog(video.s3Key));
    
    // Delete from S3
    await S3Service.deleteFile(video.s3Key);
    
    // Delete from MongoDB
    await Video.findByIdAndDelete(req.params.id);
    
    console.log('✅ Video deleted successfully');
    res.json({ message: 'Video deleted successfully' });
  } catch (error: any) {
    console.error('❌ Video delete error:', sanitizeForLog(error.message));
    res.status(500).json({ message: 'Delete failed' });
  }
});

export default router;