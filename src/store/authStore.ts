
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    username: string;
    role: string;
  } | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (username, password) => {
        // Simple authentication for demo
        if (username === 'admin' && password === 'admin') {
          set({
            isAuthenticated: true,
            user: {
              username: 'admin',
              role: 'admin',
            },
          });
          return true;
        }
        return false;
      },
      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
        });
      },
    }),
    {
      name: 'severino-auth-storage',
    }
  )
);
