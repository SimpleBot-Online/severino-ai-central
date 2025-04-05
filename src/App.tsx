
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
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";

const queryClient = new QueryClient();

// Private Route component for protected routes
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuthStore();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin h-8 w-8 border-4 border-severino-pink rounded-full border-t-transparent"></div>
    </div>;
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App = () => {
  const { refreshSession } = useAuthStore();
  
  // Check for existing session on app load
  useEffect(() => {
    refreshSession();
  }, [refreshSession]);
  
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
              <Route path="/assistants" element={<PrivateRoute><Assistants /></PrivateRoute>} />
              <Route path="/chips" element={<PrivateRoute><ChipHeating /></PrivateRoute>} />
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
