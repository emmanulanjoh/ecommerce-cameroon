require('dotenv').config();
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

async function testS3Upload() {
  console.log('🧪 Testing S3 Upload...');
  
  const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
  
  const bucket = process.env.S3_BUCKET_NAME || 'ecommerce-cameroon-assets';
  const key = `test/test-${Date.now()}.txt`;
  const content = 'Hello from S3 test!';
  
  try {
    console.log('📤 Uploading test file...');
    console.log('Bucket:', bucket);
    console.log('Key:', key);
    
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: content,
      ContentType: 'text/plain'
      // Remove ACL
    });
    
    await s3Client.send(command);
    
    const fileUrl = `https://${bucket}.s3.amazonaws.com/${key}`;
    console.log('✅ Upload successful!');
    console.log('📎 File URL:', fileUrl);
    
    // Test if file is accessible
    console.log('🔍 Testing file access...');
    const response = await fetch(fileUrl);
    if (response.ok) {
      const text = await response.text();
      console.log('✅ File accessible:', text);
    } else {
      console.log('❌ File not accessible:', response.status);
    }
    
  } catch (error) {
    console.error('❌ S3 test failed:', error.message);
  }
}

testS3Upload();