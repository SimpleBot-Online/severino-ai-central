import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { getClients, createClientRecord, updateClient, deleteClient } from '@/services/supabaseService';
import { Client, ClientStatus, ClientCategory } from '@/types';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

const ClientBoard: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchClients = async () => {
      if (user) {
        try {
          const fetchedClients = await getClients(user.id);
          setClients(fetchedClients);
        } catch (error) {
          console.error('Error fetching clients:', error);
          toast.error('Erro ao carregar clientes');
        }
      }
    };

    fetchClients();
  }, [user]);

  const handleCreateClient = async () => {
    if (user) {
      try {
        const newClient = await createClientRecord(user.id, {
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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Client Board</h1>
      <Button onClick={handleCreateClient} className="mb-4">Criar Novo Cliente</Button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clients.map(client => (
          <div key={client.id} className="bg-white rounded-md shadow-sm p-4">
            <h2 className="text-lg font-semibold">{client.name}</h2>
            <p>Status: {client.status}</p>
            <p>Category: {client.category}</p>
            <Button onClick={() => handleUpdateClient(client, { name: 'Cliente Atualizado' })} className="mt-2">Atualizar Nome</Button>
            <Button onClick={() => handleDeleteClient(client.id)} className="mt-2 bg-red-500 hover:bg-red-700 text-white">Excluir</Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientBoard;
