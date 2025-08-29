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
    
    // Get token (you'll need to replace this with actual admin token)
    const token = 'your-admin-token-here'; // Replace with actual token
    
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

console.log('Note: Replace "your-admin-token-here" with actual admin token');
console.log('To get token: Login to admin panel and check localStorage');
// testUploadRoute();