
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Terminal, ShieldCheck, Key } from 'lucide-react';

const Login = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, checkAuth } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already authenticated
  useEffect(() => {
    checkAuth();

    const timer = setTimeout(() => {
      if (isAuthenticated) {
        navigate('/dashboard');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, navigate, checkAuth]);

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
      const isProd = import.meta.env.PROD;
      const masterPassword = import.meta.env.VITE_MASTER_PASSWORD;

      if (isProd && !masterPassword) {
        toast({
          title: "Erro de configuração",
          description: "A senha mestra não foi configurada no ambiente de produção.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

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

        setTimeout(() => {
          navigate('/dashboard');
        }, 100);
      }
    } catch (error) {
      console.error('Erro durante o login:', error);
      toast({
        title: "Erro no login",
        description: "Falha na conexão. Verifique sua internet e tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [password, login, toast, navigate]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      e.preventDefault();
      handleLogin(e as unknown as React.FormEvent);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="cyberpunk-grid"></div>
      <div className="cyberpunk-scanline"></div>

      <div className="w-full max-w-md z-10 animate-fadeIn relative overflow-hidden">
        <div className="absolute inset-0 bg-cyber-grid blur-sm opacity-20 z-0"></div>
        
        <div className="relative z-10 border border-green-500/30 bg-black/90 backdrop-blur-sm">
          <div className="flex flex-col items-center py-8 px-6 border-b border-green-500/30 bg-gradient-to-r from-green-500/5 to-green-500/10">
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-full flex items-center justify-center border-2 border-green-500 shadow-cyber">
                <Terminal className="h-12 w-12 text-green-500" />
              </div>
              <div className="absolute inset-0 rounded-full border border-green-500/30 animate-pulse"></div>
            </div>
            <h1 className="text-2xl font-mono tracking-wider text-green-500 mb-1">SEVERINO.AI</h1>
            <p className="text-green-500/70 font-mono text-sm">Terminal de Acesso Seguro</p>
            <div className="flex space-x-1 mt-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="w-2 h-2 rounded-full bg-green-500/50"></div>
              ))}
            </div>
          </div>

          <div className="px-6 py-8 bg-black/95">
            <div className="terminal-header mb-6">
              <span>login_secure.sh</span>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-mono text-green-500/80 block terminal-prompt">
                  master_password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="••••••••"
                    className="bg-black/70 border border-green-500/30 text-green-400 focus:border-green-500 focus:ring-0 pl-10 font-mono"
                    required
                    autoFocus
                  />
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500/70" />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-black border border-green-500 text-green-500 hover:bg-green-500/10 hover:text-green-400 font-mono transition-all duration-300"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    AUTENTICANDO...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    AUTENTICAR
                  </>
                )}
              </Button>
            </form>
          </div>

          <div className="px-6 py-4 border-t border-green-500/20 bg-gradient-to-r from-green-500/5 to-green-500/10">
            <div className="flex justify-between items-center text-xs font-mono text-green-500/60">
              <span>SEVERINO.AI v1.0.2</span>
              <span className="animate-pulse">CONEXÃO SEGURA</span>
              <span>2025</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
