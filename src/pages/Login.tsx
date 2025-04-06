
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, UserCircle2, Mail, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login, signIn, signUp, isAuthenticated, refreshSession } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already authenticated
  useEffect(() => {
    refreshSession();
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate, refreshSession]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if input is email or username
    const isEmailInput = email.includes('@');
    
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Credenciais incompletas",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await signIn(email, password, !isEmailInput);
      
      if (error) {
        toast({
          title: "Falha no login",
          description: error.message || "Credenciais inválidas. Tente novamente.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Login aprovado",
          description: "Bem-vindo ao Severino IA Central"
        });
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast({
        title: "Erro no login",
        description: error?.message || "Ocorreu um erro ao processar o login.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !username || !password || !confirmPassword) {
      toast({
        title: "Campos obrigatórios",
        description: "Todos os campos são obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Senhas não coincidem",
        description: "A senha e a confirmação de senha devem ser iguais.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await signUp(email, password, username);
      
      if (error) {
        toast({
          title: "Falha no cadastro",
          description: error.message || "Ocorreu um erro ao criar sua conta.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Cadastro realizado",
          description: "Sua conta foi criada com sucesso! Faça login para continuar."
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro no cadastro",
        description: error?.message || "Ocorreu um erro ao processar seu cadastro.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await login('google');
      // No need to navigate here, redirection is handled by Supabase OAuth
    } catch (error: any) {
      toast({
        title: "Erro no login com Google",
        description: error?.message || "Ocorreu um erro ao processar o login com Google.",
        variant: "destructive"
      });
      setGoogleLoading(false);
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
        
        <Tabs defaultValue="signin" className="p-8 cyberpunk-terminal">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-cyber-dark border border-cyber-primary/30">
            <TabsTrigger value="signin" className="data-[state=active]:bg-cyber-primary/10 data-[state=active]:text-cyber-primary rounded-none border-r border-cyber-primary/30">INICIAR SESSÃO</TabsTrigger>
            <TabsTrigger value="signup" className="data-[state=active]:bg-cyber-primary/10 data-[state=active]:text-cyber-primary rounded-none">NOVO USUÁRIO</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <div className="terminal-header">
              <span className="typing-text">login.sh</span>
            </div>
            <form onSubmit={handleSignIn} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-mono text-foreground/80 block terminal-prompt">
                  EMAIL OU USERNAME
                </label>
                <div className="relative">
                  <Input 
                    id="email" 
                    type="text" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    placeholder="usuario@servidor.com" 
                    className="severino-input pl-10" 
                    required 
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cyber-primary/70" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-mono text-foreground/80 block terminal-prompt">
                  SENHA
                </label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    placeholder="••••••••" 
                    className="severino-input pl-10" 
                    required 
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
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-cyber-primary/30" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-cyber-dark px-2 text-foreground/60 font-mono">
                    AUTH ALTERNATIVO
                  </span>
                </div>
              </div>
              
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleGoogleLogin} 
                disabled={googleLoading}
                className="severino-button-secondary w-full"
              >
                {googleLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#00FFC8"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#00FFC8"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#00FFC8"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#00FFC8"
                    />
                  </svg>
                )}
                {googleLoading ? "AUTENTICANDO..." : "GOOGLE AUTH"}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <div className="terminal-header">
              <span className="typing-text">register.sh</span>
            </div>
            <form onSubmit={handleSignUp} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="signup-email" className="text-sm font-mono text-foreground/80 block terminal-prompt">
                  EMAIL
                </label>
                <div className="relative">
                  <Input 
                    id="signup-email" 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    placeholder="usuario@servidor.com" 
                    className="severino-input pl-10" 
                    required 
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cyber-primary/70" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="signup-username" className="text-sm font-mono text-foreground/80 block terminal-prompt">
                  USERNAME
                </label>
                <div className="relative">
                  <Input 
                    id="signup-username" 
                    type="text" 
                    value={username} 
                    onChange={e => setUsername(e.target.value)} 
                    placeholder="user123" 
                    className="severino-input pl-10" 
                    required 
                  />
                  <UserCircle2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cyber-primary/70" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="signup-password" className="text-sm font-mono text-foreground/80 block terminal-prompt">
                  SENHA
                </label>
                <div className="relative">
                  <Input 
                    id="signup-password" 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    placeholder="••••••••" 
                    className="severino-input pl-10" 
                    required 
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cyber-primary/70" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="confirm-password" className="text-sm font-mono text-foreground/80 block terminal-prompt">
                  CONFIRMAR SENHA
                </label>
                <div className="relative">
                  <Input 
                    id="confirm-password" 
                    type="password" 
                    value={confirmPassword} 
                    onChange={e => setConfirmPassword(e.target.value)} 
                    placeholder="••••••••" 
                    className="severino-input pl-10" 
                    required 
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cyber-primary/70" />
                </div>
              </div>
              
              <div className="text-xs font-mono text-foreground/70 flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-cyber-secondary shrink-0 mt-0.5" />
                <span>Sua senha deve ter no mínimo 8 caracteres e incluir letras, números e caracteres especiais para segurança máxima.</span>
              </div>
              
              <Button 
                type="submit" 
                disabled={loading} 
                className="severino-button w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    CRIANDO...
                  </>
                ) : 'REGISTRAR NO SISTEMA'}
              </Button>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-cyber-primary/30" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-cyber-dark px-2 text-foreground/60 font-mono">
                    AUTH ALTERNATIVO
                  </span>
                </div>
              </div>
              
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleGoogleLogin} 
                disabled={googleLoading}
                className="severino-button-secondary w-full"
              >
                {googleLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#00FFC8"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#00FFC8"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#00FFC8"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#00FFC8"
                    />
                  </svg>
                )}
                {googleLoading ? "AUTENTICANDO..." : "GOOGLE AUTH"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
        
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
