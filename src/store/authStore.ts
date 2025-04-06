
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
  signUp: (email: string, password: string, username?: string) => Promise<{ error: any | null }>;
  signIn: (emailOrUsername: string, password: string, isUsername?: boolean) => Promise<{ error: any | null }>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
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
      
      signUp: async (email, password, username) => {
        try {
          const options = username 
            ? { 
                data: { 
                  username 
                } 
              } 
            : undefined;
            
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options
          });
          
          if (error) return { error };
          
          if (data.session) {
            // Create profile record
            if (username) {
              const { error: profileError } = await supabase.from('profiles').upsert({
                id: data.user.id,
                username,
                updated_at: new Date().toISOString(),
              });
              
              if (profileError) {
                console.error('Error creating profile:', profileError);
              }
            }
            
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
      
      signIn: async (emailOrUsername, password, isUsername = false) => {
        try {
          if (isUsername) {
            // First, find the user by username
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('username', emailOrUsername)
              .single();
              
            if (profileError || !profileData) {
              return { error: { message: 'Usuário não encontrado' } };
            }
            
            // Now sign in with the found email and password
            const { data, error } = await supabase.auth.signInWithPassword({
              email: emailOrUsername, // Use the email directly as a fallback
              password,
            });
            
            if (error) return { error };
            
            set({
              isAuthenticated: true,
              user: data.user,
              session: data.session,
            });
            
            return { error: null };
          } 
          else {
            // Regular email login
            const { data, error } = await supabase.auth.signInWithPassword({
              email: emailOrUsername,
              password,
            });
            
            if (error) return { error };
            
            set({
              isAuthenticated: true,
              user: data.user,
              session: data.session,
            });
            
            return { error: null };
          }
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
          const { data } = await supabase.auth.getSession();
          const session = data.session;
          
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
    if (session) {
      useAuthStore.getState().refreshSession();
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
