require('dotenv').config();
const mongoose = require('mongoose');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');

// DynamoDB setup
const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const docClient = DynamoDBDocumentClient.from(dynamoClient);
const TABLE_NAME = 'ecommerce-cameroon';

// MongoDB Models
const ProductSchema = new mongoose.Schema({
  nameEn: String,
  nameFr: String,
  price: Number,
  category: String,
  images: [String],
  description: String,
  stock: Number,
  createdAt: Date
});

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  createdAt: Date
});

async function migrateProducts() {
  console.log('🔄 Migrating Products...');
  
  const Product = mongoose.model('Product', ProductSchema);
  const products = await Product.find({}).limit(50); // Limit for testing
  
  let migrated = 0;
  
  for (const product of products) {
    try {
      const item = {
        PK: `PRODUCT#${product._id}`,
        SK: `PRODUCT#${product._id}`,
        GSI1PK: `CATEGORY#${product.category}`,
        GSI1SK: `PRODUCT#${product.nameEn}`,
        id: product._id.toString(),
        nameEn: product.nameEn,
        nameFr: product.nameFr,
        price: product.price,
        category: product.category,
        images: product.images || [],
        description: product.description,
        stock: product.stock || 0,
        entityType: 'PRODUCT',
        createdAt: product.createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const command = new PutCommand({
        TableName: TABLE_NAME,
        Item: item
      });
      
      await docClient.send(command);
      migrated++;
      console.log(`✅ Migrated: ${product.nameEn}`);
      
    } catch (error) {
      console.error(`❌ Failed to migrate ${product.nameEn}:`, error.message);
    }
  }
  
  console.log(`✅ Products migrated: ${migrated}/${products.length}`);
}

async function migrateUsers() {
  console.log('🔄 Migrating Users...');
  
  const User = mongoose.model('User', UserSchema);
  const users = await User.find({}).limit(20); // Limit for testing
  
  let migrated = 0;
  
  for (const user of users) {
    try {
      const item = {
        PK: `USER#${user._id}`,
        SK: `USER#${user._id}`,
        GSI1PK: `EMAIL#${user.email}`,
        GSI1SK: `USER#${user._id}`,
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role || 'customer',
        entityType: 'USER',
        createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const command = new PutCommand({
        TableName: TABLE_NAME,
        Item: item
      });
      
      await docClient.send(command);
      migrated++;
      console.log(`✅ Migrated user: ${user.email}`);
      
    } catch (error) {
      console.error(`❌ Failed to migrate ${user.email}:`, error.message);
    }
  }
  
  console.log(`✅ Users migrated: ${migrated}/${users.length}`);
}

async function testDynamoDBConnection() {
  try {
    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        PK: 'TEST#connection',
        SK: 'TEST#connection',
        message: 'Connection successful',
        timestamp: new Date().toISOString()
      }
    });
    
    await docClient.send(command);
    console.log('✅ DynamoDB connection successful');
    return true;
  } catch (error) {
    console.error('❌ DynamoDB connection failed:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting AWS Migration...');
  
  // Test DynamoDB connection
  const dynamoConnected = await testDynamoDBConnection();
  if (!dynamoConnected) {
    console.error('❌ Cannot connect to DynamoDB. Check your credentials and table.');
    process.exit(1);
  }
  
  // Connect to MongoDB
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
  
  try {
    await migrateProducts();
    await migrateUsers();
    console.log('🎉 Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled rejection:', error);
  process.exit(1);
});

main();