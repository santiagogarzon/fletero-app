import { auth, db } from '../config/firebase';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';

export class FirebaseTestService {
  // Test Firebase Auth connection
  static async testAuthConnection(): Promise<boolean> {
    try {
      console.log('Testing Firebase Auth connection...');
      
      // Try to sign in anonymously to test the connection
      const result = await signInAnonymously(auth);
      console.log('Firebase Auth test successful:', result.user.uid);
      
      // Sign out immediately
      await auth.signOut();
      
      return true;
    } catch (error: any) {
      console.error('Firebase Auth test failed:', error);
      return false;
    }
  }

  // Test Firestore connection
  static async testFirestoreConnection(): Promise<boolean> {
    try {
      console.log('Testing Firestore connection...');
      
      // Try to read from a collection to test the connection
      const testCollection = collection(db, 'test');
      await getDocs(testCollection);
      
      console.log('Firestore test successful');
      return true;
    } catch (error: any) {
      console.error('Firestore test failed:', error);
      return false;
    }
  }

  // Test Firebase configuration
  static async testFirebaseConfig(): Promise<{
    auth: boolean;
    firestore: boolean;
    config: any;
  }> {
    const config = {
      apiKey: process.env.FIREBASE_API_KEY || 'AIzaSyAEFPnSCC8vYSbhRzxB7BiqUbV7kY6Ew20',
      authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'fletero-app-e7b3c.firebaseapp.com',
      projectId: process.env.FIREBASE_PROJECT_ID || 'fletero-app-e7b3c',
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'fletero-app-e7b3c.firebasestorage.app',
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '707401331032',
      appId: process.env.FIREBASE_APP_ID || '1:707401331032:ios:907f24e16532f8e3e3752d',
    };

    console.log('Firebase configuration:', config);

    const authTest = await this.testAuthConnection();
    const firestoreTest = await this.testFirestoreConnection();

    return {
      auth: authTest,
      firestore: firestoreTest,
      config,
    };
  }

  // Listen to auth state changes
  static listenToAuthState(callback: (user: any) => void): () => void {
    return onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user ? user.uid : 'No user');
      callback(user);
    });
  }
} 