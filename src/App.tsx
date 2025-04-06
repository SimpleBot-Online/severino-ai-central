
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./hooks/use-theme";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Notes from "./pages/Notes";
import Tasks from "./pages/Tasks";
import Links from "./pages/Links";
import Ideas from "./pages/Ideas";
import ChatCEO from "./pages/ChatCEO";
import PromptMaker from "./pages/PromptMaker";
import Assistants from "./pages/Assistants";
import ChipHeating from "./pages/ChipHeating";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import SavedPrompts from "./pages/SavedPrompts";
import MelhorRobo from "./pages/MelhorRobo";
import { useAuthStore } from "./store/authStore";
import { useInitDatabase } from "./hooks/useInitDatabase";
import { useEffect } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Private Route component for protected routes
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuthStore();
  const { loading: dbLoading } = useInitDatabase();
  
  if (loading || dbLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-cyber-dark">
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-16 h-16 mb-4">
            <div className="absolute inset-0 border-2 border-t-cyber-primary border-r-cyber-primary border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-2 border-t-transparent border-r-transparent border-b-cyber-secondary border-l-cyber-secondary rounded-full animate-spin animation-delay-500"></div>
          </div>
          <div className="text-cyber-primary font-mono text-sm">INICIALIZANDO SISTEMA</div>
          <div className="text-cyber-primary/50 font-mono text-xs mt-2 animate-pulse">CARREGANDO MÓDULOS</div>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  const { refreshSession } = useAuthStore();
  
  // Check for existing session on app load
  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  // Add a cyberpunk console message
  useEffect(() => {
    console.log(
      "%c SEVERINO IA CENTRAL v1.0.2 %c SISTEMA INICIALIZADO ",
      "background: #0F0F14; color: #00FFC8; font-weight: bold; font-family: monospace; padding: 4px;",
      "background: #FF003C; color: #0F0F14; font-weight: bold; font-family: monospace; padding: 4px;"
    );
    console.log(
      "%c > MÓDULOS CARREGADOS: OK\n > BANCO DE DADOS: ONLINE\n > INTELIGÊNCIA ARTIFICIAL: ATIVA\n > SISTEMA DE SEGURANÇA: ATIVO",
      "color: #00FFC8; font-family: monospace;"
    );
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/notes" element={<PrivateRoute><Notes /></PrivateRoute>} />
              <Route path="/tasks" element={<PrivateRoute><Tasks /></PrivateRoute>} />
              <Route path="/links" element={<PrivateRoute><Links /></PrivateRoute>} />
              <Route path="/ideas" element={<PrivateRoute><Ideas /></PrivateRoute>} />
              <Route path="/chat" element={<PrivateRoute><ChatCEO /></PrivateRoute>} />
              <Route path="/prompts" element={<PrivateRoute><PromptMaker /></PrivateRoute>} />
              <Route path="/saved-prompts" element={<PrivateRoute><SavedPrompts /></PrivateRoute>} />
              <Route path="/assistants" element={<PrivateRoute><Assistants /></PrivateRoute>} />
              <Route path="/chips" element={<PrivateRoute><ChipHeating /></PrivateRoute>} />
              <Route path="/melhor-robo" element={<PrivateRoute><MelhorRobo /></PrivateRoute>} />
              <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
