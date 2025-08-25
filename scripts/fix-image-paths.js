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

const fixImagePaths = async () => {
  try {
    console.log('🔧 Fixing image paths...');
    
    await mongoose.connect(atlasURI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000
    });
    
    const Product = mongoose.model('Product', ProductSchema);
    
    // Get all products
    const products = await Product.find();
    console.log(`📦 Found ${products.length} products`);
    
    // Get actual files in uploads directory
    const uploadsDir = path.join(__dirname, '../public/uploads/products');
    const actualFiles = fs.readdirSync(uploadsDir).filter(file => 
      file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.jpeg')
    );
    
    console.log(`📁 Found ${actualFiles.length} actual image files`);
    
    let fixedCount = 0;
    
    for (const product of products) {
      let hasChanges = false;
      const newImages = [];
      
      for (const imagePath of product.images) {
        const filename = path.basename(imagePath);
        
        // Check if file exists
        if (actualFiles.includes(filename)) {
          newImages.push(`/uploads/products/${filename}`);
        } else {
          // Try to find a similar file
          const similarFile = actualFiles.find(file => 
            file.includes(filename.split('-')[0]) || 
            filename.includes(file.split('-')[0])
          );
          
          if (similarFile) {
            console.log(`🔄 Mapping ${filename} → ${similarFile}`);
            newImages.push(`/uploads/products/${similarFile}`);
            hasChanges = true;
          } else {
            // Use placeholder if no match found
            console.log(`❌ No match for ${filename}, using placeholder`);
            newImages.push('/images/placeholder.jpg');
            hasChanges = true;
          }
        }
      }
      
      if (hasChanges || product.images.length !== newImages.length) {
        product.images = newImages;
        await product.save();
        fixedCount++;
        console.log(`✅ Fixed images for: ${product.nameEn}`);
      }
    }
    
    console.log(`🎉 Fixed ${fixedCount} products`);
    
    // Show some examples
    const updatedProducts = await Product.find().limit(3);
    console.log('\n📋 Sample updated products:');
    updatedProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.nameEn}`);
      console.log(`   Images: ${product.images.join(', ')}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

fixImagePaths();