import express, { Request, Response } from 'express';
import Product from '../../models/Product';
import SearchHistory from '../../models/SearchHistory';
import { body, query, validationResult } from 'express-validator';

const router = express.Router();

// Cache for trending searches (refresh every 5 minutes)
let trendingCache: { searches: string[], lastUpdated: number } = {
  searches: [],
  lastUpdated: 0
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper function for simple typo correction (Levenshtein distance)
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

// Get trending searches
async function getTrendingSearches(limit: number = 10): Promise<string[]> {
  const now = Date.now();
  
  // Return cached results if still valid
  if (trendingCache.lastUpdated && (now - trendingCache.lastUpdated) < CACHE_DURATION) {
    return trendingCache.searches;
  }

  try {
    // Get top searches from last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const trending = await SearchHistory.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
          resultCount: { $gt: 0 }
        }
      },
      {
        $group: {
          _id: '$query',
          count: { $sum: 1 },
          clicks: { $sum: { $cond: ['$clicked', 1, 0] } }
        }
      },
      {
        $addFields: {
          score: { $add: ['$count', { $multiply: ['$clicks', 2] }] }
        }
      },
      { $sort: { score: -1 } },
      { $limit: limit },
      { $project: { _id: 1 } }
    ]);

    const searches = trending.map(item => item._id);
    
    // Update cache
    trendingCache = {
      searches,
      lastUpdated: now
    };

    return searches;
  } catch (error) {
    console.error('Error getting trending searches:', error);
    return [];
  }
}

// Enhanced search suggestions with typo correction
router.get('/suggestions', [
  query('q').trim().isLength({ min: 1, max: 100 })
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const query = (req.query.q as string).toLowerCase();
    const language = (req.query.lang as string) || 'en';
    
    if (query.length < 2) {
      // Return trending searches for short queries
      const trending = await getTrendingSearches(6);
      return res.json({ 
        suggestions: [],
        trending,
        type: 'trending'
      });
    }

    // Get matching products
    const searchField = language === 'fr' ? 'nameFr' : 'nameEn';
    const products = await Product.find({
      $or: [
        { [searchField]: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { descriptionEn: { $regex: query, $options: 'i' } }
      ],
      isActive: true
    })
    .select('nameEn nameFr category price images averageRating')
    .limit(10)
    .lean();

    // Extract unique suggestions
    const suggestions = new Set<string>();
    const productSuggestions: any[] = [];
    
    products.forEach(product => {
      const name = language === 'fr' && product.nameFr ? product.nameFr : product.nameEn;
      
      if (name.toLowerCase().includes(query)) {
        suggestions.add(name);
        productSuggestions.push({
          id: product._id,
          name,
          category: product.category,
          price: product.price,
          image: product.images?.[0] || '',
          rating: product.averageRating || 0
        });
      }
      
      if (product.category && product.category.toLowerCase().includes(query)) {
        suggestions.add(product.category);
      }
    });

    // Add recent searches from this user's session
    const sessionId = req.sessionID || req.headers['x-session-id'] as string;
    const recentSearches = await SearchHistory.find({ sessionId })
      .sort({ createdAt: -1 })
      .limit(3)
      .select('query')
      .lean();

    const suggestionArray = Array.from(suggestions).slice(0, 8);
    
    res.json({ 
      suggestions: suggestionArray,
      products: productSuggestions.slice(0, 4),
      recent: recentSearches.map(s => s.query),
      trending: await getTrendingSearches(5),
      type: 'search'
    });
  } catch (error) {
    console.error('Search suggestions error:', error);
    res.status(500).json({ error: 'Failed to fetch suggestions' });
  }
});

// Track search query
router.post('/track', [
  body('query').trim().notEmpty(),
  body('resultCount').isInt({ min: 0 }),
  body('language').optional().isIn(['en', 'fr'])
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { query, resultCount, language } = req.body;
    const userId = (req as any).user?._id;
    const sessionId = req.sessionID || req.headers['x-session-id'] as string;

    await SearchHistory.create({
      query: query.toLowerCase(),
      resultCount,
      userId,
      sessionId,
      language: language || 'en'
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Track search error:', error);
    res.status(500).json({ error: 'Failed to track search' });
  }
});

// Track click on search result
router.post('/click', [
  body('query').trim().notEmpty(),
  body('productId').trim().notEmpty()
], async (req: Request, res: Response) => {
  try {
    const { query, productId } = req.body;
    const sessionId = req.sessionID || req.headers['x-session-id'] as string;

    await SearchHistory.findOneAndUpdate(
      { 
        query: query.toLowerCase(), 
        sessionId,
        createdAt: { $gte: new Date(Date.now() - 30 * 60 * 1000) } // Last 30 min
      },
      {
        clicked: true,
        clickedProductId: productId
      },
      { sort: { createdAt: -1 } }
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Track click error:', error);
    res.status(500).json({ error: 'Failed to track click' });
  }
});

// Get trending searches
router.get('/trending', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const trending = await getTrendingSearches(limit);
    
    res.json({ trending });
  } catch (error) {
    console.error('Trending searches error:', error);
    res.status(500).json({ error: 'Failed to fetch trending searches' });
  }
});

// Get user's search history
router.get('/history', async (req: Request, res: Response) => {
  try {
    const sessionId = req.sessionID || req.headers['x-session-id'] as string;
    const limit = parseInt(req.query.limit as string) || 10;

    const history = await SearchHistory.find({ sessionId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('query createdAt')
      .lean();

    const uniqueQueries = [...new Set(history.map(h => h.query))];

    res.json({ history: uniqueQueries });
  } catch (error) {
    console.error('Search history error:', error);
    res.status(500).json({ error: 'Failed to fetch search history' });
  }
});

// Clear user's search history
router.delete('/history', async (req: Request, res: Response) => {
  try {
    const sessionId = req.sessionID || req.headers['x-session-id'] as string;
    
    await SearchHistory.deleteMany({ sessionId });

    res.json({ success: true, message: 'Search history cleared' });
  } catch (error) {
    console.error('Clear history error:', error);
    res.status(500).json({ error: 'Failed to clear search history' });
  }
});

export { router };
