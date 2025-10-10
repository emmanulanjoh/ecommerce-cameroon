import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    // Debug environment variables
    console.log('🔍 Environment Check:');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
    console.log('PORT:', process.env.PORT);
    
    const mongoURI = `${process.env.MONGODB_URI}${process.env.DB_NAME}` || 'mongodb://localhost:27017/ecommerce_cameroon';
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔍 Connecting to database:', process.env.DB_NAME);
    }
    
    if (!process.env.MONGODB_URI) {
      console.warn('⚠️  MONGODB_URI not found in environment variables!');
      console.warn('Available env vars:', Object.keys(process.env).filter(key => key.includes('MONGO')));
    }
    
    console.log('🔄 Connecting to MongoDB...');
    console.log('📍 URI:', mongoURI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));
    
    await mongoose.connect(mongoURI, {
      retryWrites: true,
      w: 'majority',
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
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