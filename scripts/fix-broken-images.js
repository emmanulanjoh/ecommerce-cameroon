const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb+srv://emma:Emma2018@cluster0.jff9i.mongodb.net/ecommerce_cameroon', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Product schema
const productSchema = new mongoose.Schema({
  images: [String],
  nameEn: String,
}, { collection: 'products' });

const Product = mongoose.model('Product', productSchema);

async function fixBrokenImages() {
  try {
    console.log('🔍 Finding products with broken CloudFront images...');
    
    const result = await Product.updateMany(
      { images: { $regex: 'd35ew0puu9c5cz.cloudfront.net' } },
      { $set: { images: ['https://via.placeholder.com/400x400/f8f9fa/6c757d?text=Product+Image'] } }
    );

    console.log(`✅ Updated ${result.modifiedCount} products with placeholder images`);
    
  } catch (error) {
    console.error('❌ Failed to fix images:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run fix
mongoose.connection.on('connected', () => {
  console.log('✅ Connected to MongoDB');
  fixBrokenImages();
});