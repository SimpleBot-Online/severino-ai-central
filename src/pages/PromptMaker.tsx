
import React, { useState } from 'react';
import AppLayout from '../components/Layout/AppLayout';
import { usePromptsStore } from '../store/dataStore';
import { useSettingsStore } from '../store/dataStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Terminal, 
  Send,
  Save,
  ArrowDown,
  Settings,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const PromptMaker = () => {
  const { prompts, addPrompt } = usePromptsStore();
  const { settings } = useSettingsStore();
  const { toast } = useToast();
  
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [savedPrompt, setSavedPrompt] = useState({
    title: '',
    category: '',
    content: '',
  });

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt vazio",
        description: "Por favor, digite um prompt para gerar conteúdo.",
        variant: "destructive",
      });
      return;
    }

    if (!settings.openaiApiKey) {
      toast({
        title: "API Key não configurada",
        description: "Configure sua API Key da OpenAI nas configurações.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      // For demo purposes, we'll just add some mock response
      // In a real app, this would call the OpenAI API
      setTimeout(() => {
        setResult(
          `Resultado gerado para: "${prompt}"\n\nEste é um exemplo de resposta gerada pela API da OpenAI. Em uma implementação real, esta resposta viria diretamente do modelo escolhido através da API da OpenAI.\n\nO texto seria formatado adequadamente e poderia incluir várias informações relevantes ao prompt fornecido.`
        );
        setIsGenerating(false);
      }, 2000);
    } catch (error) {
      toast({
        title: "Erro na geração",
        description: "Ocorreu um erro ao gerar o conteúdo. Verifique sua API Key.",
        variant: "destructive",
      });
      setIsGenerating(false);
    }
  };

  const handleSavePrompt = () => {
    if (!savedPrompt.title.trim() || !savedPrompt.category.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Título e categoria são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    addPrompt(savedPrompt.title, prompt, savedPrompt.category);
    setSavedPrompt({
      title: '',
      category: '',
      content: '',
    });
    setIsSaveDialogOpen(false);
    
    toast({
      title: "Prompt salvo",
      description: "Seu prompt foi salvo com sucesso.",
    });
  };

  const handleOpenSaveDialog = () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt vazio",
        description: "Não é possível salvar um prompt vazio.",
        variant: "destructive",
      });
      return;
    }
    
    setSavedPrompt({
      title: '',
      category: '',
      content: prompt,
    });
    setIsSaveDialogOpen(true);
  };

  return (
    <AppLayout>
      <div className="animate-fadeIn">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Prompt Maker</h1>
          
          <Button
            variant="outline"
            className="bg-severino-gray border-severino-lightgray mt-4 md:mt-0"
            onClick={() => window.location.href = '/settings'}
          >
            <Settings size={18} className="mr-2" />
            Configurar API Key
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-severino-gray border-severino-lightgray">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Criar Prompt</h2>
                <Button
                  variant="outline"
                  className="bg-severino-lightgray border-severino-lightgray"
                  onClick={handleOpenSaveDialog}
                  disabled={!prompt.trim()}
                >
                  <Save size={16} className="mr-2" />
                  Salvar Prompt
                </Button>
              </div>
              
              <Textarea
                placeholder="Digite seu prompt aqui..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="bg-severino-lightgray border-severino-lightgray min-h-[200px] md:min-h-[300px] font-mono"
              />
              
              <Button
                onClick={handleGenerate}
                className="w-full bg-severino-pink hover:bg-severino-pink/90"
                disabled={isGenerating || !prompt.trim() || !settings.openaiApiKey}
              >
                {isGenerating ? (
                  <div className="flex items-center">
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Gerando...
                  </div>
                ) : (
                  <>
                    <Sparkles size={16} className="mr-2" />
                    Gerar com OpenAI
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-severino-gray border-severino-lightgray">
            <CardContent className="p-5 space-y-4">
              <h2 className="text-lg font-medium">Resultado</h2>
              
              {result ? (
                <div className="bg-severino-lightgray p-4 rounded-md min-h-[200px] md:min-h-[300px] whitespace-pre-wrap font-mono text-sm overflow-auto">
                  {result}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 bg-severino-lightgray rounded-md min-h-[200px] md:min-h-[300px]">
                  <Terminal size={40} className="text-gray-500 mb-4" />
                  <p className="text-center text-gray-400">
                    O resultado da sua geração aparecerá aqui.
                  </p>
                  <ArrowDown size={24} className="text-gray-500 mt-4" />
                </div>
              )}
              
              {result && (
                <Button
                  variant="outline"
                  className="w-full bg-severino-lightgray border-severino-lightgray"
                  onClick={() => {
                    navigator.clipboard.writeText(result);
                    toast({
                      title: "Copiado!",
                      description: "O resultado foi copiado para a área de transferência.",
                    });
                  }}
                >
                  Copiar Resultado
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Saved Prompts */}
        <div className="mt-6">
          <h2 className="text-lg font-medium mb-4">Prompts Salvos</h2>
          
          {prompts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {prompts.map((savedPrompt) => (
                <Card key={savedPrompt.id} className="bg-severino-gray border-severino-lightgray hover:border-severino-pink/50 transition-colors">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{savedPrompt.title}</h3>
                      <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full">
                        {savedPrompt.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mb-3 line-clamp-3">
                      {savedPrompt.content}
                    </p>
                    <Button
                      variant="outline"
                      className="w-full bg-severino-lightgray border-severino-lightgray"
                      onClick={() => {
                        setPrompt(savedPrompt.content);
                        toast({
                          title: "Prompt carregado",
                          description: "O prompt foi carregado no editor.",
                        });
                      }}
                    >
                      <Send size={16} className="mr-2" />
                      Usar Prompt
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-severino-gray border-severino-lightgray">
              <CardContent className="p-5 flex flex-col items-center justify-center py-12">
                <Terminal size={40} className="text-gray-500 mb-4" />
                <p className="text-center text-gray-400 mb-4">
                  Você ainda não tem prompts salvos.
                </p>
                <Button
                  onClick={handleOpenSaveDialog}
                  className="bg-severino-pink hover:bg-severino-pink/90"
                  disabled={!prompt.trim()}
                >
                  <Save size={16} className="mr-2" />
                  Salvar Prompt Atual
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Save Prompt Dialog */}
      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent className="bg-severino-gray border-severino-lightgray sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Salvar Prompt</DialogTitle>
            <DialogDescription>
              Adicione um título e categoria para seu prompt.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Título</label>
              <Input
                placeholder="Título do prompt"
                value={savedPrompt.title}
                onChange={(e) => setSavedPrompt({ ...savedPrompt, title: e.target.value })}
                className="bg-severino-lightgray border-severino-lightgray"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Categoria</label>
              <Input
                placeholder="Ex: Copywriting, SEO, Análise"
                value={savedPrompt.category}
                onChange={(e) => setSavedPrompt({ ...savedPrompt, category: e.target.value })}
                className="bg-severino-lightgray border-severino-lightgray"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Preview do Prompt</label>
              <div className="bg-severino-lightgray p-3 rounded-md text-sm max-h-[150px] overflow-auto">
                <p className="whitespace-pre-wrap font-mono">{prompt}</p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              onClick={() => setIsSaveDialogOpen(false)} 
              variant="outline"
              className="bg-severino-lightgray text-white border-severino-lightgray hover:bg-severino-lightgray/80"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSavePrompt} 
              className="bg-severino-pink hover:bg-severino-pink/90"
            >
              <Save size={16} className="mr-2" />
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default PromptMaker;
