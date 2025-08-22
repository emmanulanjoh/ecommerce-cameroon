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

// Exact same schema as User model
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  address: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    region: { type: String, trim: true },
    country: { type: String, default: 'Cameroon', trim: true }
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

UserSchema.methods.comparePassword = async function(password) {
  return bcryptjs.compare(password, this.password);
};

const User = mongoose.model('User', UserSchema);

const debugAPILogin = async () => {
  try {
    await connectDB();
    
    console.log('🔍 Debugging API login process...\n');
    
    const email = 'admin@findall.cm';
    const password = 'admin123';
    
    console.log('📤 Simulating API request:');
    console.log('   POST /api/users/login');
    console.log('   Body:', { email, password });
    
    // Step 1: Find user and include password (like API does)
    console.log('\n🔍 Step 1: Finding user...');
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('❌ User not found - API would return 401');
      return;
    }
    
    console.log('✅ User found:', user.name);
    console.log('   Email:', user.email);
    console.log('   Is Admin:', user.isAdmin);
    console.log('   Is Active:', user.isActive);
    
    // Step 2: Check password (like API does)
    console.log('\n🔑 Step 2: Checking password...');
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      console.log('❌ Password mismatch - API would return 401');
      return;
    }
    
    console.log('✅ Password matches');
    
    // Step 3: Check if user is active (like API does)
    console.log('\n🟢 Step 3: Checking if user is active...');
    if (!user.isActive) {
      console.log('❌ User not active - API would return 401');
      return;
    }
    
    console.log('✅ User is active');
    
    // Step 4: Generate token (simulate)
    console.log('\n🎯 Step 4: API should return success:');
    console.log('   {');
    console.log('     success: true,');
    console.log('     token: "jwt_token_here",');
    console.log('     user: {');
    console.log('       id:', user._id);
    console.log('       name:', user.name);
    console.log('       email:', user.email);
    console.log('       phone:', user.phone);
    console.log('       isAdmin:', user.isAdmin);
    console.log('     }');
    console.log('   }');
    
    console.log('\n📋 Conclusion: Login should work perfectly!');
    console.log('   If you\'re getting "login failed", the issue is likely:');
    console.log('   1. Frontend not sending request to correct endpoint');
    console.log('   2. Backend server not running');
    console.log('   3. Network/CORS issue');
    
  } catch (error) {
    console.error('❌ Error during debug:', error);
  } finally {
    mongoose.connection.close();
  }
};

debugAPILogin();