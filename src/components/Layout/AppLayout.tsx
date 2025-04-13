
import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import Header from './Header';
import { useAuthStore } from '../../store/authStore';
import { useSettingsStore } from '../../store/dataStore';
import { Navigate, useLocation } from 'react-router-dom';
import FloatingChat from '../FloatingChat';
import SetApiKey from '../SetApiKey';
import { Terminal, Loader2 } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { isAuthenticated, loading } = useAuthStore();
  const { settings } = useSettingsStore();
  const location = useLocation();

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true);
      }
    };

    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="cyberpunk-grid"></div>
        <div className="cyberpunk-scanline"></div>
        
        <div className="flex flex-col items-center justify-center z-10">
          <div className="relative w-16 h-16 mb-4">
            <Terminal className="w-12 h-12 text-green-500 animate-pulse" />
            <div className="absolute inset-0 rounded-full border-2 border-t-green-500 border-r-green-500 border-b-transparent border-l-transparent animate-spin"></div>
          </div>
          <div className="text-green-500 font-mono text-sm terminal-prompt">INICIALIZANDO SISTEMA</div>
          <div className="text-green-500/70 font-mono text-xs mt-2 animate-blink">CARREGANDO MÓDULOS</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  // Always show sidebar collapsed on mobile for better experience
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarCollapsed(true);
    }
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-black font-mono relative">
      {/* Cyberpunk grid overlay */}
      <div className="cyberpunk-grid"></div>
      <div className="cyberpunk-scanline"></div>

      {/* Overlay for mobile when sidebar is open */}
      <div
        className={`fixed inset-0 z-30 bg-black/80 backdrop-blur-sm transition-all duration-300
          lg:hidden ${!sidebarCollapsed ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleSidebar}
      />

      <div className={`fixed z-40 h-full transition-transform duration-300 ease-in-out
        ${sidebarCollapsed ? '-translate-x-full lg:translate-x-0 lg:w-20' : 'translate-x-0 w-64'}`}>
        <Sidebar collapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
      </div>

      <div className={`flex flex-col flex-1 min-h-screen w-full transition-all duration-300 relative z-10
        ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          <div className="container mx-auto max-w-7xl">
            {children}
          </div>
        </main>
        <footer className="py-2 px-4 md:px-6 border-t border-green-500/20 text-center text-xs text-green-500/50 font-mono">
          <div className="flex justify-between items-center">
            <span>SEVERINO.AI</span>
            <span>v1.0.2 &copy; 2025</span>
            <span className="text-green-500/70 animate-pulse">SISTEMA ONLINE</span>
          </div>
        </footer>
      </div>

      {/* API Key Setup */}
      {!settings?.openaiApiKey && <SetApiKey />}

      {/* Floating Chat */}
      {settings?.openaiApiKey && location.pathname !== '/chat' && <FloatingChat />}
    </div>
  );
};

export default AppLayout;
