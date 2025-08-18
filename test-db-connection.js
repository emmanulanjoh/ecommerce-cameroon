const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  try {
    console.log('🔄 Testing MongoDB Atlas connection...');
    
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      console.error('❌ MONGODB_URI not found in .env file');
      return;
    }
    
    console.log('📍 URI:', mongoURI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));
    
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    
    console.log('✅ MongoDB Atlas Connected Successfully!');
    console.log('🗄️  Database:', mongoose.connection.db.databaseName);
    console.log('🌐 Host:', mongoose.connection.host);
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📚 Collections:', collections.map(c => c.name));
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected successfully');
    
  } catch (error) {
    console.error('❌ Connection failed:');
    console.error('Name:', error.name);
    console.error('Message:', error.message);
    
    if (error.name === 'MongoServerSelectionError') {
      console.log('\n🔧 Troubleshooting tips:');
      console.log('1. Check if your IP is whitelisted in MongoDB Atlas');
      console.log('2. Verify username/password in connection string');
      console.log('3. Ensure cluster is running');
      console.log('4. Check network connectivity');
    }
  }
}

testConnection();