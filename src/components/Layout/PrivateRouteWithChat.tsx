import React from 'react';
import { useAuthStore } from '@/store/authStore';
import { useInitDatabase } from '@/hooks/useInitDatabase';
import { Loading } from '@/components/Loading';
import { Navigate } from 'react-router-dom';
import { FloatingChat } from '@/components/FloatingChat';

interface PrivateRouteWithChatProps {
  children: React.ReactNode;
}

const PrivateRouteWithChat: React.FC<PrivateRouteWithChatProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuthStore();
  const { loading: dbLoading } = useInitDatabase();

  if (loading || dbLoading) {
    return <Loading message="INICIALIZANDO SISTEMA" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      {children}
      <FloatingChat />
    </>
  );
};

export default PrivateRouteWithChat;
