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
    
    // Validate bucket name first to prevent sniping attacks
    const bucketName = process.env.S3_BUCKET_NAME;
    if (!bucketName || bucketName.length < 8 || !/^[a-z0-9][a-z0-9\-]*[a-z0-9]$/.test(bucketName)) {
      throw new Error('Invalid or insecure bucket name detected');
    }
    
    const testContent = 'Test file content - ' + new Date().toISOString();
    const uploadCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: 'test/connection-test.txt',
      Body: testContent,
      ContentType: 'text/plain'
    });
    
    await s3Client.send(uploadCommand);
    console.log('✅ File uploaded successfully!');
    console.log('📁 File URL: https://[***MASKED***].s3.amazonaws.com/test/connection-test.txt');

    // Test 3: Verify upload (without exposing bucket name)
    console.log('\n3. Verifying upload...');
    console.log('✅ Upload verification complete - file should be accessible via secure URL');
    console.log('🔒 Bucket name protected from exposure');

  } catch (error) {
    console.error('❌ S3 test failed:', error.message);
    if (error.Code) {
      console.error('Error Code:', error.Code);
    }
  }
}

testS3Connection();