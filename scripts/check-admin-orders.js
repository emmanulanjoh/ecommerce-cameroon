const mongoose = require('mongoose');
require('dotenv').config();

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  phone: String,
  address: String
}, { timestamps: true });

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1 },
    image: String
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  paymentMethod: { type: String, enum: ['whatsapp', 'cash_on_delivery', 'mobile_money', 'bank_transfer'], default: 'whatsapp' },
  shippingAddress: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    region: { type: String, required: true },
    country: { type: String, default: 'Cameroon' }
  },
  whatsappOrderId: String,
  notes: String,
  trackingNumber: String,
  estimatedDelivery: Date,
  deliveredAt: Date
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
const Order = mongoose.model('Order', OrderSchema);

async function checkAdminOrders() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Check admin users
    const adminUsers = await User.find({ isAdmin: true });
    console.log(`👑 Admin users found: ${adminUsers.length}`);
    adminUsers.forEach(admin => {
      console.log(`   - ${admin.name} (${admin.email})`);
    });
    
    // Check all orders with user info
    const orders = await Order.find().populate('user', 'name email isAdmin').sort({ createdAt: -1 });
    console.log(`\n📦 Total orders: ${orders.length}`);
    
    if (orders.length > 0) {
      console.log('\n📋 All orders:');
      orders.forEach((order, index) => {
        console.log(`${index + 1}. Order ID: ${order._id}`);
        console.log(`   User: ${order.user?.name || 'Unknown'} (${order.user?.email || 'No email'})`);
        console.log(`   User Admin: ${order.user?.isAdmin || false}`);
        console.log(`   Status: ${order.status}`);
        console.log(`   Total: ${order.totalAmount} XAF`);
        console.log(`   Items: ${order.items.length}`);
        console.log(`   Created: ${order.createdAt}`);
        console.log('');
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

checkAdminOrders();