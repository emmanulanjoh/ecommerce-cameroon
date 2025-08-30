require('dotenv').config();
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');

const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const docClient = DynamoDBDocumentClient.from(dynamoClient);
const TABLE_NAME = 'ecommerce-cameroon';

async function fixProductSchema() {
  console.log('🔧 Fixing DynamoDB Product Schema...');
  
  try {
    // Get all products
    const scanCommand = new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: 'entityType = :type',
      ExpressionAttributeValues: {
        ':type': 'PRODUCT'
      }
    });
    
    const result = await docClient.send(scanCommand);
    const products = result.Items || [];
    
    console.log(`Found ${products.length} products to update`);
    
    for (const product of products) {
      console.log(`Updating product: ${product.nameEn}`);
      
      const updates = {
        // Fix field names
        stockQuantity: product.stock || 0,
        descriptionEn: product.description || product.nameEn,
        
        // Add missing fields with defaults
        featured: product.featured || false,
        inStock: product.inStock !== false,
        isActive: product.isActive !== false,
        condition: product.condition || 'new',
        warrantyMonths: product.warrantyMonths || 12,
        averageRating: product.averageRating || 0,
        reviewCount: product.reviewCount || 0,
        
        // Ensure updatedAt exists
        updatedAt: new Date().toISOString()
      };
      
      // Remove old 'stock' field and add new fields
      const updateCommand = new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { PK: product.PK, SK: product.SK },
        UpdateExpression: `
          SET stockQuantity = :stockQuantity,
              #descriptionEn = :descriptionEn,
              featured = :featured,
              inStock = :inStock,
              isActive = :isActive,
              #condition = :condition,
              warrantyMonths = :warrantyMonths,
              averageRating = :averageRating,
              reviewCount = :reviewCount,
              updatedAt = :updatedAt
          REMOVE stock
        `,
        ExpressionAttributeNames: {
          '#condition': 'condition',
          '#descriptionEn': 'descriptionEn'
        },
        ExpressionAttributeValues: {
          ':stockQuantity': updates.stockQuantity,
          ':descriptionEn': updates.descriptionEn,
          ':featured': updates.featured,
          ':inStock': updates.inStock,
          ':isActive': updates.isActive,
          ':condition': updates.condition,
          ':warrantyMonths': updates.warrantyMonths,
          ':averageRating': updates.averageRating,
          ':reviewCount': updates.reviewCount,
          ':updatedAt': updates.updatedAt
        }
      });
      
      await docClient.send(updateCommand);
      console.log(`✅ Updated: ${product.nameEn}`);
    }
    
    console.log('🎉 Schema fix completed!');
    
  } catch (error) {
    console.error('❌ Schema fix failed:', error);
  }
}

fixProductSchema();