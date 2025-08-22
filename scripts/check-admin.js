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

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  isAdmin: Boolean
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

const checkAdmins = async () => {
  try {
    await connectDB();
    
    const admins = await User.find({ isAdmin: true });
    
    console.log('🔍 Admin users found:');
    if (admins.length === 0) {
      console.log('❌ No admin users found');
    } else {
      admins.forEach(admin => {
        console.log(`✅ ${admin.name} - ${admin.email}`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
};

checkAdmins();