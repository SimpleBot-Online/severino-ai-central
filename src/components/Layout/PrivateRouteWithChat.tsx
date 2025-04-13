import React from 'react';
import { useAuthStore } from '@/store/authStore';
import { useInitDatabase } from '@/hooks/useInitDatabase';
import { Loading } from '@/components/Loading';
import { Navigate, useLocation } from 'react-router-dom';
import FloatingChat from '@/components/FloatingChat';
import { useSettingsStore } from '@/store/dataStore';

interface PrivateRouteWithChatProps {
  children: React.ReactNode;
}

const PrivateRouteWithChat: React.FC<PrivateRouteWithChatProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuthStore();
  const { loading: dbLoading } = useInitDatabase();
  const { settings } = useSettingsStore();
  const location = useLocation();

  if (loading || dbLoading) {
    return <Loading message="INICIALIZANDO SISTEMA" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      {children}
      {settings?.openaiApiKey && location.pathname !== '/chat' && <FloatingChat />}
    </>
  );
};

export default PrivateRouteWithChat;
