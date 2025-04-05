
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (provider?: 'google') => Promise<void>;
  signUp: (email: string, password: string) => Promise<{ error: any | null }>;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      session: null,
      loading: true,
      
      login: async (provider = 'google') => {
        try {
          if (provider === 'google') {
            const { error } = await supabase.auth.signInWithOAuth({
              provider: 'google',
              options: {
                redirectTo: `${window.location.origin}/dashboard`,
              },
            });
            
            if (error) throw error;
          }
        } catch (error) {
          console.error('Error during login:', error);
          throw error;
        }
      },
      
      signUp: async (email, password) => {
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          });
          
          if (error) return { error };
          
          if (data.session) {
            set({
              isAuthenticated: true,
              user: data.user,
              session: data.session,
            });
          }
          
          return { error: null };
        } catch (error) {
          console.error('Error during sign up:', error);
          return { error };
        }
      },
      
      signIn: async (email, password) => {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (error) return { error };
          
          set({
            isAuthenticated: true,
            user: data.user,
            session: data.session,
          });
          
          return { error: null };
        } catch (error) {
          console.error('Error during sign in:', error);
          return { error };
        }
      },
      
      logout: async () => {
        try {
          await supabase.auth.signOut();
          set({
            isAuthenticated: false,
            user: null,
            session: null,
          });
        } catch (error) {
          console.error('Error during logout:', error);
        }
      },
      
      refreshSession: async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session) {
            set({
              isAuthenticated: true,
              user: session.user,
              session,
              loading: false,
            });
          } else {
            set({
              isAuthenticated: false,
              user: null,
              session: null,
              loading: false,
            });
          }
        } catch (error) {
          console.error('Error refreshing session:', error);
          set({
            loading: false,
          });
        }
      },
    }),
    {
      name: 'severino-auth-storage',
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        session: state.session
      }),
    }
  )
);

// Initialize auth state when the app loads
if (typeof window !== 'undefined') {
  // Set up auth state listener
  supabase.auth.onAuthStateChange((event, session) => {
    const store = useAuthStore.getState();
    
    if (session) {
      store.refreshSession();
    } else if (event === 'SIGNED_OUT') {
      useAuthStore.setState({
        isAuthenticated: false,
        user: null,
        session: null,
        loading: false,
      });
    }
  });
  
  // Check for existing session on load
  useAuthStore.getState().refreshSession();
}
