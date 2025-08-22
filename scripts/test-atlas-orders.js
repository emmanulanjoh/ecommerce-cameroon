const mongoose = require('mongoose');

const atlasURI = 'mongodb+srv://emma:Emma2018@cluster0.jff9i.mongodb.net/ecommerce_cameroon?retryWrites=true&w=majority&appName=ecommerce-cameroon';

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

const testAtlasOrders = async () => {
  try {
    console.log('🔍 Testing Atlas orders...');
    
    await mongoose.connect(atlasURI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000
    });
    
    const Order = mongoose.model('Order', OrderSchema);
    const User = mongoose.model('User', UserSchema);
    
    // Check orders
    const orders = await Order.find().populate('user', 'name email');
    console.log(`📦 Found ${orders.length} orders in Atlas`);
    
    orders.forEach((order, index) => {
      console.log(`${index + 1}. Order #${order._id.toString().slice(-8)}`);
      console.log(`   Customer: ${order.user?.name || 'Unknown'}`);
      console.log(`   Total: ${order.totalAmount} XAF`);
      console.log(`   Status: ${order.status}`);
      console.log(`   City: ${order.shippingAddress?.city || 'N/A'}`);
      console.log('');
    });
    
    // Check admin user
    const adminUser = await User.findOne({ email: 'admin@findall.cm' });
    console.log('👤 Admin user:', adminUser ? 'Found' : 'Not found');
    if (adminUser) {
      console.log(`   Name: ${adminUser.name}`);
      console.log(`   Is Admin: ${adminUser.isAdmin}`);
      console.log(`   Is Active: ${adminUser.isActive}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

testAtlasOrders();