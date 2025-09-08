export const config = {
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  environment: process.env.REACT_APP_ENVIRONMENT || 'development',
  whatsappNumber: process.env.REACT_APP_WHATSAPP_NUMBER || '+237123456789',
  businessName: process.env.REACT_APP_BUSINESS_NAME || 'Findall Sourcing',
  enableConsoleLogs: process.env.REACT_APP_ENABLE_CONSOLE_LOGS !== 'false'
};

export const isDevelopment = config.environment === 'development';
export const isProduction = config.environment === 'production';