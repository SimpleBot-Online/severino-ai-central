
import React, { useState, useEffect } from 'react';
import AppLayout from '../components/Layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { Client, ClientStatus, ClientCategory } from '@/types';
import { Plus, Search, Edit, Trash2, CheckCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { getClients, createClientRecord, updateClient, deleteClient } from '@/services/supabaseService';
import { useAuthStore } from '@/store/authStore';

const ClientBoard = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [newClient, setNewClient] = useState<Partial<Client>>({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'lead' as ClientStatus,
    category: 'company' as ClientCategory,
  });
  const { toast } = useToast();
  const { userId } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true);
        const data = await getClients(userId || 'admin');
        setClients(data);
        setFilteredClients(data);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os clientes.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, [userId, toast]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = clients.filter((client) =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (client.company && client.company.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredClients(filtered);
    } else {
      setFilteredClients(clients);
    }
  }, [searchTerm, clients]);

  const handleAddClient = async () => {
    if (!newClient.name) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome é obrigatório",
        variant: "destructive"
      });
      return;
    }

    try {
      const clientData = {
        name: newClient.name,
        email: newClient.email || '',
        phone: newClient.phone || '',
        company: newClient.company || '',
        status: newClient.status || 'lead',
        category: newClient.category || 'company',
      };

      const createdClient = await createClientRecord(userId || 'admin', clientData);
      setClients([...clients, createdClient]);
      setNewClient({
        name: '',
        email: '',
        phone: '',
        company: '',
        status: 'lead',
        category: 'company',
      });
      setIsAddDialogOpen(false);
      toast({
        title: "Cliente adicionado",
        description: "Cliente foi adicionado com sucesso"
      });
    } catch (error) {
      console.error('Erro ao adicionar cliente:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o cliente.",
        variant: "destructive"
      });
    }
  };

  const handleEditClient = async () => {
    if (selectedClient) {
      try {
        const updatedClient = await updateClient(selectedClient.id, selectedClient);
        const updatedClients = clients.map((client) =>
          client.id === updatedClient.id ? updatedClient : client
        );
        setClients(updatedClients);
        setSelectedClient(null);
        setIsEditDialogOpen(false);
        toast({
          title: "Cliente atualizado",
          description: "Dados do cliente atualizados com sucesso"
        });
      } catch (error) {
        console.error('Erro ao atualizar cliente:', error);
        toast({
          title: "Erro",
          description: "Não foi possível atualizar o cliente.",
          variant: "destructive"
        });
      }
    }
  };

  const handleDeleteClient = async (id: string) => {
    try {
      await deleteClient(id);
      const updatedClients = clients.filter((client) => client.id !== id);
      setClients(updatedClients);
      toast({
        title: "Cliente removido",
        description: "Cliente foi removido com sucesso"
      });
    } catch (error) {
      console.error('Erro ao remover cliente:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o cliente.",
        variant: "destructive"
      });
    }
  };

  const renderClientStatus = (status: ClientStatus) => {
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-mono 
        ${status === 'active' ? 'bg-green-500/20 text-green-500 border border-green-500/30' : 
        status === 'inactive' ? 'bg-red-500/10 text-red-500 border border-red-500/30' : 
        'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30'}`}>
        {status === 'active' ? 'ATIVO' : 
         status === 'inactive' ? 'INATIVO' : 'LEAD'}
      </span>
    );
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fadeIn terminal-effect">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-mono tracking-tight text-green-500">Quadro de Clientes</h1>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            variant="terminal"
            className="gap-2"
          >
            <Plus size={16} />
            Novo Cliente
          </Button>
        </div>

        <div className="terminal-box p-4">
          <div className="terminal-header">
            sistema {'>'}{'>'} clientes {'>'}{'>'} busca
          </div>
          <div className="relative mt-4">
            <Search className="absolute top-3 left-3 h-4 w-4 text-green-500/50" />
            <Input
              placeholder="Buscar cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="terminal-box overflow-hidden">
          <div className="terminal-header">
            sistema {'>'}{'>'} clientes {'>'}{'>'} listagem
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-green-500">Nome</TableHead>
                  <TableHead className="text-green-500">Email</TableHead>
                  <TableHead className="text-green-500">Telefone</TableHead>
                  <TableHead className="text-green-500">Empresa</TableHead>
                  <TableHead className="text-green-500">Status</TableHead>
                  <TableHead className="text-green-500 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-green-500/60 font-mono">
                      Carregando clientes...
                    </TableCell>
                  </TableRow>
                ) : filteredClients.length > 0 ? (
                  filteredClients.map((client) => (
                    <TableRow key={client.id} className="border-green-500/20">
                      <TableCell className="font-mono">{client.name}</TableCell>
                      <TableCell className="font-mono text-green-400/80">{client.email}</TableCell>
                      <TableCell className="font-mono">{client.phone}</TableCell>
                      <TableCell className="font-mono">{client.company}</TableCell>
                      <TableCell>
                        {renderClientStatus(client.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedClient(client);
                              setIsEditDialogOpen(true);
                            }}
                            className="h-7 w-7 text-green-500 hover:text-green-400 hover:bg-green-500/10"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClient(client.id)}
                            className="h-7 w-7 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-green-500/60 font-mono">
                      Nenhum cliente encontrado. Adicione um novo ou ajuste sua busca.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-black border border-green-500/30 text-green-400 font-mono">
          <DialogHeader>
            <DialogTitle className="text-green-500 font-mono">Novo Cliente</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm text-green-500/80 terminal-prompt">nome</label>
              <Input
                value={newClient.name}
                onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                placeholder="Nome completo"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-green-500/80 terminal-prompt">email</label>
              <Input
                value={newClient.email}
                onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                placeholder="email@exemplo.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-green-500/80 terminal-prompt">telefone</label>
              <Input
                value={newClient.phone}
                onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                placeholder="(00) 00000-0000"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-green-500/80 terminal-prompt">empresa</label>
              <Input
                value={newClient.company}
                onChange={(e) => setNewClient({ ...newClient, company: e.target.value })}
                placeholder="Nome da empresa"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-green-500/80 terminal-prompt">status</label>
              <select
                value={newClient.status as string}
                onChange={(e) => setNewClient({ ...newClient, status: e.target.value as ClientStatus })}
                className="bg-black border border-green-500/30 px-3 py-2 text-green-400 w-full font-mono text-sm focus:outline-none focus:border-green-500/70"
              >
                <option value="lead">LEAD</option>
                <option value="active">ATIVO</option>
                <option value="inactive">INATIVO</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-green-500/80 terminal-prompt">categoria</label>
              <select
                value={newClient.category as string}
                onChange={(e) => setNewClient({ ...newClient, category: e.target.value as ClientCategory })}
                className="bg-black border border-green-500/30 px-3 py-2 text-green-400 w-full font-mono text-sm focus:outline-none focus:border-green-500/70"
              >
                <option value="company">EMPRESA</option>
                <option value="individual">INDIVIDUAL</option>
                <option value="partner">PARCEIRO</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddClient} variant="terminal">
              <CheckCircle className="mr-2 h-4 w-4" />
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-black border border-green-500/30 text-green-400 font-mono">
          <DialogHeader>
            <DialogTitle className="text-green-500 font-mono">Editar Cliente</DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm text-green-500/80 terminal-prompt">nome</label>
                <Input
                  value={selectedClient.name}
                  onChange={(e) => setSelectedClient({ ...selectedClient, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-green-500/80 terminal-prompt">email</label>
                <Input
                  value={selectedClient.email}
                  onChange={(e) => setSelectedClient({ ...selectedClient, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-green-500/80 terminal-prompt">telefone</label>
                <Input
                  value={selectedClient.phone}
                  onChange={(e) => setSelectedClient({ ...selectedClient, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-green-500/80 terminal-prompt">empresa</label>
                <Input
                  value={selectedClient.company}
                  onChange={(e) => setSelectedClient({ ...selectedClient, company: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-green-500/80 terminal-prompt">status</label>
                <select
                  value={selectedClient.status}
                  onChange={(e) => setSelectedClient({ ...selectedClient, status: e.target.value as ClientStatus })}
                  className="bg-black border border-green-500/30 px-3 py-2 text-green-400 w-full font-mono text-sm focus:outline-none focus:border-green-500/70"
                >
                  <option value="lead">LEAD</option>
                  <option value="active">ATIVO</option>
                  <option value="inactive">INATIVO</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-green-500/80 terminal-prompt">categoria</label>
                <select
                  value={selectedClient.category}
                  onChange={(e) => setSelectedClient({ ...selectedClient, category: e.target.value as ClientCategory })}
                  className="bg-black border border-green-500/30 px-3 py-2 text-green-400 w-full font-mono text-sm focus:outline-none focus:border-green-500/70"
                >
                  <option value="company">EMPRESA</option>
                  <option value="individual">INDIVIDUAL</option>
                  <option value="partner">PARCEIRO</option>
                </select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditClient} variant="terminal">
              <CheckCircle className="mr-2 h-4 w-4" />
              Atualizar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default ClientBoard;
