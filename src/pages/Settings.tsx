
import React, { useEffect } from 'react';
import AppLayout from '../components/Layout/AppLayout';
import { useSettingsStore } from '../store/dataStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Settings as SettingsIcon, 
  Save, 
  Key, 
  Webhook, 
  Globe, 
  User, 
  Eye, 
  EyeOff,
  Sun,
  Moon
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useTheme } from '@/hooks/use-theme';
import { Switch } from '@/components/ui/switch';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const Settings = () => {
  const { settings, updateSettings } = useSettingsStore();
  const { theme, setTheme } = useTheme();
  const [formState, setFormState] = React.useState({
    openaiApiKey: settings.openaiApiKey || '',
    webhookUrl: settings.webhookUrl || 'https://gen.simplebot.online/webhook/a1b8ac76-841d-4412-911a-7f22ff0d73ff/chat',
    evolutionApiKey: settings.evolutionApiKey || '',
    theme: settings.theme || 'dark',
    language: settings.language || 'pt',
  });
  const [showOpenAIKey, setShowOpenAIKey] = React.useState(false);
  const [showEvolutionKey, setShowEvolutionKey] = React.useState(false);
  const { toast } = useToast();

  // Sync theme state with settings
  useEffect(() => {
    setFormState(prev => ({
      ...prev,
      theme: theme
    }));
  }, [theme]);

  const handleChange = (field: string, value: string) => {
    setFormState({
      ...formState,
      [field]: value,
    });
  };

  const handleToggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    setFormState({
      ...formState,
      theme: newTheme,
    });
  };

  const handleSave = () => {
    updateSettings(formState);
    
    toast({
      title: "Configurações salvas",
      description: "Suas configurações foram atualizadas com sucesso.",
    });
  };

  return (
    <AppLayout>
      <div className="animate-fadeIn">
        <div className="flex items-center mb-6">
          <h1 className="text-2xl font-bold">Configurações</h1>
        </div>

        <Tabs defaultValue="api" className="space-y-6">
          <TabsList className="bg-severino-gray border-severino-lightgray">
            <TabsTrigger value="api" className="data-[state=active]:bg-severino-pink">
              Chaves de API
            </TabsTrigger>
            <TabsTrigger value="integrations" className="data-[state=active]:bg-severino-pink">
              Integrações
            </TabsTrigger>
            <TabsTrigger value="general" className="data-[state=active]:bg-severino-pink">
              Geral
            </TabsTrigger>
          </TabsList>

          {/* API Keys Tab */}
          <TabsContent value="api">
            <div className="grid grid-cols-1 gap-6">
              <Card className="bg-severino-gray border-severino-lightgray">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Key size={18} className="mr-2 text-severino-pink" />
                    API Keys
                  </CardTitle>
                  <CardDescription>
                    Configure suas chaves de API para utilizar os serviços externos.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">OpenAI API Key</label>
                    <div className="flex">
                      <div className="relative flex-1">
                        <Input
                          type={showOpenAIKey ? "text" : "password"}
                          placeholder="sk-..."
                          value={formState.openaiApiKey}
                          onChange={(e) => handleChange('openaiApiKey', e.target.value)}
                          className="bg-severino-lightgray border-severino-lightgray pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowOpenAIKey(!showOpenAIKey)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          {showOpenAIKey ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">
                      Necessária para o funcionamento do Prompt Maker.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Evolution API Key</label>
                    <div className="flex">
                      <div className="relative flex-1">
                        <Input
                          type={showEvolutionKey ? "text" : "password"}
                          placeholder="sua-chave-evolution-api"
                          value={formState.evolutionApiKey}
                          onChange={(e) => handleChange('evolutionApiKey', e.target.value)}
                          className="bg-severino-lightgray border-severino-lightgray pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowEvolutionKey(!showEvolutionKey)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          {showEvolutionKey ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">
                      Necessária para o aquecimento de chips.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations">
            <div className="grid grid-cols-1 gap-6">
              <Card className="bg-severino-gray border-severino-lightgray">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Webhook size={18} className="mr-2 text-severino-pink" />
                    Webhooks
                  </CardTitle>
                  <CardDescription>
                    Configure webhooks para integrações externas.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">URL do Webhook (ChatCEO)</label>
                    <Input
                      placeholder="https://seu-webhook-url.com"
                      value={formState.webhookUrl}
                      onChange={(e) => handleChange('webhookUrl', e.target.value)}
                      className="bg-severino-lightgray border-severino-lightgray"
                    />
                    <p className="text-xs text-gray-400">
                      URL do webhook para o Chat CEO. Configuração necessária para envio de mensagens.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* General Tab */}
          <TabsContent value="general">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-severino-gray border-severino-lightgray">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe size={18} className="mr-2 text-severino-pink" />
                    Preferências de Idioma
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="lang-pt"
                        name="language"
                        value="pt"
                        checked={formState.language === 'pt'}
                        onChange={() => handleChange('language', 'pt')}
                        className="h-4 w-4 accent-severino-pink"
                      />
                      <label htmlFor="lang-pt">Português</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="lang-en"
                        name="language"
                        value="en"
                        checked={formState.language === 'en'}
                        onChange={() => handleChange('language', 'en')}
                        className="h-4 w-4 accent-severino-pink"
                      />
                      <label htmlFor="lang-en">English</label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-severino-gray border-severino-lightgray">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User size={18} className="mr-2 text-severino-pink" />
                    Modo de Exibição
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {theme === 'dark' ? (
                        <Moon size={20} className="text-severino-pink" />
                      ) : (
                        <Sun size={20} className="text-severino-pink" />
                      )}
                      <span>{theme === 'dark' ? 'Modo Escuro' : 'Modo Claro'}</span>
                    </div>
                    <Switch
                      checked={theme === 'light'}
                      onCheckedChange={handleToggleTheme}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-6">
          <Button 
            onClick={handleSave} 
            className="bg-severino-pink hover:bg-severino-pink/90"
          >
            <Save size={16} className="mr-2" />
            Salvar Configurações
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;
