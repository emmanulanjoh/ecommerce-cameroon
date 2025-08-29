require('dotenv').config();
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');

const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const docClient = DynamoDBDocumentClient.from(dynamoClient);
const TABLE_NAME = 'ecommerce-cameroon';

async function testDynamoDB() {
  console.log('🧪 Testing DynamoDB operations...');
  
  try {
    // Test 1: Put item
    console.log('1. Testing PUT operation...');
    const putCommand = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        PK: 'TEST#product1',
        SK: 'TEST#product1',
        GSI1PK: 'CATEGORY#Electronics',
        GSI1SK: 'PRODUCT#Test Product',
        id: 'test-product-1',
        nameEn: 'Test Product',
        price: 100,
        category: 'Electronics',
        entityType: 'PRODUCT',
        createdAt: new Date().toISOString()
      }
    });
    
    await docClient.send(putCommand);
    console.log('✅ PUT operation successful');
    
    // Test 2: Get item
    console.log('2. Testing GET operation...');
    const getCommand = new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: 'TEST#product1',
        SK: 'TEST#product1'
      }
    });
    
    const getResult = await docClient.send(getCommand);
    console.log('✅ GET operation successful:', getResult.Item?.nameEn);
    
    // Test 3: Query by category
    console.log('3. Testing QUERY operation...');
    const queryCommand = new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :pk',
      ExpressionAttributeValues: {
        ':pk': 'CATEGORY#Electronics'
      }
    });
    
    const queryResult = await docClient.send(queryCommand);
    console.log('✅ QUERY operation successful, items found:', queryResult.Items?.length);
    
    console.log('🎉 All DynamoDB tests passed!');
    
  } catch (error) {
    console.error('❌ DynamoDB test failed:', error.message);
    console.error('Full error:', error);
  }
}

testDynamoDB();