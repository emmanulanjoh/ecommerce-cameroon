const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce_cameroon');
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: { type: String, select: false },
  isAdmin: Boolean,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

UserSchema.methods.comparePassword = async function(password) {
  return bcryptjs.compare(password, this.password);
};

const User = mongoose.model('User', UserSchema);

const verifyAdminLogin = async () => {
  try {
    await connectDB();
    
    console.log('🔍 Testing admin login process...\n');
    
    // Step 1: Find admin user
    const user = await User.findOne({ email: 'admin@findall.cm' }).select('+password');
    
    if (!user) {
      console.log('❌ Admin user not found!');
      return;
    }
    
    console.log('✅ Admin user found:');
    console.log('   Name:', user.name);
    console.log('   Email:', user.email);
    console.log('   Is Admin:', user.isAdmin);
    console.log('   Is Active:', user.isActive);
    
    // Step 2: Test password
    const passwordTest = await user.comparePassword('admin123');
    console.log('   Password valid:', passwordTest ? '✅ YES' : '❌ NO');
    
    // Step 3: Simulate login response
    if (passwordTest && user.isActive) {
      console.log('\n🎯 Login should succeed with response:');
      console.log('   {');
      console.log('     success: true,');
      console.log('     user: {');
      console.log('       id:', user._id);
      console.log('       name:', user.name);
      console.log('       email:', user.email);
      console.log('       isAdmin:', user.isAdmin);
      console.log('     }');
      console.log('   }');
      
      console.log('\n📋 Expected behavior:');
      console.log('   - Login at /auth should succeed');
      console.log('   - Should redirect to /admin');
      console.log('   - Admin dashboard should be accessible');
    } else {
      console.log('\n❌ Login should fail');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
};

verifyAdminLogin();