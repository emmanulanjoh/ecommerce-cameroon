const mongoose = require('mongoose');
require('dotenv').config();

// Check Admin model
const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  lastLogin: { type: Date }
}, { timestamps: true });

const Admin = mongoose.model('Admin', AdminSchema);

async function checkAdminModel() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const admins = await Admin.find();
    console.log(`👑 Admin records found: ${admins.length}`);
    
    if (admins.length > 0) {
      admins.forEach((admin, index) => {
        console.log(`${index + 1}. Username: ${admin.username}`);
        console.log(`   Email: ${admin.email}`);
        console.log(`   Created: ${admin.createdAt}`);
        console.log('');
      });
    } else {
      console.log('❌ No admin records found in Admin collection');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

checkAdminModel();