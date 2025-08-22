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
  isAdmin: Boolean
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

const testLogin = async () => {
  try {
    await connectDB();
    
    // Find admin user with password
    const user = await User.findOne({ email: 'admin@findall.cm' }).select('+password');
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('✅ User found:', user.name);
    console.log('📧 Email:', user.email);
    console.log('🔐 Is Admin:', user.isAdmin);
    
    // Test password
    const testPassword = 'admin123';
    const isMatch = await bcryptjs.compare(testPassword, user.password);
    
    console.log('🔑 Password test:', isMatch ? '✅ MATCH' : '❌ NO MATCH');
    
    if (!isMatch) {
      console.log('🔧 Updating password...');
      const salt = await bcryptjs.genSalt(12);
      const hashedPassword = await bcryptjs.hash('admin123', salt);
      
      await User.findByIdAndUpdate(user._id, { password: hashedPassword });
      console.log('✅ Password updated successfully!');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
};

testLogin();