// API Configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.REACT_APP_API_URL || 'https://your-apprunner-url.amazonaws.com/api'
  : 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  
  // Products
  PRODUCTS: `${API_BASE_URL}/products`,
  PRODUCT_BY_ID: (id: string) => `${API_BASE_URL}/products/${id}`,
  
  // Orders
  ORDERS: `${API_BASE_URL}/orders`,
  ORDER_BY_ID: (id: string) => `${API_BASE_URL}/orders/${id}`,
  
  // WhatsApp
  WHATSAPP_ORDER: `${API_BASE_URL}/whatsapp/order`,
  
  // Upload
  UPLOAD: `${API_BASE_URL}/upload`,
  
  // Health check
  HEALTH: `${API_BASE_URL}/health`
};

export default API_BASE_URL;