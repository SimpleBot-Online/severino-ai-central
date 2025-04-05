
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
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
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Email e senha são obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        toast({
          title: "Falha no login",
          description: error.message || "Credenciais inválidas. Tente novamente.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Login bem-sucedido",
          description: "Bem-vindo ao Severino IA Central!"
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
    if (!email || !password || !confirmPassword) {
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
      const { error } = await signUp(email, password);
      
      if (error) {
        toast({
          title: "Falha no cadastro",
          description: error.message || "Ocorreu um erro ao criar sua conta.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Cadastro realizado",
          description: "Sua conta foi criada com sucesso! Verifique seu email para confirmar o cadastro."
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-lg shadow-lg overflow-hidden animate-fadeIn">
        <div className="bg-gradient-to-r from-primary to-purple-600 py-6 px-8 flex flex-col items-center">
          <img
            src="/lovable-uploads/d2dd70fc-d37b-4b1b-97c7-bc6049f571b9.png"
            alt="Severino"
            className="w-32 h-32 rounded-full border-4 border-white shadow-md mb-4"
          />
          <h1 className="text-2xl font-bold text-white text-center">Severino IA Central</h1>
          <p className="text-white/80 text-center mt-2">Seu assistente inteligente para automação</p>
        </div>
        
        <Tabs defaultValue="signin" className="p-8">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="signin">Login</TabsTrigger>
            <TabsTrigger value="signup">Cadastro</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground block">
                  Email
                </label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="seu@email.com" 
                  className="w-full" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground block">
                  Senha
                </label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="••••••••" 
                  className="w-full" 
                  required 
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : 'Entrar'}
              </Button>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Ou continue com
                  </span>
                </div>
              </div>
              
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleGoogleLogin} 
                disabled={googleLoading}
                className="w-full"
              >
                {googleLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                )}
                {googleLoading ? "Conectando..." : "Google"}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="signup-email" className="text-sm font-medium text-foreground block">
                  Email
                </label>
                <Input 
                  id="signup-email" 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="seu@email.com" 
                  className="w-full" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="signup-password" className="text-sm font-medium text-foreground block">
                  Senha
                </label>
                <Input 
                  id="signup-password" 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="••••••••" 
                  className="w-full" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="confirm-password" className="text-sm font-medium text-foreground block">
                  Confirmar Senha
                </label>
                <Input 
                  id="confirm-password" 
                  type="password" 
                  value={confirmPassword} 
                  onChange={e => setConfirmPassword(e.target.value)} 
                  placeholder="••••••••" 
                  className="w-full" 
                  required 
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : 'Criar Conta'}
              </Button>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Ou continue com
                  </span>
                </div>
              </div>
              
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleGoogleLogin} 
                disabled={googleLoading}
                className="w-full"
              >
                {googleLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                )}
                {googleLoading ? "Conectando..." : "Google"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;
