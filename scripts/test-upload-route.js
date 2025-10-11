// Lazy module loading
const loadModules = async () => {
  // Load all required modules
  const dotenv = await import('dotenv');
  const axios = await import('axios');
  const FormData = await import('form-data');
  const fs = await import('fs');
  const path = await import('path');
  
  // Configure environment variables
  dotenv.config();
  
  return { 
    axios: axios.default, 
    FormData: FormData.default, 
    fs, 
    path 
  };
};

async function testUploadRoute() {
  console.log('🧪 Testing Upload Route...');
  
  // Load modules once at the start
  const { axios, FormData, fs, path } = await loadModules();
  
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
    
    // Get CSRF token first
    const csrfResponse = await axios.get('http://localhost:5000/api/csrf-token');
    const csrfToken = csrfResponse.data.csrfToken;
    
    console.log('📤 Uploading test file...');
    const formHeaders = formData.getHeaders();
    const response = await axios.post('http://localhost:5000/api/upload/single', formData, {
      headers: {
        ...formHeaders,
        'Authorization': `Bearer ${token}`,
        'X-CSRF-Token': csrfToken
      }
    });
    
    console.log('✅ Upload successful!');
    console.log('📁 Response:', response.data);
    
    // Clean up
    fs.unlinkSync(testImagePath);
    
  } catch (error) {
    console.error('❌ Upload test failed:');
    if (error.response) {
      console.error('  Status:', error.response.status);
      console.error('  Data:', error.response.data);
    } else if (error.request) {
      console.error('  Network error - no response received');
    } else {
      console.error('  Error:', error.message);
    }
    
    // Clean up test file if it exists
    try {
      const testImagePath = path.join(__dirname, 'test-image.txt');
      if (fs.existsSync(testImagePath)) {
        fs.unlinkSync(testImagePath);
        console.log('🧹 Cleaned up test file');
      }
    } catch (cleanupError) {
      console.warn('⚠️ Failed to clean up test file:', cleanupError.message);
    }
    
    process.exit(1);
  }
}

console.log('Note: Set TEST_ADMIN_TOKEN environment variable or login first');
console.log('To get token: Login to admin panel and check localStorage');
// Uncomment to run: testUploadRoute();