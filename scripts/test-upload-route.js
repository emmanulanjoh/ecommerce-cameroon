require('dotenv').config();
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function testUploadRoute() {
  console.log('🧪 Testing Upload Route...');
  
  try {
    // Create a test image file
    const testImagePath = path.join(__dirname, 'test-image.txt');
    fs.writeFileSync(testImagePath, 'This is a test image file');
    
    // Prepare form data
    const formData = new FormData();
    formData.append('file', fs.createReadStream(testImagePath));
    formData.append('folder', 'products');
    
    // Get token from environment or login first
    const token = process.env.TEST_ADMIN_TOKEN || 'test-token-placeholder';
    
    console.log('📤 Uploading test file...');
    const response = await axios.post('http://localhost:5000/api/upload/single', formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Upload successful!');
    console.log('📁 Response:', response.data);
    
    // Clean up
    fs.unlinkSync(testImagePath);
    
  } catch (error) {
    console.error('❌ Upload test failed:', error.response?.data || error.message);
  }
}

console.log('Note: Set TEST_ADMIN_TOKEN environment variable or login first');
console.log('To get token: Login to admin panel and check localStorage');
// Uncomment to run: testUploadRoute();