const axios = require('axios');

const testAPILogin = async () => {
  try {
    console.log('🔍 Testing API login endpoint...');
    
    const loginData = {
      email: 'admin@findall.cm',
      password: 'admin123'
    };
    
    console.log('📤 Sending request to: http://localhost:3000/api/users/login');
    console.log('📧 Email:', loginData.email);
    console.log('🔑 Password:', loginData.password);
    
    const response = await axios.post('http://localhost:3000/api/users/login', loginData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Login successful!');
    console.log('📋 Response:', response.data);
    
  } catch (error) {
    console.log('❌ Login failed!');
    if (error.response) {
      console.log('📊 Status:', error.response.status);
      console.log('📋 Error:', error.response.data);
    } else {
      console.log('🔧 Network error:', error.message);
    }
  }
};

testAPILogin();