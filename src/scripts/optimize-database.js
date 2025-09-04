const mongoose = require('mongoose');
require('dotenv').config();

const optimizeDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📊 Connected to MongoDB for optimization...');

    const db = mongoose.connection.db;

    // Product collection indexes
    await db.collection('products').createIndex({ category: 1 });
    await db.collection('products').createIndex({ price: 1 });
    await db.collection('products').createIndex({ featured: 1 });
    await db.collection('products').createIndex({ inStock: 1 });
    await db.collection('products').createIndex({ createdAt: -1 });
    await db.collection('products').createIndex({ 
      nameEn: 'text', 
      nameFr: 'text', 
      descriptionEn: 'text' 
    });

    // Order collection indexes
    await db.collection('orders').createIndex({ user: 1, createdAt: -1 });
    await db.collection('orders').createIndex({ status: 1 });
    await db.collection('orders').createIndex({ createdAt: -1 });

    // Review collection indexes
    await db.collection('reviews').createIndex({ product: 1 });
    await db.collection('reviews').createIndex({ user: 1 });
    await db.collection('reviews').createIndex({ createdAt: -1 });

    // User collection indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });

    console.log('✅ Database indexes created successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database optimization failed:', error);
    process.exit(1);
  }
};

optimizeDatabase();