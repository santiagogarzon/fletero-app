import { initializeApp, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getMessaging } from 'firebase/messaging';

// Fletero App Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAEFPnSCC8vYSbhRzxB7BiqUbV7kY6Ew20",
  authDomain: "fletero-app-e7b3c.firebaseapp.com",
  projectId: "fletero-app-e7b3c",
  storageBucket: "fletero-app-e7b3c.firebasestorage.app",
  messagingSenderId: "707401331032",
  appId: "1:707401331032:ios:907f24e16532f8e3e3752d",
  measurementId: "G-XXXXXXXXXX" // Add if you have Analytics enabled
};

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error: any) {
  // If Firebase is already initialized, get the existing app
  if (error.code === 'app/duplicate-app') {
    app = getApp();
  } else {
    console.error('Error initializing Firebase:', error);
    throw error;
  }
}

// Initialize Firebase Auth
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Storage
const storage = getStorage(app);

// Initialize Firebase Messaging (for push notifications)
// const messaging = getMessaging(app);

export { auth, db, storage, app };