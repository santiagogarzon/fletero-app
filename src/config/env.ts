// Environment variables configuration
export const ENV = {
  // Google Maps
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || 'AIzaSyBvA8PdrQWD1nPeFoRB-H3cHP81HOgCmog',
  
  // App Configuration
  APP_NAME: process.env.APP_NAME || 'Fletero App',
  APP_VERSION: process.env.APP_VERSION || '1.0.0',
  
  // Firebase Configuration (if needed in the future)
  FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
};

// Validate required environment variables
export const validateEnv = () => {
  const required = ['GOOGLE_MAPS_API_KEY'];
  const missing = required.filter(key => !ENV[key as keyof typeof ENV]);
  
  if (missing.length > 0) {
    console.warn('Missing required environment variables:', missing);
  }
  
  return missing.length === 0;
};

// Initialize environment validation
validateEnv(); 