const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const atlasURI = 'mongodb+srv://emma:Emma2018@cluster0.jff9i.mongodb.net/ecommerce_cameroon?retryWrites=true&w=majority&appName=ecommerce-cameroon';

const ProductSchema = new mongoose.Schema({
  nameEn: String,
  nameFr: String,
  descriptionEn: String,
  descriptionFr: String,
  price: Number,
  images: [String],
  videos: [String],
  category: String,
  inStock: Boolean,
  featured: Boolean,
  tags: [String]
}, { timestamps: true });

const assignRealImages = async () => {
  try {
    console.log('🖼️ Assigning real images to products...');
    
    await mongoose.connect(atlasURI);
    const Product = mongoose.model('Product', ProductSchema);
    
    // Get actual image files
    const uploadsDir = path.join(__dirname, '../public/uploads/products');
    const imageFiles = fs.readdirSync(uploadsDir)
      .filter(file => file.endsWith('.jpg') || file.endsWith('.png'))
      .filter(file => !file.includes('medium')) // Skip medium versions
      .slice(0, 10); // Take first 10 images
    
    console.log('📁 Available images:', imageFiles.slice(0, 5));
    
    // Get all products
    const products = await Product.find();
    
    // Assign real images to products
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const imageIndex = i % imageFiles.length;
      const selectedImage = imageFiles[imageIndex];
      
      product.images = [`/uploads/products/${selectedImage}`];
      await product.save();
      
      console.log(`✅ ${product.nameEn} → ${selectedImage}`);
    }
    
    console.log('🎉 All products updated with real images!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

assignRealImages();