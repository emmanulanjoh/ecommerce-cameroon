const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce_cameroon');
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Order Schema
const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    quantity: Number
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  shippingAddress: {
    name: String,
    phone: String,
    street: String,
    city: String,
    region: String,
    country: { type: String, default: 'Cameroon' }
  },
  paymentMethod: { type: String, default: 'whatsapp' },
  trackingNumber: String,
  notes: String,
  deliveredAt: Date
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  isAdmin: Boolean
}, { timestamps: true });

const Order = mongoose.model('Order', OrderSchema);
const User = mongoose.model('User', UserSchema);

const createTestOrder = async () => {
  try {
    await connectDB();
    
    console.log('🔍 Creating test order...');
    
    // Find admin user
    const adminUser = await User.findOne({ email: 'admin@findall.cm' });
    if (!adminUser) {
      console.log('❌ Admin user not found');
      return;
    }
    
    console.log('✅ Found admin user:', adminUser.name);
    
    // Check if orders already exist
    const existingOrders = await Order.find();
    console.log('📋 Existing orders:', existingOrders.length);
    
    if (existingOrders.length === 0) {
      // Create test order
      const testOrder = new Order({
        user: adminUser._id,
        items: [
          {
            name: 'Test Product 1',
            price: 25000,
            quantity: 2
          },
          {
            name: 'Test Product 2', 
            price: 15000,
            quantity: 1
          }
        ],
        totalAmount: 65000,
        status: 'pending',
        shippingAddress: {
          name: 'John Doe',
          phone: '+237678830036',
          street: '123 Test Street',
          city: 'Yaoundé',
          region: 'Centre',
          country: 'Cameroon'
        },
        paymentMethod: 'whatsapp',
        notes: 'Test order for admin dashboard'
      });
      
      await testOrder.save();
      console.log('✅ Test order created successfully!');
    }
    
    // List all orders
    const orders = await Order.find().populate('user', 'name email');
    console.log('\n📋 All orders in database:');
    orders.forEach((order, index) => {
      console.log(`${index + 1}. Order #${order._id.toString().slice(-8)}`);
      console.log(`   Customer: ${order.user.name}`);
      console.log(`   Total: ${order.totalAmount} XAF`);
      console.log(`   Status: ${order.status}`);
      console.log(`   City: ${order.shippingAddress.city}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
};

createTestOrder();