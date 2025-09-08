import express, { Request, Response } from 'express';
import { param } from 'express-validator';
import { validateReview, handleValidationErrors } from '../../middleware/validation';
import jwt from 'jsonwebtoken';
import Review from '../../models/Review';
import User from '../../models/User';

const router = express.Router();

// Auth middleware
const authMiddleware = async (req: Request, res: Response, next: Function) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'Server configuration error' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
    console.log('Decoded token:', decoded);
    
    let user;
    // Handle both admin and regular user tokens
    if (decoded.admin) {
      // Admin token structure
      user = { _id: decoded.admin.id, name: decoded.admin.username, isAdmin: true };
    } else if (decoded.userId) {
      // Regular user token
      user = await User.findById(decoded.userId);
    } else {
      return res.status(401).json({ message: 'Invalid token structure' });
    }
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    (req as any).user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get reviews for a product
router.get('/product/:productId', [param('productId').isMongoId().withMessage('Valid product ID required'), handleValidationErrors], async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    const avgRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0;

    res.json({
      reviews,
      avgRating: Math.round(avgRating * 10) / 10,
      totalReviews: reviews.length
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Get all reviews
router.get('/admin/all', async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({})
      .populate('user', 'name email')
      .populate('product', 'nameEn')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Delete review
router.delete('/admin/:id', async (req: Request, res: Response) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Create review
router.post('/', authMiddleware, validateReview, async (req: Request, res: Response) => {
  try {
    const { product, rating, comment } = req.body;
    const userId = (req as any).user._id;

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ product, user: userId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    const review = new Review({
      product,
      user: userId,
      rating,
      comment
    });

    await review.save();
    await review.populate('user', 'name');

    res.status(201).json(review);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export { router };