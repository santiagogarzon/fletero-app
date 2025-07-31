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
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
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

export class AuthService {
  // Sign in anonymously
  static async signInAnonymously(): Promise<User> {
    try {
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
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Sign up with email and password
  static async signUp(email: string, password: string, userData: Partial<User>): Promise<User> {
    try {
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
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Sign in with email and password
  static async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (!userDoc.exists()) {
        throw new Error('User document not found');
      }

      return userDoc.data() as User;
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Sign out
  static async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw new Error('Error signing out');
    }
  }

  // Reset password
  static async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      console.error('Reset password error:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Update user profile
  static async updateUserProfile(userId: string, updates: Partial<User>): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: new Date(),
      });
    } catch (error: any) {
      console.error('Update profile error:', error);
      throw new Error('Error updating profile');
    }
  }

  // Convert anonymous user to permanent account
  static async convertAnonymousUser(email: string, password: string, userData: Partial<User>): Promise<User> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser || !currentUser.isAnonymous) {
        throw new Error('No anonymous user to convert');
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
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Get current user from Firestore
  static async getCurrentUser(): Promise<User | null> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return null;

      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (!userDoc.exists()) return null;

      return userDoc.data() as User;
    } catch (error: any) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // Listen to auth state changes
  static onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            callback(userDoc.data() as User);
          } else {
            callback(null);
          }
        } catch (error) {
          console.error('Error getting user data:', error);
          callback(null);
        }
      } else {
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
        return 'Error de conexión. Verifica tu internet';
      case 'auth/operation-not-allowed':
        return 'Operación no permitida. Contacta al administrador';
      default:
        return 'Error de autenticación. Intenta nuevamente';
    }
  }
} 