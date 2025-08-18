require('dotenv').config();
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce_cameroon')
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Product Schema
const ProductSchema = new mongoose.Schema(
  {
    nameEn: {
      type: String,
      required: true,
      trim: true
    },
    nameFr: {
      type: String,
      trim: true
    },
    descriptionEn: {
      type: String,
      required: true
    },
    descriptionFr: {
      type: String
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    category: {
      type: String,
      required: true,
      lowercase: true
    },
    images: {
      type: [String],
      default: []
    },
    thumbnailImage: {
      type: String
    },
    videoUrl: {
      type: String
    },
    featured: {
      type: Boolean,
      default: false
    },
    inStock: {
      type: Boolean,
      default: true
    },
    stockQuantity: {
      type: Number,
      min: 0
    },
    sku: {
      type: String
    },
    weight: {
      type: Number,
      min: 0
    },
    dimensions: {
      length: { type: Number, min: 0 },
      width: { type: Number, min: 0 },
      height: { type: Number, min: 0 }
    },
    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    reviewCount: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const Product = mongoose.model('Product', ProductSchema);

async function addSampleProducts() {
  try {
    // Check if products already exist
    const existingProducts = await Product.countDocuments();
    
    if (existingProducts > 0) {
      console.log(`Found ${existingProducts} existing products`);
      const products = await Product.find().limit(5);
      console.log('Sample products:');
      products.forEach(p => console.log(`- ${p.nameEn} (${p.category}) - ${p.price} XAF`));
      process.exit(0);
    }
    
    console.log('Adding sample products...');
    
    const sampleProducts = [
      {
        nameEn: 'iPhone 14 Pro',
        nameFr: 'iPhone 14 Pro',
        descriptionEn: 'Latest iPhone with advanced camera system and A16 Bionic chip',
        descriptionFr: 'Dernier iPhone avec système de caméra avancé et puce A16 Bionic',
        price: 850000,
        category: 'electronics',
        images: ['/images/iphone14.jpg'],
        featured: true,
        inStock: true,
        stockQuantity: 10,
        sku: 'IP14P-001',
        isActive: true
      },
      {
        nameEn: 'Samsung Galaxy S23',
        nameFr: 'Samsung Galaxy S23',
        descriptionEn: 'Flagship Android phone with excellent camera and performance',
        descriptionFr: 'Téléphone Android phare avec excellente caméra et performance',
        price: 750000,
        category: 'electronics',
        images: ['/images/galaxy-s23.jpg'],
        featured: true,
        inStock: true,
        stockQuantity: 8,
        sku: 'SGS23-001',
        isActive: true
      },
      {
        nameEn: 'MacBook Air M2',
        nameFr: 'MacBook Air M2',
        descriptionEn: 'Ultra-thin laptop with M2 chip for exceptional performance',
        descriptionFr: 'Ordinateur portable ultra-mince avec puce M2 pour des performances exceptionnelles',
        price: 1200000,
        category: 'computers',
        images: ['/images/macbook-air.jpg'],
        featured: false,
        inStock: true,
        stockQuantity: 5,
        sku: 'MBA-M2-001',
        isActive: true
      },
      {
        nameEn: 'Sony WH-1000XM4',
        nameFr: 'Sony WH-1000XM4',
        descriptionEn: 'Premium noise-canceling wireless headphones',
        descriptionFr: 'Casque sans fil premium avec réduction de bruit',
        price: 180000,
        category: 'accessories',
        images: ['/images/sony-headphones.jpg'],
        featured: false,
        inStock: true,
        stockQuantity: 15,
        sku: 'SONY-WH4-001',
        isActive: true
      },
      {
        nameEn: 'iPad Pro 12.9"',
        nameFr: 'iPad Pro 12.9"',
        descriptionEn: 'Professional tablet with M2 chip and Liquid Retina display',
        descriptionFr: 'Tablette professionnelle avec puce M2 et écran Liquid Retina',
        price: 950000,
        category: 'tablets',
        images: ['/images/ipad-pro.jpg'],
        featured: true,
        inStock: false,
        stockQuantity: 0,
        sku: 'IPP129-001',
        isActive: true
      }
    ];
    
    const savedProducts = await Product.insertMany(sampleProducts);
    
    console.log(`✅ Successfully added ${savedProducts.length} sample products:`);
    savedProducts.forEach(p => console.log(`- ${p.nameEn} (${p.category}) - ${p.price} XAF`));
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error adding sample products:', err.message);
    console.error('Full error:', err);
    process.exit(1);
  }
}

addSampleProducts();