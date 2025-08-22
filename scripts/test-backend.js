const http = require('http');

const testBackend = () => {
  console.log('🔍 Testing backend server...\n');
  
  // Test health endpoint
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/health',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  const req = http.request(options, (res) => {
    console.log('✅ Backend server is running!');
    console.log('📊 Status:', res.statusCode);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log('📋 Health check response:', response);
        
        // Now test login endpoint
        testLoginEndpoint();
      } catch (e) {
        console.log('📋 Raw response:', data);
      }
    });
  });
  
  req.on('error', (err) => {
    console.log('❌ Backend server is NOT running!');
    console.log('🔧 Error:', err.message);
    console.log('\n📋 To fix this:');
    console.log('   1. Make sure you ran: npm run build');
    console.log('   2. Start backend: npm run dev');
    console.log('   3. Or run both: npm run dev:full');
  });
  
  req.end();
};

const testLoginEndpoint = () => {
  console.log('\n🔍 Testing login endpoint...');
  
  const loginData = JSON.stringify({
    email: 'admin@findall.cm',
    password: 'admin123'
  });
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/users/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(loginData)
    }
  };
  
  const req = http.request(options, (res) => {
    console.log('📊 Login endpoint status:', res.statusCode);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        if (res.statusCode === 200) {
          console.log('✅ Login endpoint works!');
          console.log('👤 User:', response.user.name);
          console.log('🔐 Is Admin:', response.user.isAdmin);
        } else {
          console.log('❌ Login failed:', response.message);
        }
      } catch (e) {
        console.log('📋 Raw response:', data);
      }
    });
  });
  
  req.on('error', (err) => {
    console.log('❌ Login endpoint error:', err.message);
  });
  
  req.write(loginData);
  req.end();
};

testBackend();