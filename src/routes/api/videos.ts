import express from 'express';
import multer from 'multer';
// import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
// import { auth } from '../../middleware/auth';
import { Video } from '../../models/Video';

const router = express.Router();

// Configure AWS S3 - Disabled for now
// const s3 = new AWS.S3({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION
// });

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
router.post('/upload', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No video file provided' });
    }

    const videoId = uuidv4();
    const s3Key = `videos/promotional/${videoId}-${req.file.originalname}`;
    
    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: s3Key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: 'public-read'
    };

    // const s3Result = await s3.upload(uploadParams).promise();
    const s3Result = { Location: '/placeholder-video-url' };
    
    const video = new Video({
      filename: req.file.originalname,
      s3Key: s3Key,
      s3Url: s3Result.Location,
      fileSize: req.file.size,
      isActive: true
    });

    await video.save();
    res.json(video);
  } catch (error) {
    console.error('Video upload error:', error);
    res.status(500).json({ message: 'Upload failed' });
  }
});

// Get all videos (admin)
router.get('/', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Delete from S3
    const deleteParams = {
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: video.s3Key
    };
    
    // await s3.deleteObject(deleteParams).promise();
    
    // Delete from MongoDB
    await Video.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Video delete error:', error);
    res.status(500).json({ message: 'Delete failed' });
  }
});

export default router;