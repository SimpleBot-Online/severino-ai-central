import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageSquare, X, Send, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSettingsStore } from '@/store/dataStore';
import { showError } from '@/services/notificationService';

interface Message {
  id: number;
  content: string;
  isUser: boolean;
}

const FloatingChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { settings } = useSettingsStore();
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Focus input when chat is opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, isMinimized]);

  // Add welcome message when chat is first opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: Date.now(),
          content: 'Olá! Como posso ajudar você hoje?',
          isUser: false
        }
      ]);
    }
  }, [isOpen, messages.length]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (isMinimized) {
      setIsMinimized(false);
    }
  };

  const toggleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimized(!isMinimized);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Check if OpenAI API key is configured
    if (!settings?.openaiApiKey) {
      showError(
        'API Key não configurada',
        'Configure sua chave da API OpenAI nas configurações para usar o chat.'
      );
      return;
    }

    const userMessage = {
      id: Date.now(),
      content: inputValue,
      isUser: true
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Use OpenAI API to get response
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${settings?.openaiApiKey || ''}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'Você é um assistente útil e amigável que ajuda com suporte técnico e brainstorming. Seja conciso e direto nas respostas.'
            },
            ...messages.map(msg => ({
              role: msg.isUser ? 'user' as const : 'assistant' as const,
              content: msg.content
            })),
            { role: 'user', content: inputValue }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Erro ao obter resposta');
      }

      const data = await response.json();
      const botResponse = {
        id: Date.now() + 1,
        content: data.choices[0].message.content,
        isUser: false
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error getting response:', error);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.',
          isUser: false
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 text-black shadow-lg z-50 flex items-center justify-center"
        aria-label="Open chat"
      >
        <MessageSquare size={20} />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col w-80 sm:w-96 rounded-lg shadow-lg border border-green-500/50 bg-cyber-dark/90 backdrop-blur-sm overflow-hidden">
      {/* Chat header */}
      <div className="flex items-center justify-between p-3 border-b border-green-500/30 bg-cyber-dark">
        <div className="flex items-center">
          <MessageSquare size={18} className="text-green-500 mr-2" />
          <span className="font-medium text-green-500">Assistente</span>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-green-500 hover:bg-green-500/10"
            onClick={toggleMinimize}
          >
            {isMinimized ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-green-500 hover:bg-green-500/10"
            onClick={toggleChat}
          >
            <X size={16} />
          </Button>
        </div>
      </div>

      {/* Chat messages */}
      {!isMinimized && (
        <>
          <div className="flex-1 p-3 overflow-y-auto max-h-80 space-y-3">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 ${
                    message.isUser
                      ? 'bg-green-500/20 text-white border border-green-500/30'
                      : 'bg-cyber-dark/80 text-white border border-green-500/30'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg px-3 py-2 bg-cyber-dark/80 text-white border border-green-500/30">
                  <div className="flex items-center space-x-2">
                    <Loader2 size={16} className="animate-spin text-green-500" />
                    <span>Digitando...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat input */}
          <div className="p-3 border-t border-green-500/30 bg-cyber-dark/80">
            <div className="flex items-center space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                placeholder="Digite sua mensagem..."
                className="flex-1 bg-cyber-dark/80 border border-green-500/30 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500/50 text-white"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="bg-green-500 hover:bg-green-600 text-black rounded-md p-2 h-9 w-9 flex items-center justify-center"
              >
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export { FloatingChat };
export default FloatingChat;
