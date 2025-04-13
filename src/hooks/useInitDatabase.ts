import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { checkAndCreateDatabaseStructure } from '@/services/databaseInitService';

export function useInitDatabase() {
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { isAuthenticated, userId } = useAuthStore();

  useEffect(() => {
    const initDb = async () => {
      try {
        setLoading(true);
        // Inicializa o banco de dados local
        await checkAndCreateDatabaseStructure();
        setInitialized(true);
      } catch (err) {
        console.error('Erro ao inicializar banco de dados:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    initDb();
  }, []);

  return { initialized, loading, error };
}
