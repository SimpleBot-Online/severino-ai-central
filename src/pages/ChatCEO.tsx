import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { useChatStore } from '../store/dataStore';
import { useSettingsStore } from '../store/dataStore';
import { useToast } from '@/components/ui/use-toast';
import { ChatMessage } from '../types';

const ChatCEO = () => {
  const { messages, addMessage, sendWebhookMessage } = useChatStore();
  const { settings } = useSettingsStore();
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [inputMessage]);

  const handleSendMessage = async () => {
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
        description: "Verifique a URL do webhook.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white p-4 animate-fadeIn">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 px-2 transition-opacity duration-500 ease-out opacity-0 animate-fadeIn">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-20">
            <p className="text-lg">Olá! Como posso ajudar você hoje?</p>
          </div>
        ) : (
          messages.map((message: ChatMessage) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 text-sm whitespace-pre-wrap ${
                  message.sender === 'user'
                    ? 'bg-pink-600 text-white rounded-tr-none'
                    : 'bg-gray-700 text-white rounded-tl-none'
                }`}
              >
                <div className="flex justify-between items-center mb-1 text-xs opacity-70">
                  <span>{message.sender === 'user' ? 'Você' : 'CEO'}</span>
                  <span>{formatTimestamp(message.timestamp)}</span>
                </div>
                {message.content}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2 border-t border-gray-700 pt-4">
        <textarea
          ref={textareaRef}
          className="flex-1 resize-none bg-gray-800 text-white rounded-lg px-4 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-600"
          placeholder="Digite sua mensagem..."
          value={inputMessage}
          rows={1}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={isLoading || !settings.webhookUrl}
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading || !inputMessage.trim() || !settings.webhookUrl}
          className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg text-sm flex items-center disabled:opacity-50"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
              Enviando
            </div>
          ) : (
            <>
              <Send size={16} className="mr-1" />
              Enviar
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatCEO;
