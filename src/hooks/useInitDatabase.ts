
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { checkAndCreateDatabaseStructure, initializeUserData } from '@/services/databaseService';

export function useInitDatabase() {
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    async function initDatabase() {
      try {
        setLoading(true);
        
        // Check and create database structure
        const structureCreated = await checkAndCreateDatabaseStructure();
        
        if (!structureCreated) {
          throw new Error('Failed to create database structure');
        }
        
        // Initialize user data if authenticated
        if (isAuthenticated && user) {
          await initializeUserData(user.id);
        }
        
        setInitialized(true);
        setLoading(false);
      } catch (err) {
        console.error('Error initializing database:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
      }
    }
    
    if (isAuthenticated && !initialized) {
      initDatabase();
    } else if (!isAuthenticated) {
      setLoading(false);
    }
  }, [isAuthenticated, user, initialized]);

  return { initialized, loading, error };
}
