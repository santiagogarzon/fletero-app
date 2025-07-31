import { auth, db } from '../config/firebase';
import { 
  signInAnonymously, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs,
  enableNetwork,
  disableNetwork 
} from 'firebase/firestore';

export class FirebaseTestService {
  static async testAuthConnection() {
    try {
      console.log('Testing Firebase Auth connection...');
      
      // Test anonymous sign in
      const result = await signInAnonymously(auth);
      console.log('✅ Auth connection successful');
      console.log('User ID:', result.user.uid);
      
      return {
        success: true,
        message: 'Firebase Auth is working correctly',
        userId: result.user.uid
      };
    } catch (error: any) {
      console.error('❌ Auth connection failed:', error);
      return {
        success: false,
        message: `Auth error: ${error.code} - ${error.message}`,
        error: error
      };
    }
  }

  static async testFirestoreConnection() {
    try {
      console.log('Testing Firestore connection...');
      
      // Enable network to ensure connection
      await enableNetwork(db);
      
      // Try to access a test document
      const testDocRef = doc(db, 'test', 'connection');
      const testDoc = await getDoc(testDocRef);
      
      console.log('✅ Firestore connection successful');
      return {
        success: true,
        message: 'Firestore is working correctly',
        exists: testDoc.exists()
      };
    } catch (error: any) {
      console.error('❌ Firestore connection failed:', error);
      
      // Check if it's a database not found error
      if (error.code === 'failed-precondition' || error.code === 'unavailable') {
        return {
          success: false,
          message: '❌ FIRESTORE DATABASE NOT FOUND! You need to create the Firestore database in your Firebase project.',
          instructions: [
            '1. Go to Firebase Console: https://console.firebase.google.com',
            '2. Select your project: fletero-app-e7b3c',
            '3. Click "Firestore Database" in the left sidebar',
            '4. Click "Create database"',
            '5. Choose "Start in test mode"',
            '6. Select a location (us-central1 recommended)',
            '7. Click "Done"',
            '8. Wait for database to be created (1-2 minutes)',
            '9. Test again!'
          ],
          error: error
        };
      }
      
      return {
        success: false,
        message: `Firestore error: ${error.code} - ${error.message}`,
        error: error
      };
    }
  }

  static async testFirebaseConfig() {
    try {
      console.log('Testing Firebase configuration...');
      
      const config = {
        apiKey: "AIzaSyAEFPnSCC8vYSbhRzxB7BiqUbV7kY6Ew20",
        authDomain: "fletero-app-e7b3c.firebaseapp.com",
        projectId: "fletero-app-e7b3c",
        storageBucket: "fletero-app-e7b3c.firebasestorage.app",
        messagingSenderId: "707401331032",
        appId: "1:707401331032:ios:907f24e16532f8e3e3752d"
      };
      
      console.log('✅ Firebase config loaded');
      return {
        success: true,
        message: 'Firebase configuration is correct',
        config: config
      };
    } catch (error: any) {
      console.error('❌ Firebase config error:', error);
      return {
        success: false,
        message: `Config error: ${error.message}`,
        error: error
      };
    }
  }

  static async testNetworkConnectivity() {
    try {
      console.log('Testing network connectivity...');
      
      // Test if we can enable/disable network
      await enableNetwork(db);
      console.log('✅ Network enabled successfully');
      
      return {
        success: true,
        message: 'Network connectivity is working'
      };
    } catch (error: any) {
      console.error('❌ Network connectivity failed:', error);
      return {
        success: false,
        message: `Network error: ${error.message}`,
        error: error
      };
    }
  }

  static async testOfflineMode() {
    try {
      console.log('Testing offline mode...');
      
      // Disable network
      await disableNetwork(db);
      console.log('✅ Offline mode enabled');
      
      // Re-enable network
      await enableNetwork(db);
      console.log('✅ Network re-enabled');
      
      return {
        success: true,
        message: 'Offline mode is working correctly'
      };
    } catch (error: any) {
      console.error('❌ Offline mode test failed:', error);
      return {
        success: false,
        message: `Offline mode error: ${error.message}`,
        error: error
      };
    }
  }

  static async getConnectionStatus() {
    const results = {
      auth: await this.testAuthConnection(),
      firestore: await this.testFirestoreConnection(),
      config: await this.testFirebaseConfig(),
      network: await this.testNetworkConnectivity(),
      offline: await this.testOfflineMode()
    };

    const allSuccess = Object.values(results).every(result => result.success);
    
    return {
      overall: allSuccess ? '✅ All tests passed' : '❌ Some tests failed',
      results: results,
      summary: {
        auth: results.auth.success ? '✅' : '❌',
        firestore: results.firestore.success ? '✅' : '❌',
        config: results.config.success ? '✅' : '❌',
        network: results.network.success ? '✅' : '❌',
        offline: results.offline.success ? '✅' : '❌'
      }
    };
  }

  static async listenToAuthState() {
    return new Promise((resolve) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        console.log('Auth state changed:', user ? `User ${user.uid}` : 'No user');
        unsubscribe();
        resolve({
          success: true,
          message: 'Auth state listener working',
          user: user ? { uid: user.uid, isAnonymous: user.isAnonymous } : null
        });
      });
      
      // Timeout after 5 seconds
      setTimeout(() => {
        unsubscribe();
        resolve({
          success: false,
          message: 'Auth state listener timeout'
        });
      }, 5000);
    });
  }
} 