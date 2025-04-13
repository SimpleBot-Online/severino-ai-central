import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  MessageSquare,
  X,
  Send,
  Loader2,
  Minimize,
  Maximize,
  Terminal,
  Command,
  HelpCircle,
  Keyboard,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { sendChatMessage } from '@/services/openaiService';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isCommand?: boolean;
}

const FloatingChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Focus input when chat is opened
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  // Initialize with system message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'system-welcome',
          role: 'system',
          content: 'Terminal iniciado. Digite /help para ver os comandos disponíveis.',
          timestamp: new Date()
        }
      ]);
    }
  }, [messages.length]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (isMinimized) setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const toggleHelp = () => {
    setShowHelp(!showHelp);
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle shortcuts when chat is open
      if (!isOpen) return;

      // Ctrl+/ to toggle help
      if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        toggleHelp();
      }

      // Escape to close chat or help
      if (e.key === 'Escape') {
        if (showHelp) {
          setShowHelp(false);
        } else if (!isMinimized) {
          setIsMinimized(true);
        } else {
          setIsOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isMinimized, showHelp]);

  // Process commands
  const processCommand = useCallback((command: string) => {
    const cmd = command.toLowerCase().trim();

    switch(cmd) {
      case '/help':
        return {
          id: `system-${Date.now()}`,
          role: 'system',
          content: `Comandos disponíveis:
/help - Mostra esta ajuda
/clear - Limpa o histórico de mensagens
/status - Mostra o status da conexão
/version - Mostra a versão do sistema

Atalhos de teclado:
Ctrl+/ - Mostra/esconde ajuda
Esc - Minimiza ou fecha o chat`,
          timestamp: new Date(),
          isCommand: true
        };

      case '/clear':
        setMessages([{
          id: 'system-clear',
          role: 'system',
          content: 'Terminal limpo.',
          timestamp: new Date()
        }]);
        return null;

      case '/status':
        return {
          id: `system-${Date.now()}`,
          role: 'system',
          content: `Status do sistema:
Conexão: Ativa
API: OpenAI v2
Modo: Assistente técnico
Latência: ~300ms`,
          timestamp: new Date(),
          isCommand: true
        };

      case '/version':
        return {
          id: `system-${Date.now()}`,
          role: 'system',
          content: 'Severino IA Central v1.0.2',
          timestamp: new Date(),
          isCommand: true
        };

      default:
        if (cmd.startsWith('/')) {
          return {
            id: `system-${Date.now()}`,
            role: 'system',
            content: `Comando não reconhecido: ${command}\nDigite /help para ver os comandos disponíveis.`,
            timestamp: new Date(),
            isCommand: true
          };
        }
        return null;
    }
  }, []);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!input.trim()) return;

    const trimmedInput = input.trim();
    setInput('');

    // Check if it's a command
    if (trimmedInput.startsWith('/')) {
      // Add user command to messages
      const userCommand: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: trimmedInput,
        timestamp: new Date(),
        isCommand: true
      };

      setMessages(prev => [...prev, userCommand]);

      // Process command
      const commandResponse = processCommand(trimmedInput);
      if (commandResponse) {
        setMessages(prev => [...prev, commandResponse]);
      }

      return;
    }

    // Regular message flow
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmedInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Call the OpenAI service
      const chatMessages = [
        ...messages
          .filter(msg => !msg.isCommand && msg.role !== 'system')
          .map(msg => ({ role: msg.role, content: msg.content })),
        { role: 'user' as const, content: trimmedInput }
      ];

      const response = await sendChatMessage(chatMessages);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);

    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);

      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'system',
        content: 'Erro: Falha na comunicação com a API. Verifique sua conexão e tente novamente.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Button */}
      <Button
        onClick={toggleChat}
        className="rounded-none h-14 w-14 shadow-lg bg-black border border-green-500 hover:bg-black/80 transition-all duration-300 terminal-effect"
        aria-label="Chat com IA"
      >
        <Terminal className="h-6 w-6 text-green-500" />
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <div
          ref={chatContainerRef}
          className={cn(
            "absolute bottom-16 right-0 w-80 md:w-96 shadow-xl transition-all duration-300 ease-in-out",
            "bg-black border border-green-500/50 terminal-effect",
            isMinimized ? "h-10" : "h-[500px]"
          )}
        >
          {/* Terminal Header */}
          <div className="terminal-header flex flex-row items-center justify-between h-10 px-3">
            <div className="flex items-center">
              <Terminal className="h-4 w-4 mr-2 text-green-500" />
              <span className="text-green-500 text-xs font-mono">severino@terminal:~$</span>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-green-500 hover:text-green-400 hover:bg-transparent"
                onClick={toggleHelp}
                title="Ajuda (Ctrl+/)"
              >
                <HelpCircle className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-green-500 hover:text-green-400 hover:bg-transparent"
                onClick={toggleMinimize}
                title={isMinimized ? "Maximizar" : "Minimizar"}
              >
                {isMinimized ? <Maximize className="h-3 w-3" /> : <Minimize className="h-3 w-3" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-green-500 hover:text-green-400 hover:bg-transparent"
                onClick={toggleChat}
                title="Fechar"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Help Overlay */}
              {showHelp && (
                <div className="absolute inset-0 z-10 bg-black/95 border border-green-500/50 p-4 overflow-auto">
                  <div className="flex justify-between items-center mb-4 border-b border-green-500/30 pb-2">
                    <h3 className="text-green-500 font-mono text-sm flex items-center">
                      <Keyboard className="h-4 w-4 mr-2" /> Atalhos e Comandos
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-green-500 hover:text-green-400 hover:bg-transparent"
                      onClick={toggleHelp}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="space-y-4 text-green-400 text-xs font-mono">
                    <div>
                      <h4 className="text-green-500 mb-2 flex items-center">
                        <Command className="h-3 w-3 mr-1" /> Comandos
                      </h4>
                      <ul className="space-y-2 pl-4">
                        <li><span className="text-green-300">/help</span> - Mostra esta ajuda</li>
                        <li><span className="text-green-300">/clear</span> - Limpa o histórico de mensagens</li>
                        <li><span className="text-green-300">/status</span> - Mostra o status da conexão</li>
                        <li><span className="text-green-300">/version</span> - Mostra a versão do sistema</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-green-500 mb-2 flex items-center">
                        <Keyboard className="h-3 w-3 mr-1" /> Atalhos de Teclado
                      </h4>
                      <ul className="space-y-2 pl-4">
                        <li><span className="text-green-300">Ctrl+/</span> - Mostra/esconde ajuda</li>
                        <li><span className="text-green-300">Esc</span> - Minimiza ou fecha o chat</li>
                        <li><span className="text-green-300">Enter</span> - Envia mensagem</li>
                        <li><span className="text-green-300">↑/↓</span> - Navega pelo histórico (em breve)</li>
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-green-500/30">
                      <p className="text-green-400/70 italic">Dica: Use comandos para interagir rapidamente com o sistema.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Messages Area */}
              <div className="overflow-y-auto h-[calc(100%-90px)] p-3 bg-black/80">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-green-500/70">
                    <Terminal className="h-8 w-8 mb-2 text-green-500/50" />
                    <p className="text-sm font-mono">Terminal iniciado. Como posso ajudar?</p>
                    <p className="text-xs mt-1 font-mono">Digite <span className="text-green-400">/help</span> para ver os comandos disponíveis</p>
                    <div className="mt-4 flex items-center text-xs text-green-500/50">
                      <Zap className="h-3 w-3 mr-1" />
                      <span>Conectado à OpenAI API v2</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "font-mono text-xs",
                          message.role === 'user'
                            ? "terminal-prompt pb-1"
                            : message.role === 'system'
                              ? "text-green-500/80 border-l-2 border-green-500/30 pl-2 pb-1"
                              : "text-green-400 pb-1"
                        )}
                      >
                        {message.role === 'user' && message.isCommand ? (
                          <div className="terminal-command">{message.content}</div>
                        ) : (
                          <div>
                            {message.content.split('\n').map((line, i) => (
                              <p key={i} className={i > 0 ? "mt-1" : ""}>
                                {line}
                              </p>
                            ))}
                            <span className="text-[10px] text-green-500/50 mt-1 block">
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                    {isLoading && (
                      <div className="text-green-400 font-mono text-xs flex items-center">
                        <Loader2 className="h-3 w-3 animate-spin mr-2 text-green-500" />
                        <span>Processando...</span>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-3 border-t border-green-500/30 bg-black/90">
                <form onSubmit={handleSendMessage} className="flex w-full gap-2">
                  <div className="flex-1 relative">
                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-green-500 text-xs">$</span>
                    <Input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Digite um comando ou mensagem..."
                      className="pl-6 bg-black border-green-500/50 text-green-400 font-mono text-xs focus:border-green-500 focus:ring-0 focus:ring-offset-0"
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isLoading || !input.trim()}
                    className="bg-green-500/20 border border-green-500/50 text-green-500 hover:bg-green-500/30 hover:text-green-400"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FloatingChat;
