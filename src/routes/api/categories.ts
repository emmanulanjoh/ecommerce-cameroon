import express, { Request, Response } from 'express';
import Product from '../../models/Product';

const router = express.Router();

// Predefined categories
const predefinedCategories = [
  'Electronics',
  'Clothing',
  'Home & Kitchen',
  'Beauty & Personal Care',
  'Sports & Outdoors',
  'Automotive',
  'Books & Media',
  'Toys & Games',
  'Health & Wellness',
  'Groceries & Food'
];

// @route   GET /api/categories
// @desc    Get all categories with product counts
// @access  Public
router.get('/', async (req: Request, res: Response) => {
  try {
    // Aggregate to get categories with counts from existing products
    const existingCategories = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    // Create a map of existing categories
    const categoryMap = new Map();
    existingCategories.forEach((cat) => {
      categoryMap.set(cat._id, cat.count);
    });
    
    // Combine with predefined categories
    const allCategories = predefinedCategories.map(category => {
      return {
        _id: category,
        count: categoryMap.get(category.toLowerCase()) || 0
      };
    });
    
    // Add any existing categories that aren't in predefined list
    existingCategories.forEach(cat => {
      if (!predefinedCategories.includes(cat._id) && 
          !predefinedCategories.map(c => c.toLowerCase()).includes(cat._id.toLowerCase())) {
        allCategories.push(cat);
      }
    });
    
    res.json(allCategories);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export { router };