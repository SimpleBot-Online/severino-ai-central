import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { useChatStore } from '../store/dataStore';
import { useToast } from '@/components/ui/use-toast';
import { ChatMessage } from '../types';

const ChatCEO = () => {
  const { messages, addMessage } = useChatStore();
  const { toast } = useToast();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const webhookUrl = 'https://gen.simplebot.online/webhook/b8f10f59-0108-43f1-afce-e782eda6ebe0';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const sendWebhookMessage = async (text: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: text,
      timestamp: new Date(),
    };
    addMessage(userMessage);

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text }),
    });

    const data = await response.json();

    const botMessage: ChatMessage = {
      id: Date.now().toString() + '-bot',
      sender: 'bot',
      content: data.output || 'Sem resposta do bot.',
      timestamp: new Date(),
    };

    addMessage(botMessage);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    setLoading(true);

    try {
      await sendWebhookMessage(input);
      setInput('');
    } catch (err) {
      toast({
        title: 'Erro ao enviar mensagem',
        description: 'Ocorreu um problema com o servidor do webhook.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) =>
    new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white p-4">
      <div className="flex-1 overflow-y-auto space-y-4 px-2 mb-4 animate-fadeIn">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-20 text-lg">
            Olá! Como posso ajudar você hoje?
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 text-sm whitespace-pre-wrap ${
                  msg.sender === 'user'
                    ? 'bg-pink-600 text-white rounded-tr-none'
                    : 'bg-gray-700 text-white rounded-tl-none'
                }`}
              >
                <div className="flex justify-between text-xs opacity-70 mb-1">
                  <span>{msg.sender === 'user' ? 'Você' : 'CEO'}</span>
                  <span>{formatTime(msg.timestamp)}</span>
                </div>
                {msg.content}
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
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={loading}
        />

        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg text-sm flex items-center disabled:opacity-50"
        >
          {loading ? (
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
