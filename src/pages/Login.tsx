import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, checkAuth } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already authenticated
  useEffect(() => {
    checkAuth();

    // Pequeno atraso para garantir que o estado seja atualizado
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        navigate('/dashboard');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, navigate, checkAuth]);

  // Memoize the login handler to prevent unnecessary re-renders
  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, digite a senha mestra",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await login(password);

      if (error) {
        toast({
          title: "Falha no login",
          description: error.message || "Senha incorreta. Tente novamente.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Login aprovado",
          description: "Bem-vindo ao Severino IA Central"
        });

        // Pequeno atraso para garantir que o estado seja atualizado antes de redirecionar
        setTimeout(() => {
          navigate('/dashboard');
        }, 100);
      }
    } catch (error: any) {
      console.error('Erro durante o login:', error);
      toast({
        title: "Erro no login",
        description: "Falha na conexão. Verifique sua conexão com a internet e tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [password, login, toast, navigate]);

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      e.preventDefault();
      handleLogin(e as unknown as React.FormEvent);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      <div className="cyberpunk-grid"></div>
      <div className="cyberpunk-scanline"></div>

      <div className="w-full max-w-md rounded-sm overflow-hidden relative z-10 cyberpunk-box animate-fadeIn">
        <div className="bg-gradient-to-r from-cyber-primary/20 to-cyber-secondary/20 py-6 px-8 flex flex-col items-center">
          <div className="relative">
            <img
              src="/lovable-uploads/d2dd70fc-d37b-4b1b-97c7-bc6049f571b9.png"
              alt="Severino"
              className="w-32 h-32 border-2 border-cyber-primary shadow-cyber mb-4 bg-cyber-dark/50 p-1"
            />
            <div className="absolute inset-0 border-2 border-cyber-primary/30 animate-pulse"></div>
          </div>
          <h1 className="text-2xl font-cyber text-cyber-primary text-center cyberpunk-glow">SEVERINO IA CENTRAL</h1>
          <p className="text-foreground/80 text-center mt-2 font-mono">Seu assistente de automação avançada</p>
          <div className="terminal-text text-xs mt-2">// VERSÃO 1.0.2_ALPHA</div>
        </div>

        <div className="p-8 cyberpunk-terminal">
          <div className="terminal-header">
            <span className="typing-text">login.sh</span>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-mono text-foreground/80 block terminal-prompt">
                SENHA MESTRA
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="••••••••"
                  className="severino-input pl-10"
                  required
                  autoFocus
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cyber-primary/70" />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="severino-button w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  CONECTANDO...
                </>
              ) : 'ACESSAR SISTEMA'}
            </Button>
          </form>
        </div>

        <div className="px-8 py-4 border-t border-cyber-primary/30 bg-gradient-to-r from-cyber-primary/5 to-cyber-secondary/5">
          <p className="text-center text-xs font-mono text-foreground/60">
            <span className="text-cyber-primary">$</span> Severino IA Central v1.0.2 <span className="text-cyber-secondary">|</span> Todos os direitos reservados <span className="text-cyber-secondary">|</span> 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
