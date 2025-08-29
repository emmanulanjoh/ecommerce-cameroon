import express, { Request, Response } from 'express';
import { ProductModel } from '../../models/aws/Product';
import { DynamoDBService } from '../../services/dynamodb';

const router = express.Router();

// Debug products endpoint
router.get('/products', async (req: Request, res: Response) => {
  try {
    console.log('🔍 Debug: Getting all products...');
    
    // Try direct DynamoDB scan
    const allItems = await DynamoDBService.scanAll();
    const products = allItems.filter(item => item.entityType === 'PRODUCT');
    
    console.log(`Found ${allItems.length} total items, ${products.length} products`);
    
    res.json({
      success: true,
      totalItems: allItems.length,
      productCount: products.length,
      products: products.slice(0, 5), // First 5 products
      sampleItem: allItems[0] || null
    });
  } catch (error: any) {
    console.error('Debug error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Test ProductModel
router.get('/products-model', async (req: Request, res: Response) => {
  try {
    console.log('🔍 Debug: Using ProductModel...');
    const products = await ProductModel.findAll();
    
    res.json({
      success: true,
      count: products.length,
      products: products.slice(0, 3)
    });
  } catch (error: any) {
    console.error('ProductModel error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export { router };