import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { ThemeProvider } from "./hooks/use-theme";
import { useAuthStore } from "./store/authStore";
import { Loading } from "./components/Loading";
import ErrorBoundary from "./components/ErrorBoundary";
import PrivateRouteWithChat from "./components/Layout/PrivateRouteWithChat";
import NotificationProvider from "./components/NotificationProvider";

// Lazy-loaded page components
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

const ClientBoard = lazy(() => import("./pages/ClientBoard"));
const SimpleBot = lazy(() => import("./pages/SimpleBot"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes, default is 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes, default is 10 minutes
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  },
});

// Use PrivateRouteWithChat for protected routes with chat
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  return <PrivateRouteWithChat>{children}</PrivateRouteWithChat>;
};

const App = () => {
  const { checkAuth } = useAuthStore();

  // Check for existing session on app load
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Add a cyberpunk console message
  useEffect(() => {
    console.log(
      "%c SEVERINO IA CENTRAL v1.0.2 %c SISTEMA INICIALIZADO ",
      "background: #0F0F14; color: #00FFC8; font-weight: bold; font-family: monospace; padding: 4px;",
      "background: #FF003C; color: #0F0F14; font-weight: bold; font-family: monospace; padding: 4px;"
    );
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <NotificationProvider>
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

                  <Route path="/clients" element={<PrivateRoute><ClientBoard /></PrivateRoute>} />
                  <Route path="/simplebot" element={<PrivateRoute><SimpleBot /></PrivateRoute>} />
                  <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />

                  <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </TooltipProvider>
            </BrowserRouter>
          </NotificationProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
