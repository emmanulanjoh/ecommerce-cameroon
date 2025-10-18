const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');

async function testVideoUpload() {
  try {
    console.log('🧪 Testing video upload to S3...');
    
    // Check if we have a test video file
    const testVideoPath = './test-video.mp4';
    if (!fs.existsSync(testVideoPath)) {
      console.log('❌ No test video file found. Please create a small test-video.mp4 file');
      return;
    }
    
    const formData = new FormData();
    formData.append('video', fs.createReadStream(testVideoPath));
    
    const response = await fetch('http://localhost:5000/api/videos/upload', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_ADMIN_TOKEN_HERE'
      },
      body: formData
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Video upload successful!');
      console.log('📹 Video URL:', result.s3Url);
    } else {
      console.log('❌ Video upload failed:', result.message);
      console.log('Error details:', result);
    }
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

// Check environment variables
console.log('🔍 Checking S3 configuration...');
console.log('AWS_REGION:', process.env.AWS_REGION || 'NOT SET');
console.log('S3_BUCKET_NAME:', process.env.S3_BUCKET_NAME || 'NOT SET');
console.log('CLOUDFRONT_URL:', process.env.CLOUDFRONT_URL || 'NOT SET');
console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? 'SET' : 'NOT SET');
console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? 'SET' : 'NOT SET');

if (require.main === module) {
  testVideoUpload();
}

module.exports = { testVideoUpload };