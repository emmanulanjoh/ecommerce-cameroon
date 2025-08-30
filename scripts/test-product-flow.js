require('dotenv').config();
const axios = require('axios');

const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://findallsourcin.up.railway.app' 
  : 'http://localhost:5000';

async function testProductFlow() {
  console.log('🧪 Testing Product Submission & Retrieval...');
  console.log('Base URL:', BASE_URL);
  
  try {
    // Test 1: Get existing products
    console.log('\n1. Testing product retrieval...');
    const getResponse = await axios.get(`${BASE_URL}/api/products`);
    console.log('✅ Products retrieved:', getResponse.data.products?.length || 0);
    
    if (getResponse.data.products?.length > 0) {
      const sample = getResponse.data.products[0];
      console.log('📦 Sample product:', {
        id: sample.id,
        nameEn: sample.nameEn,
        price: sample.price,
        category: sample.category,
        images: sample.images?.length || 0
      });
    }
    
    // Test 2: Try to create a product (need admin token)
    console.log('\n2. Testing product creation...');
    const testProduct = {
      nameEn: 'Test Product API',
      descriptionEn: 'Test description',
      price: 50000,
      category: 'Electronics',
      images: [],
      stockQuantity: 10,
      featured: false,
      inStock: true,
      isActive: true,
      condition: 'new'
    };
    
    try {
      const createResponse = await axios.post(`${BASE_URL}/api/products`, testProduct, {
        headers: {
          'Authorization': 'Bearer test-token', // This will fail but show the error
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ Product created:', createResponse.data);
    } catch (createError) {
      console.log('❌ Product creation failed (expected without valid token):', createError.response?.status);
      console.log('Error message:', createError.response?.data?.message);
    }
    
    // Test 3: Check API structure
    console.log('\n3. API Response Structure:');
    console.log('Products array:', Array.isArray(getResponse.data.products));
    console.log('Pagination:', getResponse.data.pagination);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testProductFlow();