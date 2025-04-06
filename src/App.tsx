import React, { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import Index from './pages/Index';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Notes from './pages/Notes';
import Tasks from './pages/Tasks';
import Links from './pages/Links';
import Ideas from './pages/Ideas';
import ChatCEO from './pages/ChatCEO';
import PromptMaker from './pages/PromptMaker';
import SavedPrompts from './pages/SavedPrompts';
import Assistants from './pages/Assistants';
import ChipHeating from './pages/ChipHeating';
import MelhorRobo from './pages/MelhorRobo';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import ChatBubble from './pages/ChatBubble';

function App() {
  const { isAuthenticated, refreshSession } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  useEffect(() => {
    const publicRoutes = ['/', '/login'];
    const authRoutes = !publicRoutes.includes(location.pathname);

    if (isAuthenticated && location.pathname === '/login') {
      navigate('/dashboard');
    }

    if (!isAuthenticated && authRoutes) {
      navigate('/login');
    }
  }, [isAuthenticated, location, navigate]);

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!isAuthenticated) {
      return null;
    }

    return <>{children}</>;
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes"
          element={
            <ProtectedRoute>
              <Notes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/links"
          element={
            <ProtectedRoute>
              <Links />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ideas"
          element={
            <ProtectedRoute>
              <Ideas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatCEO />
            </ProtectedRoute>
          }
        />
        <Route
          path="/prompts"
          element={
            <ProtectedRoute>
              <PromptMaker />
            </ProtectedRoute>
          }
        />
        <Route
          path="/saved-prompts"
          element={
            <ProtectedRoute>
              <SavedPrompts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assistants"
          element={
            <ProtectedRoute>
              <Assistants />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chips"
          element={
            <ProtectedRoute>
              <ChipHeating />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat-bubble"
          element={
            <ProtectedRoute>
              <ChatBubble />
            </ProtectedRoute>
          }
        />
        <Route
          path="/melhor-robo"
          element={
            <ProtectedRoute>
              <MelhorRobo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
