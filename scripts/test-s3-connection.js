require('dotenv').config();
const { S3Client, PutObjectCommand, ListBucketsCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function testS3Connection() {
  console.log('🧪 Testing S3 Connection...');
  console.log('Region:', process.env.AWS_REGION);
  console.log('Bucket:', process.env.S3_BUCKET_NAME);
  console.log('Access Key:', process.env.AWS_ACCESS_KEY_ID ? 'SET' : 'NOT SET');
  console.log('Secret Key:', process.env.AWS_SECRET_ACCESS_KEY ? 'SET' : 'NOT SET');

  try {
    // Test 1: List buckets
    console.log('\n1. Testing ListBuckets...');
    const listCommand = new ListBucketsCommand({});
    const buckets = await s3Client.send(listCommand);
    console.log('✅ Buckets found:', buckets.Buckets?.map(b => b.Name));

    // Test 2: Upload test file
    console.log('\n2. Testing file upload...');
    const testContent = 'Test file content - ' + new Date().toISOString();
    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: 'test/connection-test.txt',
      Body: testContent,
      ContentType: 'text/plain'
    });

    await s3Client.send(uploadCommand);
    const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/test/connection-test.txt`;
    console.log('✅ File uploaded successfully!');
    console.log('📁 File URL:', fileUrl);

    // Test 3: Test URL access
    console.log('\n3. Testing URL access...');
    const response = await fetch(fileUrl);
    if (response.ok) {
      const content = await response.text();
      console.log('✅ File accessible via URL');
      console.log('📄 Content:', content.substring(0, 50) + '...');
    } else {
      console.log('❌ File not accessible via URL:', response.status);
    }

  } catch (error) {
    console.error('❌ S3 test failed:', error.message);
    if (error.Code) {
      console.error('Error Code:', error.Code);
    }
  }
}

testS3Connection();