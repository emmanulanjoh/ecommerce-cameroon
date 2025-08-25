const axios = require('axios');
const jwt = require('jsonwebtoken');

// Test the admin orders API endpoint
async function testAdminAPI() {
  try {
    // First, let's try to login as admin to get a token
    console.log('🔐 Attempting admin login...');
    
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@findall.cm',
      password: 'admin123'
    });
    
    console.log('✅ Login successful');
    const token = loginResponse.data.token;
    console.log('🎫 Token received:', token ? 'Yes' : 'No');
    
    // Now test the admin orders endpoint
    console.log('\n📦 Testing admin orders endpoint...');
    
    const ordersResponse = await axios.get('http://localhost:5000/api/orders/admin/all?limit=50', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Orders API response:');
    console.log('Status:', ordersResponse.status);
    console.log('Orders count:', ordersResponse.data.orders?.length || 0);
    
    if (ordersResponse.data.orders && ordersResponse.data.orders.length > 0) {
      console.log('\n📋 Sample order:');
      const sampleOrder = ordersResponse.data.orders[0];
      console.log('ID:', sampleOrder._id);
      console.log('User:', sampleOrder.user?.name);
      console.log('Status:', sampleOrder.status);
      console.log('Total:', sampleOrder.totalAmount);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    }
  }
}

testAdminAPI();