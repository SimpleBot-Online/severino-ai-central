
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { getClients, createClientRecord, updateClient, deleteClient } from '@/services/supabaseService';
import { Client, ClientStatus, ClientCategory } from '@/types';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import AppLayout from '@/components/Layout/AppLayout';
import { Plus, Edit, Trash2, AlertCircle } from 'lucide-react';

const ClientBoard: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const { userId } = useAuthStore();

  useEffect(() => {
    const fetchClients = async () => {
      if (userId) {
        try {
          setLoading(true);
          const fetchedClients = await getClients(userId);
          setClients(fetchedClients);
        } catch (error) {
          console.error('Error fetching clients:', error);
          toast.error('Erro ao carregar clientes');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchClients();
  }, [userId]);

  const handleCreateClient = async () => {
    if (userId) {
      try {
        const newClient = await createClientRecord(userId, {
          name: 'Novo Cliente',
          status: 'prospect' as ClientStatus,
          category: 'technology' as ClientCategory
        });
        setClients(prev => [...prev, newClient]);
        toast.success('Cliente criado com sucesso');
      } catch (error) {
        console.error('Error creating client:', error);
        toast.error('Erro ao criar cliente');
      }
    }
  };

  const handleUpdateClient = async (client: Client, updates: Partial<Client>) => {
    try {
      const updatedClient = await updateClient(client.id, updates);
      setClients(prev =>
        prev.map(c => (c.id === client.id ? { ...c, ...updatedClient } : c))
      );
      toast.success('Cliente atualizado com sucesso');
    } catch (error) {
      console.error('Error updating client:', error);
      toast.error('Erro ao atualizar cliente');
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    try {
      await deleteClient(clientId);
      setClients(prev => prev.filter(c => c.id !== clientId));
      toast.success('Cliente excluído com sucesso');
    } catch (error) {
      console.error('Error deleting client:', error);
      toast.error('Erro ao excluir cliente');
    }
  };

  const getStatusBadgeClass = (status: ClientStatus) => {
    switch (status) {
      case 'prospect':
        return 'bg-cyan-500/20 text-cyan-400';
      case 'active':
        return 'bg-green-500/20 text-green-400';
      case 'inactive':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <AppLayout>
      <div className="animate-fadeIn">
        <div className="terminal-header mb-6">
          <h1 className="text-2xl font-bold text-cyan-400">Cliente Board</h1>
          <p className="text-sm text-gray-400 mt-1">Gerencie seus clientes e prospectos</p>
        </div>

        <div className="terminal-command mb-4">
          <span className="terminal-prompt">client_manager.sh</span>
        </div>

        <Button 
          onClick={handleCreateClient} 
          className="mb-6 bg-cyber-dark border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500"
        >
          <Plus size={16} className="mr-2" />
          Criar Novo Cliente
        </Button>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 border-2 border-t-cyan-500 border-r-cyan-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        ) : clients.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-60 border border-dashed border-cyan-500/30 rounded-md p-6 bg-cyber-dark/60">
            <AlertCircle size={48} className="text-cyan-500/50 mb-4" />
            <h3 className="text-xl font-semibold text-cyan-400 mb-2">Nenhum Cliente Encontrado</h3>
            <p className="text-gray-400 text-center mb-4">Adicione seu primeiro cliente para começar a gerenciar seus relacionamentos</p>
            <Button 
              onClick={handleCreateClient} 
              className="bg-cyber-dark border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500"
            >
              <Plus size={16} className="mr-2" />
              Adicionar Cliente
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clients.map(client => (
              <div key={client.id} className="bg-cyber-dark/80 border border-cyan-500/30 rounded-md p-4 hover:border-cyan-500/70 transition-all duration-300">
                <h2 className="text-lg font-semibold text-cyan-400">{client.name}</h2>
                <div className="flex items-center mt-2 mb-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeClass(client.status)}`}>
                    {client.status}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-cyan-500/10 text-cyan-400 ml-2">
                    {client.category}
                  </span>
                </div>
                <div className="flex space-x-2 mt-3">
                  <Button 
                    onClick={() => handleUpdateClient(client, { name: 'Cliente Atualizado' })} 
                    variant="outline" 
                    size="sm"
                    className="bg-transparent border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                  >
                    <Edit size={14} className="mr-1" />
                    Editar
                  </Button>
                  <Button 
                    onClick={() => handleDeleteClient(client.id)} 
                    variant="outline" 
                    size="sm"
                    className="bg-transparent border border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 size={14} className="mr-1" />
                    Excluir
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ClientBoard;
