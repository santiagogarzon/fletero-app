import { initializeApp, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, enableNetwork, disableNetwork } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// import { getMessaging } from 'firebase/messaging'; // User commented this out

// Your Fletero App Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAEFPnSCC8vYSbhRzxB7BiqUbV7kY6Ew20",
  authDomain: "fletero-app-e7b3c.firebaseapp.com",
  projectId: "fletero-app-e7b3c",
  storageBucket: "fletero-app-e7b3c.firebasestorage.app",
  messagingSenderId: "707401331032",
  appId: "1:707401331032:ios:907f24e16532f8e3e3752d"
};

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully');
} catch (error: any) {
  console.error('Error initializing Firebase:', error);

  // If Firebase is already initialized, get the existing app
  if (error.code === 'app/duplicate-app') {
    app = getApp();
    console.log('Using existing Firebase app');
  } else {
    // For development/testing, you can use a fallback config
    console.warn('Using fallback Firebase config for development');
    const fallbackConfig = {
      apiKey: "demo-key",
      authDomain: "demo.firebaseapp.com",
      projectId: "demo-project",
      storageBucket: "demo.appspot.com",
      messagingSenderId: "123456789",
      appId: "1:123456789:web:demo"
    };
    app = initializeApp(fallbackConfig, 'fallback');
  }
}

// Initialize Firebase Auth
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Storage
const storage = getStorage(app);

// Initialize Firebase Messaging (for push notifications)
// const messaging = getMessaging(app); // User commented this out

// Network connectivity helpers
export const checkFirebaseConnection = async () => {
  try {
    // Try to enable network to check connectivity
    await enableNetwork(db);
    console.log('Firebase network connection: OK');
    return true;
  } catch (error) {
    console.error('Firebase network connection failed:', error);
    return false;
  }
};

export const disableFirebaseNetwork = async () => {
  try {
    await disableNetwork(db);
    console.log('Firebase network disabled');
  } catch (error) {
    console.error('Error disabling Firebase network:', error);
  }
};

// Check if we're in development mode
const isDevelopment = __DEV__;

// Connect to emulators if in development (optional)
if (isDevelopment) {
  // Uncomment these lines if you want to use Firebase emulators for local development
  // try {
  //   connectAuthEmulator(auth, 'http://localhost:9099');
  //   connectFirestoreEmulator(db, 'localhost', 8080);
  //   console.log('Connected to Firebase emulators');
  // } catch (error) {
  //   console.log('Firebase emulators not available, using production');
  // }
}

export { auth, db, storage, app };