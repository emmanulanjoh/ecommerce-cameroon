require('dotenv').config();

console.log('🔍 Checking Environment Variables...');
console.log('AWS_REGION:', process.env.AWS_REGION || 'NOT SET');
console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? 'SET' : 'NOT SET');
console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? 'SET' : 'NOT SET');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'SET' : 'NOT SET');

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  console.error('❌ AWS credentials are missing!');
  console.log('\n📝 Add these to your .env file:');
  console.log('AWS_REGION=us-east-1');
  console.log('AWS_ACCESS_KEY_ID=your-access-key');
  console.log('AWS_SECRET_ACCESS_KEY=your-secret-key');
} else {
  console.log('✅ AWS credentials are set');
}