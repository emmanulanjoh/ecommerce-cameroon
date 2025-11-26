const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Connect to MongoDB with proper options
mongoose.connect('mongodb+srv://emma:Emma2018@cluster0.jff9i.mongodb.net/ecommerce_cameroon', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000
});

// Wait for connection
mongoose.connection.on('connected', () => {
  console.log('✅ Connected to MongoDB');
  migrateImages();
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Product schema
const productSchema = new mongoose.Schema({
  images: [String],
  nameEn: String,
}, { collection: 'products' });

const Product = mongoose.model('Product', productSchema);

// Create downloads directory
const downloadDir = path.join(__dirname, '../downloads');
if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir, { recursive: true });
}

// Download function
const downloadImage = (url, filename) => {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(path.join(downloadDir, filename));
    
    protocol.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`✅ Downloaded: ${filename}`);
        resolve(filename);
      });
    }).on('error', (err) => {
      fs.unlink(path.join(downloadDir, filename), () => {});
      console.error(`❌ Failed to download ${url}:`, err.message);
      reject(err);
    });
  });
};

// Main migration function
async function migrateImages() {
  try {
    console.log('🔍 Finding all products with images...');
    const products = await Product.find({ images: { $exists: true, $ne: [] } }).lean();
    console.log(`📦 Found ${products.length} products with images`);

    let imageCount = 0;
    const imageMap = {};

    for (const product of products) {
      console.log(`\n📋 Processing: ${product.nameEn}`);
      
      for (let i = 0; i < product.images.length; i++) {
        const imageUrl = product.images[i];
        if (!imageUrl || imageMap[imageUrl]) continue;

        try {
          const extension = path.extname(imageUrl) || '.jpg';
          const filename = `product_${product._id}_${i}${extension}`;
          
          await downloadImage(imageUrl, filename);
          imageMap[imageUrl] = filename;
          imageCount++;
        } catch (error) {
          console.error(`Failed to download image: ${imageUrl}`);
        }
      }
    }

    // Save mapping
    fs.writeFileSync(
      path.join(__dirname, '../image-mapping.json'), 
      JSON.stringify(imageMap, null, 2)
    );

    console.log(`\n🎉 Migration complete!`);
    console.log(`📊 Downloaded ${imageCount} images`);
    console.log(`📁 Images saved to: ${downloadDir}`);
    console.log(`🗺️  Mapping saved to: image-mapping.json`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    mongoose.connection.close();
  }
}