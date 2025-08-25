const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  phone: String,
  address: String
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

async function testAdminLogin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Find admin user
    const admin = await User.findOne({ email: 'admin@findall.cm' });
    if (!admin) {
      console.error('❌ Admin user not found');
      return;
    }
    
    console.log('👑 Admin user found:');
    console.log('- Name:', admin.name);
    console.log('- Email:', admin.email);
    console.log('- Is Admin:', admin.isAdmin);
    console.log('- Password hash:', admin.password.substring(0, 20) + '...');
    
    // Test password
    const isValidPassword = await bcrypt.compare('admin123', admin.password);
    console.log('🔐 Password test:', isValidPassword ? '✅ Valid' : '❌ Invalid');
    
    if (!isValidPassword) {
      console.log('🔧 Updating admin password...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      admin.password = hashedPassword;
      await admin.save();
      console.log('✅ Admin password updated');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

testAdminLogin();