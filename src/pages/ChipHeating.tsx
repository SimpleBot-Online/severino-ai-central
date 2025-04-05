
import React, { useState } from 'react';
import AppLayout from '../components/Layout/AppLayout';
import { useChipInstancesStore } from '../store/dataStore';
import { useSettingsStore } from '../store/dataStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Cpu, 
  Trash2, 
  Zap,
  Settings,
  Timer
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from '@/components/ui/use-toast';
import { ChipInstance } from '../types';

const ChipHeating = () => {
  const { instances, addInstance, updateInstance, deleteInstance, heatChip } = useChipInstancesStore();
  const { settings } = useSettingsStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentInstance, setCurrentInstance] = useState<ChipInstance | null>(null);
  const [newInstance, setNewInstance] = useState({
    name: '',
    phone: '',
  });
  const { toast } = useToast();

  const filteredInstances = instances
    .filter(instance => 
      instance.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      instance.phone.includes(searchTerm)
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleAddInstance = () => {
    if (!newInstance.name.trim() || !newInstance.phone.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome da instância e telefone são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    // Basic phone validation
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(newInstance.phone)) {
      toast({
        title: "Telefone inválido",
        description: "Por favor, insira um número de telefone válido (10-15 dígitos).",
        variant: "destructive",
      });
      return;
    }

    addInstance(newInstance.name, newInstance.phone);
    setNewInstance({
      name: '',
      phone: '',
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Instância adicionada",
      description: "Sua instância foi adicionada com sucesso.",
    });
  };

  const handleDeleteInstance = () => {
    if (currentInstance) {
      deleteInstance(currentInstance.id);
      setCurrentInstance(null);
      setIsDeleteDialogOpen(false);
      
      toast({
        title: "Instância excluída",
        description: "Sua instância foi excluída com sucesso.",
      });
    }
  };

  const handleHeatChip = async (id: string) => {
    if (!settings.evolutionApiKey) {
      toast({
        title: "API Key não configurada",
        description: "Configure sua API Key da Evolution API nas configurações.",
        variant: "destructive",
      });
      return;
    }

    try {
      await heatChip(id, settings.evolutionApiKey);
      
      toast({
        title: "Chip aquecido",
        description: "O processo de aquecimento foi concluído com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro no aquecimento",
        description: "Ocorreu um erro ao aquecer o chip. Verifique sua API Key.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: ChipInstance['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400';
      case 'heating':
        return 'bg-orange-500/20 text-orange-400';
      case 'inactive':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusLabel = (status: ChipInstance['status']) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'heating':
        return 'Aquecendo';
      case 'inactive':
        return 'Inativo';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <AppLayout>
      <div className="animate-fadeIn">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Aquecimento de Chips</h1>
          
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto mt-4 md:mt-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Buscar chips..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-severino-gray border-severino-lightgray"
              />
            </div>
            
            <Button 
              variant="outline"
              className="bg-severino-gray border-severino-lightgray"
              onClick={() => window.location.href = '/settings'}
            >
              <Settings size={18} className="mr-2" />
              API Key
            </Button>
            
            <Button 
              onClick={() => setIsAddDialogOpen(true)} 
              className="bg-severino-pink hover:bg-severino-pink/90"
            >
              <Plus size={18} className="mr-2" />
              Nova Instância
            </Button>
          </div>
        </div>

        {filteredInstances.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredInstances.map((instance) => (
              <Card key={instance.id} className="bg-severino-gray border-severino-lightgray hover:border-severino-pink/50 transition-colors">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(instance.status)} inline-flex items-center`}>
                        {instance.status === 'heating' && <Timer size={12} className="mr-1 animate-pulse" />}
                        {getStatusLabel(instance.status)}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setCurrentInstance(instance);
                        setIsDeleteDialogOpen(true);
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-400 rounded-full hover:bg-severino-lightgray"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <h3 className="font-bold text-lg mb-2">{instance.name}</h3>
                  
                  <div className="flex items-center text-sm text-gray-300 mb-4">
                    <span>Telefone: {instance.phone}</span>
                  </div>
                  
                  <Button 
                    onClick={() => handleHeatChip(instance.id)} 
                    className="w-full bg-severino-pink hover:bg-severino-pink/90"
                    disabled={instance.status === 'heating' || instance.status === 'active' || !settings.evolutionApiKey}
                  >
                    {instance.status === 'heating' ? (
                      <div className="flex items-center">
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                        Aquecendo...
                      </div>
                    ) : instance.status === 'active' ? (
                      <>
                        <Cpu size={16} className="mr-2" />
                        Chip já Ativo
                      </>
                    ) : (
                      <>
                        <Zap size={16} className="mr-2" />
                        Aquecer Chip
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 bg-severino-gray rounded-lg">
            <Cpu size={48} className="text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhuma instância encontrada</h3>
            <p className="text-gray-400 text-center mb-4">
              {searchTerm 
                ? 'Nenhuma instância corresponde à sua busca.' 
                : 'Você ainda não tem nenhuma instância registrada.'}
            </p>
            <Button 
              onClick={() => setIsAddDialogOpen(true)} 
              className="bg-severino-pink hover:bg-severino-pink/90"
            >
              <Plus size={18} className="mr-2" />
              Adicionar Instância
            </Button>
          </div>
        )}
      </div>

      {/* Add Instance Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-severino-gray border-severino-lightgray sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Instância</DialogTitle>
            <DialogDescription>
              Adicione uma nova instância para aquecimento de chip.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome da Instância</label>
              <Input
                placeholder="Ex: Instância Principal, Bot Atendimento"
                value={newInstance.name}
                onChange={(e) => setNewInstance({ ...newInstance, name: e.target.value })}
                className="bg-severino-lightgray border-severino-lightgray"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Telefone</label>
              <Input
                placeholder="Ex: +5511999999999"
                value={newInstance.phone}
                onChange={(e) => setNewInstance({ ...newInstance, phone: e.target.value })}
                className="bg-severino-lightgray border-severino-lightgray"
              />
              <p className="text-xs text-gray-400">
                Formato: código do país + DDD + número (sem espaços ou caracteres especiais)
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              onClick={() => setIsAddDialogOpen(false)} 
              variant="outline"
              className="bg-severino-lightgray text-white border-severino-lightgray hover:bg-severino-lightgray/80"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleAddInstance} 
              className="bg-severino-pink hover:bg-severino-pink/90"
            >
              <Plus size={16} className="mr-2" />
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Instance Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-severino-gray border-severino-lightgray sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Excluir Instância</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta instância? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          
          {currentInstance && (
            <div className="py-4">
              <div className="p-3 bg-severino-lightgray rounded-lg">
                <div className="flex items-center mb-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(currentInstance.status)}`}>
                    {getStatusLabel(currentInstance.status)}
                  </span>
                </div>
                <h3 className="font-medium">{currentInstance.name}</h3>
                <p className="text-sm text-gray-400 mt-1">Telefone: {currentInstance.phone}</p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              onClick={() => setIsDeleteDialogOpen(false)} 
              variant="outline"
              className="bg-severino-lightgray text-white border-severino-lightgray hover:bg-severino-lightgray/80"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleDeleteInstance} 
              variant="destructive"
            >
              <Trash2 size={16} className="mr-2" />
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default ChipHeating;
