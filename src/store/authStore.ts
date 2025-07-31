import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, DriverProfile } from '../types';
import { AuthService } from '../services/authService';

interface AuthState {
  user: User | null;
  driverProfile: DriverProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  // Firebase Auth Actions
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInAnonymously: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  convertAnonymousUser: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  
  // Profile Actions
  updateUser: (userData: Partial<User>) => Promise<void>;
  updateDriverProfile: (profileData: Partial<DriverProfile>) => Promise<void>;
  
  // State Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  initializeAuth: () => Promise<() => void>;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      driverProfile: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Firebase Auth Actions
      signInAnonymously: async () => {
        try {
          set({ isLoading: true, error: null });
          
          const user = await AuthService.signInAnonymously();
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            error: error.message,
            isLoading: false,
          });
          throw error;
        }
      },

      convertAnonymousUser: async (email: string, password: string, userData: Partial<User>) => {
        try {
          set({ isLoading: true, error: null });
          
          const user = await AuthService.convertAnonymousUser(email, password, userData);
          
          set({
            user,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            error: error.message,
            isLoading: false,
          });
          throw error;
        }
      },

      signUp: async (email: string, password: string, userData: Partial<User>) => {
        try {
          set({ isLoading: true, error: null });
          
          const user = await AuthService.signUp(email, password, userData);
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            error: error.message,
            isLoading: false,
          });
          throw error;
        }
      },

      signIn: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const user = await AuthService.signIn(email, password);
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            error: error.message,
            isLoading: false,
          });
          throw error;
        }
      },

      signOut: async () => {
        try {
          set({ isLoading: true, error: null });
          
          await AuthService.signOut();
          
          set({
            user: null,
            driverProfile: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            error: error.message,
            isLoading: false,
          });
          throw error;
        }
      },

      resetPassword: async (email: string) => {
        try {
          set({ isLoading: true, error: null });
          
          await AuthService.resetPassword(email);
          
          set({
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            error: error.message,
            isLoading: false,
          });
          throw error;
        }
      },

      // Profile Actions
      updateUser: async (userData: Partial<User>) => {
        try {
          const currentUser = get().user;
          if (!currentUser) throw new Error('No user logged in');

          set({ isLoading: true, error: null });
          
          await AuthService.updateUserProfile(currentUser.id, userData);
          
          const updatedUser = { ...currentUser, ...userData };
          set({
            user: updatedUser,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            error: error.message,
            isLoading: false,
          });
          throw error;
        }
      },

      updateDriverProfile: async (profileData: Partial<DriverProfile>) => {
        try {
          const currentUser = get().user;
          if (!currentUser) throw new Error('No user logged in');

          set({ isLoading: true, error: null });
          
          // Update user role to driver if not already set
          if (currentUser.role !== 'driver') {
            await AuthService.updateUserProfile(currentUser.id, { role: 'driver' });
          }

          const currentProfile = get().driverProfile;
          const updatedProfile: DriverProfile = currentProfile ? {
            ...currentProfile,
            ...profileData,
            updatedAt: new Date(),
          } : {
            id: Date.now().toString(),
            userId: currentUser.id,
            vehicleType: 'pickup',
            capacity: 0,
            offersHelp: false,
            licensePlate: '',
            documents: {
              license: '',
              insurance: '',
              vehicleRegistration: '',
            },
            rating: 0,
            totalJobs: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            ...profileData,
          };

          set({
            driverProfile: updatedProfile,
            user: { ...currentUser, role: 'driver' },
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            error: error.message,
            isLoading: false,
          });
          throw error;
        }
      },

      // State Actions
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },

      // Initialize auth state listener
      initializeAuth: async () => {
        try {
          set({ isLoading: true, error: null });

          // Set up Firebase auth state listener
          const unsubscribe = AuthService.onAuthStateChanged(async (user) => {
            if (user) {
              set({
                user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
              });
            } else {
              set({
                user: null,
                driverProfile: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
              });
            }
          });

          return unsubscribe;
        } catch (error: any) {
          set({
            error: error.message,
            isLoading: false,
          });
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        driverProfile: state.driverProfile,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);