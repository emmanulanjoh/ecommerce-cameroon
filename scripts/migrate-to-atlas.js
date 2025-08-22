const mongoose = require('mongoose');

// Local MongoDB connection
const localURI = 'mongodb://localhost:27017/ecommerce_cameroon';

// Atlas MongoDB connection  
const atlasURI = 'mongodb+srv://emma:Emma2018@cluster0.jff9i.mongodb.net/ecommerce_cameroon?retryWrites=true&w=majority&appName=ecommerce-cameroon';

// Schemas
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String,
  address: {
    street: String,
    city: String,
    region: String,
    country: String
  },
  isAdmin: Boolean,
  isActive: Boolean
}, { timestamps: true });

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    quantity: Number
  }],
  totalAmount: Number,
  status: String,
  shippingAddress: {
    name: String,
    phone: String,
    street: String,
    city: String,
    region: String,
    country: String
  },
  paymentMethod: String,
  trackingNumber: String,
  notes: String,
  deliveredAt: Date
}, { timestamps: true });

const migrateData = async () => {
  try {
    console.log('🔄 Starting data migration from local to Atlas...');
    
    // Connect to local MongoDB
    console.log('📡 Connecting to local MongoDB...');
    const localConnection = await mongoose.createConnection(localURI);
    const LocalUser = localConnection.model('User', UserSchema);
    const LocalOrder = localConnection.model('Order', OrderSchema);
    
    // Connect to Atlas MongoDB
    console.log('☁️ Connecting to MongoDB Atlas...');
    const atlasConnection = await mongoose.createConnection(atlasURI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000
    });
    const AtlasUser = atlasConnection.model('User', UserSchema);
    const AtlasOrder = atlasConnection.model('Order', OrderSchema);
    
    // Migrate Users
    console.log('👥 Migrating users...');
    const localUsers = await LocalUser.find();
    console.log(`Found ${localUsers.length} users in local database`);
    
    for (const user of localUsers) {
      const existingUser = await AtlasUser.findOne({ email: user.email });
      if (!existingUser) {
        await AtlasUser.create(user.toObject());
        console.log(`✅ Migrated user: ${user.email}`);
      } else {
        console.log(`⏭️ User already exists: ${user.email}`);
      }
    }
    
    // Migrate Orders
    console.log('📦 Migrating orders...');
    const localOrders = await LocalOrder.find();
    console.log(`Found ${localOrders.length} orders in local database`);
    
    for (const order of localOrders) {
      const existingOrder = await AtlasOrder.findById(order._id);
      if (!existingOrder) {
        await AtlasOrder.create(order.toObject());
        console.log(`✅ Migrated order: ${order._id}`);
      } else {
        console.log(`⏭️ Order already exists: ${order._id}`);
      }
    }
    
    console.log('🎉 Migration completed successfully!');
    
    // Verify data
    const atlasUserCount = await AtlasUser.countDocuments();
    const atlasOrderCount = await AtlasOrder.countDocuments();
    
    console.log(`📊 Atlas database now has:`);
    console.log(`   👥 Users: ${atlasUserCount}`);
    console.log(`   📦 Orders: ${atlasOrderCount}`);
    
    // Close connections
    await localConnection.close();
    await atlasConnection.close();
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    if (error.name === 'MongooseServerSelectionError') {
      console.log('💡 Atlas connection tips:');
      console.log('   1. Check your IP is whitelisted in Atlas');
      console.log('   2. Verify username/password are correct');
      console.log('   3. Ensure network access is configured');
    }
  }
};

migrateData();