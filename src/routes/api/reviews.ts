import express, { Request, Response } from 'express';
import { param } from 'express-validator';
import { validateReview, handleValidationErrors } from '../../middleware/validation';
import jwt from 'jsonwebtoken';
import Review from '../../models/Review';
import User from '../../models/User';

const router = express.Router();

import { flexibleAuth } from '../../middleware/auth';

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
router.post('/', flexibleAuth, async (req: Request, res: Response) => {
  try {
    const { product, rating, comment } = req.body;
    const userId = (req as any).user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!product) {
      return res.status(400).json({ message: 'Product ID required' });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be 1-5' });
    }

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
    console.error('Review creation error:', error);
    res.status(500).json({ message: error.message });
  }
});

export { router };