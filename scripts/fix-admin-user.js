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

// Use the EXACT same schema as the User model
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

// Add the comparePassword method
UserSchema.methods.comparePassword = async function(password) {
  return bcryptjs.compare(password, this.password);
};

const User = mongoose.model('User', UserSchema);

const fixAdminUser = async () => {
  try {
    await connectDB();
    
    console.log('🔧 Fixing admin user...');
    
    // Delete existing admin user
    await User.deleteOne({ email: 'admin@findall.cm' });
    console.log('🗑️ Deleted existing admin user');
    
    // Hash password manually (don't rely on pre-save hook)
    const salt = await bcryptjs.genSalt(12);
    const hashedPassword = await bcryptjs.hash('admin123', salt);
    
    // Create new admin user with hashed password
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@findall.cm',
      phone: '+237678830036',
      password: hashedPassword,
      address: {
        street: 'Admin Street',
        city: 'Yaoundé',
        region: 'Centre',
        country: 'Cameroon'
      },
      isAdmin: true,
      isActive: true
    });
    
    // Save without triggering pre-save hook
    await User.collection.insertOne(adminUser.toObject());
    
    console.log('✅ Admin user recreated successfully!');
    console.log('📧 Email: admin@findall.cm');
    console.log('🔑 Password: admin123');
    
    // Test the password immediately
    const testUser = await User.findOne({ email: 'admin@findall.cm' }).select('+password');
    const passwordTest = await testUser.comparePassword('admin123');
    console.log('🔑 Password test:', passwordTest ? '✅ WORKS' : '❌ FAILED');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
};

fixAdminUser();