import React from 'react';
import AppLayout from '../components/Layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SimpleBot = () => {
  const handleOpenSimpleBot = () => {
    window.open('https://gen.simplebot.online/', '_blank', 'noopener,noreferrer');
  };

  return (
    <AppLayout>
      <div className="animate-fadeIn">
        <div className="flex items-center mb-6">
          <Bot className="mr-2 text-green-500" size={24} />
          <h1 className="text-2xl font-bold">SimpleBot</h1>
        </div>
        
        <Card className="bg-cyber-dark/80 border border-green-500/30 hover:border-green-500/50 transition-all duration-300">
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bot className="text-green-500 mb-4" size={64} />
              <h2 className="text-xl font-bold mb-4">SimpleBot Generator</h2>
              <p className="text-gray-400 mb-6 max-w-2xl">
                O SimpleBot não pode ser incorporado diretamente nesta página devido a restrições de segurança (X-Frame-Options: sameorigin).
                Para usar o SimpleBot, clique no botão abaixo para abri-lo em uma nova aba.
              </p>
              
              <Button 
                onClick={handleOpenSimpleBot} 
                className="bg-green-500 hover:bg-green-600 text-black px-6 py-3 text-lg"
              >
                <ExternalLink size={20} className="mr-2" />
                Abrir SimpleBot em Nova Aba
              </Button>
              
              <div className="mt-8 text-left bg-black/30 p-4 rounded-md border border-green-500/20 max-w-2xl">
                <h3 className="text-green-500 font-bold mb-2">Por que isso acontece?</h3>
                <p className="text-gray-400 text-sm mb-2">
                  O site do SimpleBot (gen.simplebot.online) está configurado com a proteção <code>X-Frame-Options: sameorigin</code>, 
                  que impede que ele seja incorporado em iframes em outros domínios.
                </p>
                <p className="text-gray-400 text-sm">
                  Esta é uma medida de segurança comum para prevenir ataques de clickjacking. Para usar o SimpleBot, 
                  você precisará acessá-lo diretamente em seu próprio domínio.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default SimpleBot;
