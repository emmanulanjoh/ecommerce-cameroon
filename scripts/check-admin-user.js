const mongoose = require('mongoose');
require('dotenv').config();

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  phone: String,
  address: String
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

async function checkAdminUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const admin = await User.findOne({ isAdmin: true });
    if (admin) {
      console.log('👑 Admin user found:');
      console.log('- Name:', admin.name);
      console.log('- Email:', admin.email);
      console.log('- Username:', admin.username || 'Not set');
      console.log('- Is Admin:', admin.isAdmin);
      console.log('- Created:', admin.createdAt);
    } else {
      console.log('❌ No admin user found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

checkAdminUser();