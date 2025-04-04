
import React, { useState, useRef, useEffect } from 'react';
import AppLayout from '../components/Layout/AppLayout';
import { useChatStore } from '../store/dataStore';
import { useSettingsStore } from '../store/dataStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MessageSquare, 
  Send, 
  Settings,
  User,
  Bot
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { ChatMessage } from '../types';

const ChatCEO = () => {
  const { messages, addMessage, sendWebhookMessage } = useChatStore();
  const { settings } = useSettingsStore();
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;
    
    if (!settings.webhookUrl) {
      toast({
        title: "Webhook não configurado",
        description: "Configure a URL do webhook nas configurações.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await sendWebhookMessage(inputMessage, settings.webhookUrl);
      setInputMessage('');
    } catch (error) {
      toast({
        title: "Erro ao enviar mensagem",
        description: "Não foi possível enviar sua mensagem. Verifique a URL do webhook.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-12rem)] animate-fadeIn">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Chat CEO</h1>
          
          <Button
            variant="outline"
            className="bg-severino-gray border-severino-lightgray"
            onClick={() => window.location.href = '/settings'}
          >
            <Settings size={18} className="mr-2" />
            Configurar Webhook
          </Button>
        </div>

        <Card className="flex-1 bg-severino-gray border-severino-lightgray overflow-hidden flex flex-col">
          <CardContent className="flex-1 p-0 flex flex-col">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <MessageSquare size={48} className="mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Nenhuma mensagem ainda</p>
                <p className="text-sm text-center max-w-md">
                  Este é o seu canal direto de comunicação com o CEO. 
                  Envie uma mensagem para iniciar a conversa.
                </p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message: ChatMessage) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] md:max-w-[70%] rounded-lg px-4 py-3 ${
                        message.sender === 'user'
                          ? 'bg-severino-pink text-white rounded-tr-none'
                          : 'bg-severino-lightgray text-white rounded-tl-none'
                      }`}
                    >
                      <div className="flex items-center mb-1">
                        {message.sender === 'user' ? (
                          <>
                            <span className="font-medium">Você</span>
                            <User size={14} className="ml-1" />
                          </>
                        ) : (
                          <>
                            <span className="font-medium">CEO</span>
                            <Bot size={14} className="ml-1" />
                          </>
                        )}
                        <span className="text-xs opacity-70 ml-2">
                          {formatTimestamp(message.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}

            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-severino-lightgray bg-severino-gray flex gap-2"
            >
              <Input
                placeholder="Digite sua mensagem..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="bg-severino-lightgray border-severino-lightgray"
                disabled={isLoading || !settings.webhookUrl}
              />
              <Button
                type="submit"
                className="bg-severino-pink hover:bg-severino-pink/90"
                disabled={isLoading || !inputMessage.trim() || !settings.webhookUrl}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Enviando
                  </div>
                ) : (
                  <>
                    <Send size={18} className="mr-2" /> Enviar
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ChatCEO;
