// API Configuration - HARDCODED for Vercel deployment
// DO NOT rely on environment variables as they are evaluated at build time

// Production API URL (HARDCODED)
export const API_URL = 'https://schoolserver-nine.vercel.app';
export const API_BASE_URL = 'https://schoolserver-nine.vercel.app/api';

// Debug logging
if (typeof window !== 'undefined') {
  console.log('🔧 API Configuration:', {
    API_URL,
    API_BASE_URL
  });
}



