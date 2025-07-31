import { GOOGLE_MAPS_API_KEY } from '@env';

// Environment variables configuration
export const ENV = {
  // Google Maps
  GOOGLE_MAPS_API_KEY: GOOGLE_MAPS_API_KEY,

  // App Configuration
  APP_NAME: 'Fletero App',
  APP_VERSION: '1.0.0',

  // Firebase Configuration (if needed in the future)
  FIREBASE_API_KEY: undefined,
  FIREBASE_AUTH_DOMAIN: undefined,
  FIREBASE_PROJECT_ID: undefined,
  FIREBASE_STORAGE_BUCKET: undefined,
  FIREBASE_MESSAGING_SENDER_ID: undefined,
  FIREBASE_APP_ID: undefined,
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