import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { useChatStore } from '../store/dataStore';
import { useToast } from '@/components/ui/use-toast';
import { ChatMessage } from '../types';

const formatTime = (date: Date) =>
  new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const ChatCEO = () => {
  const { messages, addMessage } = useChatStore();
  const { toast } = useToast();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; message: ChatMessage | null } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const webhookUrl = 'https://gen.simplebot.online/webhook/b8f10f59-0108-43f1-afce-e782eda6ebe0';

  useEffect(() => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.minHeight = '72px';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu) setContextMenu(null);
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [contextMenu]);

  const sendWebhookMessage = async (text: string) => {
    const userMessage: ChatMessage = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      sender: 'user',
      content: text,
      timestamp: new Date(),
    };
    addMessage(userMessage);
    setIsTyping(true);

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      const output = typeof data === 'string' ? data : data?.output || data?.message || JSON.stringify(data);

      await new Promise((res) => setTimeout(res, 400));

      const botMessage: ChatMessage = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 5)}-bot`,
        sender: 'bot',
        content: output || 'Sem resposta do bot.',
        timestamp: new Date(),
      };

      addMessage(botMessage);
    } catch (error: any) {
      console.error('Erro no webhook:', error);
      toast({
        title: 'Erro ao enviar mensagem',
        description: error.message || 'Erro desconhecido.',
        variant: 'destructive',
      });
      addMessage({
        id: `${Date.now()}-error`,
        sender: 'bot',
        content: 'Desculpe, houve um erro ao processar sua mensagem.',
        timestamp: new Date(),
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const currentInput = input;
    setInput('');
    setLoading(true);
    try {
      await sendWebhookMessage(currentInput);
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

  const handleContextMenu = (event: React.MouseEvent, message: ChatMessage) => {
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY, message });
  };

  const handleCopy = () => {
    if (contextMenu?.message) {
      navigator.clipboard.writeText(contextMenu.message.content);
      toast({ title: 'Mensagem copiada para a área de transferência.' });
    }
    setContextMenu(null);
  };

  const handleDelete = () => {
    toast({ title: 'Função de deletar ainda não implementada.' });
    setContextMenu(null);
  };

  return (
    <div className="flex h-screen bg-black text-white font-mono">
      <aside className="w-64 bg-[#0d0d0d] border-r border-gray-800 p-4 flex flex-col">
        <h2 className="text-[#ff007f] text-lg font-bold mb-4">Menu</h2>
        <ul className="space-y-2 text-sm">
          <li className="hover:text-[#00ffff] cursor-pointer">Início</li>
          <li className="hover:text-[#00ffff] cursor-pointer">Conversas</li>
          <li className="hover:text-[#00ffff] cursor-pointer">Configurações</li>
        </ul>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-[#0d0d0d] border-b border-gray-800 p-4 text-[#ff007f] font-bold text-lg">
          Chat CEO
        </header>

        <main className="flex-1 overflow-y-auto p-4 relative">
          <div className="flex-1 overflow-y-auto space-y-4 px-2 mb-4 animate-fadeIn">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 mt-20 text-lg">
                Olá! Como posso ajudar você hoje?
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  onContextMenu={(e) => handleContextMenu(e, msg)}
                >
                  {msg.content.trim() === '' ? (
                    <div className="border border-red-500 p-2 text-xs">Mensagem vazia</div>
                  ) : (
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 text-sm whitespace-pre-wrap ${
                        msg.sender === 'user'
                          ? 'bg-[#ff007f] text-white rounded-tr-none'
                          : 'bg-[#00ffff] text-black rounded-tl-none'
                      }`}
                    >
                      <div className="flex justify-between text-xs opacity-70 mb-1">
                        <span>{msg.sender === 'user' ? 'Você' : 'CEO'}</span>
                        <span>{formatTime(msg.timestamp)}</span>
                      </div>
                      {msg.content}
                    </div>
                  )}
                </div>
              ))
            )}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#00ffff] text-black text-sm rounded-lg px-4 py-2 animate-pulse">
                  CEO está digitando...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {contextMenu && contextMenu.message && (
            <div
              className="absolute bg-white text-black shadow-xl rounded-md text-sm z-50"
              style={{ top: contextMenu.y, left: contextMenu.x }}
            >
              <button
                className="block w-full px-4 py-2 hover:bg-gray-200"
                onClick={handleCopy}
              >
                Copiar
              </button>
              <button
                className="block w-full px-4 py-2 hover:bg-gray-200"
                onClick={handleDelete}
              >
                Excluir
              </button>
            </div>
          )}
        </main>

        <footer className="flex gap-2 border-t border-gray-700 p-4">
          <textarea
            id="chat-input"
            name="chat-input"
            ref={textareaRef}
            className="flex-1 resize-none bg-gray-800 text-white rounded-lg px-4 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff007f]"
            placeholder="Digite sua mensagem..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={3}
            disabled={loading}
            autoComplete="off"
            aria-label="Digite sua mensagem"
          />

          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-[#ff007f] hover:bg-pink-700 text-white px-4 py-2 rounded-lg text-sm flex items-center disabled:opacity-50"
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
        </footer>
      </div>
    </div>
  );
};

export default ChatCEO;
