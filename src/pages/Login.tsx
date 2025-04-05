import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useToast } from '@/components/ui/use-toast';
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const {
    login,
    isAuthenticated
  } = useAuthStore();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const success = login(username, password);
      if (success) {
        toast({
          title: "Login bem-sucedido",
          description: "Bem-vindo ao Severino IA Central!"
        });
        navigate('/');
      } else {
        toast({
          title: "Falha no login",
          description: "Credenciais inválidas. Tente admin/admin.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro ao processar o login.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  return <div className="min-h-screen bg-severino-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-severino-gray rounded-lg shadow-lg overflow-hidden animate-fadeIn">
        <div className="bg-gradient-to-r from-severino-pink to-purple-600 py-6 px-8">
          
          
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium text-gray-200 block">
              Usuário
            </label>
            <input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Seu nome de usuário" className="w-full p-3 rounded-md bg-severino-lightgray border border-gray-600 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-severino-pink" required />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-200 block">
              Senha
            </label>
            <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Sua senha" className="w-full p-3 rounded-md bg-severino-lightgray border border-gray-600 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-severino-pink" required />
          </div>
          
          <div className="pt-2">
            <button type="submit" disabled={loading} className={`w-full p-3 rounded-md bg-severino-pink text-white font-medium hover:bg-opacity-90 transition-colors
                ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
          
          <div className="text-center text-sm text-gray-400 mt-4">
            <p>Use admin/admin para fazer login</p>
          </div>
        </form>
      </div>
    </div>;
};
export default Login;