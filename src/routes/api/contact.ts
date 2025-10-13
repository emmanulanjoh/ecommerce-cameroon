import express, { Request, Response } from 'express';

const router = express.Router();

// @route   POST /api/contact
// @desc    Contact form disabled
// @access  Public
router.post('/', (req: Request, res: Response) => {
  res.status(503).json({ 
    message: 'Contact form is currently disabled. Please use the contact information provided on the page.' 
  });
});

export { router };