import React, { useState, useEffect } from 'react';
import AppLayout from '../components/Layout/AppLayout';
import { useClientsStore, useFinancialRecordsStore } from '../store/dataStore';
import * as databaseService from '../services/databaseService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  UserPlus,
  Building,
  Handshake,
  DollarSign,
  Calendar,
  Phone,
  Mail,
  FileText,
  Tag
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/components/ui/use-toast';
import { Client, ClientStatus, ClientCategory } from '../types';

const ClientBoard = () => {
  const { clients, addClient, updateClient, deleteClient, getClientsByStatus } = useClientsStore();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const [newClient, setNewClient] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    status: 'prospect' as ClientStatus,
    category: 'company' as ClientCategory,
    notes: '',
    value: 0
  });

  // State to force re-renders
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Refresh clients when needed
  useEffect(() => {
    // This effect will run whenever refreshTrigger changes
    console.log('Refreshing client lists...');
  }, [refreshTrigger]);

  // Get clients by status
  const prospects = getClientsByStatus('prospect');
  const leads = getClientsByStatus('lead');
  const negotiations = getClientsByStatus('negotiation');
  const activeClients = getClientsByStatus('client');

  // Filter clients based on search term
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.company && client.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Handle client form submission
  const handleAddClient = () => {
    if (!newClient.name) {
      toast({
        title: "Erro",
        description: "Nome do cliente é obrigatório",
        variant: "destructive"
      });
      return;
    }

    addClient(
      newClient.name,
      newClient.status,
      newClient.category,
      {
        company: newClient.company,
        email: newClient.email,
        phone: newClient.phone,
        notes: newClient.notes,
        value: newClient.value || 0,
        nextContactDate: new Date()
      }
    );

    toast({
      title: "Cliente adicionado",
      description: `${newClient.name} foi adicionado com sucesso.`
    });

    // Reset form and close dialog
    setNewClient({
      name: '',
      company: '',
      email: '',
      phone: '',
      status: 'prospect',
      category: 'company',
      notes: '',
      value: 0
    });
    setIsAddDialogOpen(false);
  };

  // Handle client update
  const handleUpdateClient = () => {
    if (!currentClient) return;

    updateClient(currentClient.id, currentClient);

    toast({
      title: "Cliente atualizado",
      description: `${currentClient.name} foi atualizado com sucesso.`
    });

    setIsEditDialogOpen(false);
  };

  // Handle client deletion
  const handleDeleteClient = async () => {
    if (!currentClient) {
      console.error('No client selected for deletion');
      toast({
        title: "Erro",
        description: "Nenhum cliente selecionado para remoção",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Deleting client with ID:', currentClient.id);

      // Store client info before deletion for the toast message
      const clientName = currentClient.name;
      const clientId = currentClient.id;

      // Call the store method directly to ensure deletion works
      deleteClient(clientId);

      // Close the dialog
      setIsDeleteDialogOpen(false);

      // Clear the current client
      setCurrentClient(null);

      // Trigger a refresh of the client lists
      setRefreshTrigger(prev => prev + 1);

      // Show success message
      toast({
        title: "Cliente removido",
        description: `${clientName} foi removido com sucesso.`
      });

      // Also call the database service for persistence (but don't depend on its result)
      databaseService.deleteClient(clientId).catch(err => {
        console.error('Error in database service when deleting client:', err);
      });
    } catch (error) {
      console.error('Error deleting client:', error);
      toast({
        title: "Erro ao remover",
        description: "Ocorreu um erro ao tentar remover o cliente.",
        variant: "destructive"
      });
    }
  };

  // Get status label
  const getStatusLabel = (status: ClientStatus) => {
    switch (status) {
      case 'prospect': return 'Prospecção';
      case 'lead': return 'Lead';
      case 'negotiation': return 'Negociação';
      case 'client': return 'Cliente';
      case 'inactive': return 'Inativo';
      default: return status;
    }
  };

  // Get status color
  const getStatusColor = (status: ClientStatus) => {
    switch (status) {
      case 'prospect': return 'bg-blue-500/20 text-blue-400';
      case 'lead': return 'bg-purple-500/20 text-purple-400';
      case 'negotiation': return 'bg-yellow-500/20 text-yellow-400';
      case 'client': return 'bg-green-500/20 text-green-400';
      case 'inactive': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  // Get category label
  const getCategoryLabel = (category: ClientCategory) => {
    switch (category) {
      case 'individual': return 'Pessoa Física';
      case 'company': return 'Empresa';
      case 'partner': return 'Parceiro';
      default: return category;
    }
  };

  // Format date
  const formatDate = (date: Date | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  // Render client card
  const renderClientCard = (client: Client) => (
    <Card
      key={client.id}
      className="bg-cyber-dark/80 border border-green-500/30 hover:border-green-500/50 transition-all duration-300"
    >
      <CardContent className="p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(client.status)} mr-2`}>
                {getStatusLabel(client.status)}
              </span>
              <span className="text-xs text-gray-400">
                {getCategoryLabel(client.category)}
              </span>
            </div>

            <h3 className="font-bold text-lg mb-1">{client.name}</h3>
            {client.company && <p className="text-gray-300 text-sm mb-1">{client.company}</p>}

            <div className="space-y-1 mt-2">
              {client.email && (
                <div className="flex items-center text-sm text-gray-400">
                  <Mail size={14} className="mr-1" />
                  {client.email}
                </div>
              )}
              {client.phone && (
                <div className="flex items-center text-sm text-gray-400">
                  <Phone size={14} className="mr-1" />
                  {client.phone}
                </div>
              )}
              {client.nextContactDate && (
                <div className="flex items-center text-sm text-gray-400">
                  <Calendar size={14} className="mr-1" />
                  Próximo contato: {formatDate(client.nextContactDate)}
                </div>
              )}
              {client.value && client.value > 0 && (
                <div className="flex items-center text-sm text-green-400">
                  <DollarSign size={14} className="mr-1" />
                  Valor: R$ {client.value.toFixed(2)}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center mt-4 md:mt-0">
            <Button
              variant="ghost"
              size="sm"
              className="text-green-500 hover:text-green-400 hover:bg-green-500/10"
              onClick={() => {
                setCurrentClient(client);
                setIsEditDialogOpen(true);
              }}
            >
              <Edit size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
              onClick={() => {
                setCurrentClient(client);
                setIsDeleteDialogOpen(true);
              }}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AppLayout>
      <div className="animate-fadeIn">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Users className="mr-2 text-green-500" size={24} />
            <h1 className="text-2xl font-bold">Quadro de Clientes</h1>
          </div>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-green-500 hover:bg-green-600 text-black"
          >
            <Plus size={16} className="mr-2" />
            Novo Cliente
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Buscar clientes..."
              className="pl-10 bg-cyber-dark/60 border-green-500/30 focus:border-green-500/60"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {searchTerm ? (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Resultados da Busca</h2>
            {filteredClients.length > 0 ? (
              filteredClients.map(renderClientCard)
            ) : (
              <p className="text-gray-400">Nenhum cliente encontrado.</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Prospecção */}
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                <h2 className="text-lg font-bold">Prospecção ({prospects.length})</h2>
              </div>
              {prospects.map(renderClientCard)}
            </div>

            {/* Leads */}
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                <h2 className="text-lg font-bold">Leads ({leads.length})</h2>
              </div>
              {leads.map(renderClientCard)}
            </div>

            {/* Negociação */}
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <h2 className="text-lg font-bold">Negociação ({negotiations.length})</h2>
              </div>
              {negotiations.map(renderClientCard)}
            </div>

            {/* Clientes */}
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <h2 className="text-lg font-bold">Clientes ({activeClients.length})</h2>
              </div>
              {activeClients.map(renderClientCard)}
            </div>
          </div>
        )}

        {/* Add Client Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="bg-cyber-dark border-green-500/30 text-white">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Cliente</DialogTitle>
              <DialogDescription className="text-gray-400">
                Preencha os dados do novo cliente.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome *</label>
                  <Input
                    placeholder="Nome do cliente"
                    className="bg-cyber-dark/60 border-green-500/30 focus:border-green-500/60"
                    value={newClient.name}
                    onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Empresa</label>
                  <Input
                    placeholder="Nome da empresa"
                    className="bg-cyber-dark/60 border-green-500/30 focus:border-green-500/60"
                    value={newClient.company}
                    onChange={(e) => setNewClient({...newClient, company: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    placeholder="Email"
                    type="email"
                    className="bg-cyber-dark/60 border-green-500/30 focus:border-green-500/60"
                    value={newClient.email}
                    onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Telefone</label>
                  <Input
                    placeholder="Telefone"
                    className="bg-cyber-dark/60 border-green-500/30 focus:border-green-500/60"
                    value={newClient.phone}
                    onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={newClient.status}
                    onValueChange={(value) => setNewClient({...newClient, status: value as ClientStatus})}
                  >
                    <SelectTrigger className="bg-cyber-dark/60 border-green-500/30 focus:border-green-500/60">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent className="bg-cyber-dark border-green-500/30">
                      <SelectItem value="prospect">Prospecção</SelectItem>
                      <SelectItem value="lead">Lead</SelectItem>
                      <SelectItem value="negotiation">Negociação</SelectItem>
                      <SelectItem value="client">Cliente</SelectItem>
                      <SelectItem value="inactive">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Categoria</label>
                  <Select
                    value={newClient.category}
                    onValueChange={(value) => setNewClient({...newClient, category: value as ClientCategory})}
                  >
                    <SelectTrigger className="bg-cyber-dark/60 border-green-500/30 focus:border-green-500/60">
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent className="bg-cyber-dark border-green-500/30">
                      <SelectItem value="individual">Pessoa Física</SelectItem>
                      <SelectItem value="company">Empresa</SelectItem>
                      <SelectItem value="partner">Parceiro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Valor (R$)</label>
                <Input
                  placeholder="Valor"
                  type="number"
                  className="bg-cyber-dark/60 border-green-500/30 focus:border-green-500/60"
                  value={newClient.value || ''}
                  onChange={(e) => setNewClient({...newClient, value: parseFloat(e.target.value) || 0})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Observações</label>
                <Textarea
                  placeholder="Observações sobre o cliente"
                  className="bg-cyber-dark/60 border-green-500/30 focus:border-green-500/60"
                  value={newClient.notes}
                  onChange={(e) => setNewClient({...newClient, notes: e.target.value})}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                className="border-green-500/30 text-green-500 hover:bg-green-500/10"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleAddClient}
                className="bg-green-500 hover:bg-green-600 text-black"
              >
                Adicionar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Client Dialog */}
        {currentClient && (
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="bg-cyber-dark border-green-500/30 text-white">
              <DialogHeader>
                <DialogTitle>Editar Cliente</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Atualize os dados do cliente.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nome *</label>
                    <Input
                      placeholder="Nome do cliente"
                      className="bg-cyber-dark/60 border-green-500/30 focus:border-green-500/60"
                      value={currentClient.name}
                      onChange={(e) => setCurrentClient({...currentClient, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Empresa</label>
                    <Input
                      placeholder="Nome da empresa"
                      className="bg-cyber-dark/60 border-green-500/30 focus:border-green-500/60"
                      value={currentClient.company || ''}
                      onChange={(e) => setCurrentClient({...currentClient, company: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      placeholder="Email"
                      type="email"
                      className="bg-cyber-dark/60 border-green-500/30 focus:border-green-500/60"
                      value={currentClient.email || ''}
                      onChange={(e) => setCurrentClient({...currentClient, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Telefone</label>
                    <Input
                      placeholder="Telefone"
                      className="bg-cyber-dark/60 border-green-500/30 focus:border-green-500/60"
                      value={currentClient.phone || ''}
                      onChange={(e) => setCurrentClient({...currentClient, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select
                      value={currentClient.status}
                      onValueChange={(value) => setCurrentClient({...currentClient, status: value as ClientStatus})}
                    >
                      <SelectTrigger className="bg-cyber-dark/60 border-green-500/30 focus:border-green-500/60">
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent className="bg-cyber-dark border-green-500/30">
                        <SelectItem value="prospect">Prospecção</SelectItem>
                        <SelectItem value="lead">Lead</SelectItem>
                        <SelectItem value="negotiation">Negociação</SelectItem>
                        <SelectItem value="client">Cliente</SelectItem>
                        <SelectItem value="inactive">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Categoria</label>
                    <Select
                      value={currentClient.category}
                      onValueChange={(value) => setCurrentClient({...currentClient, category: value as ClientCategory})}
                    >
                      <SelectTrigger className="bg-cyber-dark/60 border-green-500/30 focus:border-green-500/60">
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent className="bg-cyber-dark border-green-500/30">
                        <SelectItem value="individual">Pessoa Física</SelectItem>
                        <SelectItem value="company">Empresa</SelectItem>
                        <SelectItem value="partner">Parceiro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Valor (R$)</label>
                  <Input
                    placeholder="Valor"
                    type="number"
                    className="bg-cyber-dark/60 border-green-500/30 focus:border-green-500/60"
                    value={currentClient.value || ''}
                    onChange={(e) => setCurrentClient({...currentClient, value: parseFloat(e.target.value) || 0})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Observações</label>
                  <Textarea
                    placeholder="Observações sobre o cliente"
                    className="bg-cyber-dark/60 border-green-500/30 focus:border-green-500/60"
                    value={currentClient.notes || ''}
                    onChange={(e) => setCurrentClient({...currentClient, notes: e.target.value})}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  className="border-green-500/30 text-green-500 hover:bg-green-500/10"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleUpdateClient}
                  className="bg-green-500 hover:bg-green-600 text-black"
                >
                  Atualizar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Delete Client Dialog */}
        {currentClient && (
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent className="bg-cyber-dark border-red-500/30 text-white">
              <DialogHeader>
                <DialogTitle>Remover Cliente</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Tem certeza que deseja remover este cliente? Esta ação não pode ser desfeita.
                </DialogDescription>
              </DialogHeader>

              <div className="py-4">
                <p className="text-white">
                  Você está prestes a remover o cliente <span className="font-bold">{currentClient.name}</span>.
                </p>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}
                  className="border-green-500/30 text-green-500 hover:bg-green-500/10"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleDeleteClient}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  Remover
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AppLayout>
  );
};

export default ClientBoard;
