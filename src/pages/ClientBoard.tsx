
import React, { useState, useEffect } from 'react';
import AppLayout from '../components/Layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { Client, ClientStatus } from '@/types';
import { Plus, Search, Edit, Trash2, CheckCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

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
    status: 'active' as ClientStatus,
  });
  const { toast } = useToast();

  // Mock data for demonstration
  useEffect(() => {
    const mockClients: Client[] = [
      {
        id: '1',
        name: 'João Silva',
        email: 'joao.silva@example.com',
        phone: '(11) 98765-4321',
        company: 'Tech Solutions',
        status: 'active' as ClientStatus,
      },
      {
        id: '2',
        name: 'Maria Oliveira',
        email: 'maria.oliveira@example.com',
        phone: '(21) 98765-4321',
        company: 'Digital Marketing',
        status: 'inactive' as ClientStatus,
      },
      {
        id: '3',
        name: 'Carlos Santos',
        email: 'carlos.santos@example.com',
        phone: '(31) 98765-4321',
        company: 'Web Design Co.',
        status: 'lead' as ClientStatus,
      },
    ];
    setClients(mockClients);
    setFilteredClients(mockClients);
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = clients.filter((client) =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredClients(filtered);
    } else {
      setFilteredClients(clients);
    }
  }, [searchTerm, clients]);

  const handleAddClient = () => {
    if (!newClient.name || !newClient.email) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e e-mail são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const clientWithId = {
      ...newClient,
      id: Date.now().toString(),
      status: newClient.status as ClientStatus || 'lead' as ClientStatus,
    } as Client;

    setClients([...clients, clientWithId]);
    setNewClient({
      name: '',
      email: '',
      phone: '',
      company: '',
      status: 'lead' as ClientStatus,
    });
    setIsAddDialogOpen(false);
    toast({
      title: "Cliente adicionado",
      description: "Cliente foi adicionado com sucesso"
    });
  };

  const handleEditClient = () => {
    if (selectedClient) {
      const updatedClients = clients.map((client) =>
        client.id === selectedClient.id ? selectedClient : client
      );
      setClients(updatedClients);
      setSelectedClient(null);
      setIsEditDialogOpen(false);
      toast({
        title: "Cliente atualizado",
        description: "Dados do cliente atualizados com sucesso"
      });
    }
  };

  const handleDeleteClient = (id: string) => {
    const updatedClients = clients.filter((client) => client.id !== id);
    setClients(updatedClients);
    toast({
      title: "Cliente removido",
      description: "Cliente foi removido com sucesso"
    });
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
                {filteredClients.length > 0 ? (
                  filteredClients.map((client) => (
                    <TableRow key={client.id} className="border-green-500/20">
                      <TableCell className="font-mono">{client.name}</TableCell>
                      <TableCell className="font-mono text-green-400/80">{client.email}</TableCell>
                      <TableCell className="font-mono">{client.phone}</TableCell>
                      <TableCell className="font-mono">{client.company}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-mono 
                          ${client.status === 'active' ? 'bg-green-500/20 text-green-500 border border-green-500/30' : 
                          client.status === 'inactive' ? 'bg-red-500/10 text-red-500 border border-red-500/30' : 
                          'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30'}`}>
                          {client.status === 'active' ? 'ATIVO' : 
                          client.status === 'inactive' ? 'INATIVO' : 'LEAD'}
                        </span>
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

      {/* Add Client Dialog */}
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

      {/* Edit Client Dialog */}
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
