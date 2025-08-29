import express, { Request, Response } from 'express';

const router = express.Router();

// Test upload endpoint
router.post('/test', (req: Request, res: Response) => {
  console.log('Test upload endpoint hit');
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  
  res.json({
    success: true,
    message: 'Upload endpoint is working',
    timestamp: new Date().toISOString()
  });
});

router.get('/test', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Upload route is accessible',
    timestamp: new Date().toISOString()
  });
});

export { router };