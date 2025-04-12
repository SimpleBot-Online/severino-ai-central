import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

type AuthError = { error: Error | null };

interface AuthStateBase {
  isAuthenticated: boolean;
  user: User | null;
  session: Session | null;
  loading: boolean;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username?: string) => Promise<AuthError>;
  signIn: (emailOrUsername: string, password: string, isUsername?: boolean) => Promise<AuthError>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

type AuthState = AuthStateBase & AuthActions;

interface PersistedAuthState {
  isAuthenticated: boolean;
  user: User | null;
  session: Session | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      session: null,
      loading: true,
      
      login: async (email: string, password: string) => {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          
          if (error) throw error;
          
          if (data.session) {
            set({
              isAuthenticated: true,
              user: data.user,
              session: data.session,
            });
          }
        } catch (error) {
          console.error('Error during login:', error);
          throw error;
        }
      },
      
      signUp: async (email, password, username) => {
        try {
          const options = username 
            ? { data: { username } } 
            : undefined;
            
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options
          });
          
          if (error) return { error: error as Error };
          
          if (data.session) {
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
          return { error: error instanceof Error ? error : new Error(String(error)) };
        }
      },
      
      signIn: async (emailOrUsername, password, isUsername = false) => {
        try {
          if (isUsername) {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('username', emailOrUsername)
              .single();
              
            if (profileError || !profileData) {
              return { error: new Error('Usuário não encontrado') };
            }
            
            const { data, error } = await supabase.auth.signInWithPassword({
              email: emailOrUsername,
              password,
            });
            
            if (error) return { error: error as Error };
            
            set({
              isAuthenticated: true,
              user: data.user,
              session: data.session,
            });
            
            return { error: null };
          } else {
            const { data, error } = await supabase.auth.signInWithPassword({
              email: emailOrUsername,
              password,
            });
            
            if (error) return { error: error as Error };
            
            set({
              isAuthenticated: true,
              user: data.user,
              session: data.session,
            });
            
            return { error: null };
          }
        } catch (error) {
          console.error('Error during sign in:', error);
          return { error: error instanceof Error ? error : new Error(String(error)) };
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
      })
    }
  )
);

if (typeof window !== 'undefined') {
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
  
  useAuthStore.getState().refreshSession();
}
