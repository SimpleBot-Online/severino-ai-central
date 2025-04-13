import React, { useState } from 'react';
import { useSettingsStore } from '@/store/dataStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Key } from 'lucide-react';

const SetApiKey: React.FC = () => {
  const { settings, updateSettings } = useSettingsStore();
  const [apiKey, setApiKey] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    if (apiKey.trim()) {
      updateSettings({ openaiApiKey: apiKey.trim() });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  return (
    <div className="fixed bottom-20 right-6 z-50 bg-black/90 border border-green-500 p-4 rounded-lg shadow-lg w-80">
      <div className="flex items-center mb-2">
        <Key className="text-green-500 mr-2" size={16} />
        <h3 className="text-green-500 font-medium">Configurar API Key</h3>
      </div>
      
      <p className="text-white/70 text-xs mb-3">
        O chat flutuante requer uma chave da API OpenAI para funcionar.
      </p>
      
      <div className="space-y-2">
        <Input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="sk-..."
          className="bg-black border-green-500/30 text-white"
        />
        
        <div className="flex justify-between items-center">
          <div className="text-xs">
            {showSuccess && (
              <span className="text-green-500">✓ Chave salva com sucesso!</span>
            )}
          </div>
          
          <Button 
            onClick={handleSave}
            className="bg-green-500 hover:bg-green-600 text-black"
            size="sm"
          >
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SetApiKey;
