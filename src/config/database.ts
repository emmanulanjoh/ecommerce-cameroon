import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce_cameroon';
    
    console.log('🔄 Connecting to MongoDB...');
    console.log('📍 URI:', mongoURI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));
    
    await mongoose.connect(mongoURI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000
    });
    
    console.log('✅ MongoDB Connected Successfully');
    console.log('🗄️  Database:', mongoose.connection.db.databaseName);
  } catch (err: any) {
    console.error('❌ MongoDB connection error:');
    console.error('Error name:', err.name);
    console.error('Error message:', err.message);
    if (err.reason) console.error('Error reason:', err.reason);
    process.exit(1);
  }
};

export default connectDB;