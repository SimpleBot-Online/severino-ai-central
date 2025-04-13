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

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      userId: AUTH.DEFAULT_USER_ID,
      loading: true, // Começa como true para evitar flash de conteúdo não autenticado

      login: async (password: string) => {
        try {
          // Verificar se a senha corresponde à senha mestra
          if (password === AUTH.MASTER_PASSWORD) {
            set({
              isAuthenticated: true,
              loading: false,
            });
            return { error: null };
          } else {
            return { error: new Error('Senha incorreta') };
          }
        } catch (error) {
          console.error('Erro durante o login:', error);
          return { error: error instanceof Error ? error : new Error(String(error)) };
        }
      },

      logout: () => {
        set({
          isAuthenticated: false,
          loading: false,
        });
      },

      checkAuth: () => {
        // Verifica se o usuário está autenticado no localStorage
        const storedState = localStorage.getItem(DATABASE.STORAGE_KEYS.AUTH);

        if (storedState) {
          try {
            const parsedState = JSON.parse(storedState);

            // Se o estado armazenado indica que o usuário está autenticado, mantém a autenticação
            if (parsedState.state && parsedState.state.isAuthenticated) {
              set({
                isAuthenticated: true,
                loading: false,
              });
              return;
            }
          } catch (e) {
            console.error('Erro ao analisar estado armazenado:', e);
          }
        }

        // Se não houver estado armazenado ou o usuário não estiver autenticado
        set({
          isAuthenticated: false,
          loading: false,
        });
      },
    }),
    {
      name: DATABASE.STORAGE_KEYS.AUTH,
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        userId: state.userId,
      }),
    }
  )
);

// Inicializa a verificação de autenticação quando o módulo é carregado
if (typeof window !== 'undefined') {
  useAuthStore.getState().checkAuth();
}
