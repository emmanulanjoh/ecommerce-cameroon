import express from 'express';
import Product from '../../models/Product';

const router = express.Router();

// Search suggestions endpoint
router.get('/suggestions', async (req, res) => {
  try {
    const query = req.query.q as string;
    
    if (!query || query.length < 2) {
      return res.json({ suggestions: [] });
    }

    // Get product names that match the query
    const products = await Product.find({
      $or: [
        { nameEn: { $regex: query, $options: 'i' } },
        { nameFr: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    }).select('nameEn nameFr category').limit(10);

    // Extract unique suggestions
    const suggestions = new Set<string>();
    
    products.forEach(product => {
      if (product.nameEn && product.nameEn.toLowerCase().includes(query.toLowerCase())) {
        suggestions.add(product.nameEn);
      }
      if (product.nameFr && product.nameFr.toLowerCase().includes(query.toLowerCase())) {
        suggestions.add(product.nameFr);
      }
      if (product.category && product.category.toLowerCase().includes(query.toLowerCase())) {
        suggestions.add(product.category);
      }
    });

    // Convert to array and limit to 6 suggestions
    const suggestionArray = Array.from(suggestions).slice(0, 6);
    
    res.json({ suggestions: suggestionArray });
  } catch (error) {
    console.error('Search suggestions error:', error);
    res.status(500).json({ error: 'Failed to fetch suggestions' });
  }
});

export { router };