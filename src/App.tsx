import { Toaster } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./hooks/use-theme";
import { lazy, Suspense } from 'react';
const Index = lazy(() => import("./pages/Index"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Login = lazy(() => import("./pages/Login"));
const Notes = lazy(() => import("./pages/Notes"));
const Tasks = lazy(() => import("./pages/Tasks"));
const Links = lazy(() => import("./pages/Links"));
const Ideas = lazy(() => import("./pages/Ideas"));
const ChatCEO = lazy(() => import("./pages/ChatCEO"));
const PromptMaker = lazy(() => import("./pages/PromptMaker"));
const Assistants = lazy(() => import("./pages/Assistants"));
const ChipHeating = lazy(() => import("./pages/ChipHeating"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SavedPrompts = lazy(() => import("./pages/SavedPrompts"));
const MelhorRobo = lazy(() => import("./pages/MelhorRobo"));
import { useAuthStore } from "./store/authStore";
import { Loading } from "./components/Loading";
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
    return <Loading message="INICIALIZANDO SISTEMA" />;
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
        
            <Suspense fallback={<Loading />}>
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
                <Route path="/farm" element={<PrivateRoute><ChipHeating /></PrivateRoute>} />
                <Route path="/melhor-robo" element={<PrivateRoute><MelhorRobo /></PrivateRoute>} />
                <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </TooltipProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
