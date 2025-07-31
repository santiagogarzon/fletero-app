import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  signOut as firebaseSignOut,
  updateProfile,
  User as FirebaseUser,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, enableNetwork } from 'firebase/firestore';
import { auth, db, checkFirebaseConnection } from '../config/firebase';
import { User, DriverProfile } from '../types';

// Convert Firebase user to our User type
const convertFirebaseUser = (firebaseUser: FirebaseUser): User => ({
  id: firebaseUser.uid,
  email: firebaseUser.email || '',
  name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuario Anónimo',
  role: 'consumer', // Default role, will be updated from Firestore
  createdAt: new Date(),
  updatedAt: new Date(),
});

// Helper function to ensure network connectivity
const ensureNetworkConnection = async () => {
  try {
    await enableNetwork(db);
    return true;
  } catch (error) {
    console.error('Failed to enable network:', error);
    return false;
  }
};

export class AuthService {
  // Sign in anonymously
  static async signInAnonymously(): Promise<User> {
    try {
      // Check network connection first
      const isConnected = await checkFirebaseConnection();
      if (!isConnected) {
        throw new Error('Sin conexión a internet. Verifica tu conexión y vuelve a intentar.');
      }

      const userCredential = await signInAnonymously(auth);
      const firebaseUser = userCredential.user;

      // Create user document in Firestore for anonymous user
      const user: User = {
        id: firebaseUser.uid,
        email: '',
        name: 'Usuario Anónimo',
        phone: '',
        role: 'consumer',
        isAnonymous: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), user);

      return user;
    } catch (error: any) {
      console.error('Anonymous sign in error:', error);
      
      // Handle specific offline errors
      if (error.code === 'unavailable' || error.message.includes('offline')) {
        throw new Error('Sin conexión a internet. Verifica tu conexión y vuelve a intentar.');
      }
      
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Sign up with email and password
  static async signUp(email: string, password: string, userData: Partial<User>): Promise<User> {
    try {
      // Check network connection first
      const isConnected = await checkFirebaseConnection();
      if (!isConnected) {
        throw new Error('Sin conexión a internet. Verifica tu conexión y vuelve a intentar.');
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Update Firebase profile
      await updateProfile(firebaseUser, {
        displayName: userData.name,
      });

      // Create user document in Firestore
      const user: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: userData.name || '',
        phone: userData.phone,
        role: userData.role || 'consumer',
        isAnonymous: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), user);

      return user;
    } catch (error: any) {
      console.error('Sign up error:', error);
      
      // Handle specific offline errors
      if (error.code === 'unavailable' || error.message.includes('offline')) {
        throw new Error('Sin conexión a internet. Verifica tu conexión y vuelve a intentar.');
      }
      
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Sign in with email and password
  static async signIn(email: string, password: string): Promise<User> {
    try {
      // Check network connection first
      const isConnected = await checkFirebaseConnection();
      if (!isConnected) {
        throw new Error('Sin conexión a internet. Verifica tu conexión y vuelve a intentar.');
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (!userDoc.exists()) {
        throw new Error('Usuario no encontrado. Contacta al administrador.');
      }

      return userDoc.data() as User;
    } catch (error: any) {
      console.error('Sign in error:', error);
      
      // Handle specific offline errors
      if (error.code === 'unavailable' || error.message.includes('offline')) {
        throw new Error('Sin conexión a internet. Verifica tu conexión y vuelve a intentar.');
      }
      
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Sign out
  static async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw new Error('Error al cerrar sesión');
    }
  }

  // Reset password
  static async resetPassword(email: string): Promise<void> {
    try {
      // Check network connection first
      const isConnected = await checkFirebaseConnection();
      if (!isConnected) {
        throw new Error('Sin conexión a internet. Verifica tu conexión y vuelve a intentar.');
      }

      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      console.error('Reset password error:', error);
      
      // Handle specific offline errors
      if (error.code === 'unavailable' || error.message.includes('offline')) {
        throw new Error('Sin conexión a internet. Verifica tu conexión y vuelve a intentar.');
      }
      
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Update user profile
  static async updateUserProfile(userId: string, updates: Partial<User>): Promise<void> {
    try {
      // Check network connection first
      const isConnected = await checkFirebaseConnection();
      if (!isConnected) {
        throw new Error('Sin conexión a internet. Verifica tu conexión y vuelve a intentar.');
      }

      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: new Date(),
      });
    } catch (error: any) {
      console.error('Update profile error:', error);
      
      // Handle specific offline errors
      if (error.code === 'unavailable' || error.message.includes('offline')) {
        throw new Error('Sin conexión a internet. Verifica tu conexión y vuelve a intentar.');
      }
      
      throw new Error('Error al actualizar perfil');
    }
  }

  // Convert anonymous user to permanent account
  static async convertAnonymousUser(email: string, password: string, userData: Partial<User>): Promise<User> {
    try {
      // Check network connection first
      const isConnected = await checkFirebaseConnection();
      if (!isConnected) {
        throw new Error('Sin conexión a internet. Verifica tu conexión y vuelve a intentar.');
      }

      const currentUser = auth.currentUser;
      if (!currentUser || !currentUser.isAnonymous) {
        throw new Error('No hay un usuario anónimo para convertir');
      }

      // Create credential with email and password
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user profile
      await updateProfile(credential.user, {
        displayName: userData.name,
      });

      // Update user document in Firestore
      const updatedUser: User = {
        id: credential.user.uid,
        email: credential.user.email || '',
        name: userData.name || '',
        phone: userData.phone,
        role: userData.role || 'consumer',
        isAnonymous: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(doc(db, 'users', credential.user.uid), updatedUser);

      return updatedUser;
    } catch (error: any) {
      console.error('Convert anonymous user error:', error);
      
      // Handle specific offline errors
      if (error.code === 'unavailable' || error.message.includes('offline')) {
        throw new Error('Sin conexión a internet. Verifica tu conexión y vuelve a intentar.');
      }
      
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Get current user from Firestore
  static async getCurrentUser(): Promise<User | null> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return null;

      // Check network connection first
      const isConnected = await checkFirebaseConnection();
      if (!isConnected) {
        console.warn('Network unavailable, returning cached user data');
        return null;
      }

      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (!userDoc.exists()) return null;

      return userDoc.data() as User;
    } catch (error: any) {
      console.error('Get current user error:', error);
      
      // If it's an offline error, return null to use cached data
      if (error.code === 'unavailable' || error.message.includes('offline')) {
        console.warn('Offline mode: using cached user data');
        return null;
      }
      
      return null;
    }
  }

  // Listen to auth state changes with better error handling
  static onAuthStateChanged(callback: (user: User | null) => void): () => void {
    console.log('Setting up auth state listener...');
    
    return onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Firebase auth state changed:', firebaseUser ? 'User present' : 'No user');
      
      if (firebaseUser) {
        try {
          // Check network connection first
          const isConnected = await checkFirebaseConnection();
          if (!isConnected) {
            console.warn('Network unavailable during auth state change');
            // Return basic user info from Firebase Auth
            callback({
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || 'Usuario',
              role: 'consumer',
              isAnonymous: firebaseUser.isAnonymous,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
            return;
          }

          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            console.log('User data retrieved from Firestore:', userData.name);
            callback(userData);
          } else {
            console.warn('User document not found in Firestore');
            callback(null);
          }
        } catch (error: any) {
          console.error('Error getting user data:', error);
          
          // If it's an offline error, provide basic user info
          if (error.code === 'unavailable' || error.message.includes('offline')) {
            console.warn('Offline mode: providing basic user info');
            callback({
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || 'Usuario',
              role: 'consumer',
              isAnonymous: firebaseUser.isAnonymous,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          } else {
            callback(null);
          }
        }
      } else {
        console.log('No user authenticated, calling callback with null');
        callback(null);
      }
    });
  }

  // Get error message from Firebase error code
  private static getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'Ya existe una cuenta con este email';
      case 'auth/invalid-email':
        return 'Email inválido';
      case 'auth/weak-password':
        return 'La contraseña debe tener al menos 6 caracteres';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Email o contraseña incorrectos';
      case 'auth/too-many-requests':
        return 'Demasiados intentos. Intenta más tarde';
      case 'auth/network-request-failed':
      case 'unavailable':
        return 'Error de conexión. Verifica tu internet';
      case 'auth/operation-not-allowed':
        return 'Operación no permitida. Contacta al administrador';
      case 'auth/user-disabled':
        return 'Cuenta deshabilitada. Contacta al administrador';
      case 'auth/invalid-credential':
        return 'Credenciales inválidas';
      default:
        return 'Error de autenticación. Intenta nuevamente';
    }
  }
} 