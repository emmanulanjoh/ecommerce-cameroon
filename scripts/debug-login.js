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

// Add comparePassword method
UserSchema.methods.comparePassword = async function(password) {
  return bcryptjs.compare(password, this.password);
};

const User = mongoose.model('User', UserSchema);

const debugLogin = async () => {
  try {
    await connectDB();
    
    const email = 'admin@findall.cm';
    const password = 'admin123';
    
    console.log('🔍 Testing login for:', email);
    
    // Step 1: Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('✅ User found:', user.name);
    console.log('📧 Email:', user.email);
    console.log('🔐 Is Admin:', user.isAdmin);
    console.log('🟢 Is Active:', user.isActive);
    
    // Step 2: Check password
    console.log('🔑 Testing password...');
    const isMatch = await user.comparePassword(password);
    console.log('🔑 Password match:', isMatch ? '✅ YES' : '❌ NO');
    
    if (!isMatch) {
      console.log('🔧 Password hash in DB:', user.password.substring(0, 20) + '...');
      
      // Try manual bcrypt compare
      const manualMatch = await bcryptjs.compare(password, user.password);
      console.log('🔧 Manual bcrypt test:', manualMatch ? '✅ YES' : '❌ NO');
    }
    
    // Step 3: Check if active
    if (!user.isActive) {
      console.log('❌ User is not active');
    }
    
    console.log('\n📋 Summary:');
    console.log('- User exists:', !!user);
    console.log('- Password correct:', isMatch);
    console.log('- Account active:', user.isActive);
    console.log('- Should login work:', !!user && isMatch && user.isActive);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
};

debugLogin();