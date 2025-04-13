
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AUTH, DATABASE } from '@/config';

type AuthError = { error: Error | null };

interface AuthState {
  isAuthenticated: boolean;
  userId: string;
  loading: boolean;
  login: (password: string) => Promise<AuthError>;
  logout: () => void;
  checkAuth: () => void;
}

// Define explicitly what gets persisted to avoid infinite type instantiation
interface PersistedAuthState {
  isAuthenticated: boolean;
  userId: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      userId: AUTH.DEFAULT_USER_ID,
      loading: true, // Start as true to avoid content flash

      login: async (password: string) => {
        try {
          console.log('Attempting login with password:', password);
          console.log('Master password configured:', AUTH.MASTER_PASSWORD);
          
          // Verify if password matches master password
          if (password === AUTH.MASTER_PASSWORD) {
            console.log('Password matches, authenticating user');
            set({
              isAuthenticated: true,
              loading: false,
            });
            return { error: null };
          } else {
            console.log('Password incorrect');
            return { error: new Error('Senha incorreta') };
          }
        } catch (error) {
          console.error('Error during login:', error);
          return { error: error instanceof Error ? error : new Error(String(error)) };
        }
      },

      logout: () => {
        console.log('Logging out user');
        set({
          isAuthenticated: false,
          loading: false,
        });
      },

      checkAuth: () => {
        // Check if user is authenticated in localStorage
        const storedState = localStorage.getItem(DATABASE.STORAGE_KEYS.AUTH);

        if (storedState) {
          try {
            const parsedState = JSON.parse(storedState);
            console.log('Stored state:', parsedState);

            // If stored state indicates user is authenticated, maintain authentication
            if (parsedState.state && parsedState.state.isAuthenticated) {
              console.log('User already authenticated, maintaining authentication');
              set({
                isAuthenticated: true,
                loading: false,
              });
              return;
            }
          } catch (e) {
            console.error('Error parsing stored state:', e);
          }
        }

        // If no stored state or user is not authenticated
        console.log('User not authenticated');
        set({
          isAuthenticated: false,
          loading: false,
        });
      },
    }),
    {
      name: DATABASE.STORAGE_KEYS.AUTH,
      partialize: (state): PersistedAuthState => ({
        isAuthenticated: state.isAuthenticated,
        userId: state.userId,
      }),
    }
  )
);

// Initialize authentication check when module is loaded
if (typeof window !== 'undefined') {
  useAuthStore.getState().checkAuth();
}
