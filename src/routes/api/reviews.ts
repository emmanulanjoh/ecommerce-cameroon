import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { authMiddleware } from './auth';

const router = express.Router();

// Define a simple Review schema if it doesn't exist elsewhere
interface IReview extends mongoose.Document {
  productId: mongoose.Types.ObjectId;
  username: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: Date;
}

const ReviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the model if it doesn't exist
let Review: mongoose.Model<IReview>;
try {
  Review = mongoose.model<IReview>('Review');
} catch {
  Review = mongoose.model<IReview>('Review', ReviewSchema);
}

// @route   GET /api/reviews/all
// @desc    Get all reviews for admin
// @access  Private (Admin only)
router.get('/all', authMiddleware, async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({}).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error('Error fetching all reviews:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/reviews/product/:productId
// @desc    Get reviews for a product
// @access  Public
router.get('/product/:productId', async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({ 
      productId: req.params.productId,
      isApproved: true 
    }).sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/reviews
// @desc    Create a review
// @access  Public
router.post('/', async (req: Request, res: Response) => {
  try {
    const { productId, username, rating, comment } = req.body;
    
    const newReview = new Review({
      productId,
      username,
      rating,
      comment,
      isApproved: false // Require admin approval
    });
    
    await newReview.save();
    
    res.status(201).json({ message: 'Review submitted and pending approval' });
  } catch (err) {
    console.error('Error creating review:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/reviews/:id/approve
// @desc    Approve a review
// @access  Private (Admin only)
router.put('/:id/approve', authMiddleware, async (req: Request, res: Response) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    res.json(review);
  } catch (err) {
    console.error('Error approving review:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
// @access  Private (Admin only)
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    res.json({ message: 'Review removed' });
  } catch (err) {
    console.error('Error deleting review:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export { router };
export default router;