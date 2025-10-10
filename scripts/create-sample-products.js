require('dotenv').config();
const mongoose = require('mongoose');

// Product Schema
const productSchema = new mongoose.Schema({
  nameEn: { type: String, required: true },
  nameFr: { type: String },
  descriptionEn: { type: String },
  descriptionFr: { type: String },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  images: [String],
  thumbnailImage: String,
  featured: { type: Boolean, default: false },
  inStock: { type: Boolean, default: true },
  stockQuantity: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

const sampleProducts = [
  {
    nameEn: "Samsung Galaxy S24",
    nameFr: "Samsung Galaxy S24",
    descriptionEn: "Latest Samsung flagship smartphone with advanced camera",
    descriptionFr: "Dernier smartphone phare Samsung avec caméra avancée",
    price: 450000,
    category: "Electronics",
    images: ["https://via.placeholder.com/400x400?text=Galaxy+S24"],
    thumbnailImage: "https://via.placeholder.com/400x400?text=Galaxy+S24",
    featured: true,
    inStock: true,
    stockQuantity: 10
  },
  {
    nameEn: "iPhone 15 Pro",
    nameFr: "iPhone 15 Pro",
    descriptionEn: "Apple's premium smartphone with titanium design",
    descriptionFr: "Smartphone premium d'Apple avec design en titane",
    price: 650000,
    category: "Electronics",
    images: ["https://via.placeholder.com/400x400?text=iPhone+15"],
    thumbnailImage: "https://via.placeholder.com/400x400?text=iPhone+15",
    featured: true,
    inStock: true,
    stockQuantity: 5
  },
  {
    nameEn: "MacBook Air M3",
    nameFr: "MacBook Air M3",
    descriptionEn: "Ultra-thin laptop with M3 chip",
    descriptionFr: "Ordinateur portable ultra-mince avec puce M3",
    price: 850000,
    category: "Computers",
    images: ["https://via.placeholder.com/400x400?text=MacBook+Air"],
    thumbnailImage: "https://via.placeholder.com/400x400?text=MacBook+Air",
    featured: false,
    inStock: true,
    stockQuantity: 3
  }
];

async function createSampleProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Create sample products
    const products = await Product.insertMany(sampleProducts);
    console.log(`Created ${products.length} sample products`);
    
    console.log('Sample products created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating sample products:', error);
    process.exit(1);
  }
}

createSampleProducts();