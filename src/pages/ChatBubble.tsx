
import React, { useState, useRef, useEffect } from 'react';
import AppLayout from '../components/Layout/AppLayout';
import { useSettingsStore } from '../store/dataStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send, Bot, User, Clock, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

const ChatBubble = () => {
  const { settings } = useSettingsStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    if (!settings.openaiApiKey) {
      toast({
        title: "API Key não configurada",
        description: "Configure sua OpenAI API Key nas configurações.",
        variant: "destructive",
      });
      return;
    }
    
    if (!settings.assistantId) {
      toast({
        title: "Assistante ID não configurado",
        description: "Configure o ID do assistente nas configurações.",
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${settings.openaiApiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are an AI assistant with ID ${settings.assistantId}. Respond helpfully to the user's queries.`
            },
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            { role: 'user', content: input }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      const assistantResponse: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.choices[0].message.content,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantResponse]);
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      toast({
        title: "Erro na API",
        description: "Houve um erro ao processar sua mensagem. Verifique suas configurações e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <AppLayout>
      <div className="animate-fadeIn h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Chat Bubble</h1>
          <Button 
            variant="outline"
            onClick={clearChat}
            className="flex items-center gap-2"
          >
            <X size={16} />
            Limpar Chat
          </Button>
        </div>

        <Card className="flex-1 flex flex-col overflow-hidden bg-severino-gray border-severino-lightgray">
          <CardContent className="flex flex-col p-0 h-full">
            <div className="bg-severino-lightgray p-4 flex items-center gap-2 border-b border-severino-lightgray">
              <MessageCircle className="text-severino-pink" size={20} />
              <span className="font-medium">
                Chat com Assistente ID: {settings.assistantId ? settings.assistantId : "Não configurado"}
              </span>
            </div>
            
            <ScrollArea className="flex-1 p-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <MessageCircle size={40} className="mb-2 opacity-50" />
                  <p>Envie uma mensagem para iniciar a conversa</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div 
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`
                          max-w-[80%] rounded-lg p-3
                          ${message.role === 'user' 
                            ? 'bg-severino-pink text-white' 
                            : 'bg-severino-lightgray text-foreground'}
                        `}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {message.role === 'user' ? (
                            <User size={14} />
                          ) : (
                            <Bot size={14} />
                          )}
                          <span className="text-xs font-medium">
                            {message.role === 'user' ? 'Você' : 'Assistente'}
                          </span>
                          <span className="text-xs opacity-70 ml-auto flex items-center">
                            <Clock size={12} className="mr-1" />
                            {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>
            
            <form 
              onSubmit={handleSubmit}
              className="p-4 border-t border-severino-lightgray"
            >
              <div className="flex gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="min-h-[50px] resize-none bg-severino-lightgray border-severino-lightgray"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <Button 
                  type="submit" 
                  className="bg-severino-pink hover:bg-severino-pink/90"
                  disabled={loading || !input.trim()}
                >
                  {loading ? (
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <Send size={18} />
                  )}
                </Button>
              </div>
              
              {(!settings.openaiApiKey || !settings.assistantId) && (
                <div className="mt-2 text-xs text-amber-400 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                  Configure sua OpenAI API Key e ID do Assistente nas configurações
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ChatBubble;
