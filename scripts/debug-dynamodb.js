require('dotenv').config();
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');

const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const docClient = DynamoDBDocumentClient.from(dynamoClient);
const TABLE_NAME = 'ecommerce-cameroon';

async function debugDynamoDB() {
  console.log('🔍 Debugging DynamoDB Data...');
  
  try {
    // Scan all items
    const command = new ScanCommand({
      TableName: TABLE_NAME,
    });
    
    const result = await docClient.send(command);
    const items = result.Items || [];
    
    console.log(`📊 Total items in table: ${items.length}`);
    
    // Group by entity type
    const grouped = {};
    items.forEach(item => {
      const type = item.entityType || 'UNKNOWN';
      if (!grouped[type]) grouped[type] = [];
      grouped[type].push(item);
    });
    
    console.log('\n📋 Items by type:');
    Object.keys(grouped).forEach(type => {
      console.log(`  ${type}: ${grouped[type].length} items`);
    });
    
    // Show first few products
    const products = grouped.PRODUCT || [];
    if (products.length > 0) {
      console.log('\n🛍️ Sample products:');
      products.slice(0, 3).forEach((product, index) => {
        console.log(`  ${index + 1}. ${product.nameEn || 'No name'} (ID: ${product.id || 'No ID'})`);
        console.log(`     PK: ${product.PK}, SK: ${product.SK}`);
        console.log(`     Category: ${product.category || 'No category'}`);
        console.log(`     Price: ${product.price || 'No price'}`);
        console.log('');
      });
    } else {
      console.log('\n❌ No products found!');
    }
    
    // Check data structure
    if (items.length > 0) {
      console.log('\n🔧 Sample item structure:');
      console.log(JSON.stringify(items[0], null, 2));
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
}

debugDynamoDB();