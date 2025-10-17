import express from 'express';
import ProductModel from '../../models/Product';
import { ProductRecommendation } from '../../models/ProductRecommendation';
import { UserActivity } from '../../models/UserActivity';

const router = express.Router();

// Get product recommendations
router.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    
    let recommendations = await ProductRecommendation.findOne({ productId })
      .populate('relatedProducts', 'nameEn price images category')
      .populate('viewedTogether', 'nameEn price images category')
      .populate('boughtTogether', 'nameEn price images category')
      .lean();

    if (!recommendations) {
      // Generate recommendations if not exists
      await generateProductRecommendations(productId);
      recommendations = await ProductRecommendation.findOne({ productId })
        .populate('relatedProducts', 'nameEn price images category')
        .populate('viewedTogether', 'nameEn price images category')
        .populate('boughtTogether', 'nameEn price images category')
        .lean();
    }

    res.json(recommendations || {
      relatedProducts: [],
      viewedTogether: [],
      boughtTogether: []
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ message: 'Failed to get recommendations' });
  }
});

// Get personalized recommendations for user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get user's recent activity
    const recentActivity = await UserActivity.find({ userId })
      .sort({ timestamp: -1 })
      .limit(10)
      .lean();

    const viewedProducts = recentActivity
      .filter(a => a.action === 'view')
      .map(a => a.productId);

    // Get recommendations based on viewed products
    const recommendations = await ProductRecommendation.find({
      productId: { $in: viewedProducts }
    })
    .populate('relatedProducts', 'nameEn price images category')
    .lean();

    const allRecommended = recommendations
      .flatMap(r => r.relatedProducts)
      .filter((product, index, self) => 
        index === self.findIndex(p => p._id.toString() === product._id.toString())
      )
      .slice(0, 12);

    res.json({ recommendations: allRecommended });
  } catch (error) {
    console.error('User recommendations error:', error);
    res.status(500).json({ message: 'Failed to get user recommendations' });
  }
});

// Generate recommendations for a product
async function generateProductRecommendations(productId: string) {
  try {
    const product = await ProductModel.findById(productId);
    if (!product) return;

    // Find similar products by category
    const similarByCategory = await ProductModel.find({
      category: product.category,
      _id: { $ne: productId }
    }).limit(6).lean();

    // Find products viewed together (based on user activity)
    const viewedTogether = await UserActivity.aggregate([
      { $match: { productId: productId, action: 'view' } },
      { $group: { _id: '$sessionId', products: { $push: '$productId' } } },
      { $unwind: '$products' },
      { $match: { products: { $ne: productId } } },
      { $group: { _id: '$products', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 }
    ]);

    const viewedTogetherIds = viewedTogether.map(v => v._id);

    // Save recommendations
    await ProductRecommendation.findOneAndUpdate(
      { productId },
      {
        productId,
        relatedProducts: similarByCategory.map((p: any) => p._id),
        viewedTogether: viewedTogetherIds,
        boughtTogether: [], // Will be populated when order data is available
        similarProducts: similarByCategory.map((p: any) => p._id),
        lastUpdated: new Date()
      },
      { upsert: true }
    );
  } catch (error) {
    console.error('Generate recommendations error:', error);
  }
}

export default router;