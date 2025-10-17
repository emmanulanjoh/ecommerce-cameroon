import express from 'express';
import ProductModel from '../../models/Product';
import { SearchIndex } from '../../models/SearchIndex';
import { UserActivity } from '../../models/UserActivity';

const router = express.Router();

// Advanced search with filters
router.get('/products', async (req, res) => {
  try {
    const {
      q = '',
      category = '',
      minPrice = 0,
      maxPrice = 999999999,
      inStock = '',
      sortBy = 'relevance',
      page = 1,
      limit = 20
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    let query: any = {};
    let sort: any = {};

    // Text search
    if (q) {
      query.$text = { $search: q as string };
      sort.score = { $meta: 'textScore' };
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Price range
    query.price = {
      $gte: parseInt(minPrice as string),
      $lte: parseInt(maxPrice as string)
    };

    // Stock filter
    if (inStock === 'true') {
      query.inStock = true;
    }

    // Sorting
    switch (sortBy) {
      case 'price_low':
        sort.price = 1;
        break;
      case 'price_high':
        sort.price = -1;
        break;
      case 'newest':
        sort.createdAt = -1;
        break;
      case 'popularity':
        sort.popularity = -1;
        break;
      default:
        if (!q) sort.createdAt = -1;
    }

    const products = await ProductModel.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await ProductModel.countDocuments(query);

    res.json({
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Search failed' });
  }
});

// Get search suggestions
router.get('/suggestions', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || (q as string).length < 2) {
      return res.json({ suggestions: [] });
    }

    const suggestions = await SearchIndex.find({
      searchText: { $regex: q as string, $options: 'i' }
    })
    .sort({ popularity: -1 })
    .limit(10)
    .select('searchText category')
    .lean();

    const uniqueSuggestions = Array.from(
      new Set(suggestions.map(s => s.searchText))
    ).slice(0, 5);

    res.json({ suggestions: uniqueSuggestions });
  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({ message: 'Failed to get suggestions' });
  }
});

// Track user activity
router.post('/track', async (req, res) => {
  try {
    const { productId, action, sessionId } = req.body;
    
    const activity = new UserActivity({
      userId: (req as any).user?.id,
      sessionId,
      productId,
      action
    });

    await activity.save();
    res.json({ success: true });
  } catch (error) {
    console.error('Activity tracking error:', error);
    res.status(500).json({ message: 'Failed to track activity' });
  }
});

export default router;