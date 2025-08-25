const mongoose = require('mongoose');
require('dotenv').config();

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

const Order = mongoose.model('Order', OrderSchema);

async function checkOrders() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const orderCount = await Order.countDocuments();
    console.log(`📦 Total orders in database: ${orderCount}`);
    
    if (orderCount > 0) {
      const orders = await Order.find().populate('user', 'name email').limit(5);
      console.log('\n📋 Sample orders:');
      orders.forEach((order, index) => {
        console.log(`${index + 1}. Order ID: ${order._id}`);
        console.log(`   User: ${order.user?.name || 'Unknown'} (${order.user?.email || 'No email'})`);
        console.log(`   Status: ${order.status}`);
        console.log(`   Total: ${order.totalAmount} XAF`);
        console.log(`   Created: ${order.createdAt}`);
        console.log('');
      });
    } else {
      console.log('❌ No orders found in database');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

checkOrders();